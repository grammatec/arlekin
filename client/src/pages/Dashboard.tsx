import { Card } from '@/components/ui/card'
import { DollarSign, Users, FileText, Clock } from 'lucide-react'

const stats = [
  { label: 'Total Revenue', value: '$48,574', icon: DollarSign, change: '+12%' },
  { label: 'Active Clients', value: '142', icon: Users, change: '+8' },
  { label: 'Invoices Sent', value: '89', icon: FileText, change: '+23' },
  { label: 'Pending', value: '12', icon: Clock, change: '-3' },
]

export default function Dashboard() {
  return (
    <div>
      <h2 className="text-3xl font-bold text-secondary mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((s) => (
          <Card key={s.label} className="p-6">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-gray-600">{s.label}</p>
                <p className="text-2xl font-bold text-secondary">{s.value}</p>
                <p className="text-sm text-green-600">{s.change}</p>
              </div>
              <s.icon className="h-10 w-10 text-primary opacity-20" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
