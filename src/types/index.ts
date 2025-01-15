// ... existing types ...

export interface PaymentSettings {
  payeeName: string;
  identifier: string;
  identifierType: 'upi' | 'mobile';
}

export interface Product {
  id: string;
  name: string;
  price: number;
  costPrice: number; // Added for profit calculation
  stock: number;
  category: string;
  reorderPoint: number;
}

// Update StoreState
export interface StoreState {
  // ... existing properties ...
  paymentSettings: PaymentSettings | null;
  updatePaymentSettings: (settings: PaymentSettings) => void;
  // ... rest of the interface
}
