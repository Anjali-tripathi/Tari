import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { Product } from '../../core/models';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  cart$ = this.cartSubject.asObservable();
  cartCount$ = this.cart$.pipe(map(items => items.reduce((s, i) => s + i.quantity, 0)));

  addToCart(product: Product): void {
    const items = this.cartSubject.value;
    const idx = items.findIndex(i => i.product._id === product._id);
    if (idx > -1) {
      items[idx] = { ...items[idx], quantity: items[idx].quantity + 1 };
      this.cartSubject.next([...items]);
    } else {
      this.cartSubject.next([...items, { product, quantity: 1 }]);
    }
  }

  removeFromCart(productId: string): void {
    this.cartSubject.next(this.cartSubject.value.filter(i => i.product._id !== productId));
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) { this.removeFromCart(productId); return; }
    this.cartSubject.next(
      this.cartSubject.value.map(i => i.product._id === productId ? { ...i, quantity } : i)
    );
  }

  getTotal(): number {
    return this.cartSubject.value.reduce((s, i) => s + i.product.price * i.quantity, 0);
  }

  getItems(): CartItem[] { return this.cartSubject.value; }

  clearCart(): void { this.cartSubject.next([]); }
}
