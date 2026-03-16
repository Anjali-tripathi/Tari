# Tari Food Delivery App - Complete Architecture & Flow Documentation

## 🎯 **Project Overview**
**Tari** is a **full-stack food delivery application** built with **Angular 14 (Frontend)** + **Node.js/Express (Backend)** + **MongoDB** + **Socket.io (Real-time)**. 

**Key Features:**
- User registration/login (JWT Auth)
- Product catalog with search/filter
- Shopping cart management
- Checkout with Razorpay payment
- Order tracking with Google Maps & live delivery partner location
- Admin dashboard (orders, products, users)
- Delivery partner dashboard
- Real-time order status updates via WebSockets
- Role-based access (User/Admin/Delivery)

**Tech Stack:**
```
Frontend: Angular 14, RxJS 7.5, Angular Material, Google Maps
Backend: Node.js, Express, Mongoose, Socket.io, Razorpay
Database: MongoDB
Dev Tools: Angular CLI, Proxy for dev server
```

## 🏗️ **Project Structure**

```
tari/
├── src/app/
│   ├── core/          # Services, Interceptors, Guards, Models
│   ├── shared/        # Reusable components (Navbar, Loader, ProductCard)
│   └── features/      # Lazy-loaded modules (Home, Menu, Cart, Admin, etc.)
├── server/            # Node.js backend
└── proxy.conf.json    # Angular proxy to backend
```

## 🔄 **Complete Data Flow**

```
1. User opens app → HomeComponent (lazy loaded)
   ↓
2. Navbar subscribes to auth.currentUser$ & cart.cartCount$
   ↓
3. User browses menu → MenuComponent → menuService.getProducts()
   ↓ [RxJS Observable → HTTP → Proxy → Backend]
4. Products displayed via ProductCard components
   ↓
5. Add to cart → cartService.addToCart() → BehaviorSubject updates
   ↓ [cart$ Observable → Navbar updates count]
6. Checkout → Creates order → Razorpay payment
   ↓
7. Order created → Socket.io emits order-status-update
   ↓ [Real-time: TrackingComponent receives via socket.listenOrderStatus()]
8. Delivery partner sees order → Updates location → Live tracking on map
```

## ⚡ **RxJS Implementation - Heart of the App**

RxJS powers **reactive state management** & **async data flows**:

### 1. **State Management with BehaviorSubject**
```typescript
// auth.service.ts - User state
private currentUserSubject = new BehaviorSubject<User | null>(null);
currentUser$ = this.currentUserSubject.asObservable();

// Components subscribe:
currentUser$ | async in template → Navbar shows user info
```

```typescript
// cart.service.ts - Cart state
private cartSubject = new BehaviorSubject<CartItem[]>([]);
cart$ = this.cartSubject.asObservable();
cartCount$ = this.cart$.pipe(map(items => items.reduce((s, i) => s + i.quantity, 0)));
```

```typescript
// loading.service.ts - Global loading
private loadingSubject = new BehaviorSubject<boolean>(false);
loading$ = this.loadingSubject.asObservable();
```

### 2. **HTTP with RxJS Operators**
```typescript
// api.service.ts - Clean HTTP wrapper
get<T>(path: string, params?: any): Observable<T> { ... }

// Feature services chain them:
menuService.getProducts({category, search}).pipe(
  tap(products => this.products = products),  // Side effect
  catchError(err => this.handleError(err))     // Error handling
)
```

### 3. **Search Debouncing**
```typescript
// search.component.ts
fromEvent(this.searchInput.nativeElement, 'input')
  .pipe(
    debounceTime(500),        // Wait 500ms after typing stops
    distinctUntilChanged(),   // Only emit if value changed
    map(event => (event.target as HTMLInputElement).value),
    takeUntil(this.destroy$)  // Cleanup on destroy
  )
  .subscribe(searchTerm => this.onSearch(searchTerm));
```

### 4. **Interceptors Chain HTTP Requests**
```typescript
// loading.interceptor.ts
intercept(req, next): Observable<HttpEvent> {
  this.loading.show();
  return next.handle(req).pipe(
    finalize(() => this.loading.hide())  // Always hide loader
  );
}
```

### 5. **Real-time with Socket + RxJS**
```typescript
// tracking.component.ts
this.socket.listenOrderStatus().pipe(
  takeUntil(this.destroy$)
).subscribe(data => {
  this.orderStatus = data.status;
});
```

## 🌐 **Backend Architecture**

### **Express Routes** (`server/server.js`):
```
POST /api/auth/register    → AuthController.register()
POST /api/auth/login       → AuthController.login()
GET  /api/products         → ProductController.getProducts()
POST /api/orders           → OrderController.createOrder()
GET  /api/admin/stats      → AdminController.getStats()
POST /api/payment/initiate → PaymentController.initiatePayment()
```

### **Middleware Flow**:
```
Request → helmet() → cors() → json() → auth.protect() → restrictTo('admin') → Controller
```

### **Socket.io Events**:
```
order-status-update    → Order status changes (preparing → out-for-delivery)
delivery-location      → Live GPS updates from delivery partner
```

## 🚀 **Development Setup & Proxy Magic**

### **Angular Proxy** (`proxy.conf.json`):
```json
{
  \"/api\": { \"target\": \"http://localhost:3000\", \"secure\": false },
  \"/assets/**\": { \"target\": \"http://localhost:4200\" }
}
```
```
ng serve → /api/products → Proxy → Backend:3000/api/products
```

### **Run Commands**:
```bash
# Backend
cd server && npm install && npm start  # Port 3000

# Frontend  
ng serve                             # Port 4200 (proxies to backend)
```

## 🛡️ **Security & Guards**

### **Angular Guards**:
```typescript
// auth.guard.ts
canActivate(): boolean {
  return this.authService.isAuthenticated();
}

// admin.guard.ts
canActivate(): boolean {
  return this.authService.hasRole('admin');
}
```

### **JWT Flow**:
```
Login → Backend JWT → jwt.interceptor adds Authorization header → API calls authenticated
```

## 📱 **Key Components & Features**

| Feature | Components | Services | RxJS Usage |
|---------|------------|----------|------------|
| **Auth** | LoginDialog, Navbar | AuthService | BehaviorSubject (currentUser$) |
| **Menu** | MenuComponent, ProductCard | MenuService | Observables, debounceTime |
| **Cart** | CartComponent | CartService | BehaviorSubject (cart$) + map() |
| **Tracking** | TrackingComponent | SocketService | Socket Observables + Google Maps |
| **Admin** | AdminDashboard, AdminOrders | AdminService | HttpClient + Interceptors |

## 🎨 **UI/UX Highlights**
- **Angular Material** throughout
- **Responsive** design with CSS Grid/Flexbox
- **Custom Pipes**: `currency-format`, `time-ago`
- **Loading States** via global LoadingService
- **Notifications** via MatSnackBar

## 🔍 **Models (TypeScript Interfaces)**

```typescript
interface User { _id: string; name: string; role: 'user'|'admin'|'delivery'; addresses: Address[] }
interface Product { _id: string; name: string; price: number; category: string }
interface Order { _id: string; items: OrderItem[]; totalAmount: number; orderStatus: OrderStatus }
```

## 📈 **Performance Optimizations**
1. **Lazy Loading**: All feature modules
2. **OnPush Change Detection** (implicit via services)
3. **RxJS takeUntil(destroy$)** - Memory leak prevention
4. **TrackBy** in *ngFor for lists
5. **Proxy Caching** for assets

## 🎉 **Interview Talking Points**

1. **\"How does state flow from cart to navbar?\"**
   - CartService BehaviorSubject → cartCount$ Observable → Navbar subscribes → Auto-updates

2. **\"Explain RxJS usage\"**
   - BehaviorSubject for state, Observables for API, operators for transformation/filtering

3. **\"Real-time tracking?\"**
   - Socket.io + RxJS Observables for live GPS + order status

4. **\"How is backend connected?\"**
   - Angular Proxy → Express API → MongoDB + Socket.io

5. **\"Security implementation?\"**
   - JWT Interceptor, Role Guards, Backend middleware

---

**This architecture scales easily** - Add new feature modules, extend API routes, enhance Socket events. **RxJS makes it reactive** - components stay dumb, services handle smart state!

**File: `tari/DOCUMENTATION.md`** - Ready for your interview/manager demo! 🚀

