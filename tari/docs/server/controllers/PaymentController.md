**File Overview**

- **What this file does:** `PaymentController.js` provides endpoints to initiate, verify, and check payment status. It includes plugin points for real payment providers (Razorpay, PhonePe) and ships with a mock UPI and COD implementation for development.
- **Why this file exists:** To abstract payment gateway interactions and keep payment-related logic organized and replaceable.
- **Role in architecture:** Controller layer for payment routes; interacts with `Order` model to update payment status.

**Imports**

- `Order` from `../models` — to update order payment status and references.
- `crypto` — used for verifying signatures from providers (commented plugin code).

**Key Functions**

1. `initiatePayment(req, res)`
   - Purpose: start a payment flow for `cod` or `upi` methods.
   - COD: returns success and `ref: 'COD'` immediately.
   - UPI: includes a commented Razorpay integration block; currently returns a mock UPI reference.
   - Errors: 400 for unsupported methods.

2. `verifyPayment(req, res)`
   - Purpose: verify payment provider signatures and mark `Order` as paid.
   - Current state: Razorpay signature check is provided as comments; the function updates the order's `paymentStatus` to `paid` and sets `paymentRef`.

3. `paymentStatus(req, res)`
   - Purpose: return payment status and `paymentRef` for an order.

4. `webhook(req, res)`
   - Purpose: placeholder for provider webhook handling (commented signature verification example).

**Programming Concepts**

- Plugin architecture: clearly marked extension points make integrating real providers straightforward.
- Security: signature verification is essential for validating provider callbacks (commented examples show `crypto.createHmac`).

**API**

- POST `/api/payment/initiate` — body: `{ method: 'cod'|'upi'|'card', amount }` → returns `{ success, ref|orderId }`.
- POST `/api/payment/verify` — protected — body: `{ paymentId, orderId, signature }` → verifies and marks order paid.
- GET `/api/payment/status/:orderId` — returns payment status.
- POST `/api/payment/webhook` — webhook endpoint (commented example).

**Best practices / improvements**

- Implement and enable provider SDK for real payments.
- Validate incoming amounts and ensure order/amount match.
- Protect webhook route and verify signatures.
- Use idempotency checks to avoid marking payments twice.

**Summary**

`PaymentController.js` provides mock and plugin-ready payment flows, updates `Order` payment fields, and offers clear TODOs for integrating real payment providers.