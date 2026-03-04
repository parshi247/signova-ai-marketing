import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import MarketingFooter from "@/components/MarketingFooter";
import { 
  Check, 
  X, 
  Shield, 
  Sparkles,
  Crown,
  ArrowRight,
  Zap,
  DollarSign,
  Clock,
  Users,
  FileText,
  Lock
} from "lucide-react";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { SelfClosingFunnelBlock } from '@/components/SelfClosingFunnelBlock';

const comparisonData = [
  { feature: "Starter Plan from $19/mo", signova: true, docusign: false, category: "Pricing" },
  { feature: "Starting Price", signova: "$19/month", docusign: "$49/month", category: "Pricing" },
  { feature: "Unlimited Templates", signova: true, docusign: false, category: "Features" },
  { feature: "AI Document Generation", signova: true, docusign: false, category: "Features" },
  { feature: "Real-time Collaboration", signova: true, docusign: true, category: "Features" },
  { feature: "Mobile App", signova: true, docusign: true, category: "Features" },
  { feature: "API Access", signova: true, docusign: true, category: "Integration" },
  { feature: "Zapier Integration", signova: true, docusign: true, category: "Integration" },
  { feature: "Bank-Level Encryption", signova: true, docusign: true, category: "Security" },
  { feature: "SOC 2 Compliant", signova: true, docusign: true, category: "Security" },
  { feature: "HIPAA-Ready", signova: true, docusign: true, category: "Security" },
  { feature: "Audit Trail", signova: true, docusign: true, category: "Security" },
  { feature: "24/7 Support", signova: true, docusign: false, category: "Support" },
  { feature: "Setup Time", signova: "Minutes", docusign: "Hours", category: "Ease of Use" },
  { feature: "Learning Curve", signova: "Easy", docusign: "Moderate", category: "Ease of Use" },
];

export default function DocuSignComparison() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    document.title = "Signova vs DocuSign 2026: Complete Comparison | Save 47% on E-Signatures";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Compare Signova vs DocuSign in 2026. See why 1,000+ businesses switched to Signova for 47% lower costs, AI document generation, and unlimited templates. No credit card required.');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <Badge className="mb-4 bg-green-100 text-green-800 hover:bg-green-100">
            Save 47% vs DocuSign
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Signova vs DocuSign: Why 1,000+ Businesses Switched
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
            See why over 1,000 businesses have switched from DocuSign to Signova. 
            Get more features, better pricing, and AI-powered document generation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => setLocation('/register?path=generate')} className="bg-blue-900 hover:bg-blue-950 text-white shadow-lg">
              Generate with AI — Free <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => setLocation('/register?path=upload')} className="border-slate-300 text-slate-700">
              Upload &amp; Send — Free
            </Button>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-12 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-green-400">47%</div>
              <div className="text-slate-300">Lower Cost</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-blue-400">10K+</div>
              <div className="text-slate-300">Happy Users</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-indigo-400">5 min</div>
              <div className="text-slate-300">Setup Time</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-yellow-400">4.9/5</div>
              <div className="text-slate-300">User Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Feature-by-Feature Comparison</h2>
          
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="grid grid-cols-3 bg-slate-100 p-4 font-semibold">
              <div>Feature</div>
              <div className="text-center text-blue-600">Signova</div>
              <div className="text-center text-slate-600">DocuSign</div>
            </div>
            
            {comparisonData.map((item, index) => (
              <div key={index} className={`grid grid-cols-3 p-4 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'} border-b`}>
                <div className="font-medium">{item.feature}</div>
                <div className="text-center">
                  {typeof item.signova === 'boolean' ? (
                    item.signova ? <Check className="h-5 w-5 text-green-500 mx-auto" /> : <X className="h-5 w-5 text-red-500 mx-auto" />
                  ) : (
                    <span className="text-blue-600 font-semibold">{item.signova}</span>
                  )}
                </div>
                <div className="text-center">
                  {typeof item.docusign === 'boolean' ? (
                    item.docusign ? <Check className="h-5 w-5 text-green-500 mx-auto" /> : <X className="h-5 w-5 text-red-500 mx-auto" />
                  ) : (
                    <span className="text-slate-600">{item.docusign}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Switch Section */}
      <section className="py-16 px-4 bg-blue-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Businesses Switch from DocuSign to Signova</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6">
              <DollarSign className="h-12 w-12 text-green-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Save 47% on Costs</h3>
              <p className="text-slate-600">
                Signova starts at $19/month compared to DocuSign's $49/month. 
                Plus, get unlimited templates included at no extra cost.
              </p>
            </Card>
            
            <Card className="p-6">
              <Sparkles className="h-12 w-12 text-indigo-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">AI Document Generation</h3>
              <p className="text-slate-600">
                Generate contracts, NDAs, and agreements in seconds with our AI. 
                DocuSign doesn't offer this feature at any price.
              </p>
            </Card>
            
            <Card className="p-6">
              <Clock className="h-12 w-12 text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">5-Minute Setup</h3>
              <p className="text-slate-600">
                Get started in minutes, not hours. Our intuitive interface means 
                no training required for your team.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-indigo-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Switch from DocuSign?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join 1,000+ businesses who made the switch. Start free today.
          </p>
          <Button 
            size="lg" 
            onClick={() => setLocation('/pricing')}
            className="bg-white text-blue-600 hover:bg-blue-50"
          >
            Start Free
          </Button>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
