import { Component } from '@angular/core';

// ===== admin-layout.component.ts =====
@Component({
  selector: 'app-admin-layout',
  template: `
    <div class="admin-layout">
      <aside class="admin-sidebar">
        <div class="sidebar-header">
          <span class="admin-logo">🛡️ Admin</span>
        </div>
        <nav>
          <a mat-list-item routerLink="dashboard" routerLinkActive="active">
            <mat-icon>dashboard</mat-icon> Dashboard
          </a>
          <a mat-list-item routerLink="orders" routerLinkActive="active">
            <mat-icon>receipt_long</mat-icon> Orders
          </a>
          <a mat-list-item routerLink="products" routerLinkActive="active">
            <mat-icon>fastfood</mat-icon> Products
          </a>
          <a mat-list-item routerLink="users" routerLinkActive="active">
            <mat-icon>people</mat-icon> Users
          </a>
        </nav>
      </aside>
      <main class="admin-main">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .admin-layout { display: flex; min-height: calc(100vh - 64px); }
    .admin-sidebar { width: 240px; background: #212121; color: white; flex-shrink: 0; }
    .sidebar-header { padding: 20px 16px; border-bottom: 1px solid #333; }
    .admin-logo { font-size: 1.2rem; font-weight: 700; color: #ff833a; }
    nav { padding: 12px 0; }
    nav a { display: flex; align-items: center; gap: 12px; padding: 12px 20px; color: #aaa; text-decoration: none; font-size: 14px; transition: all .2s; }
    nav a:hover, nav a.active { background: #333; color: white; }
    nav a mat-icon { font-size: 1.1rem; }
    .admin-main { flex: 1; padding: 24px; background: #f5f5f5; overflow: auto; }
    @media(max-width: 768px) { .admin-sidebar { display: none; } }
  `]
})
export class AdminLayoutComponent {}
