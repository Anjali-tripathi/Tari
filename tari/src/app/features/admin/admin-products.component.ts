import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from './admin.service';
import { NotificationService } from '../../core/services/notification.service';
import { Product } from '../../core/models';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent implements OnInit {

  products: Product[] = [];
  editing: boolean = false;
  editingId: string = '';
  form!: FormGroup;
  saving: boolean = false;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private notify: NotificationService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadProducts();
  }

  initForm(p?: Product): void {
    this.form = this.fb.group({
      name: [p?.name || '', Validators.required],
      description: [p?.description || ''],
      price: [p?.price || '', [Validators.required, Validators.min(1)]],
      category: [p?.category || '', Validators.required],
      image: [p?.image || '', Validators.required],
      preparationTime: [p?.preparationTime || 20]
    });
  }

  loadProducts(): void {
    this.adminService.getAllProducts()
      .subscribe((p: Product[]) => this.products = p);
  }

  editProduct(p: Product): void {
    this.editing = true;
    this.editingId = p._id;
    this.initForm(p);
  }

  cancelEdit(): void {
    this.editing = false;
    this.editingId = '';
    this.initForm();
  }

  saveProduct(): void {
    if (this.form.invalid) return;

    this.saving = true;

    const obs = this.editing
      ? this.adminService.updateProduct(this.editingId, this.form.value)
      : this.adminService.createProduct(this.form.value);

    obs.subscribe({
      next: () => {
        this.notify.success(this.editing ? 'Product updated!' : 'Product added!');
        this.loadProducts();
        this.cancelEdit();
        this.saving = false;
      },
      error: () => {
        this.saving = false;
      }
    });
  }

  deleteProduct(id: string): void {
    if (!confirm('Delete this product?')) return;

    this.adminService.deleteProduct(id)
      .subscribe(() => {
        this.notify.success('Product deleted!');
        this.loadProducts();
      });
  }

  toggleAvailability(p: Product): void {
    this.adminService
      .updateProduct(p._id, { availability: !p.availability })
      .subscribe((updated: Product) => {
        const idx = this.products.findIndex(x => x._id === p._id);
        if (idx > -1) this.products[idx] = updated;
      });
  }
}