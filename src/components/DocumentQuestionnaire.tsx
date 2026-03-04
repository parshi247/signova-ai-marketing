import React, { useState } from 'react';
import { X, FileText, Building2, Users, Briefcase, HandshakeIcon, ChevronRight, ChevronLeft, Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DocumentQuestionnaireProps {
  documentType: 'nda' | 'commercial-lease' | 'employee-handbook' | 'partnership-dissolution' | 'freelance-contract';
  onClose: () => void;
  onComplete: (data: any, documentType: string) => void;
}

const documentConfigs = {
  'nda': {
    title: 'AI NDA Generator',
    icon: FileText,
    steps: [
      {
        title: 'Basic Information',
        subtitle: "Let's start with the parties involved in this NDA",
        fields: [
          { name: 'disclosingParty', label: 'Disclosing Party', type: 'text', placeholder: 'Company or person sharing confidential information', required: true },
          { name: 'receivingParty', label: 'Receiving Party', type: 'text', placeholder: 'Company or person receiving confidential information', required: true },
          { name: 'isMutual', label: 'This is a mutual NDA (both parties will share confidential information)', type: 'checkbox' }
        ]
      },
      {
        title: 'Confidential Information',
        subtitle: 'What type of information will be shared?',
        fields: [
          { name: 'infoTypes', label: 'Select all that apply', type: 'multiselect', options: [
            { value: 'business', label: 'Business strategies and plans' },
            { value: 'financial', label: 'Financial information' },
            { value: 'technical', label: 'Technical data and trade secrets' },
            { value: 'customer', label: 'Customer/client information' },
            { value: 'product', label: 'Product designs and specifications' }
          ]},
          { name: 'purpose', label: 'Purpose of Disclosure', type: 'select', options: [
            { value: '', label: 'Select purpose...' },
            { value: 'partnership', label: 'Business partnership discussion' },
            { value: 'employment', label: 'Employment/contractor relationship' },
            { value: 'acquisition', label: 'Sale or acquisition discussion' },
            { value: 'investment', label: 'Investment opportunity' }
          ], required: true }
        ]
      },
      {
        title: 'Terms & Conditions',
        subtitle: 'Define the legal parameters of the agreement',
        fields: [
          { name: 'duration', label: 'Confidentiality Duration', type: 'select', options: [
            { value: '1', label: '1 year' },
            { value: '2', label: '2 years' },
            { value: '3', label: '3 years' },
            { value: '5', label: '5 years' },
            { value: 'indefinite', label: 'Indefinite' }
          ], required: true },
          { name: 'jurisdiction', label: 'Governing Law (State/Country)', type: 'text', placeholder: 'e.g., California, New York, Delaware', required: true },
          { name: 'returnMaterials', label: 'Return of Materials', type: 'select', options: [
            { value: 'upon-request', label: 'Upon written request' },
            { value: 'upon-termination', label: 'Upon termination of agreement' },
            { value: 'not-required', label: 'Not required' }
          ], required: true }
        ]
      }
    ]
  },
  'commercial-lease': {
    title: 'AI Commercial Lease Generator',
    icon: Building2,
    steps: [
      {
        title: 'Property Information',
        subtitle: 'Tell us about the commercial property',
        fields: [
          { name: 'propertyAddress', label: 'Property Address', type: 'text', placeholder: '123 Main Street, Suite 100, City, State ZIP', required: true },
          { name: 'propertyType', label: 'Property Type', type: 'select', options: [
            { value: '', label: 'Select type...' },
            { value: 'office', label: 'Office Space' },
            { value: 'retail', label: 'Retail Store' },
            { value: 'restaurant', label: 'Restaurant' },
            { value: 'warehouse', label: 'Warehouse/Industrial' },
            { value: 'mixed', label: 'Mixed Use' }
          ], required: true },
          { name: 'squareFootage', label: 'Square Footage', type: 'text', placeholder: 'e.g., 2,500 sq ft', required: true }
        ]
      },
      {
        title: 'Parties Information',
        subtitle: 'Landlord and tenant details',
        fields: [
          { name: 'landlordName', label: 'Landlord/Property Owner', type: 'text', placeholder: 'Full legal name or company name', required: true },
          { name: 'tenantName', label: 'Tenant/Business Name', type: 'text', placeholder: 'Full legal name or company name', required: true },
          { name: 'tenantBusinessType', label: 'Type of Business', type: 'text', placeholder: 'e.g., Restaurant, Law Office, Retail Store', required: true }
        ]
      },
      {
        title: 'Lease Terms',
        subtitle: 'Financial and duration details',
        fields: [
          { name: 'leaseTerm', label: 'Lease Duration', type: 'select', options: [
            { value: '1', label: '1 year' },
            { value: '2', label: '2 years' },
            { value: '3', label: '3 years' },
            { value: '5', label: '5 years' },
            { value: '10', label: '10 years' }
          ], required: true },
          { name: 'monthlyRent', label: 'Monthly Rent', type: 'text', placeholder: 'e.g., $3,500', required: true },
          { name: 'securityDeposit', label: 'Security Deposit', type: 'text', placeholder: 'e.g., $7,000 (2 months)', required: true },
          { name: 'jurisdiction', label: 'State/Jurisdiction', type: 'text', placeholder: 'e.g., California', required: true }
        ]
      }
    ]
  },
  'employee-handbook': {
    title: 'AI Employee Handbook Generator',
    icon: Users,
    steps: [
      {
        title: 'Company Information',
        subtitle: 'Basic details about your organization',
        fields: [
          { name: 'companyName', label: 'Company Name', type: 'text', placeholder: 'Your company legal name', required: true },
          { name: 'industry', label: 'Industry', type: 'select', options: [
            { value: '', label: 'Select industry...' },
            { value: 'tech', label: 'Technology/Software' },
            { value: 'healthcare', label: 'Healthcare' },
            { value: 'finance', label: 'Finance/Banking' },
            { value: 'retail', label: 'Retail' },
            { value: 'manufacturing', label: 'Manufacturing' },
            { value: 'professional', label: 'Professional Services' },
            { value: 'other', label: 'Other' }
          ], required: true },
          { name: 'employeeCount', label: 'Number of Employees', type: 'select', options: [
            { value: '1-10', label: '1-10 employees' },
            { value: '11-50', label: '11-50 employees' },
            { value: '51-200', label: '51-200 employees' },
            { value: '200+', label: '200+ employees' }
          ], required: true }
        ]
      },
      {
        title: 'Work Policies',
        subtitle: 'Define your workplace policies',
        fields: [
          { name: 'workArrangement', label: 'Work Arrangement', type: 'select', options: [
            { value: 'onsite', label: 'Fully On-site' },
            { value: 'remote', label: 'Fully Remote' },
            { value: 'hybrid', label: 'Hybrid' }
          ], required: true },
          { name: 'ptoPolicy', label: 'PTO Policy', type: 'select', options: [
            { value: 'unlimited', label: 'Unlimited PTO' },
            { value: '15days', label: '15 days per year' },
            { value: '20days', label: '20 days per year' },
            { value: 'accrual', label: 'Accrual-based' }
          ], required: true },
          { name: 'dressCode', label: 'Dress Code', type: 'select', options: [
            { value: 'formal', label: 'Business Formal' },
            { value: 'business-casual', label: 'Business Casual' },
            { value: 'casual', label: 'Casual' },
            { value: 'none', label: 'No Dress Code' }
          ], required: true }
        ]
      },
      {
        title: 'Benefits & Legal',
        subtitle: 'Benefits and compliance information',
        fields: [
          { name: 'healthInsurance', label: 'Health Insurance', type: 'checkbox' },
          { name: '401k', label: '401(k) Retirement Plan', type: 'checkbox' },
          { name: 'stockOptions', label: 'Stock Options/Equity', type: 'checkbox' },
          { name: 'jurisdiction', label: 'Primary State of Operation', type: 'text', placeholder: 'e.g., California', required: true }
        ]
      }
    ]
  },
  'partnership-dissolution': {
    title: 'AI Partnership Dissolution Generator',
    icon: HandshakeIcon,
    steps: [
      {
        title: 'Partnership Information',
        subtitle: 'Details about the partnership being dissolved',
        fields: [
          { name: 'partnershipName', label: 'Partnership/Business Name', type: 'text', placeholder: 'Legal name of the partnership', required: true },
          { name: 'formationDate', label: 'Date Partnership Formed', type: 'text', placeholder: 'e.g., January 15, 2020', required: true },
          { name: 'businessType', label: 'Type of Business', type: 'text', placeholder: 'e.g., Consulting Firm, Restaurant, Law Practice', required: true }
        ]
      },
      {
        title: 'Partners Information',
        subtitle: 'Details about the partners',
        fields: [
          { name: 'partner1Name', label: 'Partner 1 Name', type: 'text', placeholder: 'Full legal name', required: true },
          { name: 'partner1Ownership', label: 'Partner 1 Ownership %', type: 'text', placeholder: 'e.g., 50%', required: true },
          { name: 'partner2Name', label: 'Partner 2 Name', type: 'text', placeholder: 'Full legal name', required: true },
          { name: 'partner2Ownership', label: 'Partner 2 Ownership %', type: 'text', placeholder: 'e.g., 50%', required: true }
        ]
      },
      {
        title: 'Dissolution Terms',
        subtitle: 'How assets and liabilities will be handled',
        fields: [
          { name: 'dissolutionReason', label: 'Reason for Dissolution', type: 'select', options: [
            { value: '', label: 'Select reason...' },
            { value: 'mutual', label: 'Mutual Agreement' },
            { value: 'retirement', label: 'Partner Retirement' },
            { value: 'dispute', label: 'Partner Dispute' },
            { value: 'business-closure', label: 'Business Closure' },
            { value: 'other', label: 'Other' }
          ], required: true },
          { name: 'assetDivision', label: 'Asset Division Method', type: 'select', options: [
            { value: 'ownership', label: 'Based on Ownership Percentage' },
            { value: 'equal', label: 'Equal Division' },
            { value: 'negotiated', label: 'Negotiated/Custom' }
          ], required: true },
          { name: 'jurisdiction', label: 'State/Jurisdiction', type: 'text', placeholder: 'e.g., California', required: true }
        ]
      }
    ]
  },
  'freelance-contract': {
    title: 'AI Freelance Contract Generator',
    icon: Briefcase,
    steps: [
      {
        title: 'Parties Information',
        subtitle: 'Client and consultant details',
        fields: [
          { name: 'clientName', label: 'Client Name/Company', type: 'text', placeholder: 'Full legal name or company name', required: true },
          { name: 'consultantName', label: 'Consultant/Freelancer Name', type: 'text', placeholder: 'Your full legal name or business name', required: true },
          { name: 'consultantType', label: 'Type of Services', type: 'select', options: [
            { value: '', label: 'Select service type...' },
            { value: 'software', label: 'Software Development' },
            { value: 'design', label: 'Design/Creative' },
            { value: 'marketing', label: 'Marketing/Consulting' },
            { value: 'writing', label: 'Writing/Content' },
            { value: 'legal', label: 'Legal Services' },
            { value: 'other', label: 'Other Professional Services' }
          ], required: true }
        ]
      },
      {
        title: 'Project Details',
        subtitle: 'Scope and deliverables',
        fields: [
          { name: 'projectDescription', label: 'Project Description', type: 'textarea', placeholder: 'Brief description of the work to be performed', required: true },
          { name: 'deliverables', label: 'Key Deliverables', type: 'textarea', placeholder: 'List main deliverables (e.g., Website design, 10 blog posts, Mobile app)', required: true },
          { name: 'timeline', label: 'Project Timeline', type: 'text', placeholder: 'e.g., 3 months, 6 weeks', required: true }
        ]
      },
      {
        title: 'Payment Terms',
        subtitle: 'Compensation and payment details',
        fields: [
          { name: 'paymentType', label: 'Payment Structure', type: 'select', options: [
            { value: 'hourly', label: 'Hourly Rate' },
            { value: 'fixed', label: 'Fixed Project Fee' },
            { value: 'retainer', label: 'Monthly Retainer' },
            { value: 'milestone', label: 'Milestone-based' }
          ], required: true },
          { name: 'rate', label: 'Rate/Amount', type: 'text', placeholder: 'e.g., $150/hour or $5,000 total', required: true },
          { name: 'paymentTerms', label: 'Payment Terms', type: 'select', options: [
            { value: 'upfront', label: '100% Upfront' },
            { value: '50-50', label: '50% Upfront, 50% on Completion' },
            { value: 'net30', label: 'Net 30 Days' },
            { value: 'milestone', label: 'Per Milestone' }
          ], required: true },
          { name: 'jurisdiction', label: 'Governing Law (State)', type: 'text', placeholder: 'e.g., California', required: true }
        ]
      }
    ]
  }
};

export default function DocumentQuestionnaire({ documentType, onClose, onComplete }: DocumentQuestionnaireProps) {
  const config = documentConfigs[documentType];
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({
    infoTypes: []
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const IconComponent = config.icon;
  const totalSteps = config.steps.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const handleInputChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleMultiSelect = (name: string, value: string) => {
    setFormData(prev => {
      const current = prev[name] || [];
      if (current.includes(value)) {
        return { ...prev, [name]: current.filter((v: string) => v !== value) };
      }
      return { ...prev, [name]: [...current, value] };
    });
  };

  const validateStep = () => {
    const currentFields = config.steps[currentStep].fields;
    const newErrors: Record<string, string> = {};
    
    currentFields.forEach(field => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = 'This field is required';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (currentStep < totalSteps - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        onComplete(formData, documentType);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const renderField = (field: any) => {
    switch (field.type) {
      case 'text':
        return (
          <div key={field.name} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <input
              type="text"
              value={formData[field.name] || ''}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors[field.name] ? 'border-red-500' : 'border-gray-300'}`}
            />
            {field.hint && <p className="text-xs text-gray-500">{field.hint}</p>}
            {errors[field.name] && <p className="text-xs text-red-500">{errors[field.name]}</p>}
          </div>
        );
      
      case 'textarea':
        return (
          <div key={field.name} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <textarea
              value={formData[field.name] || ''}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              rows={3}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors[field.name] ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors[field.name] && <p className="text-xs text-red-500">{errors[field.name]}</p>}
          </div>
        );

      case 'select':
        return (
          <div key={field.name} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <select
              value={formData[field.name] || ''}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors[field.name] ? 'border-red-500' : 'border-gray-300'}`}
            >
              {field.options.map((opt: any) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            {field.hint && <p className="text-xs text-gray-500">{field.hint}</p>}
            {errors[field.name] && <p className="text-xs text-red-500">{errors[field.name]}</p>}
          </div>
        );

      case 'checkbox':
        return (
          <div key={field.name} className="flex items-center gap-3 py-2">
            <input
              type="checkbox"
              id={field.name}
              checked={formData[field.name] || false}
              onChange={(e) => handleInputChange(field.name, e.target.checked)}
              className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label htmlFor={field.name} className="text-sm text-gray-700">{field.label}</label>
          </div>
        );

      case 'multiselect':
        return (
          <div key={field.name} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">{field.label}</label>
            <div className="space-y-2">
              {field.options.map((opt: any) => (
                <div
                  key={opt.value}
                  onClick={() => handleMultiSelect(field.name, opt.value)}
                  className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all ${
                    (formData[field.name] || []).includes(opt.value)
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-indigo-300'
                  }`}
                >
                  <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                    (formData[field.name] || []).includes(opt.value)
                      ? 'bg-indigo-700 border-indigo-600'
                      : 'border-gray-300'
                  }`}>
                    {(formData[field.name] || []).includes(opt.value) && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <span className="text-sm">{opt.label}</span>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-700 to-indigo-900 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <IconComponent className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">{config.title}</h2>
                <p className="text-sm text-white/80">Answer a few questions to create your custom document</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Progress */}
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Step {currentStep + 1} of {totalSteps}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[50vh]">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900">{config.steps[currentStep].title}</h3>
            <p className="text-sm text-gray-600">{config.steps[currentStep].subtitle}</p>
          </div>

          <div className="space-y-4">
            {config.steps[currentStep].fields.map(renderField)}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50 flex justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </Button>
          <Button
            onClick={handleNext}
            className="bg-gradient-to-r from-indigo-700 to-indigo-900 hover:from-indigo-700 hover:to-blue-700 flex items-center gap-2"
          >
            {currentStep === totalSteps - 1 ? (
              <>
                <Sparkles className="w-4 h-4" />
                Generate Document
              </>
            ) : (
              <>
                Next
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
