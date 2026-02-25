# 📊 Sheet Structure & Formulas

### 1. Products Sheet
**Headers (Row 1):**
`Product | Price | Starting Stock | Sold | Remaining`

**Formulas:**
*   **Sold (Column D):** `=SUMIFS(Orders!F:F, Orders!E:E, A2, Orders!I:I, TRUE)`
    *(Sums quantity from Orders where product matches and Paid? is TRUE)*
*   **Remaining (Column E):** `=C2 - D2`

---

### 2. Orders Sheet
**Headers (Row 1):**
`Timestamp | OrderID | Name | Phone | Items | Qty | Total | Payment Method | Paid? | Fulfilled?`

**Critical Formulas (Row 2):**
*   **Timestamp (Column A):** `=IF(C2="", "", IF(A2="", NOW(), A2))`
    *(Requires Iterative Calculation ON)*
*   **Total (Column G):** `=IF(E2="","", F2 * VLOOKUP(E2, Products!A:B, 2, FALSE))`

---

### 3. Dashboard Sheet
**Recommended Metrics:**
*   **Total Revenue:** `=SUM(Orders!G:G)`
*   **Unpaid Orders:** `=COUNTIFS(Orders!I:I, FALSE, Orders!C:C, "<>")`
*   **Low Stock Alerts:** Use `FILTER(Products!A:A, Products!E:E < 5)`
*   **Payment Breakdown:** Use `SUMIF(Orders!H:H, "Stripe", Orders!G:G)` etc.
