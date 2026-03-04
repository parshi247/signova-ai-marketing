import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, FileText, Check } from 'lucide-react';

interface NDAQuestionnaireProps {
  onClose: () => void;
  onComplete: (data: NDAFormData) => void;
}

interface NDAFormData {
  disclosingParty: string;
  receivingParty: string;
  isMutual: boolean;
  infoTypes: string[];
  purpose: string;
  duration: string;
  jurisdiction: string;
  returnMaterials: string;
}

const NDAQuestionnaire: React.FC<NDAQuestionnaireProps> = ({ onClose, onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<NDAFormData>({
    disclosingParty: '',
    receivingParty: '',
    isMutual: false,
    infoTypes: [],
    purpose: '',
    duration: '2',
    jurisdiction: 'California',
    returnMaterials: 'upon-request'
  });

  const totalSteps = 3;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      onComplete(formData);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const updateFormData = (field: keyof NDAFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleInfoType = (type: string) => {
    const current = formData.infoTypes;
    if (current.includes(type)) {
      updateFormData('infoTypes', current.filter(t => t !== type));
    } else {
      updateFormData('infoTypes', [...current, type]);
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.disclosingParty.trim() !== '' && formData.receivingParty.trim() !== '';
      case 2:
        return formData.infoTypes.length > 0 && formData.purpose.trim() !== '';
      case 3:
        return formData.duration !== '' && formData.jurisdiction.trim() !== '';
      default:
        return true;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-indigo-700 to-indigo-900 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">AI NDA Generator</h2>
                <p className="text-indigo-100 text-sm">Answer a few questions to create your custom NDA</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Step {step} of {totalSteps}</span>
              <span className="text-sm font-medium">{Math.round((step / totalSteps) * 100)}%</span>
            </div>
            <div className="w-full bg-indigo-500/30 rounded-full h-2">
              <div
                className="bg-white h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Step 1: Basic Information */}
          {step === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Basic Information</h3>
                <p className="text-gray-600">Let's start with the parties involved in this NDA</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Disclosing Party <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.disclosingParty}
                  onChange={(e) => updateFormData('disclosingParty', e.target.value)}
                  placeholder="Company or person sharing confidential information"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <p className="text-sm text-gray-500 mt-1">The party who will be sharing confidential information</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Receiving Party <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.receivingParty}
                  onChange={(e) => updateFormData('receivingParty', e.target.value)}
                  placeholder="Company or person receiving confidential information"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <p className="text-sm text-gray-500 mt-1">The party who will be receiving confidential information</p>
              </div>

              <div className="flex items-center gap-3 p-4 bg-indigo-50 rounded-lg">
                <input
                  type="checkbox"
                  id="mutual"
                  checked={formData.isMutual}
                  onChange={(e) => updateFormData('isMutual', e.target.checked)}
                  className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                />
                <label htmlFor="mutual" className="text-sm font-medium text-gray-700 cursor-pointer">
                  This is a mutual NDA (both parties will share confidential information)
                </label>
              </div>
            </div>
          )}

          {/* Step 2: Confidential Information */}
          {step === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Confidential Information</h3>
                <p className="text-gray-600">What type of information will be shared?</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select all that apply <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'business', label: 'Business strategies and plans' },
                    { value: 'financial', label: 'Financial information' },
                    { value: 'technical', label: 'Technical data and trade secrets' },
                    { value: 'customer', label: 'Customer/client information' },
                    { value: 'product', label: 'Product designs and specifications' }
                  ].map((option) => (
                    <div
                      key={option.value}
                      onClick={() => toggleInfoType(option.value)}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.infoTypes.includes(option.value)
                          ? 'border-indigo-600 bg-indigo-50'
                          : 'border-gray-200 hover:border-indigo-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">{option.label}</span>
                        {formData.infoTypes.includes(option.value) && (
                          <Check className="w-5 h-5 text-indigo-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Purpose of Disclosure <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.purpose}
                  onChange={(e) => updateFormData('purpose', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Select purpose...</option>
                  <option value="partnership">Business partnership discussion</option>
                  <option value="employment">Employment/contractor relationship</option>
                  <option value="acquisition">Sale or acquisition discussion</option>
                  <option value="investment">Investment opportunity</option>
                  <option value="other">Other business purpose</option>
                </select>
                <p className="text-sm text-gray-500 mt-1">Why is this information being shared?</p>
              </div>
            </div>
          )}

          {/* Step 3: Legal Terms */}
          {step === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Legal Terms</h3>
                <p className="text-gray-600">Define the terms of confidentiality</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration of Confidentiality Obligation <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { value: '1', label: '1 Year' },
                    { value: '2', label: '2 Years' },
                    { value: '3', label: '3 Years' },
                    { value: '5', label: '5 Years' },
                    { value: 'indefinite', label: 'Indefinite' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => updateFormData('duration', option.value)}
                      className={`p-3 border-2 rounded-lg font-medium transition-all ${
                        formData.duration === option.value
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                          : 'border-gray-200 text-gray-700 hover:border-indigo-300'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-2">How long must the information remain confidential?</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Governing Law / Jurisdiction <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.jurisdiction}
                  onChange={(e) => updateFormData('jurisdiction', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="California">California</option>
                  <option value="New York">New York</option>
                  <option value="Texas">Texas</option>
                  <option value="Florida">Florida</option>
                  <option value="Delaware">Delaware</option>
                  <option value="Illinois">Illinois</option>
                  <option value="Other">Other US State</option>
                </select>
                <p className="text-sm text-gray-500 mt-1">Which state's laws will govern this agreement?</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Return of Confidential Materials
                </label>
                <select
                  value={formData.returnMaterials}
                  onChange={(e) => updateFormData('returnMaterials', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="upon-request">Required upon request</option>
                  <option value="upon-termination">Required upon termination</option>
                  <option value="not-required">Not required</option>
                </select>
                <p className="text-sm text-gray-500 mt-1">When must materials be returned or destroyed?</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 px-8 py-4 rounded-b-2xl border-t border-gray-200">
          <div className="flex justify-between items-center">
            <button
              onClick={handleBack}
              disabled={step === 1}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
              Back
            </button>

            <button
              onClick={handleNext}
              disabled={!isStepValid()}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-700 to-indigo-900 text-white rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {step === totalSteps ? 'Generate NDA' : 'Next'}
              {step < totalSteps && <ChevronRight className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default NDAQuestionnaire;
