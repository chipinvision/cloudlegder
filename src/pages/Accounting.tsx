import React, { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { Bill } from '../types';
import { format } from 'date-fns';
import { SearchBar } from '../components/ui/SearchBar';

interface LedgerEntry {
  date: Date;
  description: string;
  account: string;
  debit: number;
  credit: number;
}

export function Accounting() {
  const { bills } = useStore();
  const [ledgerEntries, setLedgerEntries] = useState<LedgerEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAccountType, setSelectedAccountType] = useState('');

  useEffect(() => {
    const entries: LedgerEntry[] = bills.flatMap(bill => [
      {
        date: bill.date,
        description: `Sale - ${bill.billNumber}`,
        account: 'Sales Revenue',
        debit: 0,
        credit: bill.total,
      },
      {
        date: bill.date,
        description: `Sale - ${bill.billNumber}`,
        account: 'Accounts Receivable',
        debit: bill.total,
        credit: 0,
      },
    ]);
    setLedgerEntries(entries);
  }, [bills]);

  const filteredEntries = ledgerEntries.filter(entry => {
    return (
      entry.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.account.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (!selectedAccountType || entry.account.includes(selectedAccountType))
    );
  });

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-wrap sm:flex-nowrap justify-between items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Accounting</h1>
        <div className="flex gap-2">
          <select
            value={selectedAccountType}
            onChange={(e) => setSelectedAccountType(e.target.value)}
            className="bg-gray-200 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Filter by Account Type</option>
            <option value="Sales Revenue">Sales Revenue</option>
            <option value="Accounts Receivable">Accounts Receivable</option>
            <option value="Cash">Cash</option>
          </select>
        </div>
      </div>

      <div className="w-full max-w-md">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search ledger entries..."
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-primary-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Debit</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credit</th>
          </tr>
        </thead>
        <tbody>
          {filteredEntries.map(entry => (
            <tr key={entry.date.getTime()}>
          <td className="px-6 py-4 whitespace-nowrap">{format(entry.date, 'dd/MM/yyyy')}</td>
          <td className="px-6 py-4 whitespace-nowrap">{entry.description}</td>
          <td className="px-6 py-4 whitespace-nowrap">{entry.account}</td>
          <td className="px-6 py-4 whitespace-nowrap text-right">₹{entry.debit.toLocaleString('en-IN')}</td>
          <td className="px-6 py-4 whitespace-nowrap text-right">₹{entry.credit.toLocaleString('en-IN')}</td>
            </tr>
          ))}
        </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
