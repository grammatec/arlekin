import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Info } from "lucide-react";
import { 
  InvoiceTemplate, 
  Account, 
  Currency, 
  RecurrenceFrequency, 
  DayOfMonth,
  PiIdGenerationMethod,
  PriceCalculationMethod,
  PriceCalculationConfig
} from "../types";
import { getNextGenerationDate } from "../utils/dateCalculator";
import { generatePiId, formatPiIdDisplay } from "../utils/piIdGenerator";
import { getNBGExchangeRate, calculatePriceWithRate } from "../utils/nbgExchangeRate";

interface TemplateFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (template: InvoiceTemplate) => void;
  clients: Account[];
  template?: InvoiceTemplate;
}

export function TemplateForm({ isOpen, onClose, onSave, clients, template }: TemplateFormProps) {
  const [formData, setFormData] = useState<Partial<InvoiceTemplate>>(
    template || {
      name: '',
      clientId: '',
      clientName: '',
      clientEmail: '',
      accountId: '',
      frequency: 'monthly',
      dayOfMonth: 1,
      currency: 'GEL',
      piIdMethod: 'auto',
      piIdPrefix: '00',
      basePrice: 0,
      priceCalculation: {
        method: 'unchanged',
      },
      items: [],
      tax: 18, // Default VAT 18%
      paymentTerms: 30,
      notes: '',
      status: 'active',
    }
  );

  const [previewPiId, setPreviewPiId] = useState('');
  const [previewFinalPrice, setPreviewFinalPrice] = useState(0);
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [isLoadingRate, setIsLoadingRate] = useState(false);

  // Update PI ID preview when relevant fields change
  useEffect(() => {
    if (formData.piIdMethod === 'auto') {
      const account = clients.find(c => c.id === formData.clientId);
      if (account?.accountNumber) {
        const testDate = new Date();
        const piId = generatePiId(
          account.accountNumber,
          testDate,
          formData.piIdPrefix || '00'
        );
        setPreviewPiId(piId);
      }
    }
  }, [formData.piIdMethod, formData.clientId, formData.piIdPrefix, clients]);

  // Update final price preview when calculation method changes
  useEffect(() => {
    calculateFinalPrice();
  }, [
    formData.basePrice,
    formData.priceCalculation,
    formData.tax,
  ]);

  const calculateFinalPrice = async () => {
    if (!formData.basePrice || !formData.priceCalculation) {
      setPreviewFinalPrice(0);
      return;
    }

    let price = formData.basePrice;
    const calc = formData.priceCalculation;

    switch (calc.method) {
      case 'unchanged':
        price = formData.basePrice;
        break;
      
      case 'manual_rate':
        if (calc.manualRate) {
          price = formData.basePrice * calc.manualRate;
        }
        break;
      
      case 'nbg_usd_gel':
      case 'nbg_eur_gel':
      case 'nbg_gel_usd':
      case 'nbg_gel_eur':
        setIsLoadingRate(true);
        try {
          const [fromCurr, toCurr] = calc.method === 'nbg_usd_gel' 
            ? ['USD', 'GEL']
            : calc.method === 'nbg_eur_gel'
            ? ['EUR', 'GEL']
            : calc.method === 'nbg_gel_usd'
            ? ['GEL', 'USD']
            : ['GEL', 'EUR'];
          
          const rate = await getNBGExchangeRate(fromCurr, toCurr, calc.rateDate);
          setExchangeRate(rate);
          price = calculatePriceWithRate(formData.basePrice, rate);
        } catch (error) {
          console.error('Error fetching exchange rate:', error);
        }
        setIsLoadingRate(false);
        break;
    }

    // Apply VAT
    const vat = formData.tax || 0;
    const finalPrice = price * (1 + vat / 100);
    setPreviewFinalPrice(finalPrice);
  };

  const handleClientChange = (clientId: string) => {
    const client = clients.find((c) => c.id === clientId);
    if (client) {
      setFormData({
        ...formData,
        clientId: client.id,
        clientName: client.name,
        clientEmail: client.email,
        accountId: client.accountNumber,
      });
    }
  };

  const handleSubmit = () => {
    const nextGenDate = getNextGenerationDate(
      formData.frequency as RecurrenceFrequency,
      formData.dayOfMonth as DayOfMonth
    );

    const newTemplate: InvoiceTemplate = {
      id: template?.id || String(Date.now()),
      name: formData.name!,
      clientId: formData.clientId!,
      clientName: formData.clientName!,
      clientEmail: formData.clientEmail!,
      accountId: formData.accountId,
      frequency: formData.frequency as RecurrenceFrequency,
      dayOfMonth: formData.dayOfMonth as DayOfMonth,
      currency: formData.currency as Currency,
      piIdMethod: formData.piIdMethod as PiIdGenerationMethod,
      piIdPrefix: formData.piIdPrefix,
      basePrice: formData.basePrice!,
      priceCalculation: formData.priceCalculation as PriceCalculationConfig,
      items: formData.items || [],
      tax: formData.tax!,
      paymentTerms: formData.paymentTerms!,
      notes: formData.notes,
      status: formData.status as 'active' | 'inactive',
      nextGenerationDate: nextGenDate,
      createdAt: template?.createdAt || new Date().toISOString().split('T')[0],
    };
    onSave(newTemplate);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{template ? 'Edit Template' : 'Create Invoice Template'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Template Name & Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Template Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Monthly Service Fee"
              />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as 'active' | 'inactive' })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Client Selection */}
          <div className="space-y-2">
            <Label>Account *</Label>
            <Select value={formData.clientId} onValueChange={handleClientChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select an account" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name} - {client.company} {client.accountNumber ? `(#${client.accountNumber})` : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* PI ID Configuration */}
          <div className="border rounded-lg p-4 space-y-4 bg-gray-50">
            <h3 className="font-semibold flex items-center gap-2">
              1. PI ID Configuration
              <Info className="w-4 h-4 text-gray-500" />
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>PI ID Generation Method</Label>
                <Select
                  value={formData.piIdMethod}
                  onValueChange={(value) => setFormData({ ...formData, piIdMethod: value as PiIdGenerationMethod })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Automatic (YY+AccID+ExtraID+MM)</SelectItem>
                    <SelectItem value="manual">Manual Entry</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.piIdMethod === 'auto' && (
                <div className="space-y-2">
                  <Label>Extra ID (Prefix)</Label>
                  <Input
                    value={formData.piIdPrefix}
                    onChange={(e) => setFormData({ ...formData, piIdPrefix: e.target.value })}
                    placeholder="00"
                    maxLength={2}
                  />
                </div>
              )}
            </div>

            {formData.piIdMethod === 'auto' && previewPiId && (
              <div className="bg-blue-50 border border-blue-200 rounded p-3">
                <p className="text-sm">
                  <strong>Preview PI ID:</strong> {formatPiIdDisplay(previewPiId)}
                  <br />
                  <span className="text-gray-600">
                    Format: Year(25) + Account({formData.accountId || '####'}) + Extra({formData.piIdPrefix || '00'}) + Month(11)
                  </span>
                </p>
              </div>
            )}
          </div>

          {/* Price Configuration */}
          <div className="border rounded-lg p-4 space-y-4 bg-gray-50">
            <h3 className="font-semibold flex items-center gap-2">
              2. Base Price & Calculation
              <Info className="w-4 h-4 text-gray-500" />
            </h3>

            <div className="space-y-2">
              <Label>Base Price *</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.basePrice}
                onChange={(e) => setFormData({ ...formData, basePrice: Number(e.target.value) })}
                placeholder="100.00"
              />
            </div>

            <div className="space-y-2">
              <Label>Price Calculation Method *</Label>
              <Select
                value={formData.priceCalculation?.method}
                onValueChange={(value) => setFormData({ 
                  ...formData, 
                  priceCalculation: { 
                    ...formData.priceCalculation,
                    method: value as PriceCalculationMethod 
                  } 
                })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unchanged">Use Base Price (Unchanged)</SelectItem>
                  <SelectItem value="manual_rate">Manual Multiplication Rate</SelectItem>
                  <SelectItem value="nbg_usd_gel">NBG: USD to GEL</SelectItem>
                  <SelectItem value="nbg_eur_gel">NBG: EUR to GEL</SelectItem>
                  <SelectItem value="nbg_gel_usd">NBG: GEL to USD</SelectItem>
                  <SelectItem value="nbg_gel_eur">NBG: GEL to EUR</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.priceCalculation?.method === 'manual_rate' && (
              <div className="space-y-2">
                <Label>Manual Multiplication Rate</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.priceCalculation.manualRate || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    priceCalculation: { 
                      ...formData.priceCalculation,
                      manualRate: Number(e.target.value) 
                    } 
                  })}
                  placeholder="2.71"
                />
              </div>
            )}

            {formData.priceCalculation?.method?.startsWith('nbg_') && (
              <div className="space-y-2">
                <Label>Rate Date (for exchange rate lookup)</Label>
                <Input
                  type="date"
                  value={formData.priceCalculation.rateDate || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    priceCalculation: { 
                      ...formData.priceCalculation,
                      rateDate: e.target.value 
                    } 
                  })}
                />
                <p className="text-xs text-gray-600">
                  Leave empty to use current date when invoice is generated
                </p>
              </div>
            )}

            {exchangeRate !== null && (
              <div className="bg-green-50 border border-green-200 rounded p-3">
                <p className="text-sm">
                  <strong>Exchange Rate:</strong> {exchangeRate.toFixed(4)}
                  <br />
                  <strong>Calculated Price:</strong> {formData.basePrice} × {exchangeRate.toFixed(4)} = {(formData.basePrice! * exchangeRate).toFixed(2)}
                </p>
              </div>
            )}
          </div>

          {/* VAT Configuration */}
          <div className="border rounded-lg p-4 space-y-4 bg-gray-50">
            <h3 className="font-semibold flex items-center gap-2">
              3. VAT Rate
              <Info className="w-4 h-4 text-gray-500" />
            </h3>

            <div className="space-y-2">
              <Label>VAT Percentage (%)</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.tax}
                onChange={(e) => setFormData({ ...formData, tax: Number(e.target.value) })}
                placeholder="18"
              />
              <p className="text-xs text-gray-600">
                Applied to final price after calculation. Example: 18% VAT
              </p>
            </div>

            {previewFinalPrice > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded p-3 space-y-1">
                <p className="text-sm">
                  <strong>Price Preview:</strong>
                </p>
                <p className="text-sm">Base: {formData.basePrice?.toFixed(2)}</p>
                {formData.priceCalculation?.method !== 'unchanged' && exchangeRate && (
                  <p className="text-sm">After Conversion: {(formData.basePrice! * exchangeRate).toFixed(2)}</p>
                )}
                <p className="text-sm">VAT ({formData.tax}%): +{((previewFinalPrice / (1 + formData.tax! / 100)) * (formData.tax! / 100)).toFixed(2)}</p>
                <p className="text-sm font-bold">Final Price: {previewFinalPrice.toFixed(2)} {formData.currency}</p>
              </div>
            )}
          </div>

          {/* Issue Timing */}
          <div className="border rounded-lg p-4 space-y-4 bg-gray-50">
            <h3 className="font-semibold flex items-center gap-2">
              4. Issue Timing
              <Info className="w-4 h-4 text-gray-500" />
            </h3>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Frequency *</Label>
                <Select
                  value={formData.frequency}
                  onValueChange={(value) => setFormData({ ...formData, frequency: value as RecurrenceFrequency })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Day of Month *</Label>
                <Select
                  value={String(formData.dayOfMonth)}
                  onValueChange={(value) => {
                    const dayOfMonth = value === 'last' || value === 'first' ? value : parseInt(value);
                    setFormData({ ...formData, dayOfMonth: dayOfMonth as DayOfMonth });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="first">First day</SelectItem>
                    <SelectItem value="last">Last day</SelectItem>
                    {Array.from({ length: 28 }, (_, i) => i + 1).map((day) => (
                      <SelectItem key={day} value={String(day)}>
                        Day {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Currency *</Label>
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
            </div>
          </div>

          {/* Additional Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Payment Terms (days)</Label>
              <Input
                type="number"
                value={formData.paymentTerms}
                onChange={(e) => setFormData({ ...formData, paymentTerms: Number(e.target.value) })}
                placeholder="30"
              />
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

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {template ? 'Update' : 'Create'} Template
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
