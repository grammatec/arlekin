import { Invoice, InvoiceTemplate, InvoiceItem } from '../types';
import { convertCurrency } from './currencyConverter';
import { calculateNextDate } from './dateCalculator';

export function generateInvoiceFromTemplate(
  template: InvoiceTemplate,
  invoiceNumber?: string
): Invoice {
  const issueDate = new Date();
  const dueDate = new Date(issueDate);
  dueDate.setDate(dueDate.getDate() + template.paymentTerms);

  // Convert items to invoice items with amounts
  let items: InvoiceItem[] = template.items.map((item, index) => {
    let rate = item.rate;
    
    // If we need currency conversion, apply it
    if (template.baseCurrency && template.currency !== template.baseCurrency) {
      rate = convertCurrency(item.rate, template.baseCurrency, template.currency);
    }

    const amount = item.quantity * rate;

    return {
      id: String(index + 1),
      description: item.description,
      quantity: item.quantity,
      rate,
      amount,
    };
  });

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const tax = subtotal * (template.tax / 100);
  const total = subtotal + tax;

  const invoice: Invoice = {
    id: String(Date.now()),
    invoiceNumber: invoiceNumber || `INV-${Date.now()}`,
    clientId: template.clientId,
    clientName: template.clientName,
    clientEmail: template.clientEmail,
    issueDate: issueDate.toISOString().split('T')[0],
    dueDate: dueDate.toISOString().split('T')[0],
    items,
    subtotal,
    tax,
    total,
    currency: template.currency,
    status: 'draft',
    notes: template.notes,
    templateId: template.id,
  };

  return invoice;
}

export function getNextInvoiceNumber(existingInvoices: Invoice[]): string {
  const year = new Date().getFullYear();
  const invoicesThisYear = existingInvoices.filter((inv) =>
    inv.invoiceNumber.startsWith(`INV-${year}`)
  );

  const numbers = invoicesThisYear.map((inv) => {
    const parts = inv.invoiceNumber.split('-');
    return parseInt(parts[2] || '0');
  });

  const maxNumber = numbers.length > 0 ? Math.max(...numbers) : 0;
  const nextNumber = maxNumber + 1;

  return `INV-${year}-${String(nextNumber).padStart(3, '0')}`;
}

export function updateTemplateNextDate(template: InvoiceTemplate): InvoiceTemplate {
  const nextDate = calculateNextDate(
    template.frequency,
    template.dayOfMonth,
    template.nextGenerationDate ? new Date(template.nextGenerationDate) : new Date()
  );

  return {
    ...template,
    nextGenerationDate: nextDate.toISOString().split('T')[0],
  };
}
