# Pipeline Flow

1. Read raw orders, customers, products and inventory.
2. Copy source values to Bronze and add ingestion metadata.
3. Deduplicate records in Silver.
4. Standardize whitespace, casing, dates and numeric types.
5. Apply referential and business-rule validation.
6. Store invalid rows in the rejected dataset.
7. Create Gold-level KPI and performance datasets.
8. Write a timestamped execution log.
