import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Coins, Zap, TrendingUp, Shield } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import { toast } from "sonner";

const creditPackages = [
  {
    id: "starter",
    name: "Starter Pack",
    credits: 10,
    price: 9.99,
    pricePerCredit: 0.99,
    popular: false,
    features: [
      "10 document credits",
      "Valid for 6 months",
      "All document types",
      "Email support",
    ],
  },
  {
    id: "professional",
    name: "Professional Pack",
    credits: 50,
    price: 39.99,
    pricePerCredit: 0.80,
    popular: true,
    savings: "Save 20%",
    features: [
      "50 document credits",
      "Valid for 12 months",
      "All document types",
      "Priority email support",
      "Bulk generation",
    ],
  },
  {
    id: "business",
    name: "Business Pack",
    credits: 150,
    price: 99.99,
    pricePerCredit: 0.67,
    popular: false,
    savings: "Save 33%",
    features: [
      "150 document credits",
      "Valid for 12 months",
      "All document types",
      "Priority support",
      "Bulk generation",
      "API access",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise Pack",
    credits: 500,
    price: 299.99,
    pricePerCredit: 0.60,
    popular: false,
    savings: "Save 40%",
    features: [
      "500 document credits",
      "Never expires",
      "All document types",
      "24/7 priority support",
      "Bulk generation",
      "Full API access",
      "Dedicated account manager",
    ],
  },
];

export default function Credits() {
  const [, setLocation] = useLocation();
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

  const handlePurchase = (packageId: string) => {
    setSelectedPackage(packageId);
    const pkg = creditPackages.find(p => p.id === packageId);
    
    // Redirect to checkout with credits package
    setLocation(`/checkout?type=credits&package=${packageId}&amount=${pkg?.price}`);
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-indigo-700 via-white to-blue-50 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full mb-4">
              <Coins className="h-5 w-5" />
              <span className="font-semibold">Buy Credits</span>
            </div>
            <h1 className="text-5xl font-bold text-slate-100 mb-4">
              Choose Your Credit Package
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Purchase credits to generate professional legal documents instantly. 
              Credits never expire and can be used for any document type.
            </p>
          </div>

          {/* Benefits */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="p-6 text-center border-2 border-indigo-100">
              <div className="bg-indigo-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Instant Access</h3>
              <p className="text-slate-400 text-sm">
                Credits are added to your account immediately after purchase
              </p>
            </Card>

            <Card className="p-6 text-center border-2 border-blue-100">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Better Value</h3>
              <p className="text-slate-400 text-sm">
                Save up to 40% with larger credit packages
              </p>
            </Card>

            <Card className="p-6 text-center border-2 border-green-100">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Flexible Usage</h3>
              <p className="text-slate-400 text-sm">
                Use credits for any document type across all industries
              </p>
            </Card>
          </div>

          {/* Credit Packages */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {creditPackages.map((pkg) => (
              <Card
                key={pkg.id}
                className={`p-6 relative ${
                  pkg.popular
                    ? "border-4 border-indigo-500 shadow-2xl scale-105"
                    : "border-2 border-slate-700"
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-indigo-700 to-indigo-900 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                      Most Popular
                    </span>
                  </div>
                )}

                {pkg.savings && !pkg.popular && (
                  <div className="absolute -top-3 right-4">
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      {pkg.savings}
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
                  <div className="text-5xl font-bold text-indigo-600 mb-2">
                    {pkg.credits}
                  </div>
                  <div className="text-slate-400 text-sm mb-4">credits</div>
                  <div className="text-3xl font-bold text-slate-100">
                    ${pkg.price}
                  </div>
                  <div className="text-sm text-slate-400 mt-1">
                    ${pkg.pricePerCredit.toFixed(2)} per credit
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  {pkg.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-300">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={() => handlePurchase(pkg.id)}
                  className={`w-full ${
                    pkg.popular
                      ? "bg-gradient-to-r from-indigo-700 to-indigo-900 hover:from-indigo-700 hover:to-blue-700"
                      : "bg-gray-900 hover:bg-gray-800"
                  }`}
                  size="lg"
                >
                  Purchase Now
                </Button>
              </Card>
            ))}
          </div>

          {/* FAQ */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-center mb-8">
              Frequently Asked Questions
            </h2>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <Card className="p-6">
                <h3 className="font-bold text-lg mb-2">
                  Do credits expire?
                </h3>
                <p className="text-slate-400 text-sm">
                  Most packages have a 6-12 month validity period. Enterprise credits never expire.
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="font-bold text-lg mb-2">
                  Can I use credits for any document?
                </h3>
                <p className="text-slate-400 text-sm">
                  Yes! Credits can be used to generate any document type across all industries.
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="font-bold text-lg mb-2">
                  What if I run out of credits?
                </h3>
                <p className="text-slate-400 text-sm">
                  You can purchase additional credits anytime. We'll notify you when you're running low.
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="font-bold text-lg mb-2">
                  Can I get a refund?
                </h3>
                <p className="text-slate-400 text-sm">
                  Unused credits can be refunded within 30 days of purchase. Contact support for assistance.
                </p>
              </Card>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-16 text-center">
            <p className="text-slate-400 mb-4">
              Need a subscription instead?
            </p>
            <Button
              variant="outline"
              size="lg"
              onClick={() => setLocation("/pricing")}
            >
              View Subscription Plans
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
