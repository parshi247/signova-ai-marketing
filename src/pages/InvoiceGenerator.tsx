import React, { useState } from 'react';
import { Receipt, Download, Sparkles, ArrowRight, Plus, Trash2 } from 'lucide-react';
import { Link } from "wouter";

/**
 * INVOICE GENERATOR - Viral Free Tool
 * 
 * Purpose: Generate traffic and convert to paid users
 * Strategy: Free invoice generation → Upsell to e-signature & recurring invoices
 * Expected: 500-2,000 visitors/week, 10-40 signups
 */

interface LineItem {
  description: string;
  quantity: number;
  rate: number;
}

interface InvoiceData {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  fromName: string;
  fromEmail: string;
  fromAddress: string;
  toName: string;
  toEmail: string;
  toAddress: string;
  lineItems: LineItem[];
  notes: string;
  taxRate: number;
}

export default function InvoiceGenerator() {
  const [formData, setFormData] = useState<InvoiceData>({
    invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    fromName: '',
    fromEmail: '',
    fromAddress: '',
    toName: '',
    toEmail: '',
    toAddress: '',
    lineItems: [{ description: '', quantity: 1, rate: 0 }],
    notes: '',
    taxRate: 0,
  });

  const [generatedInvoice, setGeneratedInvoice] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const addLineItem = () => {
    setFormData({
      ...formData,
      lineItems: [...formData.lineItems, { description: '', quantity: 1, rate: 0 }],
    });
  };

  const removeLineItem = (index: number) => {
    const newItems = formData.lineItems.filter((_, i) => i !== index);
    setFormData({ ...formData, lineItems: newItems });
  };

  const updateLineItem = (index: number, field: keyof LineItem, value: any) => {
    const newItems = [...formData.lineItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, lineItems: newItems });
  };

  const calculateSubtotal = () => {
    return formData.lineItems.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * (formData.taxRate / 100);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const handleGenerate = async () => {
    setIsGenerating(true);

    setTimeout(() => {
      const invoice = generateInvoiceHTML(formData);
      setGeneratedInvoice(invoice);
      setIsGenerating(false);
      
      // Track conversion event
      trackEvent('invoice_generated', { 
        total: calculateTotal(),
        items: formData.lineItems.length 
      });
    }, 1500);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([generatedInvoice], { type: 'text/html' });
    element.href = URL.createObjectURL(file);
    element.download = `invoice-${formData.invoiceNumber}.html`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    trackEvent('invoice_downloaded', { invoiceNumber: formData.invoiceNumber });
  };

  const trackEvent = (event: string, data: any) => {
    if (window.gtag) {
      window.gtag('event', event, data);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              Signova.ai
            </Link>
            <Link
              to="/pricing"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Upgrade to Pro
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 p-3 rounded-full">
              <Receipt className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Free Invoice Generator
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Create professional invoices in seconds. 
            <span className="text-green-600 font-semibold"> 100% free, no signup required.</span>
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Form */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Invoice Details</h2>

            <div className="space-y-6">
              {/* Invoice Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Invoice Number
                  </label>
                  <input
                    type="text"
                    value={formData.invoiceNumber}
                    onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Invoice Date
                  </label>
                  <input
                    type="date"
                    value={formData.invoiceDate}
                    onChange={(e) => setFormData({ ...formData, invoiceDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date
                </label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* From Section */}
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">From (Your Business)</h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={formData.fromName}
                    onChange={(e) => setFormData({ ...formData, fromName: e.target.value })}
                    placeholder="Business Name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <input
                    type="email"
                    value={formData.fromEmail}
                    onChange={(e) => setFormData({ ...formData, fromEmail: e.target.value })}
                    placeholder="business@email.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <textarea
                    value={formData.fromAddress}
                    onChange={(e) => setFormData({ ...formData, fromAddress: e.target.value })}
                    placeholder="Business Address"
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* To Section */}
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Bill To (Client)</h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={formData.toName}
                    onChange={(e) => setFormData({ ...formData, toName: e.target.value })}
                    placeholder="Client Name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <input
                    type="email"
                    value={formData.toEmail}
                    onChange={(e) => setFormData({ ...formData, toEmail: e.target.value })}
                    placeholder="client@email.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <textarea
                    value={formData.toAddress}
                    onChange={(e) => setFormData({ ...formData, toAddress: e.target.value })}
                    placeholder="Client Address"
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Line Items */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold">Line Items</h3>
                  <button
                    onClick={addLineItem}
                    className="flex items-center gap-1 text-green-600 hover:text-green-700 text-sm font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    Add Item
                  </button>
                </div>

                {formData.lineItems.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 mb-3">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateLineItem(index, 'description', e.target.value)}
                      placeholder="Description"
                      className="col-span-6 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateLineItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                      placeholder="Qty"
                      className="col-span-2 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <input
                      type="number"
                      value={item.rate}
                      onChange={(e) => updateLineItem(index, 'rate', parseFloat(e.target.value) || 0)}
                      placeholder="Rate"
                      className="col-span-3 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    {formData.lineItems.length > 1 && (
                      <button
                        onClick={() => removeLineItem(index)}
                        className="col-span-1 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Tax */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tax Rate (%)
                </label>
                <input
                  type="number"
                  value={formData.taxRate}
                  onChange={(e) => setFormData({ ...formData, taxRate: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Payment terms, thank you message, etc."
                />
              </div>

              {/* Totals Preview */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span className="font-semibold">${calculateSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax ({formData.taxRate}%):</span>
                  <span className="font-semibold">${calculateTax().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total:</span>
                  <span className="text-green-600">${calculateTotal().toFixed(2)}</span>
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={!formData.fromName || !formData.toName || isGenerating}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="w-5 h-5 animate-spin" />
                    Generating Invoice...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Invoice
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Invoice Preview</h2>
              {generatedInvoice && (
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  <Download className="w-4 h-4" />
                  Download HTML
                </button>
              )}
            </div>

            {generatedInvoice ? (
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 max-h-[600px] overflow-y-auto">
                <div dangerouslySetInnerHTML={{ __html: generatedInvoice }} />
              </div>
            ) : (
              <div className="bg-gray-50 p-12 rounded-lg border-2 border-dashed border-gray-300 text-center">
                <Receipt className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  Your invoice will appear here after generation
                </p>
              </div>
            )}

            {/* Upsell CTA */}
            {generatedInvoice && (
              <div className="mt-6 bg-slate-50 p-6 rounded-lg border border-slate-200">
                <h3 className="font-bold text-lg mb-2">Need recurring invoices?</h3>
                <p className="text-gray-600 mb-4">
                  Automate your invoicing with Signova.ai. Send, track, and get paid faster.
                </p>
                <Link
                  to="/pricing"
                  className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-semibold"
                >
                  Start Free
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Generate invoice HTML
function generateInvoiceHTML(data: InvoiceData): string {
  const subtotal = data.lineItems.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
  const tax = subtotal * (data.taxRate / 100);
  const total = subtotal + tax;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Invoice ${data.invoiceNumber}</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; }
    .header { display: flex; justify-content: space-between; margin-bottom: 40px; }
    .invoice-title { font-size: 32px; font-weight: bold; color: #10b981; }
    .details { margin-bottom: 30px; }
    .party { margin-bottom: 20px; }
    .party-title { font-weight: bold; margin-bottom: 5px; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th { background: #f3f4f6; padding: 12px; text-align: left; border-bottom: 2px solid #d1d5db; }
    td { padding: 12px; border-bottom: 1px solid #e5e7eb; }
    .totals { margin-left: auto; width: 300px; }
    .totals-row { display: flex; justify-content: space-between; padding: 8px 0; }
    .total-row { font-weight: bold; font-size: 18px; border-top: 2px solid #10b981; padding-top: 12px; }
    .notes { margin-top: 30px; padding: 15px; background: #f9fafb; border-left: 4px solid #10b981; }
    .footer { margin-top: 40px; text-align: center; color: #6b7280; font-size: 12px; }
  </style>
</head>
<body>
  <div class="header">
    <div class="invoice-title">INVOICE</div>
    <div>
      <div><strong>Invoice #:</strong> ${data.invoiceNumber}</div>
      <div><strong>Date:</strong> ${data.invoiceDate}</div>
      <div><strong>Due Date:</strong> ${data.dueDate}</div>
    </div>
  </div>

  <div class="details">
    <div class="party">
      <div class="party-title">From:</div>
      <div>${data.fromName}</div>
      <div>${data.fromEmail}</div>
      <div>${data.fromAddress}</div>
    </div>

    <div class="party">
      <div class="party-title">Bill To:</div>
      <div>${data.toName}</div>
      <div>${data.toEmail}</div>
      <div>${data.toAddress}</div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Description</th>
        <th style="text-align: center;">Quantity</th>
        <th style="text-align: right;">Rate</th>
        <th style="text-align: right;">Amount</th>
      </tr>
    </thead>
    <tbody>
      ${data.lineItems.map(item => `
        <tr>
          <td>${item.description}</td>
          <td style="text-align: center;">${item.quantity}</td>
          <td style="text-align: right;">$${item.rate.toFixed(2)}</td>
          <td style="text-align: right;">$${(item.quantity * item.rate).toFixed(2)}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="totals">
    <div class="totals-row">
      <span>Subtotal:</span>
      <span>$${subtotal.toFixed(2)}</span>
    </div>
    <div class="totals-row">
      <span>Tax (${data.taxRate}%):</span>
      <span>$${tax.toFixed(2)}</span>
    </div>
    <div class="totals-row total-row">
      <span>Total:</span>
      <span>$${total.toFixed(2)}</span>
    </div>
  </div>

  ${data.notes ? `
    <div class="notes">
      <strong>Notes:</strong><br>
      ${data.notes}
    </div>
  ` : ''}

  <div class="footer">
    Generated by Signova.ai - Professional Document Management & E-Signatures<br>
    Visit https://signova.ai to automate your invoicing
  </div>
</body>
</html>
  `;
}
