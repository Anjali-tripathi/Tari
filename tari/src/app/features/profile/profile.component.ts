import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models';

// ===== profile.component.ts =====
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  constructor(private auth: AuthService) {}
  ngOnInit(): void { this.user = this.auth.getCurrentUser(); }
}
