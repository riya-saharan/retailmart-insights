# Architecture

RetailMart uses a file-based Medallion Architecture for a portable demonstration.

```mermaid
flowchart TD
    O[orders.csv] --> B[Bronze]
    C[customers.json] --> B
    P[products.csv] --> B
    I[inventory.csv] --> B
    B --> S[Silver Cleaning and Validation]
    S --> G[Gold Aggregations]
    S --> R[Rejected Records]
    G --> D[Analytics Dashboard]
```

The same design can scale to object storage, Delta Lake, PostgreSQL, Spark and orchestration tools.
