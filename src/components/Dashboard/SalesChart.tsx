import React, { useEffect, useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChevronDown, BarChart2, LineChart as LineChartIcon } from 'lucide-react';
import { Menu } from '@headlessui/react';
import { clsx } from 'clsx';
import { useStore } from '../../store/useStore';
import { format } from 'date-fns';

interface SalesData {
  name: string;
  sales: number;
}

export function SalesChart() {
  const [timeframe, setTimeframe] = useState<'monthly' | 'weekly'>('monthly');
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');
  const { bills } = useStore();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBills = bills.filter(bill =>
    bill.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bill.billNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getSalesData = (bills: Bill[], timeframe: 'monthly' | 'weekly'): SalesData[] => {
    const salesData = {};
    bills.forEach(bill => {
      const period = timeframe === 'monthly' ? format(bill.date, 'MMM') : format(bill.date, 'w');
      salesData[period] = (salesData[period] || 0) + bill.total;
    });
    return Object.entries(salesData).map(([name, sales]) => ({ name, sales }));
  };

  const data = getSalesData(filteredBills, timeframe);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Sales Overview</h2>
        <div className="flex items-center gap-2">
          <Menu as="div" className="relative">
            <Menu.Button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              {timeframe === 'monthly' ? 'Monthly' : 'Weekly'}
              <ChevronDown className="w-4 h-4" />
            </Menu.Button>
            <Menu.Items className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={clsx(
                      'block w-full text-left px-4 py-2 text-sm',
                      active ? 'bg-gray-100' : ''
                    )}
                    onClick={() => setTimeframe('monthly')}
                  >
                    Monthly
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={clsx(
                      'block w-full text-left px-4 py-2 text-sm',
                      active ? 'bg-gray-100' : ''
                    )}
                    onClick={() => setTimeframe('weekly')}
                  >
                    Weekly
                  </button>
                )}
              </Menu.Item>
            </Menu.Items>
          </Menu>

          <button
            onClick={() => setChartType(chartType === 'line' ? 'bar' : 'line')}
            className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            {chartType === 'line' ? (
              <BarChart2 className="w-5 h-5" />
            ) : (
              <LineChartIcon className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'line' ? (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#eb5e28"
                strokeWidth={2}
                dot={{ fill: '#eb5e28', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          ) : (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Bar dataKey="sales" fill="#eb5e28" />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
