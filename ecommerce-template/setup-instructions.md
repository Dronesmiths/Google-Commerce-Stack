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

## 3. Frontend Configuration
1. Open `frontend.html`.
2. Find the constant `const API_URL = "YOUR_APPS_SCRIPT_URL_HERE";` and paste your URL.
3. If using Stripe, update the `STRIPE_CHECKOUT_LINK` placeholder.
4. Upload `frontend.html` (or embed the code) to the client's website.

## 4. Final Test
1. Refresh the frontend page. The product dropdown should populate automatically from the `Products` sheet.
2. Place a test order.
3. Verify the row appears in the `Orders` sheet with an auto-timestamp and auto-total.
4. Check the `Dashboard` for live updates.
