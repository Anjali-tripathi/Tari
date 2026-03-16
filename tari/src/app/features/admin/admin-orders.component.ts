import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AdminService } from './admin.service';
import { Order, OrderStatus } from '../../core/models';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-admin-orders',
  styleUrls: ['./admin-orders.component.css'],
  templateUrl: './admin-orders.component.html'
})
export class AdminOrdersComponent implements OnInit {
  displayedColumns = ['id', 'user', 'amount', 'status', 'payment', 'date', 'actions'];
  dataSource = new MatTableDataSource<Order>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private adminService: AdminService, private notify: NotificationService) {}

  ngOnInit(): void {
    this.adminService.getAllOrders().subscribe(orders => {
      this.dataSource.data = orders;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(event: Event): void {
    const v = (event.target as HTMLInputElement).value;
    this.dataSource.filter = v.trim().toLowerCase();
  }

  updateStatus(orderId: string, status: OrderStatus): void {
    this.adminService.updateOrderStatus(orderId, status).subscribe(() => {
      this.notify.success('Order status updated!');
      const idx = this.dataSource.data.findIndex(o => o._id === orderId);
      if (idx > -1) this.dataSource.data[idx].orderStatus = status;
      this.dataSource._updateChangeSubscription();
    });
  }
}
