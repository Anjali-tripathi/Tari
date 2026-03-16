import { Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil , map } from 'rxjs';
import { FormControl } from '@angular/forms';
import { MenuService } from '@features/menu/menu.service';
import { CartService } from '@features/cart/cart.service';
import { NotificationService } from '@core/services/notification.service';
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit , OnDestroy{
      categories: string[] = [];
      selectedCategory: string | null = null;
      searchCtrl = new FormControl('');
    @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
    @Output() search = new EventEmitter<string>();

    private destroy$ = new Subject<void>();
    
    constructor(
        private menuServices : MenuService,
        private cart: CartService,
        private notify: NotificationService
      ) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {
    
    
    this.loadCategories();
    this.loadProducts(undefined);
    setTimeout(() => this.setupSearchStream(), 0);
    
  }
  loadProducts(p0: string | undefined) {
    throw new Error('Method not implemented.');
  }
  private loadCategories(): void {
    // TODO: Implement category loading logic
  }
  private setupSearchStream(): void {
    fromEvent<Event>(this.searchInput.nativeElement, 'input')
    .pipe(
      debounceTime(500),
      distinctUntilChanged(),
      map(event => (event.target as HTMLInputElement).value),
      takeUntil(this.destroy$)
    )
.subscribe(v => this.loadProducts(v || undefined));  }
  

}
