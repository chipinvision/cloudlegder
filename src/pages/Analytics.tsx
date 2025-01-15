import React from 'react';
import { useStore } from '../store/useStore';
import { format, subMonths, subWeeks, isWithinInterval } from 'date-fns';
import { KPICard } from '../components/Dashboard/KPICard';
import { IndianRupee, Package, TrendingUp, Calculator, DollarSign } from 'lucide-react';
import { SalesChart } from '../components/Dashboard/SalesChart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function Analytics() {
  const { bills, products } = useStore();

  const calculateAOV = (): number => {
    if (bills.length === 0) return 0;
    const totalRevenue = bills.reduce((sum, bill) => sum + bill.total, 0);
    return totalRevenue / bills.length;
  };

  const calculateTotalSales = (timeframe: 'week' | 'month' | 'year'): number => {
    const now = new Date();
    const fromDate = timeframe === 'week'
      ? subWeeks(now, 1)
      : timeframe === 'month'
      ? subMonths(now, 1)
      : subMonths(now, 12);

    return bills.filter(bill => isWithinInterval(bill.date, { start: fromDate, end: now }))
      .reduce((sum, bill) => sum + bill.total, 0);
  };

  const getTopProduct = (): { name: string; revenue: number } | null => {
    if (bills.length === 0) return null;
    const productSales = {};
    bills.forEach(bill => {
      bill.items.forEach(item => {
        productSales[item.productId] = (productSales[item.productId] || 0) + item.subtotal;
      });
    });
    const topProduct = Object.entries(productSales).sort(([, a], [, b]) => b - a)[0];
    return topProduct ? { name: products.find(p => p.id === topProduct[0])?.name || 'Unknown', revenue: topProduct[1] } : null;
  };

  const calculateConversionRate = (): number => {
    // Placeholder - needs actual quotation data
    return 50;
  };

  const calculateInventoryValuation = (): number => {
    return products.reduce((sum, product) => sum + product.price * product.stock, 0);
  };

  const getLowStockProduct = (): { name: string; stock: number; reorderPoint: number } | null => {
    const lowStockProducts = products.filter(product => product.stock <= product.reorderPoint);
    return lowStockProducts.length > 0 ? { name: lowStockProducts[0].name, stock: lowStockProducts[0].stock, reorderPoint: lowStockProducts[0].reorderPoint } : null;
  };

  const calculateProfitMargin = (): number => {
    // Placeholder - needs cost data
    return 25;
  };

  const getSalesTrendData = (timeframe: 'week' | 'month'): { name: string; sales: number }[] => {
    const data = [];
    const now = new Date();
    for (let i = 0; i < 4; i++) {
      const fromDate = timeframe === 'week' ? subWeeks(now, i + 1) : subMonths(now, i + 1);
      const toDate = timeframe === 'week' ? subWeeks(now, i) : subMonths(now, i);
      const sales = bills.filter(bill => isWithinInterval(bill.date, { start: fromDate, end: toDate }))
        .reduce((sum, bill) => sum + bill.total, 0);
      data.push({ name: timeframe === 'week' ? `Week ${i + 1}` : `${format(toDate, 'MMM')}`, sales });
    }
    return data.reverse();
  };

  return (
    <div className="space-y-6 pb-16">
      <h1 className="text-2xl font-bold text-gray-800">Analytics</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <KPICard title="Average Order Value" value={calculateAOV()} icon={<Calculator className="w-6 h-6 text-primary-600" />} />
        <KPICard title="Total Sales (Last Month)" value={calculateTotalSales('month')} icon={<IndianRupee className="w-6 h-6 text-primary-600" />} />
        <KPICard title="Conversion Rate" value={`${calculateConversionRate()}%`} icon={<TrendingUp className="w-6 h-6 text-primary-600" />} />
        <KPICard title="Inventory Valuation" value={calculateInventoryValuation()} icon={<Package className="w-6 h-6 text-primary-600" />} />
        <KPICard title="Profit Margin" value={`${calculateProfitMargin()}%`} icon={<DollarSign className="w-6 h-6 text-primary-600" />} />
        <KPICard title="Accounts Receivable" value={0} icon={<IndianRupee className="w-6 h-6 text-primary-600" />} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Sales Trends (Last 4 Weeks)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={getSalesTrendData('week')}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Bar dataKey="sales" fill="#eb5e28" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Top Product</h2>
          <p>{getTopProduct()?.name || 'No sales yet'}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Low Stock Alert</h2>
        <p>{getLowStockProduct()?.name || 'No low stock alerts'}</p>
      </div>
    </div>
  );
}
