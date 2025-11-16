import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { Search, Plus, Edit, Trash2, PlayCircle, PauseCircle, Calendar } from "lucide-react";
import { InvoiceTemplate } from "../types";
import { formatDayOfMonth } from "../utils/dateCalculator";
import { getCurrencySymbol } from "../utils/currencyConverter";

interface TemplateListProps {
  templates: InvoiceTemplate[];
  onCreate: () => void;
  onEdit: (template: InvoiceTemplate) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onGenerateNow: (template: InvoiceTemplate) => void;
}

export function TemplateList({
  templates,
  onCreate,
  onEdit,
  onDelete,
  onToggleStatus,
  onGenerateNow,
}: TemplateListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTemplates = templates.filter((template) =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.clientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Invoice Templates</h2>
          <p className="text-gray-600 mt-1">Automate recurring invoice generation</p>
        </div>
        <Button onClick={onCreate}>
          <Plus className="w-4 h-4 mr-2" />
          New Template
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map((template) => {
          const subtotal = template.items.reduce((sum, item) => sum + item.quantity * item.rate, 0);
          const tax = subtotal * (template.tax / 100);
          const total = subtotal + tax;
          const currencySymbol = getCurrencySymbol(template.currency);

          return (
            <Card key={template.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3>{template.name}</h3>
                  <p className="text-sm text-gray-600">{template.clientName}</p>
                </div>
                <Badge className={template.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                  {template.status}
                </Badge>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Frequency:</span>
                  <span className="capitalize">{template.frequency}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Day of Month:</span>
                  <span>{formatDayOfMonth(template.dayOfMonth)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Amount:</span>
                  <span>{currencySymbol}{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Currency:</span>
                  <span>
                    {template.currency}
                    {template.baseCurrency && template.baseCurrency !== template.currency && (
                      <span className="text-xs text-gray-500"> (from {template.baseCurrency})</span>
                    )}
                  </span>
                </div>
                {template.nextGenerationDate && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Next Invoice:</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(template.nextGenerationDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-3 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => onToggleStatus(template.id)}
                >
                  {template.status === 'active' ? (
                    <>
                      <PauseCircle className="w-4 h-4 mr-1" />
                      Pause
                    </>
                  ) : (
                    <>
                      <PlayCircle className="w-4 h-4 mr-1" />
                      Activate
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onGenerateNow(template)}
                  disabled={template.status === 'inactive'}
                >
                  Generate
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(template)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(template.id)}
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
