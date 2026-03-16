import { Component } from '@angular/core';
import { CartService, CartItem } from './cart.service';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { LoginDialogComponent } from '../home/login-dialog.component';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  cart$ = this.cart.cart$;

  constructor(
    private cart: CartService,
    private router: Router,
    private auth: AuthService,
    private dialog: MatDialog
  ) {}

  updateQty(item: CartItem, delta: number): void {
    this.cart.updateQuantity(item.product._id, item.quantity + delta);
  }

  remove(id: string): void { this.cart.removeFromCart(id); }

  getTotal(): number { return this.cart.getTotal(); }

  checkout(): void {
    if (this.auth.isAuthenticated()) {
      this.router.navigate(['/checkout']);
    } else {
      this.dialog.open(LoginDialogComponent, { width: '400px' }).afterClosed().subscribe(r => {
        if (r === 'success') this.router.navigate(['/checkout']);
      });
    }
  }
}
