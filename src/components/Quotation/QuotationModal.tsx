import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { useQuotationStore } from '../../store/quotationStore';
import { Quotation, PaymentTerm, QuotationItem } from '../../types/quotation';
import { generateQuotationNumber } from '../../utils/quotationUtils';
import { validatePaymentTerms } from '../../utils/paymentTerms';
import { PaymentTermsSection } from './PaymentTermsSection';

interface QuotationModalProps {
  quotation?: Quotation;
  onClose: () => void;
  onSubmit: (quotation: Quotation) => void;
}

export function QuotationModal({ quotation, onClose, onSubmit }: QuotationModalProps) {
  const { products } = useStore();
  const { quotations } = useQuotationStore();
  const [items, setItems] = useState<QuotationItem[]>(quotation?.items || []);
  const [paymentTerms, setPaymentTerms] = useState<PaymentTerm[]>(
    quotation?.paymentTerms || []
  );
  const [formData, setFormData] = useState({
    vendorName: quotation?.vendorName || '',
    vendorEmail: quotation?.vendorEmail || '',
    vendorPhone: quotation?.vendorPhone || '',
    vendorAddress: quotation?.vendorAddress || '',
    deliveryAddress: quotation?.deliveryAddress || '',
    expectedDeliveryDate: quotation?.expectedDeliveryDate 
      ? new Date(quotation.expectedDeliveryDate).toISOString().split('T')[0]
      : '',
    specialInstructions: quotation?.specialInstructions || '',
  });

  const addItem = () => {
    setItems([...items, { productId: '', quantity: 1, price: 0, subtotal: 0 }]);
  };

  const updateItem = (index: number, updates: Partial<QuotationItem>) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], ...updates };

    if (updates.productId) {
      const product = products.find((p) => p.id === updates.productId);
      if (product) {
        newItems[index].price = product.price;
        newItems[index].subtotal = product.price * newItems[index].quantity;
      }
    }

    if (updates.quantity) {
      newItems[index].subtotal = newItems[index].price * updates.quantity;
    }

    setItems(newItems);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePaymentTerms(paymentTerms)) {
      alert('Payment terms must total 100%');
      return;
    }

    const total = items.reduce((sum, item) => sum + item.subtotal, 0);
    const newQuotation: Quotation = {
      id: quotation?.id || crypto.randomUUID(),
      quotationNumber: quotation?.quotationNumber || generateQuotationNumber(quotations.length + 1),
      date: quotation?.date || new Date(),
      businessName: quotation?.businessName || 'Your Business Name',
      businessAddress: quotation?.businessAddress || 'Your Business Address',
      businessPhone: quotation?.businessPhone || '',
      ...formData,
      expectedDeliveryDate: formData.expectedDeliveryDate 
        ? new Date(formData.expectedDeliveryDate) 
        : undefined,
      items,
      total,
      paymentTerms,
      status: quotation?.status || 'draft',
    };

    onSubmit(newQuotation);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {quotation ? 'Edit Quotation' : 'Create Quotation'}
          </h2>
          <button onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Vendor Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Vendor Name</label>
              <input
                type="text"
                value={formData.vendorName}
                onChange={(e) => setFormData({ ...formData, vendorName: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Vendor Phone</label>
              <input
                type="tel"
                value={formData.vendorPhone}
                onChange={(e) => setFormData({ ...formData, vendorPhone: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Vendor Email</label>
              <input
                type="email"
                value={formData.vendorEmail}
                onChange={(e) => setFormData({ ...formData, vendorEmail: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Vendor Address</label>
              <input
                type="text"
                value={formData.vendorAddress}
                onChange={(e) => setFormData({ ...formData, vendorAddress: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                required
              />
            </div>
          </div>

          {/* Items */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Items</h3>
              <button
                type="button"
                onClick={addItem}
                className="flex items-center gap-1 text-primary-600 hover:text-primary-700"
              >
                <Plus className="w-4 h-4" />
                Add Item
              </button>
            </div>

            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={index} className="flex gap-4 items-start">
                  <div className="flex-1">
                    <select
                      value={item.productId}
                      onChange={(e) => updateItem(index, { productId: e.target.value })}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      required
                    >
                      <option value="">Select Product</option>
                      {products.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="w-24">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, { quantity: Number(e.target.value) })}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      required
                      min="1"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Terms */}
          <PaymentTermsSection
            terms={paymentTerms}
            onChange={setPaymentTerms}
          />

          {/* Additional Information */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Delivery Address
            </label>
            <input
              type="text"
              value={formData.deliveryAddress}
              onChange={(e) =>
                setFormData({ ...formData, deliveryAddress: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Special Instructions
            </label>
            <textarea
              value={formData.specialInstructions}
              onChange={(e) =>
                setFormData({ ...formData, specialInstructions: e.target.value })
              }
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              {quotation ? 'Update' : 'Create'} Quotation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
