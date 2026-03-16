import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { Order, OrderStatus, Product, User } from '../../core/models';

export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalUsers: number;
  activeDeliveries: number;
  ordersToday: number;
  revenueToday: number;
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  constructor(private api: ApiService) {}

  getDashboardStats(): Observable<DashboardStats> {
    return this.api.get<DashboardStats>('/admin/stats');
  }

  // Orders
  getAllOrders(params?: any): Observable<Order[]> {
    return this.api.get<Order[]>('/admin/orders', params);
  }

  updateOrderStatus(orderId: string, status: OrderStatus): Observable<Order> {
    return this.api.patch<Order>(`/admin/orders/${orderId}/status`, { status });
  }

  assignDeliveryPartner(orderId: string, partnerId: string): Observable<Order> {
    return this.api.patch<Order>(`/admin/orders/${orderId}/assign`, { partnerId });
  }

  // Products
  getAllProducts(): Observable<Product[]> {
    return this.api.get<Product[]>('/admin/products');
  }

  createProduct(data: FormData): Observable<Product> {
    return this.api.post<Product>('/admin/products', data);
  }

  updateProduct(id: string, data: any): Observable<Product> {
    return this.api.put<Product>(`/admin/products/${id}`, data);
  }

  deleteProduct(id: string): Observable<any> {
    return this.api.delete(`/admin/products/${id}`);
  }

  // Users
  getAllUsers(params?: any): Observable<User[]> {
    return this.api.get<User[]>('/admin/users', params);
  }

  // Delivery Partners
  getDeliveryPartners(): Observable<any[]> {
    return this.api.get<any[]>('/admin/delivery-partners');
  }

  // Analytics
  getSalesReport(from: string, to: string): Observable<any> {
    return this.api.get('/admin/reports/sales', { from, to });
  }
}
