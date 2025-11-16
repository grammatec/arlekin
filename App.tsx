import { useState } from "react";
import { Navigation } from "./components/Navigation";
import { DashboardView } from "./components/DashboardView";
import { AccountsView } from "./components/AccountsView";
import { InvoiceViewer } from "./components/InvoiceViewer";
import { TemplateList } from "./components/TemplateList";
import { TemplateForm } from "./components/TemplateForm";
import { InvoiceForm } from "./components/InvoiceForm";
import { ClientList } from "./components/ClientList";
import { EmailScheduler } from "./components/EmailScheduler";
import {
  mockClients,
  mockInvoices,
  mockEmailSchedules,
  mockTemplates,
} from "./data/mockData";
import {
  Invoice,
  Account,
  EmailSchedule,
  InvoiceTemplate,
} from "./types";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner@2.0.3";
import {
  generateInvoiceFromTemplate,
  getNextInvoiceNumber,
  updateTemplateNextDate,
} from "./utils/invoiceGenerator";

export default function App() {
  const [accounts, setAccounts] = useState<Account[]>(mockClients);
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [schedules, setSchedules] = useState<EmailSchedule[]>(mockEmailSchedules);
  const [templates, setTemplates] = useState<InvoiceTemplate[]>(mockTemplates);
  
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isInvoiceFormOpen, setIsInvoiceFormOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | undefined>();
  const [isTemplateFormOpen, setIsTemplateFormOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<InvoiceTemplate | undefined>();
  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null);
  const [isInvoiceViewerOpen, setIsInvoiceViewerOpen] = useState(false);
  const [isAccountFormOpen, setIsAccountFormOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | undefined>();

  // Invoice handlers
  const handleSaveInvoice = (invoice: Invoice) => {
    if (editingInvoice) {
      setInvoices((prev) =>
        prev.map((inv) => (inv.id === invoice.id ? invoice : inv))
      );
      toast.success("Invoice updated successfully");
    } else {
      setInvoices((prev) => [...prev, invoice]);
      toast.success("Invoice created successfully");
    }
    setIsInvoiceFormOpen(false);
    setEditingInvoice(undefined);
  };

  const handleEditInvoice = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setIsInvoiceFormOpen(true);
  };

  const handleDeleteInvoice = (id: string) => {
    setInvoices((prev) => prev.filter((inv) => inv.id !== id));
    toast.success("Invoice deleted successfully");
  };

  const handleViewInvoice = (invoice: Invoice) => {
    setViewingInvoice(invoice);
    setIsInvoiceViewerOpen(true);
  };

  // Account handlers
  const handleSaveAccount = (account: Account) => {
    if (editingAccount) {
      setAccounts((prev) =>
        prev.map((acc) => (acc.id === account.id ? account : acc))
      );
      toast.success("Account updated successfully");
    } else {
      setAccounts((prev) => [...prev, account]);
      toast.success("Account created successfully");
    }
    setIsAccountFormOpen(false);
    setEditingAccount(undefined);
  };

  const handleEditAccount = (account: Account) => {
    setEditingAccount(account);
    setIsAccountFormOpen(true);
  };

  const handleDeleteAccount = (id: string) => {
    setAccounts((prev) => prev.filter((acc) => acc.id !== id));
    toast.success("Account deleted successfully");
  };

  // Template handlers
  const handleSaveTemplate = (template: InvoiceTemplate) => {
    if (editingTemplate) {
      setTemplates((prev) =>
        prev.map((temp) => (temp.id === template.id ? template : temp))
      );
      toast.success("Template updated successfully");
    } else {
      setTemplates((prev) => [...prev, template]);
      toast.success("Template created successfully");
    }
    setIsTemplateFormOpen(false);
    setEditingTemplate(undefined);
  };

  const handleEditTemplate = (template: InvoiceTemplate) => {
    setEditingTemplate(template);
    setIsTemplateFormOpen(true);
  };

  const handleDeleteTemplate = (id: string) => {
    setTemplates((prev) => prev.filter((temp) => temp.id !== id));
    toast.success("Template deleted successfully");
  };

  const handleToggleTemplateStatus = (id: string) => {
    setTemplates((prev) =>
      prev.map((temp) =>
        temp.id === id
          ? {
              ...temp,
              status: temp.status === "active" ? "inactive" : "active",
            }
          : temp
      )
    );
    const template = templates.find((t) => t.id === id);
    toast.success(
      `Template ${template?.status === "active" ? "paused" : "activated"}`
    );
  };

  const handleGenerateFromTemplate = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId);
    if (!template) return;

    const invoiceNumber = getNextInvoiceNumber(invoices);
    const newInvoice = generateInvoiceFromTemplate(template, invoiceNumber);
    
    setInvoices((prev) => [...prev, newInvoice]);
    
    const updatedTemplate = updateTemplateNextDate(template);
    setTemplates((prev) =>
      prev.map((t) => (t.id === templateId ? updatedTemplate : t))
    );
    
    toast.success(`Invoice ${invoiceNumber} generated from template`);
  };

  // Email schedule handlers
  const handleSaveSchedule = (schedule: EmailSchedule) => {
    const existingSchedule = schedules.find((s) => s.id === schedule.id);
    if (existingSchedule) {
      setSchedules((prev) =>
        prev.map((s) => (s.id === schedule.id ? schedule : s))
      );
      toast.success("Schedule updated successfully");
    } else {
      setSchedules((prev) => [...prev, schedule]);
      toast.success("Email scheduled successfully");
    }
  };

  const handleDeleteSchedule = (id: string) => {
    setSchedules((prev) => prev.filter((s) => s.id !== id));
    toast.success("Schedule deleted successfully");
  };

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="flex-1 w-full overflow-hidden">
        {activeTab === "dashboard" && (
          <DashboardView
            invoices={invoices}
            accounts={accounts}
            onViewInvoice={handleViewInvoice}
          />
        )}

        {activeTab === "accounts" && (
          <AccountsView
            accounts={accounts}
            onEditAccount={handleEditAccount}
            onAddAccount={() => {
              setEditingAccount(undefined);
              setIsAccountFormOpen(true);
            }}
          />
        )}

        {activeTab === "templates" && (
          <div className="p-8 h-full overflow-y-auto">
            <TemplateList
              templates={templates}
              onEdit={handleEditTemplate}
              onDelete={handleDeleteTemplate}
              onToggleStatus={handleToggleTemplateStatus}
              onGenerate={handleGenerateFromTemplate}
              onAdd={() => {
                setEditingTemplate(undefined);
                setIsTemplateFormOpen(true);
              }}
            />
          </div>
        )}

        {activeTab === "history" && (
          <div className="p-8 h-full overflow-y-auto">
            <EmailScheduler
              schedules={schedules}
              invoices={invoices}
              onSave={handleSaveSchedule}
              onDelete={handleDeleteSchedule}
            />
          </div>
        )}

        {activeTab === "payroll" && (
          <div className="p-8 h-full overflow-y-auto">
            <div className="flex items-center justify-center h-[400px] border-2 border-dashed border-gray-300 rounded-lg">
              <p className="text-gray-400">Payroll feature coming soon...</p>
            </div>
          </div>
        )}
      </div>

      {/* Account Form Modal (reusing ClientList component) */}
      {isAccountFormOpen && (
        <ClientList
          clients={accounts}
          onEdit={handleEditAccount}
          onDelete={handleDeleteAccount}
          onAdd={() => {
            setEditingAccount(undefined);
            setIsAccountFormOpen(true);
          }}
        />
      )}

      {/* Invoice Form Modal */}
      <InvoiceForm
        isOpen={isInvoiceFormOpen}
        onClose={() => {
          setIsInvoiceFormOpen(false);
          setEditingInvoice(undefined);
        }}
        onSave={handleSaveInvoice}
        clients={accounts}
        invoice={editingInvoice}
      />

      {/* Template Form Modal */}
      <TemplateForm
        isOpen={isTemplateFormOpen}
        onClose={() => {
          setIsTemplateFormOpen(false);
          setEditingTemplate(undefined);
        }}
        onSave={handleSaveTemplate}
        clients={accounts}
        template={editingTemplate}
      />

      {/* Invoice Viewer Modal */}
      <InvoiceViewer
        invoice={viewingInvoice}
        isOpen={isInvoiceViewerOpen}
        onClose={() => {
          setIsInvoiceViewerOpen(false);
          setViewingInvoice(null);
        }}
      />

      <Toaster />
    </div>
  );
}
