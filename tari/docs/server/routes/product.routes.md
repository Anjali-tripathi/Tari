**File Overview**

- **What this file does:** `product.routes.js` maps HTTP product routes to controller functions and protects admin routes with authentication and role middleware.
- **Why this file exists:** To define RESTful endpoints for product CRUD and public listing.
- **Role in architecture:** Route layer connecting HTTP endpoints to controller logic.

**Routes**

- `GET /` → `ctrl.getProducts` — public listing with filters and pagination.
- `GET /categories` → `ctrl.getCategories` — public categories list.
- `GET /:id` → `ctrl.getProduct` — get single product by id.
- `POST /` → protected, admin only → `ctrl.createProduct`.
- `PUT /:id` → protected, admin only → `ctrl.updateProduct`.
- `DELETE /:id` → protected, admin only → `ctrl.deleteProduct`.

**Middleware**

- Uses `protect` to ensure authentication and `restrictTo('admin')` for admin-only actions.

**Summary**

`product.routes.js` wires product-related HTTP endpoints to `ProductController` and secures modification endpoints for admins.