import { create } from 'zustand';
import { Bill, Product, StoreState, PaymentSettings } from '../types';
import { updateStockLevels, getStockAlerts } from '../utils/stockManagement';

export const useStore = create<StoreState>((set, get) => ({
  products: [],
  bills: [],
  loading: false,
  selectedBillTheme: 'minimal',
  stockAlerts: [],
  paymentSettings: null,
  
  // Products actions
  addProduct: (product: Product) =>
    set((state) => ({ products: [...state.products, product] })),
  
  updateProduct: (product: Product) =>
    set((state) => ({
      products: state.products.map((p) => (p.id === product.id ? product : p)),
    })),
  
  deleteProduct: (id: string) =>
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
    })),

  // Bills actions
  createBill: (bill: Bill) =>
    set((state) => {
      const updatedProducts = updateStockLevels(state.products, bill);
      const stockAlerts = getStockAlerts(updatedProducts);
      return {
        bills: [...state.bills, bill],
        products: updatedProducts,
        stockAlerts
      };
    }),

  // Theme actions
  setSelectedBillTheme: (themeId: string) => 
    set({ selectedBillTheme: themeId }),

  // Payment settings
  updatePaymentSettings: (settings: PaymentSettings) => 
    set({ paymentSettings: settings }),

  // Stats calculation
  getDashboardStats: () => {
    const state = get();
    const totalSales = state.bills.reduce((sum, bill) => sum + bill.total, 0);
    
    // Calculate real profit margin
    const totalCost = state.bills.reduce((sum, bill) => {
      return sum + bill.items.reduce((itemSum, item) => {
        const product = state.products.find(p => p.id === item.productId);
        return itemSum + (product?.costPrice || 0) * item.quantity;
      }, 0);
    }, 0);

    const netProfitMargin = totalSales > 0 
      ? ((totalSales - totalCost) / totalSales) * 100 
      : 0;
    
    return {
      totalSales,
      netProfitMargin,
      totalOrders: state.bills.length,
      averageOrderValue: state.bills.length > 0 ? totalSales / state.bills.length : 0
    };
  },
}));
