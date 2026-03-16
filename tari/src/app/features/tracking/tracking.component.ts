import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { SocketService } from '../../core/services/socket.service';
import { Order, OrderStatus } from '../../core/models';

interface StatusStep {
  key: OrderStatus;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-tracking',
  template: `
    <div class="page-container">
      <div class="tracking-header">
        <h1>Track Your Order 📍</h1>
        <span class="order-id">Order #{{ order?._id | slice:0:8 }}</span>
      </div>

      <div class="tracking-layout">
        <!-- Map -->
        <div class="map-container">
          <google-map
            width="100%"
            height="100%"
            [center]="mapCenter"
            [zoom]="14"
            [options]="mapOptions">
            <!-- Delivery location marker -->
            <map-marker *ngIf="deliveryLocation" [position]="deliveryLocation" [title]="'Delivery Partner'"></map-marker>
            <!-- Destination marker -->
            <map-marker *ngIf="destinationLocation" [position]="destinationLocation" [title]="'Your Location'"></map-marker>
          </google-map>
        </div>

        <!-- Status Panel -->
        <div class="status-panel">
          <div class="status-card card">
            <h3>Order Status</h3>
            <div class="steps">
              <div class="step" *ngFor="let step of statusSteps; let i = index"
                [class.done]="getStepIndex() > i"
                [class.active]="getStepIndex() === i">
                <div class="step-icon">{{ step.icon }}</div>
                <div class="step-label">{{ step.label }}</div>
                <div class="step-line" *ngIf="i < statusSteps.length - 1"></div>
              </div>
            </div>

            <div class="eta-badge" *ngIf="orderStatus !== 'delivered' && orderStatus !== 'cancelled'">
              ⏱ Estimated: {{ getEta() }} mins
            </div>

            <div class="delivered-badge" *ngIf="orderStatus === 'delivered'">
              🎉 Order Delivered! Enjoy your meal!
            </div>
            <div class="cancelled-badge" *ngIf="orderStatus === 'cancelled'">
              ❌ Order Cancelled
            </div>
          </div>

          <!-- Order Items -->
          <div class="items-card card mt-2" *ngIf="order">
            <h3>Items Ordered</h3>
            <div class="order-item" *ngFor="let item of order.items">
              <span>{{ item.name }} × {{ item.quantity }}</span>
              <span>₹{{ item.price * item.quantity }}</span>
            </div>
            <mat-divider class="mt-1 mb-2"></mat-divider>
            <div class="order-total"><strong>Total: ₹{{ order.totalAmount }}</strong></div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .tracking-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 8px; }
    h1 { font-size: 2rem; font-weight: 700; }
    .order-id { background: #f5f5f5; padding: 6px 14px; border-radius: 20px; font-size: 13px; color: #555; }
    .tracking-layout { display: grid; grid-template-columns: 1fr 320px; gap: 24px; }
    @media(max-width: 768px) { .tracking-layout { grid-template-columns: 1fr; } .map-container { height: 300px; } }
    .map-container { height: 500px; border-radius: 12px; overflow: hidden; }
    .steps { display: flex; flex-direction: column; gap: 0; margin: 16px 0; }
    .step { display: flex; align-items: center; gap: 12px; position: relative; padding: 10px 0; }
    .step-icon { width: 36px; height: 36px; border-radius: 50%; background: #e0e0e0; display: flex; align-items: center; justify-content: center; font-size: 1rem; flex-shrink: 0; }
    .step.done .step-icon { background: #2e7d32; color: white; }
    .step.active .step-icon { background: #e65100; color: white; animation: pulse 1.5s infinite; }
    .step-label { font-size: 14px; font-weight: 500; }
    .step.done .step-label { color: #2e7d32; }
    .step.active .step-label { color: #e65100; font-weight: 700; }
    .eta-badge { background: #fff3e0; color: #e65100; padding: 10px 16px; border-radius: 8px; font-weight: 600; text-align: center; margin-top: 12px; }
    .delivered-badge { background: #e8f5e9; color: #2e7d32; padding: 10px 16px; border-radius: 8px; font-weight: 600; text-align: center; margin-top: 12px; }
    .cancelled-badge { background: #ffebee; color: #b71c1c; padding: 10px 16px; border-radius: 8px; font-weight: 600; text-align: center; margin-top: 12px; }
    .order-item { display: flex; justify-content: space-between; font-size: 13px; padding: 6px 0; }
    .order-total { font-size: 15px; }
    @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.15); } }
  `]
})
export class TrackingComponent implements OnInit, OnDestroy {
  order: Order | null = null;
  orderStatus: OrderStatus = 'confirmed';
  deliveryLocation: google.maps.LatLngLiteral | null = null;
  destinationLocation: google.maps.LatLngLiteral | null = null;
  mapCenter: google.maps.LatLngLiteral = { lat: 28.6139, lng: 77.2090 };
  mapOptions: google.maps.MapOptions = { disableDefaultUI: true, styles: [] };
  private destroy$ = new Subject<void>();

  statusSteps: StatusStep[] = [
    { key: 'confirmed', label: 'Order Confirmed', icon: '✅' },
    { key: 'preparing', label: 'Preparing', icon: '🍳' },
    { key: 'picked_up', label: 'Picked Up', icon: '📦' },
    { key: 'on_the_way', label: 'On The Way', icon: '🛵' },
    { key: 'delivered', label: 'Delivered', icon: '🎉' }
  ];

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private socket: SocketService
  ) {}

  ngOnInit(): void {
    const orderId = this.route.snapshot.paramMap.get('orderId')!;
    this.socket.connect();

    this.api.get<Order>(`/orders/${orderId}`).subscribe(order => {
      this.order = order;
      this.orderStatus = order.orderStatus;
      if (order.deliveryAddress.lat && order.deliveryAddress.lng) {
        this.destinationLocation = { lat: order.deliveryAddress.lat, lng: order.deliveryAddress.lng };
        this.mapCenter = this.destinationLocation;
      }
    });

    this.socket.joinOrderRoom(orderId);

    this.socket.listenOrderStatus().pipe(takeUntil(this.destroy$)).subscribe(data => {
      this.orderStatus = data.status as OrderStatus;
    });

    this.socket.listenDeliveryLocation().pipe(takeUntil(this.destroy$)).subscribe(data => {
      this.deliveryLocation = data.location;
      this.mapCenter = data.location;
    });
  }

  getStepIndex(): number {
    const order: OrderStatus[] = ['confirmed', 'preparing', 'picked_up', 'on_the_way', 'delivered'];
    return order.indexOf(this.orderStatus);
  }

  getEta(): number {
    const etaMap: Record<string, number> = {
      confirmed: 45, preparing: 30, picked_up: 20, on_the_way: 10
    };
    return etaMap[this.orderStatus] ?? 0;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.socket.disconnect();
  }
}
