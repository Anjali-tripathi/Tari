**File Overview**

- **What this file does:** `mockData.js` provides in-memory sample data for `products`, `users`, and `orders` so the app can run without a MongoDB connection.
- **Why this file exists:** To enable development and demos when a database isn't available, reducing friction for frontend development and testing.
- **Role in architecture:** Local demo data source; controllers check `mongoose.connections[0].readyState` and fall back to the arrays exported here when not connected.

**Exports**

- `mockProducts` — array of product objects with fields like `_id`, `name`, `category`, `price`, `image`, `availability`, `rating`, `reviews`, `preparationTime`.
- `mockUsers` — array of user objects with basic fields and plain text passwords (for demo only).
- `mockOrders` — small sample of an order referencing `userId` and product data.

**Security note**

- Plaintext passwords in `mockUsers` are strictly for demo use and must not be used in production. The `useMock()` switch avoids this data when MongoDB is connected.

**Best practices / improvements**

- Use fixtures or JSON files for larger mock datasets.
- Keep mock passwords and tokens clearly marked and separate from real data.

**Summary**

`mockData.js` enables demo mode by exporting sample arrays for products, users, and orders consumed by controllers when no DB connection is available.