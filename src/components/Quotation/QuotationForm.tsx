import React, { useState } from 'react';
import { format } from 'date-fns';
import { Plus, Save } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { useQuotationStore } from '../../store/quotationStore';
import { Quotation, PaymentTerm, QuotationItem } from '../../types/quotation';
import { generateQuotationNumber } from '../../utils/quotationUtils';
import { validatePaymentTerms } from '../../utils/paymentTerms';
import { PaymentTermsSection } from './PaymentTermsSection';

interface QuotationFormProps {
  quotation?: Quotation;
  onSubmit: (quotation: Quotation) => void;
  onClose: () => void;
}

export function QuotationForm({ quotation, onSubmit, onClose }: QuotationFormProps) {
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
      ? format(quotation.expectedDeliveryDate, 'yyyy-MM-dd')
      : '',
    specialInstructions: quotation?.specialInstructions || '',
    businessPhone: quotation?.businessPhone || '',
  });

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
      ...formData,
      expectedDeliveryDate: formData.expectedDeliveryDate 
        ? new Date(formData.expectedDeliveryDate) 
        : undefined,
      items,
      total,
      paymentTerms,
      status: quotation?.status || 'draft',
      businessName: 'Your Business Name', // Get from settings
      businessAddress: 'Your Business Address', // Get from settings
    };

    onSubmit(newQuotation);
  };

  // Rest of the component implementation...
}
