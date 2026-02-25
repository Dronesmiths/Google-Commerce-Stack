/**
 * 📦 Commerce Engine Template v1 - Backend (Apps Script)
 * 
 * Routes:
 * - GET: Returns product list for the frontend.
 * - POST: Handles new orders or Stripe Webhooks.
 */

const CONFIG = {
  SHEET_NAME: "Orders",
  PRODUCTS_SHEET: "Products",
  MERCHANT_EMAIL: "admin@clientdomain.com" 
};

function doGet() {
  const ps = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.PRODUCTS_SHEET);
  const data = ps.getRange("A2:A" + ps.getLastRow()).getValues().flat().filter(String);
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
  const postData = JSON.parse(e.postData.contents);

  // Route A: Stripe Webhook
  if (postData.type && postData.type.startsWith("checkout.session")) {
    return handleStripeWebhook(postData, sheet);
  }

  // Route B: New Order
  return handleNewOrder(postData, sheet);
}

function handleNewOrder(data, sheet) {
  const orderId = "ORD-" + Utilities.getUuid().slice(0, 8);
  
  // Find first empty row in Name column (C)
  const names = sheet.getRange("C:C").getValues();
  let nextRow = 2;
  for (let i = 1; i < names.length; i++) {
    if (names[i][0] === "") { nextRow = i + 1; break; }
    if (i === names.length - 1) nextRow = names.length + 1;
  }

  // Write Data (Columns A and G are formula-locked on-sheet)
  sheet.getRange(nextRow, 2).setValue(orderId);             // OrderID
  sheet.getRange(nextRow, 3).setValue(data.name);          // Name
  sheet.getRange(nextRow, 4).setValue(data.phone);         // Phone
  sheet.getRange(nextRow, 5).setValue(data.items);         // Items
  sheet.getRange(nextRow, 6).setValue(data.qty);           // Qty
  sheet.getRange(nextRow, 8).setValue(data.paymentMethod); // Payment Method
  sheet.getRange(nextRow, 9).setValue(false);              // Paid?
  sheet.getRange(nextRow, 10).setValue(false);             // Fulfilled?

  // Confirmation Email
  try {
    MailApp.sendEmail({
      to: data.email || CONFIG.MERCHANT_EMAIL,
      subject: "New Order - " + orderId,
      htmlBody: `<h2>Order Confirmation</h2><p><b>ID:</b> ${orderId}</p><p><b>Items:</b> ${data.items}</p>`
    });
  } catch(f) { console.log("Mail fail"); }

  return ContentService.createTextOutput(JSON.stringify({ status: "success", orderId })).setMimeType(ContentService.MimeType.JSON);
}

function handleStripeWebhook(event, sheet) {
  if (event.type === "checkout.session.completed") {
    const orderId = event.data.object.metadata.orderId;
    const vals = sheet.getDataRange().getValues();
    for (let i = 1; i < vals.length; i++) {
      if (vals[i][1] === orderId) {
        sheet.getRange(i + 1, 9).setValue(true); // Column I (Paid?)
        break;
      }
    }
  }
  return ContentService.createTextOutput("OK");
}
