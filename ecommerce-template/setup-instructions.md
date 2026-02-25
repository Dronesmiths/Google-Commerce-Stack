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
1. Open `storefront/assets/app.js`.
2. Find `const APPS_SCRIPT_URL = "YOUR_APPS_SCRIPT_URL_HERE";` and paste your URL.
3. Upload the entire contents of the `storefront/` folder to your S3 bucket.
4. Ensure the S3 bucket is configured for **Static Website Hosting**.
5. Create a **CloudFront Distribution** pointing to your S3 bucket (or S3 website endpoint).
6. Enable **CloudFront Functions** or **CORS** headers if needed (though `no-cors` mode is used in `app.js` for simplicity).

## 4. Final Test
1. Access your CloudFront URL.
2. The product dropdown should populate automatically from the `Products` sheet.
3. Place a test order.
4. Verify the row appears in the `Orders` sheet with an auto-timestamp and auto-total.
5. Check the `Dashboard` for live updates.
