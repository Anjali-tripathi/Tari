import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// ===== auth.guard.ts =====
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}
  canActivate(): boolean {
    if (this.auth.isAuthenticated()) return true;
    this.router.navigate(['/']);
    return false;
  }
}

// ===== admin.guard.ts =====
@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}
  canActivate(): boolean {
    if (this.auth.hasRole('admin')) return true;
    this.router.navigate(['/']);
    return false;
  }
}

// ===== delivery.guard.ts =====
@Injectable({ providedIn: 'root' })
export class DeliveryGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}
  canActivate(): boolean {
    if (this.auth.hasRole('delivery')) return true;
    this.router.navigate(['/']);
    return false;
  }
}
