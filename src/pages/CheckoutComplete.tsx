import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { GA4Tracker } from '@/lib/ga4-tracking';
declare global { interface Window { gtag?: (...args: any[]) => void; } }
import { CheckCircle2, ArrowRight, Mail, Shield, FileText, Users, Zap } from 'lucide-react';

export default function CheckoutComplete() {
  const [, navigate] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const sessionId = searchParams.get('session_id');
  
  const [isProcessing, setIsProcessing] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customerEmail, setCustomerEmail] = useState<string>('');

  const completeCheckout = trpc.payment.completeEmbeddedCheckout.useMutation({
    onSuccess: (data) => {
      setIsSuccess(true);
      setIsProcessing(false);
      setCustomerEmail(data.email || '');
      // Fire GA4 purchase conversion
      try {
        GA4Tracker.getInstance().trackConversion('subscription_purchase', data.planPrice || 49);
        // Also fire standard GA4 purchase event for Google Ads
        if (window.gtag) {
          window.gtag('event', 'purchase', {
            transaction_id: data.sessionId || '',
            value: data.planPrice || 49,
            currency: 'USD',
            items: [{ item_name: data.planName || 'professional', price: data.planPrice || 49 }]
          });
          window.gtag('event', 'conversion', {
            send_to: 'G-9TWH5FG0CG',
            value: data.planPrice || 49,
            currency: 'USD'
          });
        }
      } catch(e) {}
    },
    onError: (err) => {
      setError(err.message || 'Something went wrong');
      setIsProcessing(false);
    }
  });

  useEffect(() => {
    if (sessionId && isProcessing) {
      completeCheckout.mutate({ sessionId });
    }
  }, [sessionId]);

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Processing your subscription...</h2>
          <p className="text-slate-500">Please wait while we set up your account</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg border border-slate-200 shadow-sm p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Something went wrong</h2>
          <p className="text-slate-500 mb-6">{error}</p>
          <Button onClick={() => navigate('/pricing')} className="bg-blue-600 hover:bg-blue-700">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-center">
            <svg className="h-7 w-7 text-slate-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="ml-2 text-xl font-semibold text-slate-900">Signova</span>
            <span className="ml-1 text-xl font-semibold text-blue-600">AI</span>
          </div>
        </div>
      </header>

      {/* Success Content */}
      <main className="max-w-3xl mx-auto px-6 py-16">
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
          {/* Success Header */}
          <div className="bg-indigo-600 px-8 py-10 text-center text-white">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Welcome to Signova AI!</h1>
            <p className="text-green-100 text-lg">Your subscription is now active</p>
          </div>

          {/* Account Details */}
          <div className="px-8 py-6 border-b border-slate-100 bg-slate-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-sm text-slate-500">Account Email</p>
                  <p className="font-medium text-slate-900">{customerEmail}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-green-100 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-sm font-medium text-green-700">Active</span>
              </div>
            </div>
          </div>

          {/* Quick Start */}
          <div className="px-8 py-8">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">Get Started in 3 Steps</h2>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-semibold text-sm">1</span>
                </div>
                <div>
                  <h3 className="font-medium text-slate-900">Log in to your dashboard</h3>
                  <p className="text-sm text-slate-500 mt-1">Use your email and password to access your account</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-semibold text-sm">2</span>
                </div>
                <div>
                  <h3 className="font-medium text-slate-900">Upload your first document</h3>
                  <p className="text-sm text-slate-500 mt-1">Drag and drop any PDF, Word, or image file</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-semibold text-sm">3</span>
                </div>
                <div>
                  <h3 className="font-medium text-slate-900">Send for signature</h3>
                  <p className="text-sm text-slate-500 mt-1">Add recipients and send documents for e-signature</p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <Button 
              onClick={() => window.location.href = 'https://portal.signova.ai/login'}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold mt-8"
            >
              Go to Dashboard
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {/* Features Grid */}
          <div className="px-8 py-6 bg-slate-50 border-t border-slate-100">
            <p className="text-sm font-medium text-slate-700 mb-4">Your subscription includes:</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-slate-600">Unlimited documents</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-slate-600">Team collaboration</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-slate-600">Bank-level security</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-slate-600">AI-powered features</span>
              </div>
            </div>
          </div>

          {/* Support Footer */}
          <div className="px-8 py-4 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500">
              Need help? <a href="mailto:support@signova.ai" className="text-blue-600 hover:underline">Contact our support team</a>
            </p>
          </div>
        </div>

        {/* Confirmation Email Notice */}
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-500">
            A confirmation email has been sent to <span className="font-medium">{customerEmail}</span>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <p className="text-sm text-slate-500 text-center">
            © 2026 Signova AI Inc. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
