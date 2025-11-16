import { useState } from "react";
import { Table } from "./ui/table";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Eye, Edit, Trash2, Search, Plus } from "lucide-react";
import { Invoice } from "../types";
import { formatCurrency } from "../utils/currencyConverter";

interface InvoiceListProps {
  invoices: Invoice[];
  onEdit: (invoice: Invoice) => void;
  onDelete: (id: string) => void;
  onView: (invoice: Invoice) => void;
  onCreate: () => void;
}

export function InvoiceList({ invoices, onEdit, onDelete, onView, onCreate }: InvoiceListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredInvoices = invoices.filter((invoice) =>
    invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Invoices</h2>
          <p className="text-gray-600 mt-1">Manage and track all your invoices</p>
        </div>
        <Button onClick={onCreate}>
          <Plus className="w-4 h-4 mr-2" />
          New Invoice
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search invoices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-4 text-sm">Invoice Number</th>
              <th className="text-left p-4 text-sm">Client</th>
              <th className="text-left p-4 text-sm">Issue Date</th>
              <th className="text-left p-4 text-sm">Due Date</th>
              <th className="text-right p-4 text-sm">Amount</th>
              <th className="text-center p-4 text-sm">Status</th>
              <th className="text-right p-4 text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.map((invoice) => (
              <tr key={invoice.id} className="border-t hover:bg-gray-50">
                <td className="p-4">{invoice.invoiceNumber}</td>
                <td className="p-4">
                  <div>
                    <p>{invoice.clientName}</p>
                    <p className="text-sm text-gray-600">{invoice.clientEmail}</p>
                  </div>
                </td>
                <td className="p-4 text-sm">{new Date(invoice.issueDate).toLocaleDateString()}</td>
                <td className="p-4 text-sm">{new Date(invoice.dueDate).toLocaleDateString()}</td>
                <td className="p-4 text-right">{formatCurrency(invoice.total, invoice.currency)}</td>
                <td className="p-4 text-center">
                  <Badge className={getStatusColor(invoice.status)}>
                    {invoice.status}
                  </Badge>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onView(invoice)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(invoice)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(invoice.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
