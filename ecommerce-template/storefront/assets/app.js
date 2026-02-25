/**
 * Storefront Logic
 * Connects the static UI to the Google Apps Script Backend.
 */

// REPLACE THIS WITH YOUR DEPLOYED APPS SCRIPT WEB APP URL
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzmDfuKTdJthq8Gzadc6qhxlOl_hy7ExOCavejFCeQGopNdnZc-RRjP1IzfCuaE4zdy/exec";

const orderForm = document.getElementById('orderForm');
const productDropdown = document.getElementById('items');
const submitBtn = document.getElementById('submitBtn');
const statusMessage = document.getElementById('statusMessage');
const displayOrderId = document.getElementById('displayOrderId');

/**
 * 1. Load Products Dynamically on Page Load
 */
async function loadProducts() {
    if (APPS_SCRIPT_URL === "YOUR_APPS_SCRIPT_URL_HERE") {
        productDropdown.innerHTML = '<option value="">ERROR: Set API URL in app.js</option>';
        return;
    }

    try {
        const response = await fetch(APPS_SCRIPT_URL);
        const products = await response.json();

        if (products && products.length > 0) {
            productDropdown.innerHTML = products.map(item => `<option value="${item}">${item}</option>`).join('');
        } else {
            productDropdown.innerHTML = '<option value="">No products found</option>';
        }
    } catch (error) {
        console.error("Failed to load products:", error);
        productDropdown.innerHTML = '<option value="">Failed to load products</option>';
    }
}

/**
 * 2. Handle Form Submission
 */
orderForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Verification
    if (APPS_SCRIPT_URL === "YOUR_APPS_SCRIPT_URL_HERE") {
        alert("Please set your APPS_SCRIPT_URL in assets/app.js before placing an order.");
        return;
    }

    // UI Feedback
    submitBtn.disabled = true;
    submitBtn.innerText = "Processing Order...";

    const formData = new FormData(orderForm);
    const orderData = Object.fromEntries(formData.entries());

    try {
        const response = await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', // Apps Script requires no-cors for simple redirects
            body: JSON.stringify(orderData),
            headers: {
                'Content-Type': 'text/plain' // Must use text/plain for no-cors
            }
        });

        // Note: With no-cors, we cannot read the response body directly. 
        // In a production environment with Stripe, we'd handle the redirect logic here.
        // For a simple successful submission, we show the success UI.

        orderForm.style.display = 'none';
        statusMessage.style.display = 'block';
        displayOrderId.innerText = "Pending"; // ID generation is server-side

    } catch (error) {
        console.error("Order submission failed:", error);
        alert("There was an error placing your order. Please try again.");
        submitBtn.disabled = false;
        submitBtn.innerText = "Place Order";
    }
});

// Initialize
loadProducts();
