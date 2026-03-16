import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, interval, takeUntil } from 'rxjs';
import { SocketService } from '../../core/services/socket.service';
import { DeliveryService } from './delivery.service';
import { NotificationService } from '../../core/services/notification.service';
import { Order, OrderStatus } from '../../core/models';

@Component({
  selector: 'app-delivery-dashboard',
  templateUrl: './delivery-dashboard.component.html',
  styleUrls: ['./delivery-dashboard.component.css']
})
export class DeliveryDashboardComponent implements OnInit, OnDestroy {
  assignedOrders: Order[] = [];
  activeOrder: Order | null = null;
  isTracking = false;
  myLocation: google.maps.LatLngLiteral | null = null;
  defaultCenter: google.maps.LatLngLiteral = { lat: 28.6139, lng: 77.2090 };
  private destroy$ = new Subject<void>();

  constructor(
    private deliveryService: DeliveryService,
    private socket: SocketService,
    private notify: NotificationService
  ) {}

  ngOnInit(): void {
    this.deliveryService.getMyOrders().subscribe(orders => this.assignedOrders = orders);
    this.socket.connect();
    // Show current location
    navigator.geolocation.getCurrentPosition(pos => {
      this.myLocation = { lat: pos.coords.latitude, lng: pos.coords.longitude };
    });
  }

  startDelivery(order: Order): void {
    this.activeOrder = order;
    this.isTracking = true;
    this.notify.info('Location sharing started!');

    // Broadcast GPS every 5 seconds
    interval(5000).pipe(takeUntil(this.destroy$)).subscribe(() => {
      navigator.geolocation.getCurrentPosition(pos => {
        const location = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        this.myLocation = location;
        this.socket.emitDeliveryLocation(location, order._id);
      });
    });
  }

  updateStatus(orderId: string, status: OrderStatus): void {
    this.deliveryService.updateOrderStatus(orderId, status).subscribe(updated => {
      const idx = this.assignedOrders.findIndex(o => o._id === orderId);
      if (idx > -1) this.assignedOrders[idx] = updated;
      this.socket.emitOrderStatusUpdate(orderId, status);
      this.notify.success(`Status updated to ${status}`);
    });
  }

  markDelivered(orderId: string): void {
    this.updateStatus(orderId, 'delivered');
    this.isTracking = false;
    this.activeOrder = null;
    this.destroy$.next();
    this.notify.success('Order delivered! Great job! 🎉');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.socket.disconnect();
  }
}
