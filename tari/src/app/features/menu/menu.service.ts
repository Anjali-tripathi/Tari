import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { Product } from '../../core/models';

@Injectable({ providedIn: 'root' })
export class MenuService {
  constructor(private api: ApiService) {}
  getProducts(params?: { category?: string; search?: string }): Observable<Product[]> {
    return this.api.get<Product[]>('/products', params);
  }
  getCategories(): Observable<string[]> {
    return this.api.get<string[]>('/products/categories');
  }
}
