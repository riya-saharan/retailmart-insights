# RetailMart Python ETL Pipeline

This standalone pipeline processes RetailMart data using the Medallion Architecture.

## Run

```bash
pip install -r requirements.txt
python pipeline.py
```

## Test

```bash
python -m unittest test_pipeline.py
```

## Layers

- **Raw:** CSV and JSON source files with intentional quality issues.
- **Bronze:** Unmodified business values plus ingestion metadata.
- **Silver:** Standardized, deduplicated and validated records.
- **Gold:** Business-ready aggregations, KPIs and data-quality summaries.
- **Rejected:** Invalid rows with a reason and invalid value.
- **Logs:** Timestamped execution logs.
