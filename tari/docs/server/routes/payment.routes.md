**File Overview**

- **What this file does:** `payment.routes.js` maps payment-related HTTP endpoints to `PaymentController` functions and requires authentication.

**Routes**

- `POST /initiate` → `initiatePayment` (protected)
- `POST /verify` → `verifyPayment` (protected)
- `GET /status/:orderId` → `paymentStatus` (protected)
- Webhook route is commented and requires raw body handling when enabled.

**Summary**

`payment.routes.js` defines secure endpoints for initiating and verifying payments, with a webhook placeholder for production integrations.