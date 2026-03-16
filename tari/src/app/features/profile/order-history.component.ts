import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { Order } from '../../core/models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {
  orders: Order[] = [];
  constructor(private api: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.api.get<Order[]>('/orders/my').subscribe(orders => this.orders = orders);
  }

  trackOrder(id: string): void { this.router.navigate([`/tracking/${id}`]); }

  reorder(order: Order): void {
    // TODO: Add all items back to cart
    this.router.navigate(['/cart']);
  }
}
