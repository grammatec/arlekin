export interface Account {
  id: string;
  accountNumber?: string; // Account number for PI generation (e.g., "1032")
  name: string;
  email: string;
  ccEmails?: string[];
  company: string;
  taxId?: string;
  phone?: string;
  address?: string;
  templateId?: string;
  contractStart?: string;
  contractEnd?: string;
  contractUrl?: string;
  piArchiveUrl?: string;
  createdAt: string;
}

// Keep Client as alias for backwards compatibility during transition
export type Client = Account;

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  currency: Currency;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  notes?: string;
  templateId?: string;
}

export interface EmailSchedule {
  id: string;
  invoiceId: string;
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  scheduledDate: string;
  emailType: 'send' | 'reminder' | 'overdue';
  status: 'pending' | 'sent' | 'failed';
  message?: string;
}

export type Currency = 'USD' | 'GEL' | 'EUR';

export type RecurrenceFrequency = 'monthly' | 'quarterly' | 'yearly';

export type DayOfMonth = number | 'last' | 'first';

export interface InvoiceTemplateItem {
  description: string;
  quantity: number;
  rate: number;
}

export type PiIdGenerationMethod = 'auto' | 'manual';

export type PriceCalculationMethod = 
  | 'unchanged' 
  | 'manual_rate' 
  | 'nbg_usd_gel' 
  | 'nbg_eur_gel'
  | 'nbg_gel_usd'
  | 'nbg_gel_eur';

export interface PriceCalculationConfig {
  method: PriceCalculationMethod;
  manualRate?: number; // For manual_rate method
  rateDate?: string; // For NBG exchange rate methods (date to use for rate)
}

export interface InvoiceTemplate {
  id: string;
  name: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  accountId?: string; // Account ID for PI number generation
  frequency: RecurrenceFrequency;
  dayOfMonth: DayOfMonth;
  currency: Currency;
  baseCurrency?: Currency; // For currency conversion (e.g., USD for GEL calculation)
  
  // Enhanced PI ID generation
  piIdMethod: PiIdGenerationMethod;
  piIdPrefix?: string; // Extra ID like "00" for auto-generation
  
  // Enhanced price calculation
  basePrice: number; // Base amount
  priceCalculation: PriceCalculationConfig;
  
  items: InvoiceTemplateItem[];
  tax: number; // VAT percentage
  paymentTerms: number; // Days until due
  notes?: string;
  status: 'active' | 'inactive';
  nextGenerationDate?: string;
  createdAt: string;
}
