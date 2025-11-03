import { Link } from 'react-router-dom'
import { Home, Users, FileText, Settings, LogOut } from 'lucide-react'
import { Button } from './ui/button'

const nav = [
  { icon: Home, label: 'Dashboard', to: '/' },
  { icon: Users, label: 'Clients', to: '/clients' },
  { icon: FileText, label: 'Invoices', to: '/invoices' },
  { icon: Settings, label: 'Settings', to: '/settings' },
]

export default function Sidebar() {
  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full p-4 flex flex-col">
      <h1 className="text-2xl font-bold text-primary mb-8">PI-factory</h1>
      <nav className="space-y-2 flex-1">
        {nav.map((item) => (
          <Button key={item.to} variant="ghost" className="w-full justify-start" asChild>
            <Link to={item.to}>
              <item.icon className="mr-3 h-5 w-5" />
              {item.label}
            </Link>
          </Button>
        ))}
      </nav>
      <Button variant="ghost" className="w-full justify-start text-red-600">
        <LogOut className="mr-3 h-5 w-5" />
        Logout
      </Button>
    </div>
  )
}
