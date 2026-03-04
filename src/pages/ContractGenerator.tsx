import React, { useState } from 'react';
import { FileText, Download, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from "wouter";

/**
 * CONTRACT GENERATOR - Viral Free Tool
 * 
 * Purpose: Generate traffic and convert to paid users
 * Strategy: Free contract generation → Upsell to e-signature
 * Expected: 500-2,000 visitors/week, 10-40 signups
 */

interface ContractData {
  type: string;
  party1Name: string;
  party1Address: string;
  party2Name: string;
  party2Address: string;
  startDate: string;
  endDate?: string;
  amount?: string;
  terms: string;
}

const CONTRACT_TYPES = [
  { value: 'service', label: 'Service Agreement', description: 'For freelancers and contractors' },
  { value: 'employment', label: 'Employment Contract', description: 'For hiring employees' },
  { value: 'consulting', label: 'Consulting Agreement', description: 'For consultants and advisors' },
  { value: 'sales', label: 'Sales Contract', description: 'For selling goods or services' },
  { value: 'partnership', label: 'Partnership Agreement', description: 'For business partnerships' },
  { value: 'rental', label: 'Rental Agreement', description: 'For property rentals' },
];

export default function ContractGenerator() {
  const [formData, setFormData] = useState<ContractData>({
    type: '',
    party1Name: '',
    party1Address: '',
    party2Name: '',
    party2Address: '',
    startDate: '',
    endDate: '',
    amount: '',
    terms: '',
  });

  const [generatedContract, setGeneratedContract] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);

    // Simulate AI generation (replace with actual API call)
    setTimeout(() => {
      const contract = generateContractText(formData);
      setGeneratedContract(contract);
      setIsGenerating(false);
      
      // Track conversion event
      trackEvent('contract_generated', { type: formData.type });
    }, 2000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([generatedContract], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${formData.type}-contract.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    // Track download event
    trackEvent('contract_downloaded', { type: formData.type });
  };

  const trackEvent = (event: string, data: any) => {
    // Send to analytics
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
            <div className="bg-blue-100 p-3 rounded-full">
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Free Contract Generator
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Generate professional contracts in seconds with AI. 
            <span className="text-blue-600 font-semibold"> 100% free, no signup required.</span>
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Form */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Contract Details</h2>

            <div className="space-y-4">
              {/* Contract Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contract Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a contract type...</option>
                  {CONTRACT_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label} - {type.description}
                    </option>
                  ))}
                </select>
              </div>

              {/* Party 1 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name/Company
                </label>
                <input
                  type="text"
                  value={formData.party1Name}
                  onChange={(e) => setFormData({ ...formData, party1Name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="John Doe or Acme Inc."
                />
              </div>

              {/* Party 2 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Other Party Name/Company
                </label>
                <input
                  type="text"
                  value={formData.party2Name}
                  onChange={(e) => setFormData({ ...formData, party2Name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Jane Smith or XYZ Corp."
                />
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contract Value (Optional)
                </label>
                <input
                  type="text"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="$5,000"
                />
              </div>

              {/* Terms */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Key Terms & Conditions
                </label>
                <textarea
                  value={formData.terms}
                  onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe the main terms, deliverables, payment schedule, etc."
                />
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={!formData.type || !formData.party1Name || !formData.party2Name || isGenerating}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="w-5 h-5 animate-spin" />
                    Generating with AI...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Contract
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Generated Contract</h2>
              {generatedContract && (
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              )}
            </div>

            {generatedContract ? (
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 max-h-[600px] overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
                  {generatedContract}
                </pre>
              </div>
            ) : (
              <div className="bg-gray-50 p-12 rounded-lg border-2 border-dashed border-gray-300 text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  Your contract will appear here after generation
                </p>
              </div>
            )}

            {/* Upsell CTA */}
            {generatedContract && (
              <div className="mt-6 bg-slate-50 p-6 rounded-lg border border-slate-200">
                <h3 className="font-bold text-lg mb-2">Ready to sign this contract?</h3>
                <p className="text-gray-600 mb-4">
                  Get e-signatures in minutes with Signova.ai. Save 50% vs DocuSign.
                </p>
                <Link
                  to="/pricing"
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
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

// Generate contract text based on form data
function generateContractText(data: ContractData): string {
  const today = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return `${data.type.toUpperCase()} AGREEMENT

This ${data.type} Agreement ("Agreement") is entered into as of ${data.startDate || today} ("Effective Date"), by and between:

PARTY 1: ${data.party1Name}
Address: ${data.party1Address || '[Address]'}

AND

PARTY 2: ${data.party2Name}
Address: ${data.party2Address || '[Address]'}

(Each a "Party" and collectively the "Parties")

1. SCOPE OF SERVICES
${data.terms || '[Describe the services, deliverables, or goods to be provided]'}

2. TERM
This Agreement shall commence on ${data.startDate || '[Start Date]'} and shall continue until ${data.endDate || '[End Date or "terminated by either party"]'}.

3. COMPENSATION
${data.amount ? `The total compensation for services rendered under this Agreement shall be ${data.amount}.` : '[Specify payment terms, amount, and schedule]'}

4. PAYMENT TERMS
Payment shall be made according to the following schedule:
[Specify payment schedule - e.g., upon completion, monthly, milestone-based]

5. CONFIDENTIALITY
Both parties agree to keep confidential any proprietary information shared during the term of this Agreement.

6. TERMINATION
Either party may terminate this Agreement with [30] days written notice to the other party.

7. GOVERNING LAW
This Agreement shall be governed by and construed in accordance with the laws of [Jurisdiction].

8. ENTIRE AGREEMENT
This Agreement constitutes the entire agreement between the parties and supersedes all prior agreements and understandings.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the Effective Date.

_______________________________
${data.party1Name}
Date: _______________

_______________________________
${data.party2Name}
Date: _______________


---
⚡ Generated by Signova.ai - Get this contract signed in minutes at https://signova.ai
`;
}
