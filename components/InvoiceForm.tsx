import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import { Invoice, InvoiceItem, Client, Currency } from "../types";

interface InvoiceFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (invoice: Invoice) => void;
  clients: Client[];
  invoice?: Invoice;
}

export function InvoiceForm({ isOpen, onClose, onSave, clients, invoice }: InvoiceFormProps) {
  const [formData, setFormData] = useState<Partial<Invoice>>(
    invoice || {
      invoiceNumber: `INV-2025-${String(Date.now()).slice(-3)}`,
      clientId: '',
      clientName: '',
      clientEmail: '',
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: '',
      items: [],
      subtotal: 0,
      tax: 0,
      total: 0,
      currency: 'USD',
      status: 'draft',
      notes: '',
    }
  );

  const [items, setItems] = useState<InvoiceItem[]>(invoice?.items || []);

  const handleClientChange = (clientId: string) => {
    const client = clients.find((c) => c.id === clientId);
    if (client) {
      setFormData({
        ...formData,
        clientId: client.id,
        clientName: client.name,
        clientEmail: client.email,
      });
    }
  };

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: String(Date.now()),
      description: '',
      quantity: 1,
      rate: 0,
      amount: 0,
    };
    setItems([...items, newItem]);
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    const updatedItems = items.map((item) => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === 'quantity' || field === 'rate') {
          updated.amount = updated.quantity * updated.rate;
        }
        return updated;
      }
      return item;
    });
    setItems(updatedItems);
    calculateTotals(updatedItems);
  };

  const removeItem = (id: string) => {
    const updatedItems = items.filter((item) => item.id !== id);
    setItems(updatedItems);
    calculateTotals(updatedItems);
  };

  const calculateTotals = (currentItems: InvoiceItem[]) => {
    const subtotal = currentItems.reduce((sum, item) => sum + item.amount, 0);
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;
    setFormData({
      ...formData,
      items: currentItems,
      subtotal,
      tax,
      total,
    });
  };

  const handleSubmit = () => {
    const newInvoice: Invoice = {
      id: invoice?.id || String(Date.now()),
      invoiceNumber: formData.invoiceNumber!,
      clientId: formData.clientId!,
      clientName: formData.clientName!,
      clientEmail: formData.clientEmail!,
      issueDate: formData.issueDate!,
      dueDate: formData.dueDate!,
      items,
      subtotal: formData.subtotal!,
      tax: formData.tax!,
      total: formData.total!,
      currency: formData.currency as Currency,
      status: formData.status as Invoice['status'],
      notes: formData.notes,
    };
    onSave(newInvoice);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{invoice ? 'Edit Invoice' : 'Create New Invoice'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Invoice Number</Label>
              <Input
                value={formData.invoiceNumber}
                onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Currency</Label>
              <Select
                value={formData.currency}
                onValueChange={(value) => setFormData({ ...formData, currency: value as Currency })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="GEL">GEL (₾)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as Invoice['status'] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Client</Label>
            <Select value={formData.clientId} onValueChange={handleClientChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a client" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name} - {client.company}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Issue Date</Label>
              <Input
                type="date"
                value={formData.issueDate}
                onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Due Date</Label>
              <Input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Items</Label>
              <Button type="button" variant="outline" size="sm" onClick={addItem}>
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </div>

            {items.map((item) => (
              <div key={item.id} className="grid grid-cols-12 gap-2 items-end">
                <div className="col-span-5 space-y-2">
                  <Input
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Input
                    type="number"
                    placeholder="Qty"
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))}
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Input
                    type="number"
                    placeholder="Rate"
                    value={item.rate}
                    onChange={(e) => updateItem(item.id, 'rate', Number(e.target.value))}
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Input
                    type="number"
                    placeholder="Amount"
                    value={item.amount}
                    disabled
                  />
                </div>
                <div className="col-span-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${formData.subtotal?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (10%):</span>
              <span>${formData.tax?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span>Total:</span>
              <span>${formData.total?.toFixed(2) || '0.00'}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea
              placeholder="Add any additional notes..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {invoice ? 'Update' : 'Create'} Invoice
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
