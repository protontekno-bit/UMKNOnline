export type CategoryId = 'all' | 'burger' | 'pizza' | 'chicken' | 'drink' | 'dessert' | 'paket';

export type NavTab = 'explore' | 'favorites' | 'orders' | 'profile' | 'admin';

export type SortOption = 'popular' | 'rating' | 'price-asc' | 'price-desc' | 'fastest';

export type PaymentMethodType = 'qris' | 'dana' | 'transfer' | 'cod';

export interface PaymentSettings {
  // QRIS
  qrisMerchantName: string;
  qrisNmid: string;
  qrisImageUrl: string;
  qrisInstructions: string;
  
  // DANA
  danaNumber: string;
  danaAccountName: string;
  danaInstructions: string;
  
  // Bank Transfer (BCA/Mandiri)
  bankName: string;
  bankAccountNumber: string;
  bankAccountName: string;
}

export interface MenuItem {
  id: number;
  name: string;
  category: CategoryId;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  deliveryTime: string;
  distance: string;
  calories: number;
  description: string;
  spicyAvailable: boolean;
  isPopular?: boolean;
  isPromo?: boolean;
  bgGradient: string;
  accentColor: string;
  foodEmoji: string;
  tags: string[];
}

export interface CartItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  spicyLevel?: number;
  notes?: string;
}

export type OrderStatus = 'placed' | 'cooking' | 'delivering' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  status: OrderStatus;
  estimatedDeliveryTime: string;
  driverName?: string;
  driverPhone?: string;
  driverVehicle?: string;
  deliveryAddress: string;
  paymentMethod: string;
}

export interface DeliveryAddress {
  id: string;
  label: string;
  recipient: string;
  phone: string;
  address: string;
  note: string;
  isDefault: boolean;
}

export interface PromoVoucher {
  code: string;
  discountPercent?: number;
  discountAmount?: number;
  minSpend: number;
  description: string;
}
