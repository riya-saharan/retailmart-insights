import unittest
from pathlib import Path
import sys

import pandas as pd

sys.path.insert(0, str(Path(__file__).resolve().parent))
from pipeline import clean_orders, EMAIL_PATTERN, build_gold


class RetailMartPipelineTests(unittest.TestCase):
    def test_duplicate_removal(self):
        df = pd.DataFrame([
            {"order_id":"O1","order_date":"2026-01-01","customer_id":"C1","product_id":"P1",
             "quantity":1,"unit_price":100,"sales":100,"profit":20,"city":"Jaipur","region":"North","segment":"Consumer"},
            {"order_id":"O1","order_date":"2026-01-01","customer_id":"C1","product_id":"P1",
             "quantity":1,"unit_price":100,"sales":100,"profit":20,"city":"Jaipur","region":"North","segment":"Consumer"},
        ])
        clean, _, duplicates = clean_orders(df, {"C1"}, {"P1"})
        self.assertEqual(duplicates, 1)
        self.assertEqual(len(clean), 1)

    def test_invalid_email_detection(self):
        self.assertIsNone(EMAIL_PATTERN.match("not-an-email"))
        self.assertIsNotNone(EMAIL_PATTERN.match("riya@example.com"))

    def test_negative_quantity_rejection(self):
        df = pd.DataFrame([{
            "order_id":"O2","order_date":"2026-01-01","customer_id":"C1","product_id":"P1",
            "quantity":-1,"unit_price":100,"sales":-100,"profit":-20,"city":"Jaipur","region":"North","segment":"Consumer"
        }])
        clean, rejected, _ = clean_orders(df, {"C1"}, {"P1"})
        self.assertEqual(len(clean), 0)
        self.assertTrue(any("Quantity" in reason for frame in rejected for reason in frame.get("rejection_reason", [])))

    def test_invalid_region_rejection(self):
        df = pd.DataFrame([{
            "order_id":"O3","order_date":"2026-01-01","customer_id":"C1","product_id":"P1",
            "quantity":1,"unit_price":100,"sales":100,"profit":20,"city":"Jaipur","region":"Unknown","segment":"Consumer"
        }])
        clean, _, _ = clean_orders(df, {"C1"}, {"P1"})
        self.assertEqual(len(clean), 0)

    def test_date_standardization(self):
        df = pd.DataFrame([{
            "order_id":"O4","order_date":"01/02/2026","customer_id":"C1","product_id":"P1",
            "quantity":1,"unit_price":100,"sales":100,"profit":20,"city":"Jaipur","region":"North","segment":"Consumer"
        }])
        clean, _, _ = clean_orders(df, {"C1"}, {"P1"})
        self.assertEqual(clean.iloc[0]["order_date"], "2026-02-01")

    def test_gold_kpi_generation(self):
        # This test verifies that the checked-in generated KPI file exists and has values.
        kpi_path = Path(__file__).resolve().parent / "gold" / "executive_kpis.csv"
        self.assertTrue(kpi_path.exists())
        kpis = pd.read_csv(kpi_path)
        self.assertIn("Total Revenue", set(kpis["metric"]))
        self.assertGreater(len(kpis), 5)


if __name__ == "__main__":
    unittest.main()
