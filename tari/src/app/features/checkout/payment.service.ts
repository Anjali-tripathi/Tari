import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from '../../core/services/api.service';

export interface PaymentResult {
  success: boolean;
  ref?: string;
  orderId?: string;
  key?: string;
}

/**
 * TARI Payment Service — Plugin-Ready Architecture
 *
 * Currently supports:
 * - COD (Cash on Delivery) — works out of the box
 * - UPI Mock — replace with real provider
 *
 * HOW TO ADD RAZORPAY:
 * 1. npm install razorpay (backend) + add script to index.html
 * 2. Set RAZORPAY_KEY_ID in .env
 * 3. Replace the UPI case below with Razorpay checkout flow
 *
 * HOW TO ADD PHONEPE / PAYTM:
 * Follow the same pattern — call your backend initiate endpoint,
 * open the provider SDK, then call verifyPayment()
 */
@Injectable({ providedIn: 'root' })
export class PaymentService {
  constructor(private api: ApiService) {}

  initiatePayment(method: string, amount: number): Observable<PaymentResult> {
    switch (method) {
      case 'cod':
        // COD: No external call needed
        return of({ success: true, ref: 'COD' });

      case 'upi':
        // PLUGIN POINT: Replace with real UPI provider
        // For Razorpay: call backend -> open Razorpay checkout -> return payment details
        return this.api.post<PaymentResult>('/payment/initiate', { method, amount });

      default:
        return of({ success: false });
    }
  }

  verifyPayment(paymentId: string, orderId: string): Observable<PaymentResult> {
    return this.api.post<PaymentResult>('/payment/verify', { paymentId, orderId });
  }

  paymentStatus(orderId: string): Observable<any> {
    return this.api.get(`/payment/status/${orderId}`);
  }
}
