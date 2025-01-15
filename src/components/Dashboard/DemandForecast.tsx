import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useStore } from '../../store/useStore';
import { format, subMonths } from 'date-fns';

interface ForecastData {
  month: string;
  actual: number;
  predicted: number;
}

export function DemandForecast() {
  const { bills } = useStore();
  const [forecastData, setForecastData] = useState<ForecastData[]>([]);

  useEffect(() => {
    const generateForecast = () => {
      const monthlySales = {};
      bills.forEach(bill => {
        const month = format(bill.date, 'yyyy-MM');
        monthlySales[month] = (monthlySales[month] || 0) + bill.total;
      });

      const salesData = Object.entries(monthlySales)
        .map(([month, sales]) => ({ month, sales }))
        .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());

      if (salesData.length < 3) {
        setForecastData([]);
        return;
      }

      const lastThreeMonths = salesData.slice(-3);
      const averageSales = lastThreeMonths.reduce((sum, item) => sum + item.sales, 0) / 3;
      const nextMonth = format(subMonths(new Date(), 1), 'yyyy-MM');
      const predictedSales = averageSales;

      const forecast = salesData.concat({ month: nextMonth, sales: predictedSales });
      const formattedForecast = forecast.map(({ month, sales }) => ({
        month: format(new Date(month), 'MMM'),
        actual: sales,
        predicted: sales,
      }));

      setForecastData(formattedForecast);
    };

    generateForecast();
  }, [bills]);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-semibold">Demand Forecast</h2>
        </div>
      </div>

      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={forecastData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="actual"
              stroke="#eb5e28"
              strokeWidth={2}
              dot={{ fill: '#eb5e28', r: 4 }}
              name="Actual Sales"
            />
            <Line
              type="monotone"
              dataKey="predicted"
              stroke="#3b82f6"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: '#3b82f6', r: 4 }}
              name="Predicted Sales"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div className="p-3 bg-green-50 rounded-lg">
          <p className="text-green-700 font-medium">Accuracy Score</p>
          <p className="text-green-900 text-lg font-semibold">N/A</p>
        </div>
        <div className="p-3 bg-orange-50 rounded-lg">
          <p className="text-orange-700 font-medium">Next Restock</p>
          <p className="text-orange-900 text-lg font-semibold">N/A</p>
        </div>
      </div>
    </div>
  );
}
