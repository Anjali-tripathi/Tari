import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SocketService {
  private socket!: Socket;

  connect(): void {
    this.socket = io(environment.socketUrl, {
      transports: ['websocket'],
      autoConnect: true
    });
    this.socket.on('connect', () => console.log('Socket connected:', this.socket.id));
    this.socket.on('disconnect', () => console.log('Socket disconnected'));
  }

  joinOrderRoom(orderId: string): void {
    this.socket.emit('join-order', orderId);
  }

  listenOrderStatus(): Observable<{ status: string }> {
    return new Observable(obs => {
      this.socket.on('order-status-update', data => obs.next(data));
    });
  }

  listenDeliveryLocation(): Observable<{ location: { lat: number; lng: number } }> {
    return new Observable(obs => {
      this.socket.on('delivery-location', data => obs.next(data));
    });
  }

  emitDeliveryLocation(location: { lat: number; lng: number }, orderId: string): void {
    this.socket.emit('update-location', { location, orderId });
  }

  emitOrderStatusUpdate(orderId: string, status: string): void {
    this.socket.emit('update-order-status', { orderId, status });
  }

  disconnect(): void {
    if (this.socket) this.socket.disconnect();
  }
}
