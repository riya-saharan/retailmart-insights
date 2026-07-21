# Data-Quality Rules

| Rule | Action on failure |
|---|---|
| Order ID is required and unique | Remove duplicate or reject missing ID |
| Customer ID must exist | Reject order |
| Product ID must exist | Reject order |
| Quantity must be greater than zero | Reject order |
| Unit price cannot be negative | Reject record |
| Email must match a valid format | Reject customer |
| Date must be parseable | Reject record |
| Region must be accepted | Reject record |
| Stock and unit cost cannot be negative | Reject inventory row |

Rejected rows are retained with traceability rather than silently deleted.
