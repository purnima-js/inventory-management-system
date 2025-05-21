// User types
export interface User {
  _id: string;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

// Category types
export interface Category {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryInput {
  name: string;
}

// Product types
export interface Product {
  _id: string;
  name: string;
  category:
    | {
        name: string;
        _id: string;
      }
    | string;
  image: string;
  price: number;
  stock: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductInput {
  name: string;
  category: string;
  price: number;
  stock: number;
  image: File | string;
}
export interface OrderItem {
  _id: string;
  owner: string;
  product: Product;
  quantity: number;
  price: number;
}

export interface OrderItemInput {
  product: string;
  quantity: number;
}

export interface UpdateOrderItemInput {
  quantity: number;
}

// Discount types
export interface Discount {
  _id: string;
  code: string;
  percentage: number;
  isActive: boolean;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface DiscountInput {
  code: string;
  percentage: number;
  isActive: boolean;
  expiresAt: string;
}

// Order types
export interface Order {
  _id: string
  total: number
  discountedTotal?: number
  customer: User | { _id: string; email: string } | string
  discount?: Discount | string | null
  paymentType: "CASH" | "CARD"
  paymentId?: string | null
  status: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED"
  isPaid: boolean
  orderItems: OrderItem[] | string[]
  createdAt: string
  updatedAt: string
}

export interface OrderInput {
  customer: string
  orderItems: string[]
  total: number
  discountCode?: string
  paymentType: "CASH" | "CARD"
}

// API Response types
export interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}

export interface ReportData {
  totalProducts: number
  totalOrders: number
  totalRevenue: number
  totalCustomers: number
  recentOrders: Order[]
  productsByCategory: {
    category: string
    count: number
  }[]
  ordersByStatus: {
    status: string
    count: number
  }[]
  ordersByPaymentType: {
    paymentType: string
    count: number
  }[]
  monthlySales: {
    month: string
    sales: number
  }[]
}