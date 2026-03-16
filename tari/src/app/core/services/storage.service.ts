import { Injectable } from '@angular/core';
import { User } from '../models';

const TOKEN_KEY = 'tari_token';
const USER_KEY = 'tari_user';

@Injectable({ providedIn: 'root' })
export class StorageService {
  setToken(token: string): void { localStorage.setItem(TOKEN_KEY, token); }
  getToken(): string | null { return localStorage.getItem(TOKEN_KEY); }
  removeToken(): void { localStorage.removeItem(TOKEN_KEY); }

  setUser(user: User): void { localStorage.setItem(USER_KEY, JSON.stringify(user)); }
  getUser(): User | null {
    const u = localStorage.getItem(USER_KEY);
    return u ? JSON.parse(u) : null;
  }
  removeUser(): void { localStorage.removeItem(USER_KEY); }

  clear(): void { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(USER_KEY); }
}
