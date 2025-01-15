import { format } from 'date-fns';
import { PaymentMilestone, PaymentTerm } from '../types/quotation';

export const generateQuotationNumber = (sequence: number): string => {
  const date = new Date();
  const formattedDate = format(date, 'ddMM');
  const sequenceNumber = String(sequence).padStart(3, '0');
  return `QT-${formattedDate}-${sequenceNumber}`;
};

export const calculateMilestoneAmount = (
  total: number,
  percentage: number
): number => {
  return (total * percentage) / 100;
};

export const validatePaymentTerms = (terms: PaymentTerm[]): boolean => {
  const totalPercentage = terms.reduce((sum, term) => sum + term.percentage, 0);
  return totalPercentage === 100;
};

export const convertTermsToMilestones = (
  terms: PaymentTerm[],
  total: number
): PaymentMilestone[] => {
  return terms.map(term => ({
    id: term.id,
    description: term.description,
    percentage: term.percentage,
    amount: calculateMilestoneAmount(total, term.percentage)
  }));
};
