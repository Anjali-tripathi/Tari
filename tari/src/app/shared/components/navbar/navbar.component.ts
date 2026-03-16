import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../features/cart/cart.service';
import { User } from '../../../core/models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  currentUser$!: Observable<User | null>;
  cartCount$!: Observable<number>;

  constructor(private auth: AuthService, private cart: CartService) {}

  ngOnInit(): void {
    this.currentUser$ = this.auth.currentUser$;
    this.cartCount$ = this.cart.cartCount$;
  }

  logout(): void { this.auth.logout(); }
}
