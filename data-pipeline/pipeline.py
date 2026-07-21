from __future__ import annotations

from pathlib import Path
from datetime import datetime
import logging
import re
import time
import uuid

import pandas as pd

BASE_DIR = Path(__file__).resolve().parent
RAW_DIR = BASE_DIR / "raw"
BRONZE_DIR = BASE_DIR / "bronze"
SILVER_DIR = BASE_DIR / "silver"
GOLD_DIR = BASE_DIR / "gold"
REJECTED_DIR = BASE_DIR / "rejected"
LOG_DIR = BASE_DIR / "logs"

ACCEPTED_REGIONS = {"North", "South", "East", "West", "Central"}
EMAIL_PATTERN = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


def ensure_directories() -> None:
    for directory in [BRONZE_DIR, SILVER_DIR, GOLD_DIR, REJECTED_DIR, LOG_DIR]:
        directory.mkdir(parents=True, exist_ok=True)


def configure_logging() -> Path:
    ensure_directories()
    log_path = LOG_DIR / f"pipeline_{datetime.now():%Y%m%d_%H%M%S}.log"
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s | %(levelname)s | %(message)s",
        handlers=[logging.FileHandler(log_path, encoding="utf-8"), logging.StreamHandler()],
        force=True,
    )
    return log_path


def add_bronze_metadata(df: pd.DataFrame, source_file: str, source_system: str) -> pd.DataFrame:
    result = df.copy()
    result["source_file"] = source_file
    result["source_system"] = source_system
    result["ingestion_timestamp"] = datetime.now().isoformat(timespec="seconds")
    result["ingestion_id"] = [str(uuid.uuid4()) for _ in range(len(result))]
    return result


def ingest_bronze() -> dict[str, pd.DataFrame]:
    logging.info("Reading raw files")
    raw_frames = {
        "orders": pd.read_csv(RAW_DIR / "orders.csv"),
        "customers": pd.read_json(RAW_DIR / "customers.json"),
        "products": pd.read_csv(RAW_DIR / "products.csv"),
        "inventory": pd.read_csv(RAW_DIR / "inventory.csv"),
    }

    bronze_frames = {}
    for name, frame in raw_frames.items():
        source_file = f"{name}.json" if name == "customers" else f"{name}.csv"
        bronze = add_bronze_metadata(frame, source_file, "RetailMart")
        bronze.to_csv(BRONZE_DIR / f"bronze_{name}.csv", index=False)
        bronze_frames[name] = bronze

    logging.info("Bronze ingestion completed")
    return bronze_frames


def normalize_text(series: pd.Series) -> pd.Series:
    return series.fillna("").astype(str).str.strip().str.replace(r"\s+", " ", regex=True)


def make_rejections(
    df: pd.DataFrame,
    mask: pd.Series,
    source_file: str,
    reason: str,
    value_column: str,
    record_column: str,
) -> pd.DataFrame:
    failed = df.loc[mask].copy()
    if failed.empty:
        return pd.DataFrame(columns=["source_file", "record_id", "rejection_reason", "invalid_value", "rejected_at"])
    return pd.DataFrame({
        "source_file": source_file,
        "record_id": failed.get(record_column, pd.Series(failed.index, index=failed.index)).astype(str),
        "rejection_reason": reason,
        "invalid_value": failed.get(value_column, "").astype(str),
        "rejected_at": datetime.now().isoformat(timespec="seconds"),
    })


def clean_customers(df: pd.DataFrame) -> tuple[pd.DataFrame, list[pd.DataFrame], int]:
    business_cols = ["customer_id", "customer_name", "email", "city", "region", "segment", "signup_date"]
    work = df[business_cols].copy()
    before = len(work)
    work = work.drop_duplicates(subset=["customer_id"], keep="first")
    duplicates_removed = before - len(work)

    for col in ["customer_id", "customer_name", "email", "city", "region", "segment"]:
        work[col] = normalize_text(work[col])
    work["customer_name"] = work["customer_name"].str.title()
    work["city"] = work["city"].str.title()
    work["region"] = work["region"].str.title()
    work["segment"] = work["segment"].str.title().replace({"Home Office": "Home Office"})
    work["signup_date"] = pd.to_datetime(work["signup_date"], errors="coerce", dayfirst=True, format="mixed")

    rejected = []
    masks = [
        (work["customer_id"].eq(""), "Customer ID cannot be null", "customer_id"),
        (~work["email"].str.match(EMAIL_PATTERN), "Invalid email address", "email"),
        (~work["region"].isin(ACCEPTED_REGIONS), "Unknown region", "region"),
        (work["signup_date"].isna(), "Invalid signup date", "signup_date"),
    ]
    invalid = pd.Series(False, index=work.index)
    for mask, reason, value_col in masks:
        rejected.append(make_rejections(work, mask, "customers.json", reason, value_col, "customer_id"))
        invalid |= mask

    clean = work.loc[~invalid].copy()
    clean["signup_date"] = clean["signup_date"].dt.strftime("%Y-%m-%d")
    clean["processing_timestamp"] = datetime.now().isoformat(timespec="seconds")
    return clean, rejected, duplicates_removed


def clean_products(df: pd.DataFrame) -> tuple[pd.DataFrame, list[pd.DataFrame], int]:
    business_cols = ["product_id", "product_name", "category", "subcategory", "unit_price", "unit_cost"]
    work = df[business_cols].copy()
    before = len(work)
    work = work.drop_duplicates(subset=["product_id"], keep="first")
    duplicates_removed = before - len(work)

    for col in ["product_id", "product_name", "category", "subcategory"]:
        work[col] = normalize_text(work[col])
    work["product_name"] = work["product_name"].str.title()
    work["category"] = work["category"].str.title()
    work["subcategory"] = work["subcategory"].str.title()
    work["unit_price"] = pd.to_numeric(work["unit_price"], errors="coerce")
    work["unit_cost"] = pd.to_numeric(work["unit_cost"], errors="coerce")

    rejected = []
    masks = [
        (work["product_id"].eq(""), "Product ID cannot be null", "product_id"),
        (work["product_name"].eq(""), "Product name cannot be null", "product_name"),
        (work["unit_price"].isna() | (work["unit_price"] < 0), "Invalid product price", "unit_price"),
        (work["unit_cost"].isna() | (work["unit_cost"] < 0), "Invalid product cost", "unit_cost"),
    ]
    invalid = pd.Series(False, index=work.index)
    for mask, reason, value_col in masks:
        rejected.append(make_rejections(work, mask, "products.csv", reason, value_col, "product_id"))
        invalid |= mask

    clean = work.loc[~invalid].copy()
    clean["processing_timestamp"] = datetime.now().isoformat(timespec="seconds")
    return clean, rejected, duplicates_removed


def clean_inventory(df: pd.DataFrame, valid_product_ids: set[str]) -> tuple[pd.DataFrame, list[pd.DataFrame], int]:
    business_cols = ["product_id", "current_stock", "reorder_level", "unit_cost", "warehouse"]
    work = df[business_cols].copy()
    before = len(work)
    work = work.drop_duplicates(subset=["product_id"], keep="first")
    duplicates_removed = before - len(work)

    work["product_id"] = normalize_text(work["product_id"])
    work["warehouse"] = normalize_text(work["warehouse"]).str.title()
    for col in ["current_stock", "reorder_level", "unit_cost"]:
        work[col] = pd.to_numeric(work[col], errors="coerce")

    rejected = []
    masks = [
        (~work["product_id"].isin(valid_product_ids), "Product ID does not exist", "product_id"),
        (work["current_stock"].isna() | (work["current_stock"] < 0), "Invalid stock quantity", "current_stock"),
        (work["reorder_level"].isna() | (work["reorder_level"] < 0), "Invalid reorder level", "reorder_level"),
        (work["unit_cost"].isna() | (work["unit_cost"] < 0), "Invalid inventory unit cost", "unit_cost"),
    ]
    invalid = pd.Series(False, index=work.index)
    for mask, reason, value_col in masks:
        rejected.append(make_rejections(work, mask, "inventory.csv", reason, value_col, "product_id"))
        invalid |= mask

    clean = work.loc[~invalid].copy()
    clean["processing_timestamp"] = datetime.now().isoformat(timespec="seconds")
    return clean, rejected, duplicates_removed


def clean_orders(
    df: pd.DataFrame,
    valid_customer_ids: set[str],
    valid_product_ids: set[str],
) -> tuple[pd.DataFrame, list[pd.DataFrame], int]:
    business_cols = [
        "order_id", "order_date", "customer_id", "product_id", "quantity",
        "unit_price", "sales", "profit", "city", "region", "segment"
    ]
    work = df[business_cols].copy()
    before = len(work)
    work = work.drop_duplicates(subset=["order_id"], keep="first")
    duplicates_removed = before - len(work)

    for col in ["order_id", "customer_id", "product_id", "city", "region", "segment"]:
        work[col] = normalize_text(work[col])
    work["city"] = work["city"].str.title()
    work["region"] = work["region"].str.title()
    work["segment"] = work["segment"].str.title()
    work["order_date"] = pd.to_datetime(work["order_date"], errors="coerce", dayfirst=True, format="mixed")

    for col in ["quantity", "unit_price", "sales", "profit"]:
        work[col] = pd.to_numeric(work[col], errors="coerce")

    rejected = []
    masks = [
        (work["order_id"].eq(""), "Order ID cannot be null", "order_id"),
        (~work["customer_id"].isin(valid_customer_ids), "Customer ID does not exist", "customer_id"),
        (~work["product_id"].isin(valid_product_ids), "Product ID does not exist", "product_id"),
        (work["quantity"].isna() | (work["quantity"] <= 0), "Quantity must be greater than zero", "quantity"),
        (work["unit_price"].isna() | (work["unit_price"] < 0), "Product price cannot be negative", "unit_price"),
        (work["order_date"].isna(), "Order date must be valid", "order_date"),
        (~work["region"].isin(ACCEPTED_REGIONS), "Region is not accepted", "region"),
    ]
    invalid = pd.Series(False, index=work.index)
    for mask, reason, value_col in masks:
        rejected.append(make_rejections(work, mask, "orders.csv", reason, value_col, "order_id"))
        invalid |= mask

    clean = work.loc[~invalid].copy()
    clean["order_date"] = clean["order_date"].dt.strftime("%Y-%m-%d")
    clean["processing_timestamp"] = datetime.now().isoformat(timespec="seconds")
    return clean, rejected, duplicates_removed


def transform_silver(bronze: dict[str, pd.DataFrame]) -> tuple[dict[str, pd.DataFrame], pd.DataFrame, dict[str, int]]:
    customers, cust_rej, cust_dups = clean_customers(bronze["customers"])
    products, prod_rej, prod_dups = clean_products(bronze["products"])
    inventory, inv_rej, inv_dups = clean_inventory(bronze["inventory"], set(products["product_id"]))
    orders, order_rej, order_dups = clean_orders(
        bronze["orders"], set(customers["customer_id"]), set(products["product_id"])
    )

    silver = {
        "customers": customers,
        "products": products,
        "inventory": inventory,
        "orders": orders,
    }
    for name, frame in silver.items():
        frame.to_csv(SILVER_DIR / f"silver_{name}.csv", index=False)

    rejections = pd.concat(
        cust_rej + prod_rej + inv_rej + order_rej,
        ignore_index=True,
    ).drop_duplicates()
    rejections.to_csv(REJECTED_DIR / "rejected_records.csv", index=False)

    order_rejection_count = len(pd.concat(order_rej, ignore_index=True).drop_duplicates())
    stats = {
        "duplicates_removed": cust_dups + prod_dups + inv_dups + order_dups,
        "order_duplicates_removed": order_dups,
        "rejected_records": len(rejections),
        "order_rejected_records": order_rejection_count,
        "valid_orders": len(orders),
    }
    logging.info("Silver cleaning completed")
    return silver, rejections, stats


def safe_margin(profit: pd.Series, revenue: pd.Series) -> pd.Series:
    return (profit / revenue.replace(0, pd.NA) * 100).fillna(0).round(2)


def build_gold(silver: dict[str, pd.DataFrame], stats: dict[str, int]) -> dict[str, pd.DataFrame]:
    orders = silver["orders"].copy()
    customers = silver["customers"].copy()
    products = silver["products"].copy()
    inventory = silver["inventory"].copy()

    order_product = orders.merge(products[["product_id", "product_name", "category"]], on="product_id", how="left")
    order_customer = orders.merge(customers[["customer_id", "customer_name"]], on="customer_id", how="left")

    monthly = orders.copy()
    monthly["month"] = pd.to_datetime(monthly["order_date"]).dt.to_period("M").astype(str)
    monthly_sales = monthly.groupby("month", as_index=False).agg(
        total_revenue=("sales", "sum"),
        total_profit=("profit", "sum"),
        total_orders=("order_id", "nunique"),
    )
    monthly_sales["average_order_value"] = (
        monthly_sales["total_revenue"] / monthly_sales["total_orders"]
    ).round(2)

    category = order_product.groupby("category", as_index=False).agg(
        revenue=("sales", "sum"),
        profit=("profit", "sum"),
        units_sold=("quantity", "sum"),
    )
    category["profit_margin"] = safe_margin(category["profit"], category["revenue"])

    regional = orders.groupby("region", as_index=False).agg(
        revenue=("sales", "sum"),
        profit=("profit", "sum"),
        orders=("order_id", "nunique"),
        customers=("customer_id", "nunique"),
    )

    product_perf = order_product.groupby(["product_id", "product_name"], as_index=False).agg(
        revenue=("sales", "sum"),
        profit=("profit", "sum"),
        units_sold=("quantity", "sum"),
    )
    product_perf["profit_margin"] = safe_margin(product_perf["profit"], product_perf["revenue"])

    customer_perf = order_customer.groupby(["customer_id", "customer_name"], as_index=False).agg(
        total_orders=("order_id", "nunique"),
        total_revenue=("sales", "sum"),
    )
    customer_perf["average_order_value"] = (
        customer_perf["total_revenue"] / customer_perf["total_orders"]
    ).round(2)

    inventory_summary = inventory.merge(products[["product_id", "product_name"]], on="product_id", how="left")
    inventory_summary["inventory_status"] = inventory_summary.apply(
        lambda row: "Out of Stock" if row["current_stock"] == 0
        else "Low Stock" if row["current_stock"] <= row["reorder_level"]
        else "Overstocked" if row["current_stock"] > row["reorder_level"] * 4
        else "In Stock",
        axis=1,
    )
    inventory_summary["recommended_action"] = inventory_summary["inventory_status"].map({
        "Out of Stock": "Urgent reorder",
        "Low Stock": "Reorder soon",
        "Overstocked": "Pause purchasing",
        "In Stock": "No action",
    })

    total_revenue = float(orders["sales"].sum())
    total_profit = float(orders["profit"].sum())
    total_orders = int(orders["order_id"].nunique())
    kpis = {
        "Total Revenue": round(total_revenue, 2),
        "Total Orders": total_orders,
        "Total Customers": int(orders["customer_id"].nunique()),
        "Average Order Value": round(total_revenue / total_orders, 2) if total_orders else 0,
        "Total Profit": round(total_profit, 2),
        "Profit Margin": round((total_profit / total_revenue * 100), 2) if total_revenue else 0,
        "Best Performing Product": product_perf.sort_values("revenue", ascending=False).iloc[0]["product_name"],
        "Best Performing Category": category.sort_values("revenue", ascending=False).iloc[0]["category"],
        "Best Performing Region": regional.sort_values("revenue", ascending=False).iloc[0]["region"],
    }
    executive = pd.DataFrame({"metric": list(kpis.keys()), "value": list(kpis.values())})

    input_orders = len(pd.read_csv(RAW_DIR / "orders.csv"))
    quality = pd.DataFrame([{
        "input_records": input_orders,
        "duplicate_records_removed": stats["order_duplicates_removed"],
        "missing_values": int(orders.isna().sum().sum()),
        "invalid_records": stats["order_rejected_records"],
        "rejected_records": stats["order_rejected_records"],
        "valid_records": len(orders),
        "data_quality_percentage": round(len(orders) / input_orders * 100, 2),
    }])

    outputs = {
        "monthly_sales": monthly_sales,
        "category_performance": category,
        "regional_performance": regional,
        "product_performance": product_perf,
        "customer_performance": customer_perf,
        "inventory_summary": inventory_summary,
        "executive_kpis": executive,
        "data_quality_summary": quality,
    }
    for name, frame in outputs.items():
        frame.to_csv(GOLD_DIR / f"{name}.csv", index=False)

    logging.info("Gold aggregations completed")
    return outputs


def run_pipeline() -> None:
    started = time.perf_counter()
    log_path = configure_logging()
    logging.info("RetailMart ETL Pipeline Started")

    try:
        bronze = ingest_bronze()
        silver, rejected, stats = transform_silver(bronze)
        gold = build_gold(silver, stats)

        input_count = len(bronze["orders"])
        logging.info("Input order record count: %s", input_count)
        logging.info("Duplicate order records removed: %s", stats["order_duplicates_removed"])
        logging.info("Invalid records rejected: %s", len(rejected))
        logging.info("Valid order output count: %s", stats["valid_orders"])
        logging.info("Gold datasets generated: %s", len(gold))
        logging.info("Pipeline execution duration: %.2f seconds", time.perf_counter() - started)
        logging.info("RetailMart pipeline completed successfully")
        print(f"\nLog written to: {log_path}")
    except Exception:
        logging.exception("RetailMart pipeline failed")
        raise


if __name__ == "__main__":
    run_pipeline()
