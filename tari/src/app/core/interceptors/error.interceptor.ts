import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService, private notify: NotificationService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401) {
          this.auth.logout();
          this.notify.error('Session expired. Please login again.');
        } else if (err.status === 403) {
          this.notify.error('You do not have permission to perform this action.');
        } else if (err.status === 0) {
          this.notify.error('Cannot connect to server. Please try again.');
        } else {
          const msg = err.error?.message || 'Something went wrong.';
          this.notify.error(msg);
        }
        return throwError(() => err);
      })
    );
  }
}
