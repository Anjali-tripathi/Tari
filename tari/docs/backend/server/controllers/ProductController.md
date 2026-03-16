**File Overview**

- **What this file does:** `ProductController.js` exposes functions (controller actions) that handle HTTP requests related to products — listing, searching, retrieving single products, creating, updating, and deleting products.
- **Why this file exists:** To separate request-handling logic from routing and database models. It translates HTTP requests (`req`) into model operations and returns HTTP responses (`res`). This keeps the server organized (MVC-like pattern).
- **Role in architecture:** Controller layer. It is called by route handlers in `server/routes/*` and uses models from `server/models` to perform data operations.

**Imports**

- `const { Product } = require('../models');`
  - Module: local `models` index that exports Mongoose models.
  - Why used: to perform database operations on the `Product` collection when not running in mock mode.
  - Role: primary data access for real DB queries.

- `const { mockProducts } = require('../mockData');`
  - Module: `mockData.js` exports in-memory arrays used when the database is not connected.
  - Why used: allows the server to run without MongoDB for development or demos.
  - Role: fallback data source.

- `const mongoose = require('mongoose');`
  - Module: `mongoose` is an ODM (Object Data Modeling) library for MongoDB.
  - Why used: to detect whether a DB connection is available via `mongoose.connections[0].readyState`.
  - Role: environment/connection check.

**Variables and Small Helpers**

- `useMock()`
  - Purpose: returns `true` when Mongoose's first connection is not ready, meaning the app should use `mockProducts` instead of real DB models.
  - When called: at the start of controller functions to decide data source.
  - How it works: checks `mongoose.connections[0].readyState` which is `1` when connected. Returns negation.

**Functions (exports)**

Each exported function is an Express controller that receives `(req, res)`.

1. `getProducts` (async)
   - Purpose: return a paginated, filterable list of products.
   - Called when: route for listing products is hit (GET `/products` or similar).
   - Steps:
     1. Read query params: `category`, `search`, `page`, `limit`.
     2. Load products from DB or `mockProducts` depending on `useMock()`.
     3. Apply `category` filter (exact match).
     4. Apply `search` filter on `name` or `description` (case-insensitive contains).
     5. Compute pagination slice and send JSON response.
   - Error handling: wraps in `try/catch`; on error returns 500 and error message.

2. `getCategories` (async)
   - Purpose: return unique product categories.
   - Called when: route to fetch categories is hit.
   - Steps:
     1. Load products (DB or mock).
     2. Map product categories and use `Set` to deduplicate.
     3. Return array of unique categories.

3. `getProduct` (async)
   - Purpose: return a single product by id.
   - Called when: route for single product (GET `/products/:id`).
   - Steps:
     1. Use `mockProducts.find` or `Product.findById`.
     2. If not found, return 404.
     3. Otherwise return product JSON.

4. `createProduct` (async)
   - Purpose: create a new product record.
   - Called when: POST `/products`.
   - Steps:
     1. If `useMock()`: create an object with `_id` = timestamp string, push to `mockProducts`, return 201 with item.
     2. Else: call `Product.create(req.body)` and return 201 with created document.
   - Error handling: on validation or creation errors returns 400.

5. `updateProduct` (async)
   - Purpose: update an existing product by id.
   - Called when: PUT/PATCH `/products/:id`.
   - Steps:
     1. If `useMock()`: find index in `mockProducts`, merge updates, return updated object or 404.
     2. Else: `Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })` returns updated doc. If not found => 404.
   - Error handling: returns 400 on validation errors.

6. `deleteProduct` (async)
   - Purpose: delete a product by id.
   - Called when: DELETE `/products/:id`.
   - Steps:
     1. If `useMock()`: remove from array and return message.
     2. Else: `Product.findByIdAndDelete(req.params.id)` then return message.
   - Error handling: returns 500 on general failures.

**Programming Concepts (Detailed)**

- `try / catch`
  - What: JavaScript construct to catch exceptions thrown in a `try` block and handle them in `catch`.
  - Why: To prevent crashes and return HTTP errors instead of letting the server crash.
  - When to use: around asynchronous code or any code that may `throw` errors.
  - Analogy: Like wrapping risky operations in a safety net.

- `async / await`
  - What: syntax for writing asynchronous code that returns Promises in a synchronous style.
  - Why: Makes asynchronous flows easier to read compared to `.then()` chains.
  - When to use: for I/O operations such as DB queries.
  - Analogy: `await` pauses a function until a promise resolves, like waiting for a package delivery before continuing.

- `require`
  - What: CommonJS module import function used in Node.js to bring other modules/files into the current file.
  - Why: To reuse code across files (models, utilities).
  - When: at top of files to load dependencies.

- `exports` / `module.exports`
  - What: Node.js mechanism to expose functions/objects from a module so other files can `require` them.
  - Why: To make controller functions available to routing code.
  - When: export controllers so `routes` can import them.

- `req` and `res`
  - What: `req` is the Express request object with data from the client; `res` is the response object used to send back data.
  - Why: controllers use them to read inputs (`req.params`, `req.query`, `req.body`, `req.user`) and send outputs (`res.status()`, `res.json()`).

- `res.status()` and `res.json()`
  - `res.status(code)` sets the HTTP status code.
  - `res.json(obj)` sets the body as JSON and sends the response.
  - Why: to follow HTTP protocol and return structured data.

- `pagination`
  - What: splitting large result sets into pages using `page` and `limit`.
  - Why: reduce payload size and improve performance.
  - In this file: implemented by slicing the loaded array with `start` and `end` indices.

- `filtering` and `search`
  - What: narrowing results by fields like `category`, searching `name` or `description`.
  - Why: UX feature to let users find relevant items quickly.

- `database queries` (Mongoose)
  - What: calls like `Product.find({})`, `Product.findById`, `Product.create`, `findByIdAndUpdate`, `findByIdAndDelete`.
  - Why: to read/write MongoDB via Mongoose models.
  - Note: when `useMock()` is true, the code uses in-memory arrays instead.

- `error handling`
  - What: catching exceptions and returning appropriate HTTP error codes and messages.
  - Why: to give clients useful feedback and avoid leaking sensitive info.

- `middleware flow`
  - What: Express processes middleware in sequence; middleware can attach `req.user` (e.g., authentication) used here.
  - Why: controllers rely on `req.user` for user-scoped operations.

**Code Walkthrough (logical blocks & line-by-line summary)**

1. Imports and helper
   - Lines 1-3: load `Product`, `mockProducts`, and `mongoose`.
   - Line 5: `useMock()` helper returns boolean based on DB connection.

2. `getProducts`
   - Read query params, load products, filter by category and search, paginate, return JSON.

3. `getCategories`
   - Load products, deduplicate categories via `Set`, return array.

4. `getProduct`
   - Find product by id using mock or DB, return 404 if missing, otherwise return product.

5. `createProduct`
   - Create product in mock or DB and return 201.

6. `updateProduct`
   - Update product in mock or DB; uses `runValidators` for DB updates and returns updated document.

7. `deleteProduct`
   - Delete from mock or DB and return success message.

**API Explanation (endpoints covered by this controller)**

Note: Actual route paths are defined in `server/routes/product.routes.js`. Typical mappings:

- GET `/products` — `getProducts`
  - Query params: `category`, `search`, `page`, `limit`
  - Response: array of product objects (paginated)

- GET `/products/categories` — `getCategories`
  - Response: array of category strings

- GET `/products/:id` — `getProduct`
  - Params: `id` (product id)
  - Response: product object or 404

- POST `/products` — `createProduct`
  - Body: product fields (name, price, category, etc.)
  - Response: created product (status 201) or 400 on validation error

- PUT/PATCH `/products/:id` — `updateProduct`
  - Params: `id` ; Body: fields to update
  - Response: updated product or 404 / 400 on error

- DELETE `/products/:id` — `deleteProduct`
  - Params: `id`
  - Response: { message: 'Product deleted' }

**Best Practices**

- Good:
  - Clear separation between controller and model.
  - Graceful fallback to `mockData` for local development.
  - Use of `try/catch` around async operations.
  - Proper HTTP status codes for create (201) and not found (404).

- Improvements:
  - For large datasets, use DB-level pagination with `limit` and `skip` instead of loading all items then slicing.
  - Use query building for filters directly in `Product.find()` for efficiency.
  - Validate and sanitize `req.query` values (`page`, `limit` should be numbers).
  - Centralize error formatting (error middleware) to avoid repetitive `try/catch` in every controller.
  - Add logging when errors occur.

**Summary**

`ProductController.js` is the application's product request handler layer. It handles listing, searching, CRUD operations for products, and falls back to in-memory mock data if MongoDB is not connected. It translates HTTP requests into data operations and returns appropriate HTTP responses.
