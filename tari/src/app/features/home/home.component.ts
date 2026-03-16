import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../core/services/auth.service';
import { LoginDialogComponent } from './login-dialog.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  features = [
    { icon: '⚡', title: 'Lightning Fast', desc: 'Cooked in pure A2 Ghee' },
    { icon: '🌿', title: 'Fresh Ingredient', desc: 'Our spices are hand-blended' },
    { icon: '📍', title: 'Cooking Method', desc: 'Nothing reheated, Nothing rushed' },
  ];

  constructor(private auth: AuthService, private router: Router, private dialog: MatDialog) {}

  onOrderNow(): void {
    if (this.auth.isAuthenticated()) {
      this.router.navigate(['/menu']);
    } else {
      this.dialog.open(LoginDialogComponent, { width: '400px' }).afterClosed().subscribe(result => {
        if (result === 'success') this.router.navigate(['/menu']);
      });
    }
  }
}
