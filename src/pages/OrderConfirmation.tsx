import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { CheckCircle, ArrowRight, Mail, CreditCard } from 'lucide-react';
import { trpc } from '@/lib/trpc';

export default function OrderConfirmation() {
  const [location, setLocation] = useLocation();
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.split('?')[1]);
    const sessionId = params.get('session_id');
    
    if (!sessionId) {
      setLocation('/pricing');
      return;
    }

    // Fetch order details using tRPC
    trpc.payment.getCheckoutSession.query({ sessionId })
      .then(data => {
        setOrderDetails(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching order details:', err);
        setError('Failed to load order details');
        setLoading(false);
      });
  }, [location, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-indigo-600 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading your order details...</div>
      </div>
    );
  }

  if (error || !orderDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-indigo-600 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-white text-xl mb-4">{error || 'Order not found'}</div>
          <button
            onClick={() => setLocation('/pricing')}
            className="bg-white text-indigo-600 px-6 py-2 rounded-lg hover:bg-gray-100"
          >
            Back to Pricing
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-indigo-600 to-indigo-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-4 animate-bounce">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Payment Successful!</h1>
          <p className="text-xl text-white/90">Thank you for subscribing to Signova AI</p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-lg shadow-2xl p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Confirmation</h2>
          
          {/* Order ID */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Order ID:</span>
              <span className="font-mono text-sm text-gray-900">{orderDetails.orderId}</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-gray-600">Date:</span>
              <span className="text-gray-900">{new Date().toLocaleDateString()}</span>
            </div>
          </div>

          {/* Plan Details */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3">Subscription Details</h3>
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-lg font-bold text-slate-900">{orderDetails.planName} Plan</span>
                <span className="text-2xl font-bold text-indigo-600">
                  ${orderDetails.amount}
                  <span className="text-sm text-gray-600">/month</span>
                </span>
              </div>
              <p className="text-sm text-gray-600">{orderDetails.planDescription}</p>
            </div>
          </div>

          {/* Payment Method */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <CreditCard className="w-5 h-5 mr-2" />
              Payment Method
            </h3>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Paid with:</span>
              <span className="text-gray-900">{orderDetails.paymentMethod}</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-gray-600">Total Paid:</span>
              <span className="text-xl font-bold text-green-600">{orderDetails.currency} ${orderDetails.amount}</span>
            </div>
          </div>

          {/* Next Steps */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">What's Next?</h3>
            <div className="space-y-2 text-gray-600">
              <div className="flex items-start">
                <Mail className="w-5 h-5 mr-2 mt-0.5 text-indigo-600" />
                <p>A confirmation email has been sent to <strong>{orderDetails.email}</strong></p>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 mr-2 mt-0.5 text-green-600" />
                <p>Your subscription is now active and ready to use</p>
              </div>
              <div className="flex items-start">
                <ArrowRight className="w-5 h-5 mr-2 mt-0.5 text-blue-600" />
                <p>Complete your onboarding to personalize your experience</p>
              </div>
            </div>
          </div>

          {/* Security Badge */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center text-sm text-gray-600">
              <svg className="w-5 h-5 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z" clipRule="evenodd" />
              </svg>
              Secured by Stripe • PCI DSS Level 1 Certified
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={() => setLocation('/onboarding')}
            className="w-full bg-indigo-700 hover:bg-indigo-800 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center group"
          >
            Complete Setup
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Support Link */}
        <div className="text-center text-white/80 text-sm">
          Need help? <a href="mailto:support@signova.ai" className="underline hover:text-white">Contact Support</a>
        </div>
      </div>
    </div>
  );
}
