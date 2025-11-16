import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { X, Download, Send } from "lucide-react";
import { Invoice } from "../types";
import { formatCurrency } from "../utils/currencyConverter";

interface InvoiceViewerProps {
  invoice: Invoice | null;
  isOpen: boolean;
  onClose: () => void;
}

export function InvoiceViewer({ invoice, isOpen, onClose }: InvoiceViewerProps) {
  if (!invoice) return null;

  const getStatusColor = (status: Invoice['status']) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-700';
      case 'sent':
        return 'bg-blue-100 text-blue-700';
      case 'overdue':
        return 'bg-red-100 text-red-700';
      case 'draft':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Invoice Details</DialogTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
              <Button variant="outline" size="sm">
                <Send className="w-4 h-4 mr-2" />
                Send Email
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Invoice Header */}
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-gray-900">{invoice.invoiceNumber}</h2>
              <div className="mt-2">
                <Badge className={getStatusColor(invoice.status)}>
                  {invoice.status}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Issue Date</p>
              <p>{new Date(invoice.issueDate).toLocaleDateString()}</p>
              <p className="text-sm text-gray-600 mt-2">Due Date</p>
              <p>{new Date(invoice.dueDate).toLocaleDateString()}</p>
            </div>
          </div>

          <Separator />

          {/* Client Information */}
          <div>
            <h3 className="text-gray-900 mb-2">Bill To</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p>{invoice.clientName}</p>
              <p className="text-sm text-gray-600">{invoice.clientEmail}</p>
            </div>
          </div>

          <Separator />

          {/* Invoice Items */}
          <div>
            <h3 className="text-gray-900 mb-4">Items</h3>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-3 text-sm">Description</th>
                    <th className="text-right p-3 text-sm">Quantity</th>
                    <th className="text-right p-3 text-sm">Rate</th>
                    <th className="text-right p-3 text-sm">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item) => (
                    <tr key={item.id} className="border-t">
                      <td className="p-3">{item.description}</td>
                      <td className="p-3 text-right">{item.quantity}</td>
                      <td className="p-3 text-right">{formatCurrency(item.rate, invoice.currency)}</td>
                      <td className="p-3 text-right">{formatCurrency(item.amount, invoice.currency)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-80 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span>{formatCurrency(invoice.subtotal, invoice.currency)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax:</span>
                <span>{formatCurrency(invoice.tax, invoice.currency)}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span>Total:</span>
                <span>{formatCurrency(invoice.total, invoice.currency)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <>
              <Separator />
              <div>
                <h3 className="text-gray-900 mb-2">Notes</h3>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">{invoice.notes}</p>
              </div>
            </>
          )}

          {invoice.templateId && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                This invoice was generated from a template
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
