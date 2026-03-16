// ========== user.model.ts ==========
export interface Address {
  _id?: string;
  label: string;   // Home / Work / Other
  line1: string;
  city: string;
  pincode: string;
  lat?: number;
  lng?: number;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'admin' | 'delivery';
  addresses: Address[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ========== product.model.ts ==========
export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  availability: boolean;
  rating: number;
  ratingCount: number;
  tags: string[];
  preparationTime: number;
  createdAt: string;
}

// ========== order.model.ts ==========
export type OrderStatus =
  | 'confirmed'
  | 'preparing'
  | 'picked_up'
  | 'on_the_way'
  | 'delivered'
  | 'cancelled';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  _id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: 'cod' | 'upi' | 'card';
  paymentStatus: 'pending' | 'paid';
  orderStatus: OrderStatus;
  deliveryAddress: Address;
  deliveryPartnerId?: string;
  specialInstructions?: string;
  paymentRef?: string;
  createdAt: string;
  updatedAt: string;
}

// ========== delivery-partner.model.ts ==========
export interface DeliveryPartner {
  _id: string;
  userId: string;
  name: string;
  phone: string;
  vehicleNumber: string;
  currentLocation: { lat: number; lng: number; updatedAt: string };
  activeOrderId?: string;
  isAvailable: boolean;
  totalDeliveries: number;
  rating: number;
}

// ========== api-response.model.ts ==========
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface AuthResponse {
  token: string;
  user: User;
}
