# 📦 Commerce Engine Template v1 - Setup Instructions

Follow these steps to deploy a new eCommerce instance for a client.

## 1. Google Sheet Setup
1. Create a new Google Sheet.
2. Rename the first tab to `Products`.
3. Create a second tab named `Orders`.
4. Create a third tab named `Dashboard`.
5. Apply the headers and formulas defined in `sheet-structure.md`.
6. Go to **File > Settings > Calculation** and set **Iterative Calculation** to **ON** (Threshold: 1). This is required for the locking timestamps.

## 2. Apps Script Deployment
1. In the Google Sheet, go to **Extensions > Apps Script**.
2. Delete any existing code and paste the contents of `backend.gs`.
3. Click **Deploy > New Deployment**.
4. Select **Web App**.
5. Set "Execute as" to **Me** and "Who has access" to **Anyone**.
6. **Copy the Web App URL**. You will need this for the frontend.

## 3. Storefront Deployment (AWS S3)
### Option A: Manual Upload
1. Open `storefront/assets/app.js`.
2. Find `const APPS_SCRIPT_URL = "...";` and ensure your URL is pasted correctly.
3. Upload the entire contents of the `storefront/` folder to your S3 bucket.

### Option B: Automated Script (Recommended)
1. Ensure your AWS CLI is configured (`aws configure`).
2. Run the deployment script from the root directory:
   ```bash
   ./deploy.sh [YOUR_S3_BUCKET_NAME] [OPTIONAL_CLOUDFRONT_ID]
   ```
4. Ensure the S3 bucket is configured for **Static Website Hosting**.
5. Create a **CloudFront Distribution** pointing to your S3 bucket (or S3 website endpoint).
6. Enable **CloudFront Functions** or **CORS** headers if needed (though `no-cors` mode is used in `app.js` for simplicity).

## 4. Automation & Dashboard Setup
To ensure the system is fully hardened, verify these formulas:

### Orders Sheet (Column G: Total)
Cell G2 should contain:
```excel
=ARRAYFORMULA(IF(E2:E100<>"", F2:F100 * IFERROR(VLOOKUP(E2:E100, Products!$A$2:$B$100, 2, FALSE), 0), ""))
```

### Dashboard Sheet
- **Total Revenue (B1)**: `=SUMIFS(Orders!G2:G, Orders!I2:I, TRUE)`
- **Payment Breakdowns (B2-B4)**: `=SUMIFS(Orders!G2:G, Orders!H2:H, "[Method]", Orders!I2:I, TRUE)`
- **Unpaid Orders (B5)**: `=COUNTIFS(Orders!C2:C, "<>", Orders!I2:I, FALSE)`
- **Low Stock Alert (B6)**: `=IFERROR(TEXTJOIN(", ", TRUE, FILTER(Products!A2:A, Products!E2:E < 3, Products!A2:A <> "")), "None")`

## 5. Final Test Workflow
1. Access your CloudFront URL.
2. Place a test order.
3. Verify the row appears in **Orders**.
4. Check the **"Paid?"** checkbox.
5. Confirm revenue on **Dashboard** and stock deduction on **Products**.

🚀 **Your Commerce Stack is Ready.**
