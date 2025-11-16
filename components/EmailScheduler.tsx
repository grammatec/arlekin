import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Search, Plus, Calendar, Mail, Clock, Trash2 } from "lucide-react";
import { EmailSchedule, Invoice } from "../types";

interface EmailSchedulerProps {
  schedules: EmailSchedule[];
  invoices: Invoice[];
  onAdd: (schedule: EmailSchedule) => void;
  onDelete: (id: string) => void;
}

export function EmailScheduler({ schedules, invoices, onAdd, onDelete }: EmailSchedulerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  const [formData, setFormData] = useState<Partial<EmailSchedule>>({
    invoiceId: '',
    scheduledDate: '',
    emailType: 'send',
    status: 'pending',
    message: '',
  });

  const filteredSchedules = schedules.filter((schedule) =>
    schedule.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    schedule.clientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInvoiceSelect = (invoiceId: string) => {
    const invoice = invoices.find((inv) => inv.id === invoiceId);
    if (invoice) {
      setFormData({
        ...formData,
        invoiceId: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        clientName: invoice.clientName,
        clientEmail: invoice.clientEmail,
      });
    }
  };

  const handleSubmit = () => {
    const schedule: EmailSchedule = {
      id: String(Date.now()),
      invoiceId: formData.invoiceId!,
      invoiceNumber: formData.invoiceNumber!,
      clientName: formData.clientName!,
      clientEmail: formData.clientEmail!,
      scheduledDate: formData.scheduledDate!,
      emailType: formData.emailType as EmailSchedule['emailType'],
      status: 'pending',
      message: formData.message,
    };

    onAdd(schedule);
    setIsFormOpen(false);
    setFormData({
      invoiceId: '',
      scheduledDate: '',
      emailType: 'send',
      status: 'pending',
      message: '',
    });
  };

  const getEmailTypeColor = (type: EmailSchedule['emailType']) => {
    switch (type) {
      case 'send':
        return 'bg-blue-100 text-blue-700';
      case 'reminder':
        return 'bg-yellow-100 text-yellow-700';
      case 'overdue':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status: EmailSchedule['status']) => {
    switch (status) {
      case 'sent':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-orange-100 text-orange-700';
      case 'failed':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Email Schedule</h2>
          <p className="text-gray-600 mt-1">Automate invoice email delivery</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Schedule Email
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search schedules..."
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
              <th className="text-left p-4 text-sm">Invoice</th>
              <th className="text-left p-4 text-sm">Client</th>
              <th className="text-left p-4 text-sm">Email Type</th>
              <th className="text-left p-4 text-sm">Scheduled Date</th>
              <th className="text-center p-4 text-sm">Status</th>
              <th className="text-left p-4 text-sm">Message</th>
              <th className="text-right p-4 text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSchedules.map((schedule) => (
              <tr key={schedule.id} className="border-t hover:bg-gray-50">
                <td className="p-4">{schedule.invoiceNumber}</td>
                <td className="p-4">
                  <div>
                    <p>{schedule.clientName}</p>
                    <p className="text-sm text-gray-600">{schedule.clientEmail}</p>
                  </div>
                </td>
                <td className="p-4">
                  <Badge className={getEmailTypeColor(schedule.emailType)}>
                    {schedule.emailType}
                  </Badge>
                </td>
                <td className="p-4 text-sm">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    {new Date(schedule.scheduledDate).toLocaleDateString()}
                  </div>
                </td>
                <td className="p-4 text-center">
                  <Badge className={getStatusColor(schedule.status)}>
                    {schedule.status}
                  </Badge>
                </td>
                <td className="p-4 text-sm text-gray-600">{schedule.message}</td>
                <td className="p-4">
                  <div className="flex items-center justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(schedule.id)}
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

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule Email</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Invoice *</Label>
              <Select value={formData.invoiceId} onValueChange={handleInvoiceSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an invoice" />
                </SelectTrigger>
                <SelectContent>
                  {invoices.map((invoice) => (
                    <SelectItem key={invoice.id} value={invoice.id}>
                      {invoice.invoiceNumber} - {invoice.clientName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Email Type *</Label>
              <Select
                value={formData.emailType}
                onValueChange={(value) => setFormData({ ...formData, emailType: value as EmailSchedule['emailType'] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="send">Send Invoice</SelectItem>
                  <SelectItem value="reminder">Payment Reminder</SelectItem>
                  <SelectItem value="overdue">Overdue Notice</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Scheduled Date *</Label>
              <Input
                type="date"
                value={formData.scheduledDate}
                onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea
                placeholder="Add a custom message for the email..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsFormOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>
                Schedule Email
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
