import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import InvoiceBuilder from './pages/Invoices/Builder'

export default function App() {
  return (
    <Router>
      <div className="flex h-screen bg-bg">
        <Sidebar />
        <main className="flex-1 overflow-auto p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/invoices/builder" element={<InvoiceBuilder />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}
