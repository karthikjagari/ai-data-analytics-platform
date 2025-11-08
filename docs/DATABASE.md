# Database Schema

## Overview
The application uses PostgreSQL with Prisma ORM. The schema is defined in `apps/api/prisma/schema.prisma`.

## Entity Relationship Diagram

```
vendors
  ├── invoices (1:N)
  │     ├── line_items (1:N)
  │     └── payments (1:N)
  └── categories (M:N via line_items.category)
```

## Tables

### vendors
Stores vendor information.

| Column | Type | Description |
|--------|------|-------------|
| id | String (CUID) | Primary key |
| name | String | Unique vendor name |
| email | String? | Vendor email |
| phone | String? | Vendor phone |
| address | String? | Vendor address |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update timestamp |

### invoices
Stores invoice records.

| Column | Type | Description |
|--------|------|-------------|
| id | String (CUID) | Primary key |
| invoiceNumber | String | Unique invoice number |
| vendorId | String | Foreign key to vendors |
| customerName | String? | Customer name |
| issueDate | DateTime | Invoice issue date |
| dueDate | DateTime? | Invoice due date |
| status | String | "paid", "pending", "overdue" |
| subtotal | Decimal(12,2) | Subtotal amount |
| tax | Decimal(12,2) | Tax amount |
| total | Decimal(12,2) | Total amount |
| currency | String | Currency code (default: "EUR") |
| notes | String? | Additional notes |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update timestamp |

**Indexes:**
- vendorId
- issueDate
- status

### line_items
Stores invoice line items.

| Column | Type | Description |
|--------|------|-------------|
| id | String (CUID) | Primary key |
| invoiceId | String | Foreign key to invoices |
| description | String | Item description |
| quantity | Decimal(10,2) | Item quantity |
| unitPrice | Decimal(12,2) | Unit price |
| category | String? | Spending category |
| total | Decimal(12,2) | Line total |
| createdAt | DateTime | Creation timestamp |

**Indexes:**
- invoiceId
- category

### payments
Stores payment records.

| Column | Type | Description |
|--------|------|-------------|
| id | String (CUID) | Primary key |
| invoiceId | String | Foreign key to invoices |
| amount | Decimal(12,2) | Payment amount |
| paymentDate | DateTime | Payment date |
| method | String? | Payment method |
| reference | String? | Payment reference |
| createdAt | DateTime | Creation timestamp |

**Indexes:**
- invoiceId
- paymentDate

### categories
Stores spending categories (optional, currently using string in line_items).

| Column | Type | Description |
|--------|------|-------------|
| id | String (CUID) | Primary key |
| name | String | Unique category name |
| description | String? | Category description |
| createdAt | DateTime | Creation timestamp |

## Data Types

- **CUID**: Collision-resistant unique identifier
- **Decimal**: Fixed-point decimal numbers for financial data
- **DateTime**: ISO 8601 timestamps

## Relationships

- **Vendor → Invoices**: One-to-Many (Cascade delete)
- **Invoice → Line Items**: One-to-Many (Cascade delete)
- **Invoice → Payments**: One-to-Many (Cascade delete)

## Migration

To create and apply migrations:

```bash
cd apps/api
npx prisma migrate dev --name init
```

## Seeding

To seed the database with sample data:

```bash
npm run db:seed
```

The seed script reads from `data/Analytics_Test_Data.json` and creates vendors, invoices, line items, and payments.

