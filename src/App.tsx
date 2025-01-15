import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Inventory } from './pages/Inventory';
import { Bills } from './pages/Bills';
import { Quotations } from './pages/Quotations';
import { Settings } from './pages/Settings';
import { StockAlert } from './components/StockAlert';
import { Accounting } from './pages/Accounting';
import { Analytics } from './pages/Analytics';

function App() {
  return (
    <BrowserRouter>
      <StockAlert />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="accounting" element={<Accounting />} />
          <Route path="bills" element={<Bills />} />
          <Route path="quotations" element={<Quotations />} />
          <Route path="settings" element={<Settings />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
