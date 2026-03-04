import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import MarketingFooter from "@/components/MarketingFooter";
import { 
  Check, 
  X, 
  ArrowRight,
  DollarSign,
  Sparkles,
  Clock
} from "lucide-react";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { SelfClosingFunnelBlock } from '@/components/SelfClosingFunnelBlock';

const comparisonData = [
  { feature: "Starter Plan from $19/mo", signova: true, adobe: false, category: "Pricing" },
  { feature: "Starting Price", signova: "$19/month", adobe: "$22.99/month", category: "Pricing" },
  { feature: "AI Document Generation", signova: true, adobe: false, category: "Features" },
  { feature: "Unlimited Templates", signova: true, adobe: false, category: "Features" },
  { feature: "Real-time Collaboration", signova: true, adobe: true, category: "Features" },
  { feature: "Mobile App", signova: true, adobe: true, category: "Features" },
  { feature: "API Access", signova: true, adobe: true, category: "Integration" },
  { feature: "Bank-Level Encryption", signova: true, adobe: true, category: "Security" },
  { feature: "SOC 2 Compliant", signova: true, adobe: true, category: "Security" },
  { feature: "24/7 Support", signova: true, adobe: false, category: "Support" },
  { feature: "Setup Time", signova: "Minutes", adobe: "Hours", category: "Ease of Use" },
  { feature: "No Adobe Subscription Required", signova: true, adobe: false, category: "Requirements" },
];

export default function AdobeSignComparison() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    document.title = "Signova vs Adobe Sign 2026 | Save 65% - No Adobe Subscription Needed";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Compare Signova vs Adobe Sign (Acrobat Sign) in 2026. Save 65% without needing an Adobe subscription. AI document generation, unlimited templates. No credit card required.');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navigation />
      
      <section className="pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <Badge className="mb-4 bg-green-100 text-green-800 hover:bg-green-100">
            Save 65% vs Adobe Sign
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Signova vs Adobe Sign: The Complete 2026 Comparison
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
            Adobe Sign costs $22.99/month and requires an Adobe ecosystem. 
            Signova gives you more features for $19/month with no strings attached.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => setLocation('/pricing')} className="bg-blue-900 hover:bg-blue-950">
              Start Free <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => setLocation('/features')}>
              See All Features
            </Button>
          </div>
        </div>
      </section>

      <section className="py-12 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-green-400">65%</div>
              <div className="text-slate-300">Lower Cost</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-blue-400">No</div>
              <div className="text-slate-300">Adobe Required</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-indigo-400">AI</div>
              <div className="text-slate-300">Doc Generation</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-yellow-400">5 min</div>
              <div className="text-slate-300">Setup Time</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Feature-by-Feature Comparison</h2>
          
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="grid grid-cols-3 bg-slate-100 p-4 font-semibold">
              <div>Feature</div>
              <div className="text-center text-blue-600">Signova</div>
              <div className="text-center text-slate-600">Adobe Sign</div>
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
                  {typeof item.adobe === 'boolean' ? (
                    item.adobe ? <Check className="h-5 w-5 text-green-500 mx-auto" /> : <X className="h-5 w-5 text-red-500 mx-auto" />
                  ) : (
                    <span className="text-slate-600">{item.adobe}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-indigo-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Switch from Adobe Sign?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            No Adobe subscription needed. Get better features at 65% lower cost.
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
