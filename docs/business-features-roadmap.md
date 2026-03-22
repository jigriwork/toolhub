# ToolHub Business Features Roadmap (Phase-wise)

This roadmap adds all requested Business features in a practical order, including a full POS track.

## Phase 1 — Core Business Pack (Quick wins)

### 1) Quotation / Estimate Generator
- Branded quotation PDF
- Customer + item table + taxes + notes
- Convert quotation to invoice (prefill flow)

### 2) Receipt Generator
- Payment receipt for cash / UPI / bank transfer
- Auto receipt number + date
- A4 + thermal print layout

### 3) Profit Margin & Pricing Calculator
- Cost price → margin % / markup % → selling price
- GST-inclusive and GST-exclusive modes
- Discount simulation for offer planning

### 4) WhatsApp Message Template Builder
- Ready templates: offer, follow-up, payment reminder, festival greeting
- Auto insert variables (name, amount, due date, link)

---

## Phase 2 — Billing Suite (GST + Docs)

### 5) Proforma Invoice Generator
- Pre-sales billing doc with clear PROFORMA status

### 6) Purchase Order (PO) Generator
- Supplier details + ordered items + expected delivery
- Status: Draft / Sent / Received

### 7) GST Billing Helper
- CGST/SGST/IGST logic
- HSN/SAC support (manual + suggested)
- Tax summary section for compliance clarity

---

## Phase 3 — POS MVP (Billing + Print + Basic Inventory)

### POS Lite v1
- Product catalog (name, SKU, price, tax, stock)
- Cart and quick checkout
- Bill generation with GST split
- Thermal print and A4 print styles
- Save daily sales in local storage

### Inventory Lite v1
- Stock in / stock out entries
- Low stock alerts
- Basic daily summary (sold items, revenue)

---

## Phase 4 — POS Pro (Advanced operations)

### POS v2
- Returns/refunds workflow
- Multiple payment modes split (cash+UPI)
- User roles (owner/cashier)
- Daily close report (opening cash, closing cash, variance)

### Inventory v2
- Batch update/import (CSV)
- Supplier ledger basics
- Reorder recommendations

---

## Phase 5 — Optional Cloud Sync & Multi-store

- Login-based cloud sync (optional)
- Branch / multi-store support
- Central dashboard with multi-outlet analytics

---

## POS Feasibility Notes

Yes — a proper POS is possible in this app.

### What works immediately (no backend mandatory)
- Browser/PWA based POS for single store
- Local data persistence
- Bill print support (thermal/A4)

### What needs backend (for production scale)
- Multi-device sync
- Role-based auth
- Cloud backup, audit logs, and central reporting

---

## Recommended Build Order (Execution)

1. Phase 1 (fast launch + user value)
2. Phase 2 (business document completeness)
3. Phase 3 (POS MVP + inventory basics)
4. Phase 4 (advanced operations)
5. Phase 5 (cloud scale)
