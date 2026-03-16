import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User, AuthResponse } from '../models';
import { StorageService } from './storage.service';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    private storage: StorageService
  ) {
    const user = this.storage.getUser();
    if (user) this.currentUserSubject.next(user);
  }

  register(data: { name: string; email: string; phone: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, data)
      .pipe(tap(res => this.handleAuthResponse(res)));
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, { email, password })
      .pipe(tap(res => this.handleAuthResponse(res)));
  }

  logout(): void {
    this.storage.clear();
    this.currentUserSubject.next(null);
    this.router.navigate(['/']);
  }

  isAuthenticated(): boolean { return !!this.storage.getToken(); }

  hasRole(role: string): boolean {
    return this.currentUserSubject.value?.role === role;
  }

  getCurrentUser(): User | null { return this.currentUserSubject.value; }

  updateCurrentUser(user: User): void {
    this.storage.setUser(user);
    this.currentUserSubject.next(user);
  }

  private handleAuthResponse(res: AuthResponse): void {
    this.storage.setToken(res.token);
    this.storage.setUser(res.user);
    this.currentUserSubject.next(res.user);
  }
}
