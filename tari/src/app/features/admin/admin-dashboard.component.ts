import { Component, OnInit } from '@angular/core';
import { AdminService, DashboardStats } from './admin.service';

@Component({
  selector: 'app-admin-dashboard',
  template: `
    
  `,
  
})
export class AdminDashboardComponent implements OnInit {
  stats: DashboardStats | null = null;
  totalOrders = 0;
  totalRevenue = 0;
  totalUsers = 0;
  activeDeliveries = 0;
  ordersToday = 0;
  revenueToday = 0;

  constructor(private adminService: AdminService) {}
  ngOnInit(): void { this.adminService.getDashboardStats().subscribe(s => this.stats = s); }
}
