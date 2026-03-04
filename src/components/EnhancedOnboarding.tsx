/**
 * Enhanced Global Onboarding Component
 * 
 * Features:
 * - Auto-detect user location via IP geolocation
 * - Save location as default option
 * - Company profile creation during onboarding
 * - Signature profile setup
 * - AI learning initialization
 * - Tier-based feature visibility
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, Check, Sparkles, MapPin, Building2, Pen, 
  Globe, ChevronRight, Loader2, AlertCircle, Crown
} from 'lucide-react';

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
  // New fields
  detectedLocation?: DetectedLocation;
  saveLocationAsDefault: boolean;
  companyProfile?: CompanyProfile;
  signatureProfile?: SignatureProfile;
}

interface DetectedLocation {
  country: string;
  countryName: string;
  region: string;
  regionCode: string;
  city?: string;
  timezone?: string;
}

interface CompanyProfile {
  companyName: string;
  companyType?: string;
  industry?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country: string;
  };
  phone?: string;
  email?: string;
  website?: string;
  logoUrl?: string;
}

interface SignatureProfile {
  fullName: string;
  initials?: string;
  signatureStyle: 'typed' | 'drawn' | 'uploaded';
  signatureData?: string;
}

interface TierLimits {
  maxCompanyProfiles: number;
  maxSignatureProfiles: number;
  maxTemplates: number;
}

// Country data with regions
const COUNTRIES_WITH_REGIONS: Record<string, { name: string; regions: { code: string; name: string }[] }> = {
  US: {
    name: 'United States',
    regions: [
      { code: 'AL', name: 'Alabama' }, { code: 'AK', name: 'Alaska' },
      { code: 'AZ', name: 'Arizona' }, { code: 'AR', name: 'Arkansas' },
      { code: 'CA', name: 'California' }, { code: 'CO', name: 'Colorado' },
      { code: 'CT', name: 'Connecticut' }, { code: 'DE', name: 'Delaware' },
      { code: 'FL', name: 'Florida' }, { code: 'GA', name: 'Georgia' },
      { code: 'HI', name: 'Hawaii' }, { code: 'ID', name: 'Idaho' },
      { code: 'IL', name: 'Illinois' }, { code: 'IN', name: 'Indiana' },
      { code: 'IA', name: 'Iowa' }, { code: 'KS', name: 'Kansas' },
      { code: 'KY', name: 'Kentucky' }, { code: 'LA', name: 'Louisiana' },
      { code: 'ME', name: 'Maine' }, { code: 'MD', name: 'Maryland' },
      { code: 'MA', name: 'Massachusetts' }, { code: 'MI', name: 'Michigan' },
      { code: 'MN', name: 'Minnesota' }, { code: 'MS', name: 'Mississippi' },
      { code: 'MO', name: 'Missouri' }, { code: 'MT', name: 'Montana' },
      { code: 'NE', name: 'Nebraska' }, { code: 'NV', name: 'Nevada' },
      { code: 'NH', name: 'New Hampshire' }, { code: 'NJ', name: 'New Jersey' },
      { code: 'NM', name: 'New Mexico' }, { code: 'NY', name: 'New York' },
      { code: 'NC', name: 'North Carolina' }, { code: 'ND', name: 'North Dakota' },
      { code: 'OH', name: 'Ohio' }, { code: 'OK', name: 'Oklahoma' },
      { code: 'OR', name: 'Oregon' }, { code: 'PA', name: 'Pennsylvania' },
      { code: 'RI', name: 'Rhode Island' }, { code: 'SC', name: 'South Carolina' },
      { code: 'SD', name: 'South Dakota' }, { code: 'TN', name: 'Tennessee' },
      { code: 'TX', name: 'Texas' }, { code: 'UT', name: 'Utah' },
      { code: 'VT', name: 'Vermont' }, { code: 'VA', name: 'Virginia' },
      { code: 'WA', name: 'Washington' }, { code: 'WV', name: 'West Virginia' },
      { code: 'WI', name: 'Wisconsin' }, { code: 'WY', name: 'Wyoming' },
      { code: 'DC', name: 'District of Columbia' }
    ]
  },
  CA: {
    name: 'Canada',
    regions: [
      { code: 'AB', name: 'Alberta' }, { code: 'BC', name: 'British Columbia' },
      { code: 'MB', name: 'Manitoba' }, { code: 'NB', name: 'New Brunswick' },
      { code: 'NL', name: 'Newfoundland and Labrador' }, { code: 'NS', name: 'Nova Scotia' },
      { code: 'NT', name: 'Northwest Territories' }, { code: 'NU', name: 'Nunavut' },
      { code: 'ON', name: 'Ontario' }, { code: 'PE', name: 'Prince Edward Island' },
      { code: 'QC', name: 'Quebec' }, { code: 'SK', name: 'Saskatchewan' },
      { code: 'YT', name: 'Yukon' }
    ]
  },
  GB: {
    name: 'United Kingdom',
    regions: [
      { code: 'ENG', name: 'England' }, { code: 'SCT', name: 'Scotland' },
      { code: 'WLS', name: 'Wales' }, { code: 'NIR', name: 'Northern Ireland' }
    ]
  },
  AU: {
    name: 'Australia',
    regions: [
      { code: 'NSW', name: 'New South Wales' }, { code: 'VIC', name: 'Victoria' },
      { code: 'QLD', name: 'Queensland' }, { code: 'WA', name: 'Western Australia' },
      { code: 'SA', name: 'South Australia' }, { code: 'TAS', name: 'Tasmania' },
      { code: 'ACT', name: 'Australian Capital Territory' }, { code: 'NT', name: 'Northern Territory' }
    ]
  },
  // Add more countries as needed...
};

// All Stripe-supported countries
const ALL_COUNTRIES = [
  { code: 'US', name: 'United States' }, { code: 'CA', name: 'Canada' },
  { code: 'GB', name: 'United Kingdom' }, { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' }, { code: 'FR', name: 'France' },
  { code: 'IT', name: 'Italy' }, { code: 'ES', name: 'Spain' },
  { code: 'NL', name: 'Netherlands' }, { code: 'BE', name: 'Belgium' },
  { code: 'AT', name: 'Austria' }, { code: 'CH', name: 'Switzerland' },
  { code: 'IE', name: 'Ireland' }, { code: 'PT', name: 'Portugal' },
  { code: 'SE', name: 'Sweden' }, { code: 'NO', name: 'Norway' },
  { code: 'DK', name: 'Denmark' }, { code: 'FI', name: 'Finland' },
  { code: 'PL', name: 'Poland' }, { code: 'CZ', name: 'Czech Republic' },
  { code: 'NZ', name: 'New Zealand' }, { code: 'SG', name: 'Singapore' },
  { code: 'HK', name: 'Hong Kong' }, { code: 'JP', name: 'Japan' },
  { code: 'MX', name: 'Mexico' }, { code: 'BR', name: 'Brazil' },
  { code: 'IN', name: 'India' }, { code: 'AE', name: 'United Arab Emirates' },
  // ... add all 135+ Stripe countries
].sort((a, b) => a.name.localeCompare(b.name));

interface EnhancedOnboardingProps {
  onComplete: (data: OnboardingData) => Promise<void>;
  userTier?: string;
  tierLimits?: TierLimits;
}

export default function EnhancedOnboarding({ 
  onComplete, 
  userTier = 'free',
  tierLimits = { maxCompanyProfiles: 1, maxSignatureProfiles: 1, maxTemplates: 3 }
}: EnhancedOnboardingProps) {
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState(true);
  const [locationError, setLocationError] = useState<string | null>(null);
  
  const [data, setData] = useState<OnboardingData>({
    role: '',
    industry: '',
    specialty: '',
    countries: [],
    jurisdictions: [],
    companySize: '',
    companyLogoUrl: '',
    useCases: [],
    saveLocationAsDefault: true,
  });

  // Auto-detect location on mount
  useEffect(() => {
    detectLocation();
  }, []);

  const detectLocation = async () => {
    setIsDetectingLocation(true);
    setLocationError(null);
    
    try {
      const response = await fetch('/api/onboarding/detect-location');
      const result = await response.json();
      
      if (result.detected) {
        setData(prev => ({
          ...prev,
          detectedLocation: {
            country: result.country,
            countryName: result.countryName,
            region: result.region,
            regionCode: result.regionCode,
            city: result.city,
            timezone: result.timezone
          },
          countries: [result.country],
          jurisdictions: result.regionCode ? [`${result.country}-${result.regionCode}`] : []
        }));
      } else if (result.suggestedDefaults) {
        setData(prev => ({
          ...prev,
          detectedLocation: result.suggestedDefaults,
          countries: [result.suggestedDefaults.country]
        }));
      }
    } catch (error) {
      console.error('Location detection failed:', error);
      setLocationError('Could not detect your location automatically');
    } finally {
      setIsDetectingLocation(false);
    }
  };

  const steps = [
    // Step 0: Location Confirmation
    {
      title: "Let's confirm your location",
      subtitle: "We'll use this to show relevant forms and jurisdictions",
      component: (
        <LocationStep 
          data={data} 
          setData={setData}
          isDetecting={isDetectingLocation}
          error={locationError}
          onRetry={detectLocation}
        />
      )
    },
    // Step 1: Role
    {
      title: "What best describes you?",
      subtitle: "This helps us personalize your experience",
      component: (
        <RoleStep data={data} setData={setData} />
      )
    },
    // Step 2: Industry
    {
      title: "What industry are you in?",
      subtitle: "We'll show you the most relevant document types",
      component: (
        <IndustryStep data={data} setData={setData} />
      )
    },
    // Step 3: Use Cases
    {
      title: "What will you use Signova for?",
      subtitle: "Select all that apply",
      component: (
        <UseCasesStep data={data} setData={setData} />
      )
    },
    // Step 4: Company Profile (Optional)
    {
      title: "Set up your company profile",
      subtitle: "Optional - auto-fill your company info on documents",
      skip: true,
      component: (
        <CompanyProfileStep 
          data={data} 
          setData={setData}
          tierLimits={tierLimits}
          userTier={userTier}
        />
      )
    },
    // Step 5: Preferences Summary
    {
      title: "You're all set!",
      subtitle: "Review your preferences",
      component: (
        <SummaryStep data={data} />
      )
    }
  ];

  const currentStep = steps[step];
  const progress = ((step + 1) / steps.length) * 100;

  const handleNext = async () => {
    if (step === steps.length - 1) {
      // Complete onboarding
      setIsLoading(true);
      try {
        await onComplete(data);
        
        // Save preferences if user opted in
        if (data.saveLocationAsDefault && data.detectedLocation) {
          await fetch('/api/onboarding/preferences', {
            credentials: 'include',
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              defaultCountry: data.detectedLocation.country,
              defaultRegion: data.detectedLocation.regionCode,
              defaultCity: data.detectedLocation.city,
              timezone: data.detectedLocation.timezone,
              saveAsDefault: true
            })
          });
        }

        // Record AI learning event
        await fetch('/api/onboarding/ai-learn', {
          credentials: 'include',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            eventType: 'onboarding_completed',
            eventData: {
              role: data.role,
              industry: data.industry,
              countries: data.countries,
              useCases: data.useCases
            }
          })
        });

      } catch (error) {
        console.error('Onboarding completion failed:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleSkip = () => {
    if (currentStep.skip) {
      setStep(step + 1);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 0: return data.countries.length > 0;
      case 1: return data.role !== '';
      case 2: return data.industry !== '';
      case 3: return data.useCases.length > 0;
      case 4: return true; // Optional step
      case 5: return true;
      default: return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-800 to-slate-900 flex items-center justify-center p-4">
      <motion.div 
        className="w-full max-w-2xl bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Progress bar */}
        <div className="h-1 bg-white/20">
          <motion.div 
            className="h-full bg-gradient-to-r from-indigo-700 to-pink-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <div className="p-8">
          {/* Step indicator */}
          <div className="flex items-center justify-between mb-6">
            <span className="text-white/60 text-sm">
              Step {step + 1} of {steps.length}
            </span>
            {currentStep.skip && (
              <button
                onClick={handleSkip}
                className="text-white/60 hover:text-white text-sm transition-colors"
              >
                Skip this step
              </button>
            )}
          </div>

          {/* Title */}
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h2 className="text-2xl font-bold text-white mb-2">
              {currentStep.title}
            </h2>
            <p className="text-white/60 mb-8">
              {currentStep.subtitle}
            </p>
          </motion.div>

          {/* Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="min-h-[300px]"
            >
              {currentStep.component}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-white/10">
            <button
              onClick={handleBack}
              disabled={step === 0}
              className="px-6 py-3 text-white/60 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={!canProceed() || isLoading}
              className="px-8 py-3 bg-gradient-to-r from-indigo-700 to-pink-500 text-white rounded-xl font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : step === steps.length - 1 ? (
                <>
                  <Sparkles className="w-4 h-4" />
                  Complete Setup
                </>
              ) : (
                <>
                  Continue
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Location Step Component
function LocationStep({ 
  data, 
  setData, 
  isDetecting, 
  error, 
  onRetry 
}: {
  data: OnboardingData;
  setData: React.Dispatch<React.SetStateAction<OnboardingData>>;
  isDetecting: boolean;
  error: string | null;
  onRetry: () => void;
}) {
  const [showManualSelect, setShowManualSelect] = useState(false);
  const selectedCountry = COUNTRIES_WITH_REGIONS[data.countries[0]];

  if (isDetecting) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="w-12 h-12 text-indigo-400 animate-spin mb-4" />
        <p className="text-white/60">Detecting your location...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Detected location card */}
      {data.detectedLocation && !showManualSelect && (
        <motion.div 
          className="bg-white/5 rounded-2xl p-6 border border-white/10"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
              <MapPin className="w-6 h-6 text-green-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-medium mb-1">
                We detected your location
              </h3>
              <p className="text-white/80 text-lg">
                {data.detectedLocation.city && `${data.detectedLocation.city}, `}
                {data.detectedLocation.region}, {data.detectedLocation.countryName}
              </p>
              <button
                onClick={() => setShowManualSelect(true)}
                className="text-indigo-400 text-sm mt-2 hover:text-indigo-300"
              >
                Not correct? Select manually
              </button>
            </div>
            <Check className="w-6 h-6 text-green-400" />
          </div>
        </motion.div>
      )}

      {/* Error state */}
      {error && (
        <div className="bg-red-500/10 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400" />
          <span className="text-red-300">{error}</span>
          <button
            onClick={onRetry}
            className="ml-auto text-red-400 hover:text-red-300 text-sm"
          >
            Retry
          </button>
        </div>
      )}

      {/* Manual selection */}
      {(showManualSelect || !data.detectedLocation) && (
        <div className="space-y-4">
          <div>
            <label className="text-white/60 text-sm mb-2 block">Country</label>
            <select
              value={data.countries[0] || ''}
              onChange={(e) => setData(prev => ({
                ...prev,
                countries: [e.target.value],
                jurisdictions: []
              }))}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="">Select your country</option>
              {ALL_COUNTRIES.map(c => (
                <option key={c.code} value={c.code}>{c.name}</option>
              ))}
            </select>
          </div>

          {selectedCountry && (
            <div>
              <label className="text-white/60 text-sm mb-2 block">
                State/Province/Region
              </label>
              <select
                value={data.jurisdictions[0]?.split('-')[1] || ''}
                onChange={(e) => setData(prev => ({
                  ...prev,
                  jurisdictions: e.target.value 
                    ? [`${prev.countries[0]}-${e.target.value}`] 
                    : []
                }))}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="">Select your region</option>
                {selectedCountry.regions.map(r => (
                  <option key={r.code} value={r.code}>{r.name}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {/* Save as default checkbox */}
      <label className="flex items-center gap-3 cursor-pointer group">
        <div 
          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
            data.saveLocationAsDefault 
              ? 'bg-indigo-600 border-indigo-500' 
              : 'border-white/30 group-hover:border-white/50'
          }`}
          onClick={() => setData(prev => ({ 
            ...prev, 
            saveLocationAsDefault: !prev.saveLocationAsDefault 
          }))}
        >
          {data.saveLocationAsDefault && <Check className="w-3 h-3 text-white" />}
        </div>
        <span className="text-white/80">
          Save as my default location for future documents
        </span>
      </label>

      <p className="text-white/40 text-sm">
        You can change this anytime in your settings
      </p>
    </div>
  );
}

// Role Step Component
function RoleStep({ data, setData }: { data: OnboardingData; setData: React.Dispatch<React.SetStateAction<OnboardingData>> }) {
  const roles = [
    { value: 'business_owner', label: 'Business Owner', emoji: '👔' },
    { value: 'legal_professional', label: 'Legal Professional', emoji: '⚖️' },
    { value: 'real_estate', label: 'Real Estate Professional', emoji: '🏠' },
    { value: 'hr_manager', label: 'HR Manager', emoji: '👥' },
    { value: 'freelancer', label: 'Freelancer/Consultant', emoji: '💼' },
    { value: 'individual', label: 'Individual', emoji: '👤' },
    { value: 'other', label: 'Other', emoji: '✨' },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {roles.map(role => (
        <button
          key={role.value}
          onClick={() => setData(prev => ({ ...prev, role: role.value }))}
          className={`p-4 rounded-xl border-2 text-left transition-all ${
            data.role === role.value
              ? 'border-indigo-500 bg-indigo-600/20'
              : 'border-white/10 hover:border-white/30 bg-white/5'
          }`}
        >
          <span className="text-2xl mb-2 block">{role.emoji}</span>
          <span className="text-white font-medium">{role.label}</span>
        </button>
      ))}
    </div>
  );
}

// Industry Step Component
function IndustryStep({ data, setData }: { data: OnboardingData; setData: React.Dispatch<React.SetStateAction<OnboardingData>> }) {
  const industries = [
    { value: 'legal', label: 'Legal Services', emoji: '⚖️' },
    { value: 'real_estate', label: 'Real Estate', emoji: '🏠' },
    { value: 'finance', label: 'Finance & Banking', emoji: '💰' },
    { value: 'healthcare', label: 'Healthcare', emoji: '🏥' },
    { value: 'technology', label: 'Technology', emoji: '💻' },
    { value: 'construction', label: 'Construction', emoji: '🏗️' },
    { value: 'retail', label: 'Retail & E-commerce', emoji: '🛒' },
    { value: 'education', label: 'Education', emoji: '📚' },
    { value: 'government', label: 'Government', emoji: '🏛️' },
    { value: 'other', label: 'Other', emoji: '✨' },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {industries.map(industry => (
        <button
          key={industry.value}
          onClick={() => setData(prev => ({ ...prev, industry: industry.value }))}
          className={`p-4 rounded-xl border-2 text-left transition-all ${
            data.industry === industry.value
              ? 'border-indigo-500 bg-indigo-600/20'
              : 'border-white/10 hover:border-white/30 bg-white/5'
          }`}
        >
          <span className="text-2xl mb-2 block">{industry.emoji}</span>
          <span className="text-white font-medium">{industry.label}</span>
        </button>
      ))}
    </div>
  );
}

// Use Cases Step Component
function UseCasesStep({ data, setData }: { data: OnboardingData; setData: React.Dispatch<React.SetStateAction<OnboardingData>> }) {
  const useCases = [
    { value: 'contracts', label: 'Contracts & Agreements', emoji: '📝' },
    { value: 'nda', label: 'NDAs & Confidentiality', emoji: '🤐' },
    { value: 'employment', label: 'Employment Documents', emoji: '👥' },
    { value: 'real_estate', label: 'Real Estate Forms', emoji: '🏠' },
    { value: 'legal_forms', label: 'Legal Forms', emoji: '⚖️' },
    { value: 'government', label: 'Government Forms', emoji: '🏛️' },
    { value: 'financial', label: 'Financial Documents', emoji: '💰' },
    { value: 'personal', label: 'Personal Documents', emoji: '👤' },
  ];

  const toggleUseCase = (value: string) => {
    setData(prev => ({
      ...prev,
      useCases: prev.useCases.includes(value)
        ? prev.useCases.filter(u => u !== value)
        : [...prev.useCases, value]
    }));
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      {useCases.map(useCase => (
        <button
          key={useCase.value}
          onClick={() => toggleUseCase(useCase.value)}
          className={`p-4 rounded-xl border-2 text-left transition-all ${
            data.useCases.includes(useCase.value)
              ? 'border-indigo-500 bg-indigo-600/20'
              : 'border-white/10 hover:border-white/30 bg-white/5'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-2xl">{useCase.emoji}</span>
            {data.useCases.includes(useCase.value) && (
              <Check className="w-5 h-5 text-indigo-400" />
            )}
          </div>
          <span className="text-white font-medium mt-2 block">{useCase.label}</span>
        </button>
      ))}
    </div>
  );
}

// Company Profile Step Component
function CompanyProfileStep({ 
  data, 
  setData, 
  tierLimits,
  userTier 
}: { 
  data: OnboardingData; 
  setData: React.Dispatch<React.SetStateAction<OnboardingData>>;
  tierLimits: TierLimits;
  userTier: string;
}) {
  const [companyName, setCompanyName] = useState('');

  const handleSave = () => {
    if (companyName.trim()) {
      setData(prev => ({
        ...prev,
        companyProfile: {
          companyName: companyName.trim(),
          address: {
            country: prev.countries[0] || 'US'
          }
        }
      }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/5 rounded-xl p-4 flex items-center gap-3">
        <Building2 className="w-5 h-5 text-indigo-400" />
        <span className="text-white/80">
          Your company info will auto-fill on documents you create
        </span>
      </div>

      <div>
        <label className="text-white/60 text-sm mb-2 block">Company Name</label>
        <input
          type="text"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          onBlur={handleSave}
          placeholder="Enter your company name"
          className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-indigo-500"
        />
      </div>

      {data.companyProfile && (
        <div className="bg-green-500/10 rounded-xl p-4 flex items-center gap-3">
          <Check className="w-5 h-5 text-green-400" />
          <span className="text-green-300">Company profile will be created</span>
        </div>
      )}

      {tierLimits.maxCompanyProfiles > 1 && (
        <p className="text-white/40 text-sm">
          Your {userTier} plan allows up to {tierLimits.maxCompanyProfiles} company profiles
        </p>
      )}

      {tierLimits.maxCompanyProfiles === 1 && userTier === 'free' && (
        <div className="bg-indigo-600/10 rounded-xl p-4 flex items-center gap-3">
          <Crown className="w-5 h-5 text-indigo-400" />
          <span className="text-indigo-300 text-sm">
            Upgrade to add multiple company profiles
          </span>
        </div>
      )}
    </div>
  );
}

// Summary Step Component
function SummaryStep({ data }: { data: OnboardingData }) {
  return (
    <div className="space-y-4">
      <div className="bg-white/5 rounded-xl p-4">
        <div className="flex items-center gap-3 mb-3">
          <MapPin className="w-5 h-5 text-indigo-400" />
          <span className="text-white/60">Location</span>
        </div>
        <p className="text-white font-medium">
          {data.detectedLocation?.countryName || 'Not set'}
          {data.detectedLocation?.region && `, ${data.detectedLocation.region}`}
        </p>
        {data.saveLocationAsDefault && (
          <span className="text-green-400 text-sm">✓ Saved as default</span>
        )}
      </div>

      <div className="bg-white/5 rounded-xl p-4">
        <div className="flex items-center gap-3 mb-3">
          <Globe className="w-5 h-5 text-indigo-400" />
          <span className="text-white/60">Profile</span>
        </div>
        <p className="text-white">
          {data.role.replace(/_/g, ' ')} in {data.industry.replace(/_/g, ' ')}
        </p>
      </div>

      <div className="bg-white/5 rounded-xl p-4">
        <div className="flex items-center gap-3 mb-3">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          <span className="text-white/60">Use Cases</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {data.useCases.map(uc => (
            <span key={uc} className="px-3 py-1 bg-indigo-600/20 rounded-full text-indigo-300 text-sm">
              {uc.replace(/_/g, ' ')}
            </span>
          ))}
        </div>
      </div>

      {data.companyProfile && (
        <div className="bg-white/5 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <Building2 className="w-5 h-5 text-indigo-400" />
            <span className="text-white/60">Company</span>
          </div>
          <p className="text-white font-medium">{data.companyProfile.companyName}</p>
        </div>
      )}
    </div>
  );
}
