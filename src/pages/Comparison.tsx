import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import { 
  Check, 
  X, 
  Shield, 
  Sparkles,
  Crown,
  ArrowRight,
  Zap
} from "lucide-react";
import { useLocation } from "wouter";
import { APP_TITLE } from "@/const";

interface ComparisonFeature {
  feature: string;
  signova: boolean | string;
  docusign: boolean | string;
  hellosign: boolean | string;
  category: string;
}

const features: ComparisonFeature[] = [
  // Pricing
  { category: "Pricing", feature: "Entry Price", signova: "$19/mo (Starter)", docusign: "$15/mo", hellosign: "$15/mo" },
  { category: "Pricing", feature: "Professional Plan Price", signova: "$49/month", docusign: "$25/month", hellosign: "$20/month" },
  { category: "Pricing", feature: "Unlimited Documents", signova: "$149/month", docusign: "$65/month", hellosign: "$40/month" },
  { category: "Pricing", feature: "Annual Discount", signova: true, docusign: true, hellosign: true },
  
  // Core Features
  { category: "Core Features", feature: "Electronic Signatures", signova: true, docusign: true, hellosign: true },
  { category: "Core Features", feature: "Mobile App", signova: true, docusign: true, hellosign: true },
  { category: "Core Features", feature: "Document Templates", signova: true, docusign: true, hellosign: true },
  { category: "Core Features", feature: "Audit Trail", signova: true, docusign: true, hellosign: true },
  { category: "Core Features", feature: "Bulk Send", signova: true, docusign: true, hellosign: true },
  
  // AI & Automation
  { category: "AI & Innovation", feature: "AI Document Generator", signova: true, docusign: false, hellosign: false },
  { category: "AI & Innovation", feature: "Jurisdiction-Specific Legal Compliance", signova: true, docusign: false, hellosign: false },
  { category: "AI & Innovation", feature: "Smart Questionnaires", signova: true, docusign: false, hellosign: false },
  { category: "AI & Innovation", feature: "Auto-Generated Legal Documents", signova: true, docusign: false, hellosign: false },
  { category: "AI & Innovation", feature: "AI-Powered Field Detection", signova: true, docusign: false, hellosign: false },
  
  // Document Types
  { category: "Document Creation", feature: "Upload PDFs", signova: true, docusign: true, hellosign: true },
  { category: "Document Creation", feature: "Create NDAs from Scratch", signova: true, docusign: false, hellosign: false },
  { category: "Document Creation", feature: "Create Employment Contracts", signova: true, docusign: false, hellosign: false },
  { category: "Document Creation", feature: "Create Lease Agreements", signova: true, docusign: false, hellosign: false },
  { category: "Document Creation", feature: "12+ Document Types", signova: true, docusign: false, hellosign: false },
  
  // Security & Compliance
  { category: "Security", feature: "Bank-Level Encryption", signova: true, docusign: true, hellosign: true },
  { category: "Security", feature: "GDPR Compliant", signova: true, docusign: true, hellosign: true },
  { category: "Security", feature: "SOC 2 Certified", signova: true, docusign: true, hellosign: true },
  { category: "Security", feature: "Two-Factor Authentication", signova: true, docusign: true, hellosign: true },
  
  // User Experience
  { category: "User Experience", feature: "Modern Interface", signova: true, docusign: false, hellosign: true },
  { category: "User Experience", feature: "No Learning Curve", signova: true, docusign: false, hellosign: true },
  { category: "User Experience", feature: "Mobile-Optimized", signova: true, docusign: true, hellosign: true },
  { category: "User Experience", feature: "Real-time Notifications", signova: true, docusign: true, hellosign: true },
  
  // Support
  { category: "Support", feature: "Email Support", signova: true, docusign: true, hellosign: true },
  { category: "Support", feature: "Live Chat", signova: true, docusign: "Enterprise only", hellosign: "Paid plans" },
  { category: "Support", feature: "Phone Support", signova: "Enterprise", docusign: "Enterprise only", hellosign: "Enterprise only" },
  { category: "Support", feature: "24/7 Support", signova: "Enterprise", docusign: "Enterprise only", hellosign: false },
];

const categories = Array.from(new Set(features.map(f => f.category)));

const renderValue = (value: boolean | string) => {
  if (value === true) {
    return <Check className="h-5 w-5 text-green-600 mx-auto" />;
  } else if (value === false) {
    return <X className="h-5 w-5 text-gray-300 mx-auto" />;
  } else {
    return <span className="text-sm text-center block">{value}</span>;
  }
};

export default function Comparison() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      {/* Header */}
      <Navigation />

      {/* Hero Section */}
      <section className="py-16 text-center">
        <div className="container mx-auto px-4">
          <Badge className="mb-4 gap-1">
            <Sparkles className="h-3 w-3" />
            Industry Comparison
          </Badge>
          <h1 className="text-5xl font-bold mb-4">
            Why Choose {APP_TITLE}?
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            See how {APP_TITLE}'s modern document platform compares to DocuSign and HelloSign. 
            We offer more features at better prices, with industry-leading innovation.
          </p>
        </div>
      </section>

      {/* Key Differentiators */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
            <Card className="p-6 text-center border-2 border-indigo-200">
              <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">AI Document Generator</h3>
              <p className="text-sm text-muted-foreground">
                Create legal documents from scratch - no templates needed. Our AI generates NDAs, contracts, and more in minutes.
              </p>
            </Card>

            <Card className="p-6 text-center border-2 border-green-200">
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Better Pricing</h3>
              <p className="text-sm text-muted-foreground">
                Save 40% compared to DocuSign. Our Professional plan is significantly more affordable than competitors, with more features included.
              </p>
            </Card>

            <Card className="p-6 text-center border-2 border-blue-200">
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Modern Experience</h3>
              <p className="text-sm text-muted-foreground">
                Built for 2025 with a clean, intuitive interface. No clunky menus or confusing workflows - just simple, powerful tools.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="overflow-x-auto">
              <div className="min-w-[800px]">
                {/* Table Header */}
                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div className="font-semibold text-lg">Feature</div>
                  <div className="text-center">
                    <div className="inline-flex items-center gap-2 bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold">
                      <Crown className="h-4 w-4" />
                      {APP_TITLE}
                    </div>
                  </div>
                  <div className="text-center font-semibold text-gray-700">DocuSign</div>
                  <div className="text-center font-semibold text-gray-700">HelloSign</div>
                </div>

                {/* Table Body */}
                {categories.map((category) => (
                  <div key={category} className="mb-8">
                    <h3 className="font-semibold text-lg mb-4 text-indigo-600">{category}</h3>
                    <Card className="overflow-hidden">
                      {features
                        .filter(f => f.category === category)
                        .map((feature, index, arr) => (
                          <div 
                            key={index}
                            className={`grid grid-cols-4 gap-4 p-4 ${
                              index !== arr.length - 1 ? 'border-b' : ''
                            } ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                          >
                            <div className="font-medium text-sm">{feature.feature}</div>
                            <div className="flex items-center justify-center">
                              {renderValue(feature.signova)}
                            </div>
                            <div className="flex items-center justify-center">
                              {renderValue(feature.docusign)}
                            </div>
                            <div className="flex items-center justify-center">
                              {renderValue(feature.hellosign)}
                            </div>
                          </div>
                        ))}
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Experience the Difference?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of businesses and individuals who switched to {APP_TITLE} for better features, lower prices, and AI-assisted innovation.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => navigate('/dashboard')}
              className="gap-2"
            >
              Start Free
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/pricing')}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              View Pricing
            </Button>
          </div>
          <p className="mt-6 text-sm opacity-75">
            Try risk-free • 3 free documents • Cancel anytime
          </p>
        </div>
      </section>
    </div>
  );
}
