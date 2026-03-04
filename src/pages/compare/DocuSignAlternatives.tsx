import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import MarketingFooter from "@/components/MarketingFooter";
import { 
  Check, 
  X, 
  ArrowRight,
  Star,
  Crown,
  Zap,
  Shield
} from "lucide-react";
import { useLocation } from "wouter";
import { useEffect } from "react";

const alternatives = [
  {
    name: "Signova",
    rating: 4.9,
    price: "$19/month",
    highlight: "Best Overall",
    pros: ["AI Document Generation", "47% cheaper than DocuSign", "Unlimited templates", "24/7 support", "5-minute setup"],
    cons: ["Newer platform"],
    recommended: true
  },
  {
    name: "HelloSign (Dropbox Sign)",
    rating: 4.5,
    price: "$20/month",
    highlight: "Good for Dropbox Users",
    pros: ["Dropbox integration", "Clean interface", "Good mobile app"],
    cons: ["No free plan", "No AI features", "Higher price"],
    recommended: false
  },
  {
    name: "Adobe Sign",
    rating: 4.3,
    price: "$22.99/month",
    highlight: "Adobe Ecosystem",
    pros: ["Adobe integration", "Enterprise features", "Good security"],
    cons: ["Requires Adobe subscription", "Complex setup", "Expensive"],
    recommended: false
  },
  {
    name: "PandaDoc",
    rating: 4.4,
    price: "$35/month",
    highlight: "Sales Teams",
    pros: ["CRM integration", "Document analytics", "Proposal features"],
    cons: ["Very expensive", "Complex for simple needs", "No AI generation"],
    recommended: false
  },
  {
    name: "SignNow",
    rating: 4.2,
    price: "$10/month",
    highlight: "Budget Option",
    pros: ["Affordable", "Basic features", "Mobile app"],
    cons: ["Limited templates", "Basic UI", "No AI features"],
    recommended: false
  }
];

export default function DocuSignAlternatives() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    document.title = "Best DocuSign Alternatives 2026 | Top 5 E-Signature Solutions Compared";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Looking for DocuSign alternatives in 2026? Compare the top 5 e-signature solutions including Signova, HelloSign, Adobe Sign, PandaDoc. Find the best fit for your business.');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navigation />
      
      <section className="pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-100">
            Updated January 2026
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Best DocuSign Alternatives in 2026
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
            DocuSign is expensive and lacks modern features like AI. 
            Here are the top 5 alternatives that offer better value and more features.
          </p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          {alternatives.map((alt, index) => (
            <Card key={index} className={`p-6 ${alt.recommended ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-slate-400">#{index + 1}</span>
                  <h2 className="text-2xl font-bold">{alt.name}</h2>
                  {alt.recommended && (
                    <Badge className="bg-blue-600 text-white">
                      <Crown className="h-3 w-3 mr-1" /> Recommended
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-4 mt-2 md:mt-0">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                    <span className="ml-1 font-semibold">{alt.rating}</span>
                  </div>
                  <span className="text-lg font-bold text-blue-600">{alt.price}</span>
                </div>
              </div>
              
              <Badge variant="outline" className="mb-4">{alt.highlight}</Badge>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-green-600 mb-2">Pros</h3>
                  <ul className="space-y-1">
                    {alt.pros.map((pro, i) => (
                      <li key={i} className="flex items-center text-sm">
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-red-600 mb-2">Cons</h3>
                  <ul className="space-y-1">
                    {alt.cons.map((con, i) => (
                      <li key={i} className="flex items-center text-sm">
                        <X className="h-4 w-4 text-red-500 mr-2" />
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              {alt.recommended && (
                <Button 
                  className="mt-4 w-full md:w-auto bg-blue-900 hover:bg-blue-950"
                  onClick={() => setLocation('/pricing')}
                >
                  Try Signova Free <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </Card>
          ))}
        </div>
      </section>

      <section className="py-16 px-4 bg-indigo-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Try the #1 DocuSign Alternative?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join 1,000+ businesses who switched to Signova.
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

      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-3xl mx-auto px-4 text-center" style={{"paddingTop": "2rem", "paddingBottom": "2rem"}}>
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Switch from DocuSign?</h2>
          <p className="text-slate-300 mb-8">Start free. No credit card required. Get started in under 2 minutes.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.location.href = '/register?path=generate'}
              className="inline-flex items-center justify-center gap-2 bg-white text-slate-900 hover:bg-slate-100 font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              Generate with AI — Free
            </button>
            <button
              onClick={() => window.location.href = '/register?path=upload'}
              className="inline-flex items-center justify-center gap-2 border border-slate-500 text-white hover:bg-slate-800 font-medium px-8 py-3 rounded-lg transition-colors"
            >
              Upload &amp; Send — Free
            </button>
          </div>
          <p className="text-sm text-slate-400 mt-4">Cancel anytime · Legally binding in 180+ countries</p>
        </div>
      </section>
    </div>
  );
}
