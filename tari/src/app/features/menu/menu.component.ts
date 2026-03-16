import { Component, OnInit } from '@angular/core';
import { MenuService } from './menu.service';
import { CartService } from '../cart/cart.service';
import { Product } from '../../core/models';
import { NotificationService } from '../../core/services/notification.service';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']    ,
})

export class MenuComponent implements OnInit {
  products: Product[] = [];
  categories: string[] = [];
  selectedCategory: string | null = null;
  searchCtrl = new FormControl('');

  constructor(
    private menuService: MenuService,
    private cart: CartService,
    private notify: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
    this.searchCtrl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(v => this.loadProducts(v || undefined));
  }

  loadCategories(): void {
    this.menuService.getCategories().subscribe(cats => this.categories = cats);
  }

  loadProducts(search?: string): void {
    this.menuService.getProducts({
      category: this.selectedCategory || undefined,
      search
    }).subscribe(p => this.products = p);
  }

  selectCategory(cat: string | null): void {
    this.selectedCategory = cat;
    this.loadProducts();
  }

  onAddToCart(product: Product): void {
    this.cart.addToCart(product);
    this.notify.success(`${product.name} added to cart!`);
  }
}
