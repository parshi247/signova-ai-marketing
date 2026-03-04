/**
 * Global Multi-Jurisdiction Onboarding Component
 * 
 * Supports users from any country with dynamic jurisdiction selection
 * and multi-jurisdiction support for cross-border professionals
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Check, Sparkles } from 'lucide-react';

// Types
interface OnboardingData {
  role: string;
  industry: string;
  specialty?: string;
  countries: string[];
  jurisdictions: string[];
  companySize: string;
  companyLogoUrl?: string;
  useCases: string[];
}

// Country and jurisdiction data
const COUNTRIES = [
  { code: 'US', name: 'United States', flag: '🇺🇸', hasStates: true },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', hasProvinces: true },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', hasRegions: true },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', hasStates: true },
  { code: 'NZ', name: 'New Zealand', flag: '🇳🇿', hasRegions: false },
  { code: 'IE', name: 'Ireland', flag: '🇮🇪', hasRegions: false },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬', hasRegions: false },
  { code: 'HK', name: 'Hong Kong', flag: '🇭🇰', hasRegions: false },
  { code: 'IN', name: 'India', flag: '🇮🇳', hasStates: true },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', hasStates: true },
  { code: 'FR', name: 'France', flag: '🇫🇷', hasRegions: true },
  { code: 'ES', name: 'Spain', flag: '🇪🇸', hasRegions: true },
  { code: 'IT', name: 'Italy', flag: '🇮🇹', hasRegions: true },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱', hasRegions: false },
  { code: 'BE', name: 'Belgium', flag: '🇧🇪', hasRegions: true },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭', hasCantons: true },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽', hasStates: true },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷', hasStates: true },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷', hasProvinces: true },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦', hasProvinces: true },
  { code: 'OTHER', name: 'Other', flag: '🌍', hasRegions: false },
];

const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
  'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
  'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
  'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
  'Wisconsin', 'Wyoming', 'District of Columbia',
];

const CANADA_PROVINCES = [
  'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick', 'Newfoundland and Labrador',
  'Northwest Territories', 'Nova Scotia', 'Nunavut', 'Ontario', 'Prince Edward Island',
  'Quebec', 'Saskatchewan', 'Yukon',
];

const UK_REGIONS = [
  'England & Wales',
  'Scotland',
  'Northern Ireland',
];

const AUSTRALIA_STATES = [
  'New South Wales', 'Victoria', 'Queensland', 'South Australia', 'Western Australia',
  'Tasmania', 'Northern Territory', 'Australian Capital Territory',
];

interface GlobalOnboardingProps {
  onComplete: (data: OnboardingData) => void;
}

export default function GlobalOnboarding({ onComplete }: GlobalOnboardingProps) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Partial<OnboardingData>>({
    countries: [],
    jurisdictions: [],
    useCases: [],
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleCountrySelect = (countryCode: string) => {
    setData({ ...data, countries: [countryCode] });
    handleNext();
  };

  const handleJurisdictionSelect = (jurisdiction: string) => {
    const current = data.jurisdictions || [];
    if (current.includes(jurisdiction)) {
      setData({ ...data, jurisdictions: current.filter(j => j !== jurisdiction) });
    } else {
      setData({ ...data, jurisdictions: [...current, jurisdiction] });
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleComplete = async () => {
    let logoUrl = data.companyLogoUrl;
    
    // Upload logo if provided
    if (logoFile) {
      const formData = new FormData();
      formData.append('logo', logoFile);
      
      const response = await fetch('/api/user/upload-logo', {
        method: 'POST',
        body: formData,
      });
      
      const { url } = await response.json();
      logoUrl = url;
    }

    onComplete({
      role: data.role!,
      industry: data.industry!,
      specialty: data.specialty,
      countries: data.countries!,
      jurisdictions: data.jurisdictions!,
      companySize: data.companySize!,
      companyLogoUrl: logoUrl,
      useCases: data.useCases!,
    });
  };

  const getJurisdictions = () => {
    const country = COUNTRIES.find(c => c.code === data.countries?.[0]);
    if (!country) return [];

    if (country.code === 'US') return US_STATES;
    if (country.code === 'CA') return CANADA_PROVINCES;
    if (country.code === 'GB') return UK_REGIONS;
    if (country.code === 'AU') return AUSTRALIA_STATES;
    
    return [];
  };

  const steps = [
    // Step 0: Role
    {
      title: "What's your role?",
      subtitle: "Help us personalize your experience",
      options: [
        { value: 'business_owner', label: 'Business Owner', emoji: '👔' },
        { value: 'legal', label: 'Legal Professional', emoji: '⚖️' },
        { value: 'real_estate', label: 'Real Estate', emoji: '🏠' },
        { value: 'hr', label: 'Human Resources', emoji: '👥' },
        { value: 'sales', label: 'Sales & Business Development', emoji: '📊' },
        { value: 'operations', label: 'Operations', emoji: '🔧' },
        { value: 'other', label: 'Other', emoji: '📝' },
      ],
      onSelect: (value: string) => {
        setData({ ...data, role: value });
        handleNext();
      },
    },

    // Step 1: Industry
    {
      title: "What industry are you in?",
      subtitle: "We'll show you relevant document types",
      options: [
        { value: 'legal', label: 'Legal Services', emoji: '⚖️' },
        { value: 'real_estate', label: 'Real Estate', emoji: '🏠' },
        { value: 'healthcare', label: 'Healthcare', emoji: '🏥' },
        { value: 'finance', label: 'Finance & Banking', emoji: '💰' },
        { value: 'technology', label: 'Technology', emoji: '💻' },
        { value: 'retail', label: 'Retail & E-commerce', emoji: '🛍️' },
        { value: 'education', label: 'Education', emoji: '🎓' },
        { value: 'construction', label: 'Construction', emoji: '🏗️' },
        { value: 'other', label: 'Other', emoji: '📦' },
      ],
      onSelect: (value: string) => {
        setData({ ...data, industry: value });
        handleNext();
      },
    },

    // Step 2: Specialty (conditional)
    {
      title: "What's your specialty?",
      subtitle: "Optional - helps us show the most relevant forms",
      skip: true,
      options: data.industry === 'legal' ? [
        { value: 'family_law', label: 'Family Law', emoji: '👨‍👩‍👧' },
        { value: 'personal_injury', label: 'Personal Injury', emoji: '🚑' },
        { value: 'criminal_defense', label: 'Criminal Defense', emoji: '⚖️' },
        { value: 'corporate', label: 'Corporate Law', emoji: '🏢' },
        { value: 'real_estate_law', label: 'Real Estate Law', emoji: '🏠' },
        { value: 'immigration', label: 'Immigration', emoji: '✈️' },
        { value: 'estate_planning', label: 'Estate Planning', emoji: '📜' },
        { value: 'general_practice', label: 'General Practice', emoji: '⚖️' },
      ] : data.industry === 'real_estate' ? [
        { value: 'residential', label: 'Residential', emoji: '🏡' },
        { value: 'commercial', label: 'Commercial', emoji: '🏢' },
        { value: 'property_management', label: 'Property Management', emoji: '🔑' },
        { value: 'development', label: 'Development', emoji: '🏗️' },
      ] : [],
      onSelect: (value: string) => {
        setData({ ...data, specialty: value });
        handleNext();
      },
    },

    // Step 3: Country
    {
      title: "Where do you operate?",
      subtitle: "Select your primary country",
      render: () => (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {COUNTRIES.map(country => (
            <motion.button
              key={country.code}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCountrySelect(country.code)}
              className="p-6 bg-white rounded-xl border-2 border-gray-200 hover:border-indigo-500 transition-all text-center"
            >
              <div className="text-4xl mb-2">{country.flag}</div>
              <div className="font-medium text-gray-900">{country.name}</div>
            </motion.button>
          ))}
        </div>
      ),
    },

    // Step 4: Jurisdiction (conditional)
    {
      title: `Select your ${data.countries?.[0] === 'US' ? 'state' : data.countries?.[0] === 'CA' ? 'province' : 'region'}`,
      subtitle: "You can select multiple if you work across jurisdictions",
      render: () => {
        const jurisdictions = getJurisdictions();
        if (jurisdictions.length === 0) {
          handleNext();
          return null;
        }

        return (
          <div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-5xl mx-auto mb-8">
              {jurisdictions.map(jurisdiction => {
                const isSelected = data.jurisdictions?.includes(jurisdiction);
                return (
                  <motion.button
                    key={jurisdiction}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleJurisdictionSelect(jurisdiction)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      isSelected
                        ? 'bg-indigo-100 border-indigo-500 text-indigo-900'
                        : 'bg-white border-gray-200 hover:border-indigo-300'
                    }`}
                  >
                    <div className="font-medium text-sm">{jurisdiction}</div>
                    {isSelected && (
                      <Check className="w-4 h-4 mx-auto mt-2 text-indigo-600" />
                    )}
                  </motion.button>
                );
              })}
            </div>
            
            <button
              onClick={handleNext}
              disabled={!data.jurisdictions?.length}
              className="px-8 py-3 bg-gradient-to-r from-indigo-700 to-indigo-900 text-white rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        );
      },
    },

    // Step 5: Team Size
    {
      title: "How big is your team?",
      subtitle: "Helps us recommend the right plan",
      options: [
        { value: 'solo', label: 'Just me', emoji: '👤' },
        { value: '2-10', label: '2-10 people', emoji: '👥' },
        { value: '11-50', label: '11-50 people', emoji: '👥👥' },
        { value: '51-200', label: '51-200 people', emoji: '🏢' },
        { value: '201+', label: '201+ people', emoji: '🏢🏢' },
      ],
      onSelect: (value: string) => {
        setData({ ...data, companySize: value });
        handleNext();
      },
    },

    // Step 6: Logo Upload
    {
      title: "Upload your company logo",
      subtitle: "Optional - we'll add it to your generated documents",
      render: () => (
        <div className="max-w-md mx-auto">
          <div
            className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-indigo-500 transition-all cursor-pointer"
            onClick={() => document.getElementById('logo-upload')?.click()}
          >
            {logoPreview ? (
              <div>
                <img src={logoPreview} alt="Logo preview" className="max-h-32 mx-auto mb-4" />
                <p className="text-sm text-gray-600">Click to change</p>
              </div>
            ) : (
              <div>
                <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-medium text-gray-900 mb-2">
                  Drop your logo here or click to browse
                </p>
                <p className="text-sm text-gray-500">PNG, JPG, or SVG (max 5MB)</p>
              </div>
            )}
          </div>
          <input
            id="logo-upload"
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            className="hidden"
          />
          
          <div className="flex gap-4 mt-8">
            <button
              onClick={handleNext}
              className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-all"
            >
              Skip
            </button>
            <button
              onClick={handleNext}
              disabled={!logoFile}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-700 to-indigo-900 text-white rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        </div>
      ),
    },

    // Step 7: Use Cases
    {
      title: "What will you create most?",
      subtitle: "Select all that apply",
      multiSelect: true,
      options: [
        { value: 'contracts', label: 'Contracts & Agreements', emoji: '📄' },
        { value: 'hr_docs', label: 'HR Documents', emoji: '👥' },
        { value: 'sales_docs', label: 'Sales Documents', emoji: '💼' },
        { value: 'ndas', label: 'NDAs & Confidentiality', emoji: '🔒' },
        { value: 'invoices', label: 'Invoices & Billing', emoji: '💵' },
        { value: 'legal_forms', label: 'Legal Forms', emoji: '⚖️' },
        { value: 'real_estate', label: 'Real Estate Documents', emoji: '🏠' },
        { value: 'other', label: 'Other', emoji: '📋' },
      ],
      onSelect: (value: string) => {
        const current = data.useCases || [];
        if (current.includes(value)) {
          setData({ ...data, useCases: current.filter(v => v !== value) });
        } else {
          setData({ ...data, useCases: [...current, value] });
        }
      },
      onContinue: handleComplete,
    },
  ];

  const currentStep = steps[step];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-700 via-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        {/* Progress */}
        <div className="mb-12">
          <div className="flex justify-center gap-2 mb-4">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all ${
                  i === step
                    ? 'w-8 bg-indigo-700'
                    : i < step
                    ? 'w-2 bg-indigo-500'
                    : 'w-2 bg-gray-300'
                }`}
              />
            ))}
          </div>
          <p className="text-center text-sm text-gray-500">
            Step {step + 1} of {steps.length}
          </p>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {currentStep.title}
            </h2>
            <p className="text-lg text-gray-600 mb-12">
              {currentStep.subtitle}
            </p>

            {currentStep.render ? (
              currentStep.render()
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
                {currentStep.options?.map(option => {
                  const isSelected = currentStep.multiSelect
                    ? data.useCases?.includes(option.value)
                    : false;

                  return (
                    <motion.button
                      key={option.value}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        if (currentStep.multiSelect) {
                          currentStep.onSelect?.(option.value);
                        } else {
                          currentStep.onSelect?.(option.value);
                        }
                      }}
                      className={`p-6 rounded-xl border-2 transition-all ${
                        isSelected
                          ? 'bg-indigo-100 border-indigo-500'
                          : 'bg-white border-gray-200 hover:border-indigo-500'
                      }`}
                    >
                      <div className="text-4xl mb-3">{option.emoji}</div>
                      <div className="font-medium text-gray-900">{option.label}</div>
                      {isSelected && (
                        <Check className="w-5 h-5 mx-auto mt-2 text-indigo-600" />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            )}

            {currentStep.multiSelect && (
              <button
                onClick={currentStep.onContinue}
                disabled={!data.useCases?.length}
                className="mt-8 px-8 py-3 bg-gradient-to-r from-indigo-700 to-indigo-900 text-white rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Complete Setup <Sparkles className="inline w-5 h-5 ml-2" />
              </button>
            )}

            {currentStep.skip && (
              <button
                onClick={handleNext}
                className="mt-4 text-gray-500 hover:text-gray-700 underline"
              >
                Skip this step
              </button>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
