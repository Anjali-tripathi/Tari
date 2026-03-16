import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { RegisterDialogComponent } from './register-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.css']
})
export class LoginDialogComponent {
  form: FormGroup;
  loading = false;
  showPass = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private notify: NotificationService,
    private dialogRef: MatDialogRef<LoginDialogComponent>,
    private dialog: MatDialog
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  login(): void {
    if (this.form.invalid) return;
    this.loading = true;
    const { email, password } = this.form.value;
    this.auth.login(email, password).subscribe({
      next: () => { this.notify.success('Login successful!'); this.dialogRef.close('success'); },
      error: () => { this.loading = false; }
    });
  }

  openRegister(): void {
    this.dialogRef.close();
    this.dialog.open(RegisterDialogComponent, { width: '420px' });
  }
}
