import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { APP_LOGO } from "@/const";
import { 
  Shield, 
  Lock, 
  Zap, 
  Check, 
  ArrowLeft, 
  ArrowRight,
  Star,
  Users,
  FileText,
  CreditCard,
  BadgeCheck,
  Sparkles
} from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { loadStripe } from "@stripe/stripe-js";
import { 
  EmbeddedCheckoutProvider, 
  EmbeddedCheckout 
} from "@stripe/react-stripe-js";

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "");

// Plan configurations
const PLANS: Record<string, {
  planId: string;
  name: string;
  price: number;
  yearlyPrice: number;
  description: string;
  features: string[];
  popular?: boolean;
  trial?: number;
}> = {
  professional: {
    planId: 'professional',
    name: 'Professional',
    price: 49,
    yearlyPrice: 470,
    description: 'Perfect for individuals and small teams',
    features: [
      'Unlimited document signing',
      '50+ professional templates',
      'Advanced e-signature workflows',
      'Priority email support',
      'API access included',
      'Custom branding',
    ],
  },
  business: {
    planId: 'business',
    name: 'Business',
    price: 99,
    yearlyPrice: 950,
    description: 'For growing teams and organizations',
    features: [
      'Everything in Professional',
      'Unlimited team members',
      'Advanced analytics dashboard',
      'Bulk document processing',
      'SSO & advanced security',
      'Dedicated account manager',
    ],
    popular: true,
  },
  enterprise: {
    planId: 'enterprise',
    name: 'Enterprise',
    price: 249,
    yearlyPrice: 2390,
    description: 'For large organizations with custom needs',
    features: [
      'Everything in Business',
      'Custom integrations',
      'On-premise deployment option',
      'SLA guarantee (99.99%)',
      '24/7 phone support',
      'Compliance certifications',
    ],
  },
};

// Testimonials for social proof
const TESTIMONIALS = [
  {
    name: "Sarah Chen",
    role: "CEO, TechStart Inc",
    text: "Signova AI transformed our contract workflow. We close deals 3x faster now.",
    avatar: "SC",
  },
  {
    name: "Michael Roberts",
    role: "Legal Director, Fortune 500",
    text: "The most intuitive document signing platform we've ever used.",
    avatar: "MR",
  },
];

export default function Checkout() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<'info' | 'payment'>('info');
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Get plan from URL
  const params = new URLSearchParams(window.location.search);
  const planId = params.get('plan') || 'professional';
  const billingInterval = (params.get('billing') || 'month') as 'month' | 'year';
  const plan = PLANS[planId] || PLANS.professional;

  // Account info state
  const [accountInfo, setAccountInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: '',
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Create checkout session mutation
  const createCheckoutSession = trpc.payment.createEmbeddedCheckoutSession.useMutation({
    onSuccess: (data) => {
      setClientSecret(data.clientSecret);
      setStep('payment');
      setIsLoading(false);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to initialize checkout');
      setIsLoading(false);
    },
  });

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!accountInfo.fullName || !accountInfo.email) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    if (!agreedToTerms) {
      toast.error('Please agree to the Terms of Service');
      return;
    }

    setIsLoading(true);
    createCheckoutSession.mutate({
      planId: plan.planId,
      accountInfo,
      billingInterval,
    });
  };

  // Calculate savings for yearly
  const monthlyCost = plan.price * 12;
  const yearlySavings = monthlyCost - plan.yearlyPrice;
  const savingsPercent = Math.round((yearlySavings / monthlyCost) * 100);

  // Embedded checkout options
  const options = clientSecret ? { clientSecret } : undefined;

  return (
    <div className="min-h-screen bg-[#0a0a1a] relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/20 via-slate-800/20 to-slate-900/20" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-700/30 rounded-full blur-[128px] animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-slate-700/30 rounded-full blur-[128px] animate-pulse delay-1000" />
      
      {/* Header */}
      <header className="relative z-10 border-b border-white/10 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button 
            onClick={() => setLocation('/')}
            className="flex items-center gap-2 text-white/70 hover:text-white transition-all duration-300 group"
          >
            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            <span className="hidden sm:inline">Back to Home</span>
          </button>
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-indigo-800 blur-lg opacity-50" />
              <img 
                src={APP_LOGO} 
                alt="Signova AI" 
                className="h-10 relative z-10"
              />
            </div>
          </div>

          {/* Security badge */}
          <div className="hidden sm:flex items-center gap-2 text-white/60 text-sm">
            <Lock className="h-4 w-4 text-green-400" />
            <span>Secure Checkout</span>
          </div>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-4 py-8 lg:py-12">
        {step === 'info' ? (
          /* Step 1: Account Information */
          <div className="max-w-6xl mx-auto">
            {/* Progress indicator */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-600 to-indigo-800 flex items-center justify-center text-white font-semibold text-sm">
                  1
                </div>
                <span className="text-white font-medium">Account</span>
              </div>
              <div className="w-12 h-0.5 bg-white/20" />
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/50 font-semibold text-sm">
                  2
                </div>
                <span className="text-white/50">Payment</span>
              </div>
            </div>

            <div className="grid lg:grid-cols-5 gap-8">
              {/* Left: Form (3 cols) */}
              <div className="lg:col-span-3">
                <Card className="p-8 bg-white/[0.03] backdrop-blur-xl border-white/10 shadow-2xl">
                  <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">
                      Complete Your Order
                    </h1>
                    <p className="text-white/60">
                      Join 10,000+ professionals using Signova AI
                    </p>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">
                          Full Name *
                        </label>
                        <Input
                          type="text"
                          value={accountInfo.fullName}
                          onChange={(e) => setAccountInfo({...accountInfo, fullName: e.target.value})}
                          placeholder="John Smith"
                          required
                          className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-indigo-500 focus:ring-indigo-500/20 h-12"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">
                          Email Address *
                        </label>
                        <Input
                          type="email"
                          value={accountInfo.email}
                          onChange={(e) => setAccountInfo({...accountInfo, email: e.target.value})}
                          placeholder="john@company.com"
                          required
                          className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-indigo-500 focus:ring-indigo-500/20 h-12"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">
                          Phone Number
                        </label>
                        <Input
                          type="tel"
                          value={accountInfo.phone}
                          onChange={(e) => setAccountInfo({...accountInfo, phone: e.target.value})}
                          placeholder="+1 (555) 123-4567"
                          className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-indigo-500 focus:ring-indigo-500/20 h-12"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">
                          Company Name
                        </label>
                        <Input
                          type="text"
                          value={accountInfo.company}
                          onChange={(e) => setAccountInfo({...accountInfo, company: e.target.value})}
                          placeholder="Acme Inc."
                          className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-indigo-500 focus:ring-indigo-500/20 h-12"
                        />
                      </div>
                    </div>

                    <div className="flex items-start gap-3 pt-2">
                      <Checkbox
                        id="terms"
                        checked={agreedToTerms}
                        onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                        className="border-white/30 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600 mt-0.5"
                      />
                      <label htmlFor="terms" className="text-sm text-white/60 leading-relaxed">
                        I agree to the{' '}
                        <a href="/terms" className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2">
                          Terms of Service
                        </a>{' '}
                        and{' '}
                        <a href="/privacy" className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2">
                          Privacy Policy
                        </a>
                      </label>
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-indigo-700 via-blue-600 to-indigo-600 bg-[length:200%_100%] hover:bg-[position:100%_0] transition-all duration-500 border-0 shadow-lg shadow-indigo-500/25"
                    >
                      {isLoading ? (
                        <span className="flex items-center gap-3">
                          <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                          Setting up your account...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          Continue to Payment
                          <ArrowRight className="h-5 w-5" />
                        </span>
                      )}
                    </Button>
                  </form>

                  {/* Trust badges */}
                  <div className="mt-8 pt-6 border-t border-white/10">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="flex flex-col items-center text-center">
                        <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center mb-2">
                          <Shield className="h-5 w-5 text-green-400" />
                        </div>
                        <span className="text-xs text-white/50">Bank-Level Security</span>
                      </div>
                      <div className="flex flex-col items-center text-center">
                        <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center mb-2">
                          <BadgeCheck className="h-5 w-5 text-blue-400" />
                        </div>
                        <span className="text-xs text-white/50">SOC 2 Certified</span>
                      </div>
                      <div className="flex flex-col items-center text-center">
                        <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center mb-2">
                          <CreditCard className="h-5 w-5 text-indigo-400" />
                        </div>
                        <span className="text-xs text-white/50">PCI DSS Level 1</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Right: Order Summary (2 cols) */}
              <div className="lg:col-span-2 space-y-6">
                {/* Order summary card */}
                <Card className="p-6 bg-gradient-to-br from-slate-900/40 to-blue-900/40 backdrop-blur-xl border-white/10 shadow-2xl overflow-hidden relative">
                  {plan.popular && (
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-semibold rounded-full flex items-center gap-1">
                        <Sparkles className="h-3 w-3" />
                        Most Popular
                      </span>
                    </div>
                  )}

                  <h3 className="text-lg font-semibold text-white/80 mb-4">Order Summary</h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-xl text-white">{plan.name} Plan</p>
                        <p className="text-sm text-white/50">{plan.description}</p>
                      </div>
                    </div>

                    {/* Price display */}
                    <div className="bg-white/5 rounded-xl p-4">
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-white">
                          ${billingInterval === 'year' ? plan.yearlyPrice : plan.price}
                        </span>
                        <span className="text-white/50">
                          /{billingInterval === 'year' ? 'year' : 'month'}
                        </span>
                      </div>
                      {billingInterval === 'year' && (
                        <p className="text-green-400 text-sm mt-1 flex items-center gap-1">
                          <Check className="h-4 w-4" />
                          Save ${yearlySavings}/year ({savingsPercent}% off)
                        </p>
                      )}
                    </div>

                    {plan.trial && (
                      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
                        <div className="flex items-center gap-2 text-green-400">
                          <Zap className="h-5 w-5" />
                          <span className="font-semibold">{plan.trial}Subscription</span>
                        </div>
                        <p className="text-sm text-white/60 mt-1">
                          Try all features risk-free. Cancel anytime.
                        </p>
                      </div>
                    )}

                    <div className="border-t border-white/10 pt-4">
                      <p className="font-medium text-white/80 mb-3">What's included:</p>
                      <ul className="space-y-2.5">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-sm text-white/70">
                            <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Money back guarantee */}
                    <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                        <Shield className="h-6 w-6 text-amber-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-white text-sm">30-Day Money-Back Guarantee</p>
                        <p className="text-xs text-white/50">No questions asked refund policy</p>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Social proof */}
                <Card className="p-5 bg-white/[0.03] backdrop-blur-xl border-white/10">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex -space-x-2">
                      {['bg-indigo-500', 'bg-blue-500', 'bg-green-500', 'bg-amber-500'].map((color, i) => (
                        <div key={i} className={`w-8 h-8 rounded-full ${color} border-2 border-[#0a0a1a] flex items-center justify-center text-white text-xs font-semibold`}>
                          {['JD', 'SC', 'MR', 'AK'][i]}
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-1 ml-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-white/70 text-sm italic">
                    "Signova AI transformed our contract workflow. We close deals 3x faster now."
                  </p>
                  <p className="text-white/50 text-xs mt-2">— Sarah Chen, CEO at TechStart Inc</p>
                </Card>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-xl p-3 text-center">
                    <div className="text-2xl font-bold text-white">10K+</div>
                    <div className="text-xs text-white/50">Happy Users</div>
                  </div>
                  <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-xl p-3 text-center">
                    <div className="text-2xl font-bold text-white">1M+</div>
                    <div className="text-xs text-white/50">Docs Signed</div>
                  </div>
                  <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-xl p-3 text-center">
                    <div className="text-2xl font-bold text-white">99.9%</div>
                    <div className="text-xs text-white/50">Uptime</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Step 2: Stripe Embedded Checkout */
          <div className="max-w-3xl mx-auto">
            {/* Progress indicator */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white">
                  <Check className="h-5 w-5" />
                </div>
                <span className="text-white/60">Account</span>
              </div>
              <div className="w-12 h-0.5 bg-indigo-500" />
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-600 to-indigo-800 flex items-center justify-center text-white font-semibold text-sm">
                  2
                </div>
                <span className="text-white font-medium">Payment</span>
              </div>
            </div>

            <Card className="p-8 bg-white shadow-2xl rounded-2xl overflow-hidden">
              <div className="mb-6 flex items-center justify-between">
                <button
                  onClick={() => {
                    setStep('info');
                    setClientSecret(null);
                  }}
                  className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors group"
                >
                  <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                  Back
                </button>
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-gray-500">Secured by Stripe</span>
                </div>
              </div>

              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Complete Your Payment</h2>
                <p className="text-gray-500">
                  You're subscribing to <strong>{plan.name}</strong> for{' '}
                  <strong>${billingInterval === 'year' ? plan.yearlyPrice : plan.price}/{billingInterval}</strong>
                </p>
              </div>

              {options && (
                <div className="stripe-checkout-container">
                  <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
                    <EmbeddedCheckout />
                  </EmbeddedCheckoutProvider>
                </div>
              )}

              {/* Bottom trust badges */}
              <div className="mt-6 pt-6 border-t flex items-center justify-center gap-6 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <Lock className="h-4 w-4" />
                  <span>256-bit SSL</span>
                </div>
                <div className="flex items-center gap-1">
                  <Shield className="h-4 w-4" />
                  <span>PCI Compliant</span>
                </div>
                <div className="flex items-center gap-1">
                  <BadgeCheck className="h-4 w-4" />
                  <span>Money-back guarantee</span>
                </div>
              </div>
            </Card>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/40">
            <p>© 2025 Signova AI. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="/terms" className="hover:text-white/60 transition-colors">Terms</a>
              <a href="/privacy" className="hover:text-white/60 transition-colors">Privacy</a>
              <a href="mailto:support@signova.ai" className="hover:text-white/60 transition-colors">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
