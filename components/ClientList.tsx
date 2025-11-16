import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Label } from "./ui/label";
import { Search, Plus, Edit, Trash2, Mail, Phone } from "lucide-react";
import { Client } from "../types";
import { Card } from "./ui/card";

interface ClientListProps {
  clients: Client[];
  onAdd: (client: Client) => void;
  onEdit: (client: Client) => void;
  onDelete: (id: string) => void;
}

export function ClientList({ clients, onAdd, onEdit, onDelete }: ClientListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | undefined>();
  
  const [formData, setFormData] = useState<Partial<Client>>({
    name: '',
    email: '',
    company: '',
    phone: '',
    address: '',
  });

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenForm = (client?: Client) => {
    if (client) {
      setEditingClient(client);
      setFormData(client);
    } else {
      setEditingClient(undefined);
      setFormData({
        name: '',
        email: '',
        company: '',
        phone: '',
        address: '',
      });
    }
    setIsFormOpen(true);
  };

  const handleSubmit = () => {
    const client: Client = {
      id: editingClient?.id || String(Date.now()),
      name: formData.name!,
      email: formData.email!,
      company: formData.company!,
      phone: formData.phone,
      address: formData.address,
      createdAt: editingClient?.createdAt || new Date().toISOString().split('T')[0],
    };

    if (editingClient) {
      onEdit(client);
    } else {
      onAdd(client);
    }
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Clients</h2>
          <p className="text-gray-600 mt-1">Manage your client information</p>
        </div>
        <Button onClick={() => handleOpenForm()}>
          <Plus className="w-4 h-4 mr-2" />
          Add Client
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClients.map((client) => (
          <Card key={client.id} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3>{client.name}</h3>
                <p className="text-sm text-gray-600">{client.company}</p>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleOpenForm(client)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(client.id)}
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="w-4 h-4 mr-2" />
                {client.email}
              </div>
              {client.phone && (
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="w-4 h-4 mr-2" />
                  {client.phone}
                </div>
              )}
              {client.address && (
                <p className="text-sm text-gray-600 mt-2">{client.address}</p>
              )}
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingClient ? 'Edit Client' : 'Add New Client'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Doe"
              />
            </div>

            <div className="space-y-2">
              <Label>Email *</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@company.com"
              />
            </div>

            <div className="space-y-2">
              <Label>Company *</Label>
              <Input
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="Acme Corporation"
              />
            </div>

            <div className="space-y-2">
              <Label>Phone</Label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div className="space-y-2">
              <Label>Address</Label>
              <Input
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="123 Business St, City, State"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsFormOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>
                {editingClient ? 'Update' : 'Add'} Client
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
