# 🍱 TARI — Food Delivery Platform

> Production-ready Angular 14 food delivery application with Node.js backend, MongoDB, Socket.io real-time tracking, and plugin-ready payment architecture.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- MongoDB (local or Atlas)
- Angular CLI 14

---

## 📦 Installation

### Step 1 — Install Angular Frontend

```bash
cd tari

# Install dependencies
npm install

# (If you see peer dependency warnings, use --legacy-peer-deps)
npm install --legacy-peer-deps
```

### Step 2 — Install Backend

```bash
cd server
npm install
```

### Step 3 — Configure Environment

**Frontend** — edit `src/environments/environment.ts`:
```ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  socketUrl: 'http://localhost:3000',
  googleMapsApiKey: 'YOUR_GOOGLE_MAPS_API_KEY'  // ← Add your key here
};
```

**Backend** — edit `server/.env`:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/tari
JWT_SECRET=change_this_to_a_long_random_secret
CLIENT_URL=http://localhost:4200
```

### Step 4 — Add Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Enable **Maps JavaScript API**
3. Create an API key
4. Add it to `src/index.html`:
```html
<script async src="https://maps.googleapis.com/maps/api/js?key=YOUR_KEY&libraries=places"></script>
```
5. Also add to `src/environments/environment.ts`

---

## ▶️ Running the App

Open **3 terminals**:

**Terminal 1 — MongoDB**
```bash
mongod --dbpath /data/db
# or if using Homebrew on Mac:
brew services start mongodb-community
```

**Terminal 2 — Backend**
```bash
cd server
npm run dev   # uses nodemon for auto-reload
# Server runs on http://localhost:3000
```

**Terminal 3 — Angular Frontend**
```bash
npm start
# App runs on http://localhost:4200
```

---

## 🏗️ Project Structure

```
tari/
├── src/app/
│   ├── core/               # Singleton services, guards, interceptors
│   │   ├── services/       # auth, api, socket, loading, notification
│   │   ├── interceptors/   # JWT, error, loading
│   │   ├── guards/         # auth, admin, delivery
│   │   └── models/         # TypeScript interfaces
│   ├── shared/             # Reusable components, pipes
│   │   ├── components/     # navbar, footer, loader, product-card
│   │   └── pipes/          # currencyFormat, timeAgo
│   └── features/           # Lazy-loaded feature modules
│       ├── home/           # Landing page + login/register dialogs
│       ├── menu/           # Browse food items
│       ├── cart/           # Shopping cart
│       ├── checkout/       # Order placement + payment
│       ├── tracking/       # Live Google Maps order tracking
│       ├── profile/        # User profile, orders, addresses
│       ├── admin/          # Admin dashboard (protected)
│       └── delivery/       # Delivery partner panel (protected)
└── server/
    ├── models/             # Mongoose schemas (User, Product, Order, DeliveryPartner)
    ├── controllers/        # Business logic
    ├── routes/             # Express route handlers
    ├── middleware/         # JWT auth, role check
    └── sockets/            # Socket.io event handlers
```

---

## 👥 User Roles & Access

| Role | Access |
|------|--------|
| `user` | Home, Menu, Cart, Checkout, Tracking, Profile |
| `admin` | Everything + Admin Dashboard (`/admin`) |
| `delivery` | Delivery Dashboard (`/delivery`) |

To create an admin user, register normally then update via MongoDB:
```js
db.users.updateOne({ email: "admin@tari.com" }, { $set: { role: "admin" } })
```

---

## 💳 Adding Payment Providers

### Razorpay (Recommended for UPI)

1. **Install:** `npm install razorpay` (in `/server`)
2. **Add to `.env`:**
   ```
   RAZORPAY_KEY_ID=rzp_test_xxxxx
   RAZORPAY_KEY_SECRET=your_secret
   ```
3. **Uncomment** the Razorpay block in `server/controllers/PaymentController.js`
4. **Add Razorpay script** to `src/index.html`:
   ```html
   <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
   ```
5. **Update** Angular `payment.service.ts` to open Razorpay checkout popup

### PhonePe / Paytm
Follow a similar pattern — call your backend `initiate` endpoint, open the provider SDK, then call `verifyPayment()`.

---

## 🔌 Socket.io Events

| Event | Direction | Payload |
|-------|-----------|---------|
| `join-order` | Client → Server | `orderId: string` |
| `update-location` | Client → Server | `{ location: { lat, lng }, orderId }` |
| `update-order-status` | Client → Server | `{ orderId, status }` |
| `delivery-location` | Server → Client | `{ location: { lat, lng } }` |
| `order-status-update` | Server → Client | `{ status }` |

---

## 🌐 API Endpoints

```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me

GET    /api/products
GET    /api/products/categories
GET    /api/products/:id

POST   /api/orders              (auth)
GET    /api/orders/my           (auth)
GET    /api/orders/:id          (auth)

POST   /api/users/address       (auth)
DELETE /api/users/address/:id   (auth)
PATCH  /api/users/me            (auth)

POST   /api/payment/initiate    (auth)
POST   /api/payment/verify      (auth)

GET    /api/admin/stats         (admin)
GET    /api/admin/orders        (admin)
PATCH  /api/admin/orders/:id/status  (admin)
PATCH  /api/admin/orders/:id/assign  (admin)
GET    /api/admin/users         (admin)
POST   /api/admin/products      (admin)
PUT    /api/admin/products/:id  (admin)
DELETE /api/admin/products/:id  (admin)

GET    /api/delivery/orders     (delivery)
PATCH  /api/delivery/orders/:id/status  (delivery)
```

---

## 🚀 Production Deployment

### Frontend (Vercel / Netlify)
```bash
npm run build:prod
# Upload dist/tari/ to Vercel or Netlify
```

### Backend (Railway / Render / EC2)
```bash
# With PM2
npm install -g pm2
pm2 start server.js --name tari-api
pm2 save
pm2 startup
```

### MongoDB Atlas
Replace `MONGODB_URI` in `.env` with your Atlas connection string.

---

## 🛡️ Security Features

- JWT authentication with 7-day expiry
- bcrypt password hashing (salt rounds: 12)
- Role-based route guards (client + server)
- HTTP interceptors for auto token injection
- Helmet.js for secure HTTP headers
- CORS configured for specific origin

---

Built with ❤️ — Angular 14 + Node.js + MongoDB + Socket.io
