import React from 'react';
import { useStore } from '../../store/useStore';
import { subMonths } from 'date-fns';

interface KPICardProps {
  title: string;
  icon: React.ReactNode;
}

export function KPICard({ title, icon }: KPICardProps) {
  const { getDashboardStats, bills } = useStore();
  const stats = getDashboardStats();
  const totalItems = useStore((state) =>
    state.products.reduce((sum, product) => sum + product.stock, 0)
  );
  const averageOrderValue = useStore((state) => {
    const { bills } = state;
    if (bills.length === 0) return 0;
    const totalRevenue = bills.reduce((sum, bill) => sum + bill.total, 0);
    return totalRevenue / bills.length;
  });

  const getTrend = (previousValue: number, currentValue: number): { value: number; isPositive: boolean } => {
    if (previousValue === 0) return { value: 0, isPositive: false };
    const difference = currentValue - previousValue;
    const percentageChange = (difference / previousValue) * 100;
    return { value: percentageChange, isPositive: percentageChange > 0 };
  };

  const lastMonthBills = bills.filter((bill) => {
    const lastMonth = subMonths(new Date(), 1);
    return bill.date >= lastMonth;
  });

  const lastMonthTotal = lastMonthBills.reduce((sum, bill) => sum + bill.total, 0);

  const trend =
    title === 'Total Sales Amount'
      ? getTrend(lastMonthTotal, stats.totalSales)
      : title === 'Total Items in Stock'
      ? getTrend(0, totalItems)
      : title === 'Net Profit Margin'
      ? getTrend(0, stats.netProfitMargin)
      : title === 'Average Order Value'
      ? getTrend(0, averageOrderValue)
      : { value: 0, isPositive: false };

  return (
    <div className="bg-white shadow-sm rounded-lg p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <div className="text-3xl font-semibold mt-2 flex items-center gap-2">
            <span>
              {title.toLowerCase().includes('amount') || title.toLowerCase().includes('value')
                ? `₹${(title === 'Total Sales Amount'
                    ? stats.totalSales
                    : title === 'Average Order Value'
                    ? averageOrderValue
                    : 0
                  ).toLocaleString('en-IN')}`
                : title.toLowerCase().includes('margin')
                ? `${stats.netProfitMargin.toFixed(1)}%`
                : totalItems}
            </span>
            {trend.value !== 0 && (
              <span
                className={`inline-block px-2 py-1 text-xs font-medium rounded-md ${
                  trend.isPositive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                }`}
              >
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value).toFixed(1)}%
              </span>
            )}
          </div>
        </div>
        <div className="p-3 bg-primary-50 rounded-[12px] shadow-inner">
          {icon}
        </div>
      </div>
    </div>
  );
}