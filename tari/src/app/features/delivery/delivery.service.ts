import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { Order, OrderStatus } from '../../core/models';

@Injectable({ providedIn: 'root' })
export class DeliveryService {
  constructor(private api: ApiService) {}

  getMyOrders(): Observable<Order[]> {
    return this.api.get<Order[]>('/delivery/orders');
  }

  updateOrderStatus(orderId: string, status: OrderStatus): Observable<Order> {
    return this.api.patch<Order>(`/delivery/orders/${orderId}/status`, { status });
  }
}
