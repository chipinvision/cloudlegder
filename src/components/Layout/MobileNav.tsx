import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, FileText, Settings, FileSpreadsheet, Book, ChartNoAxesCombined } from 'lucide-react';
import { clsx } from 'clsx';

export function MobileNav() {
  const location = useLocation();

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Package, label: 'Inventory', path: '/inventory' },
    { icon: Book, label: 'Accounting', path: '/accounting' },
    { icon: FileText, label: 'Invoicing', path: '/bills' },
    { icon: FileSpreadsheet, label: 'Quotations', path: '/quotations' },
    { icon: ChartNoAxesCombined, label: 'Analytics', path: '/analytics' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg md:hidden flex">
      <div className="flex-1 flex">
        {navItems.map(({ icon: Icon, label, path }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={clsx(
                'flex flex-col items-center justify-center p-2 text-xs flex-1',
                isActive ? 'text-primary-600' : 'text-gray-600'
              )}
            >
              <Icon className="h-5 w-5 mb-1" />
              <span className="truncate">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
