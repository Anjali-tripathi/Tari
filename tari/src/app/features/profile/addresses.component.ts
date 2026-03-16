import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { Address, User } from '../../core/models';

@Component({
  selector: 'app-addresses',
  templateUrl: './addresses.component.html',
  styleUrls: ['./addresses.component.css']
})
export class AddressesComponent implements OnInit {
  user: User | null = null;
  form!: FormGroup;
  saving = true;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private auth: AuthService,
    private notify: NotificationService
  ) {}

  ngOnInit(): void {
    this.user = this.auth.getCurrentUser();
    this.form = this.fb.group({
      label: ['Home', Validators.required],
      line1: ['', Validators.required],
      city: ['', Validators.required],
      pincode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
    });
  }

  saveAddress(): void {
    if (this.form.invalid) return;
    this.saving = true;
    this.api.post<User>('/users/address', this.form.value).subscribe({
      next: (user) => {
        this.auth.updateCurrentUser(user);
        this.user = user;
        this.form.reset({ label: 'Home' });
        this.notify.success('Address saved!');
        this.saving = false;
      },
      error: () => { this.saving = false; }
    });
  }

  removeAddress(addressId: string): void {
    this.api.delete<User>(`/users/address/${addressId}`).subscribe(user => {
      this.auth.updateCurrentUser(user);
      this.user = user;
    });
  }
}
