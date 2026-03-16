import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../cart/cart.service';
import { PaymentService } from './payment.service';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { Address, User } from '../../core/models';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  addressForm!: FormGroup;
  paymentForm!: FormGroup;
  user: User | null = null;
  cartItems = this.cart.getItems();
  total = 0;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private cart: CartService,
    private payment: PaymentService,
    private api: ApiService,
    private auth: AuthService,
    private notify: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.user = this.auth.getCurrentUser();
    this.total = this.cart.getTotal();
    this.addressForm = this.fb.group({ addressId: ['', Validators.required] });
    this.paymentForm = this.fb.group({
      paymentMethod: ['cod', Validators.required],
      specialInstructions: ['']
    });
  }

  placeOrder(): void {
    this.loading = true;
    const { paymentMethod, specialInstructions } = this.paymentForm.value;

    this.payment.initiatePayment(paymentMethod, this.total).subscribe({
      next: (paymentResult) => {
        const payload = {
          items: this.cart.getItems().map(i => ({
            productId: i.product._id, name: i.product.name,
            price: i.product.price, quantity: i.quantity, image: i.product.image
          })),
          addressId: this.addressForm.value.addressId,
          paymentMethod,
          specialInstructions,
          totalAmount: this.total,
          paymentRef: paymentResult.ref
        };

        this.api.post<any>('/orders', payload).subscribe({
          next: (order) => {
            this.cart.clearCart();
            this.notify.success('Order placed successfully! 🎉');
            this.router.navigate([`/tracking/${order._id}`]);
          },
          error: () => { this.loading = false; }
        });
      },
      error: () => { this.loading = false; }
    });
  }
}
