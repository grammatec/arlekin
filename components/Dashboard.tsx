import { Card } from "./ui/card";
import { FileText, Users, Calendar, DollarSign } from "lucide-react";
import { Invoice, Client, EmailSchedule } from "../types";

interface DashboardProps {
  invoices: Invoice[];
  clients: Client[];
  schedules: EmailSchedule[];
}

export function Dashboard({ invoices, clients, schedules }: DashboardProps) {
  const totalRevenue = invoices
    .filter((inv) => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.total, 0);
  
  const pendingAmount = invoices
    .filter((inv) => inv.status === 'sent' || inv.status === 'overdue')
    .reduce((sum, inv) => sum + inv.total, 0);
  
  const pendingSchedules = schedules.filter((s) => s.status === 'pending').length;

  const stats = [
    {
      title: 'Total Invoices',
      value: invoices.length,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Total Clients',
      value: clients.length,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Pending Emails',
      value: pendingSchedules,
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Pending Amount',
      value: `$${pendingAmount.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2>Dashboard</h2>
        <p className="text-gray-600 mt-1">Overview of your invoicing activity</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="mb-4">Recent Invoices</h3>
          <div className="space-y-3">
            {invoices.slice(0, 5).map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                <div>
                  <p>{invoice.invoiceNumber}</p>
                  <p className="text-sm text-gray-600">{invoice.clientName}</p>
                </div>
                <div className="text-right">
                  <p>${invoice.total.toLocaleString()}</p>
                  <span className={`text-xs px-2 py-1 rounded ${
                    invoice.status === 'paid' ? 'bg-green-100 text-green-700' :
                    invoice.status === 'sent' ? 'bg-blue-100 text-blue-700' :
                    invoice.status === 'overdue' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {invoice.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="mb-4">Upcoming Email Schedules</h3>
          <div className="space-y-3">
            {schedules
              .filter((s) => s.status === 'pending')
              .slice(0, 5)
              .map((schedule) => (
                <div key={schedule.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                  <div>
                    <p>{schedule.invoiceNumber}</p>
                    <p className="text-sm text-gray-600">{schedule.clientName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">{new Date(schedule.scheduledDate).toLocaleDateString()}</p>
                    <span className={`text-xs px-2 py-1 rounded ${
                      schedule.emailType === 'send' ? 'bg-blue-100 text-blue-700' :
                      schedule.emailType === 'reminder' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {schedule.emailType}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
