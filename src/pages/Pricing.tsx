import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { APP_LOGO, APP_TITLE, getLoginUrl, getSignupUrl, buildPlanSignupPath } from "@/const";
import { CheckCircle2, X, Sparkles, Brain, Rocket, Zap, Loader2, ArrowRight} from "lucide-react";
import MarketingNav from "@/components/MarketingNav";
import MarketingFooter from "@/components/MarketingFooter";
import { useState, useEffect } from "react";
import { usePricingConfig } from '../hooks/usePricingConfig';

interface PricingTier {
  id: number;
  tier_name: string;
  tier_key: string;
  display_name: string;
  monthly_price: string | number;
  annual_price: string | number;
  stripe_monthly_price_id: string | null;
  stripe_annual_price_id: string | null;
  active: number;
  is_active: number;
  features?: string[];
  // Phase 34: Dynamic DB columns (admin-editable)
  display_features?: string[] | null;
  display_description?: string | null;
  cta_text?: string | null;
  badge_text?: string | null;
}

// Static feature sets per tier (can be moved to DB later)
const TIER_FEATURES: Record<string, { features: string[]; limitations: string[]; description: string; popular?: boolean; highlight?: boolean; cta: string; badge?: string }> = {
  free: {
    description: "Perfect for trying out Signova",
    features: [
      "3 e-signatures per month",
      "1 AI-generated document per month",
      "Basic templates",
      "Mobile app access",
      "Email support (72hr)",
    ],
    limitations: ["No team collaboration", "No custom branding", "No API access"],
    cta: "GET_STARTED_CTA", // Replaced dynamically by primaryCtaText from flags
  },
  starter: {
    description: "For solo entrepreneurs & freelancers",
    features: [
      "10 e-signatures per month",
      "5 AI-generated documents per month",
      "Basic templates library",
      "Mobile app access",
      "Email support (24-48hr)",
      "Audit trails",
      "256-bit encryption",
    ],
    limitations: ["No team collaboration", "No custom branding"],
    cta: "Get Started",
    badge: "30-Day Money-Back Guarantee",
  },
  professional: {
    description: "For small businesses & consultants",
    features: [
      "50 e-signatures per month",
      "25 AI-generated documents per month",
      "Custom templates (save & reuse)",
      "Team collaboration (up to 5 users)",
      "Priority email support (12-24hr)",
      "Advanced AI features",
      "Audit trails & compliance",
      "Mobile app access",
      "API access (basic)",
      "Custom branding (logo, colors)",
    ],
    limitations: [],
    cta: "Get Started",
    popular: true,
    highlight: true,
    badge: "30-Day Money-Back Guarantee",
  },
  business: {
    description: "For growing companies & teams",
    features: [
      "200 e-signatures per month",
      "100 AI-generated documents per month",
      "Unlimited custom templates",
      "Team collaboration (up to 20 users)",
      "Priority support (4-8hr response)",
      "Advanced AI analysis",
      "Biometric verification",
      "Custom branding (white-label)",
      "SSO/SAML integration",
      "Dedicated account manager",
      "Phone support",
      "API access (advanced)",
      "Bulk operations",
    ],
    limitations: [],
    cta: "Start Free",
    badge: "30-Day Money-Back Guarantee",
  },
  growth: {
    description: "For growing teams & expanding firms",
    features: [
      "150 e-signatures per month",
      "75 AI-generated documents per month",
      "Advanced reusable templates",
      "Team collaboration (up to 15 users)",
      "Shared document workspaces",
      "Advanced API access",
      "Audit logs & compliance tracking",
      "Custom branding (logo + domain)",
      "Priority support (same-day response)",
    ],
    limitations: [],
    cta: "Get Started",
    badge: "30-Day Money-Back Guarantee",
  },
  scale: {
    description: "For multi-location firms & high-volume operations",
    features: [
      "500 e-signatures per month",
      "250 AI-generated documents per month",
      "Unlimited reusable templates",
      "Team collaboration (up to 50 users)",
      "Workflow automation rules",
      "Dedicated API rate limits",
      "Role-based access control",
      "Advanced compliance exports",
      "Custom branding + white-label options",
      "Priority support (4-hour SLA)",
    ],
    limitations: [],
    cta: "Get Started",
    badge: "30-Day Money-Back Guarantee",
  },
  enterprise: {
    description: "For large organizations",
    features: [
      "Unlimited e-signatures",
      "Unlimited AI-generated documents",
      "Unlimited team members",
      "Custom integrations",
      "On-premise deployment option",
      "Dedicated infrastructure",
      "Custom AI training (industry-specific)",
      "SLA agreement",
      "24/7 dedicated support",
    ],
    limitations: [],
    cta: "Contact Sales",
  },
};

function formatPrice(price: string | number): string {
  const num = parseFloat(String(price));
  if (isNaN(num) || num === 0) return "$0";
  return `$${num % 1 === 0 ? num.toFixed(0) : num.toFixed(2)}`;
}

const faqs = [
  {
    question: "Can I cancel anytime?",
    answer: "Yes, you can cancel your subscription at any time. Your plan will remain active until the end of your billing period.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, Mastercard, American Express) through our secure Stripe payment processor.",
  },
  {
    question: "Do you offer a money-back guarantee?",
    answer: "All paid plans include a 30-day money-back guarantee. Contact us for more information.",
    showWhenFreeEnabled: true, // This FAQ is shown differently based on freePlanEnabled
  },
  {
    question: "What is an AI-generated document?",
    answer: "Our AI generates professional, legally-informed documents tailored to your specific needs. Each generation counts as one AI-generated document. Credits can be used for any document type across all industries.",
  },
  {
    question: "Are my documents legally binding?",
    answer: "Our e-signatures comply with major e-signature laws (ESIGN, UETA, eIDAS). However, we recommend consulting a qualified attorney for documents requiring specific legal advice.",
  },
  {
    question: "How secure is my data?",
    answer: "We use industry-standard 256-bit AES encryption for all documents and data. All connections are secured with TLS. Your documents are stored securely and never shared with third parties.",
  },
];

export default function Pricing() {
  const { tiers, flags, loading, error } = usePricingConfig();
  const [billingInterval, setBillingInterval] = useState<"monthly" | "annual">("monthly");

  // Derive flag values with safe defaults
  const freePlanEnabled = flags?.freePlanEnabled ?? false;
  const showNoCreditCardCopy = flags ? !flags.creditCardRequired : false;
  const showFreeForeverCopy = freePlanEnabled;
  const primaryCtaText = flags?.primaryCtaText ?? "Get Started";


  // Find professional tier for comparison section
  const professionalTier = tiers.find((t) => t.tier_key === "professional" || t.tier_name?.toLowerCase() === "professional");
  const proPrice = professionalTier
    ? billingInterval === "annual"
      ? formatPrice(professionalTier.annual_price)
      : formatPrice(professionalTier.monthly_price)
    : null;

  return (
    <div className="min-h-screen bg-background">
      <MarketingNav />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 via-background to-blue-50 dark:from-indigo-700/20 dark:via-background dark:to-blue-950/20">
        <div className="container text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-100 dark:bg-slate-900/30 text-indigo-700 dark:text-indigo-300 rounded-full px-4 py-2 mb-6 text-sm font-medium">
            <Sparkles className="h-4 w-4" />
            AI Document Generator + E-Signature Platform
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mt-4">
            Generate professional documents with AI and get them signed. 30-day money-back guarantee on all paid plans.
          </p>

          {/* Billing toggle */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={() => setBillingInterval("monthly")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                billingInterval === "monthly"
                  ? "bg-indigo-600 text-white"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingInterval("annual")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                billingInterval === "annual"
                  ? "bg-indigo-600 text-white"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              Annual
              <span className="ml-2 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 text-xs px-2 py-0.5 rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-12 bg-background">
        <div className="container">
          {loading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
              <span className="ml-3 text-muted-foreground">Loading pricing...</span>
            </div>
          )}
          {error && (
            <div className="text-center py-20 text-red-600">
              <p>{error}</p>
              <Button onClick={() => window.location.reload()} className="mt-4" variant="outline">
                Retry
              </Button>
            </div>
          )}
          {!loading && !error && (
            <div className={`grid gap-8 mx-auto ${
              tiers.length === 1 ? "max-w-xl" :
              tiers.length === 2 ? "max-w-3xl md:grid-cols-2" :
              tiers.length === 3 ? "max-w-5xl md:grid-cols-3" :
              tiers.length === 4 ? "max-w-7xl md:grid-cols-2 lg:grid-cols-4" :
              "max-w-7xl md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
            }`}>
              {tiers.map((tier) => {
                const key = tier.tier_key || tier.tier_name?.toLowerCase() || "";
                // Phase 34: Prefer dynamic DB values, fall back to hardcoded TIER_FEATURES
                const staticMeta = TIER_FEATURES[key] || {
                  description: tier.display_name || tier.tier_name,
                  features: [],
                  limitations: [],
                  cta: "Get Started",
                };
                const meta = {
                  ...staticMeta,
                  description: tier.display_description || staticMeta.description,
                  features: (tier.display_features && tier.display_features.length > 0)
                    ? tier.display_features
                    : staticMeta.features,
                  cta: tier.cta_text || staticMeta.cta,
                  badge: tier.badge_text !== undefined && tier.badge_text !== null ? tier.badge_text : staticMeta.badge,
                };
                const price = billingInterval === "annual"
                  ? formatPrice(tier.annual_price)
                  : formatPrice(tier.monthly_price);
                const isEnterprise = key === "enterprise" || price === "$0" && key !== "free";
                const displayPrice = isEnterprise ? "Custom" : price;
                const isFree = key === "free";

                return (
                  <Card
                    key={tier.id}
                    className={`relative flex flex-col ${
                      meta.highlight
                        ? "border-4 border-indigo-500 shadow-2xl scale-105"
                        : "border-2"
                    }`}
                  >
                    {meta.popular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                        <div className="bg-indigo-700 text-white px-4 py-1 rounded-full text-sm font-bold">
                          Most Popular
                        </div>
                      </div>
                    )}
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="mb-6">
                        <h3 className="text-2xl font-bold mb-2">{tier.display_name || tier.tier_name}</h3>
                        <p className="text-sm text-muted-foreground">{meta.description}</p>
                      </div>
                      <div className="mb-6">
                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl font-bold">{displayPrice}</span>
                          {!isFree && displayPrice !== "Custom" && (
                            <span className="text-muted-foreground">/month</span>
                          )}
                        </div>
                        {isFree && showFreeForeverCopy && (
                          <p className="text-sm text-muted-foreground mt-1">forever</p>
                        )}
                        {billingInterval === "annual" && !isFree && displayPrice !== "Custom" && (
                          <p className="text-xs text-green-600 font-semibold mt-1">
                            Billed annually
                          </p>
                        )}
                      </div>
                      <Button
                        onClick={() => {
                          if (meta.cta === "Contact Sales") {
                            window.location.href = "/contact?topic=enterprise";
                          } else {
                            const key = tier.tier_key || (tier.tier_name || "").toLowerCase();
                            window.location.href = buildPlanSignupPath(key, displayPrice);
                          }
                        }}
                        className={`w-full mb-4 ${
                          meta.highlight
                            ? "bg-indigo-700 hover:bg-indigo-800"
                            : ""
                        }`}
                        variant={meta.highlight ? "default" : "outline"}
                      >
                        {meta.cta === "GET_STARTED_CTA" ? primaryCtaText : meta.cta}
                      </Button>

                      {meta.badge && (
                        <div className="mb-4 text-center">
                          <span className="inline-block px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs font-semibold rounded-full">
                            ✓ {meta.badge}
                          </span>
                        </div>
                      )}

                      <div className="space-y-3 flex-1">
                        {meta.features.map((feature, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                        {meta.limitations.map((limitation, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <X className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-muted-foreground">{limitation}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Why Signova Delivers More Value
              </h2>
              <p className="text-lg text-muted-foreground">
                Compare our Professional plan vs competitors
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-2">
                <div className="p-6 text-center">
                  <div className="text-lg font-semibold mb-2">LegalZoom</div>
                  <div className="text-3xl font-bold text-red-600 mb-4">$999/mo</div>
                  <ul className="space-y-2 text-sm text-left">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>25 documents ($39.99 each)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <X className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                      <span>No e-signatures included</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <X className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                      <span>Template-based only</span>
                    </li>
                  </ul>
                </div>
              </Card>
              <Card className="border-4 border-green-500 shadow-2xl scale-110">
                <div className="p-6 text-center">
                  <div className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-3 py-1 rounded-full text-xs font-bold inline-block mb-2">
                    Best Value
                  </div>
                  <div className="text-lg font-semibold mb-2">Signova AI</div>
                  <div className="text-3xl font-bold text-green-600 mb-4">
                    {proPrice || "See Pricing"}
                    {proPrice && <span className="text-base font-normal text-muted-foreground">/mo</span>}
                  </div>
                  <ul className="space-y-2 text-sm text-left">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>25 AI documents</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>50 e-signatures included</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>AI-powered generation</span>
                    </li>
                  </ul>
                </div>
              </Card>
              <Card className="border-2">
                <div className="p-6 text-center">
                  <div className="text-lg font-semibold mb-2">Rocket Lawyer</div>
                  <div className="text-3xl font-bold text-red-600 mb-4">$39.99/mo</div>
                  <ul className="space-y-2 text-sm text-left">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Templates only</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <X className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                      <span>No AI generation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <X className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                      <span>Limited jurisdictions</span>
                    </li>
                  </ul>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* DocuSign Savings Comparison */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                How Much Are You Overpaying for DocuSign?
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Signova AI delivers the same legally binding e-signatures — plus AI document generation — at a fraction of the cost.
              </p>
            </div>
            <div className="overflow-x-auto rounded-2xl border border-border shadow-sm mb-8">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left p-4 font-semibold">Feature</th>
                    <th className="text-center p-4 font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-700/20">
                      <div className="flex flex-col items-center gap-1">
                        <span>Signova AI</span>
                        <span className="text-xl font-bold text-green-600">From $19/mo</span>
                      </div>
                    </th>
                    <th className="text-center p-4 font-semibold text-muted-foreground">
                      <div className="flex flex-col items-center gap-1">
                        <span>DocuSign</span>
                        <span className="text-xl font-bold text-red-500">$45–$125/mo</span>
                      </div>
                    </th>
                    <th className="text-center p-4 font-semibold text-muted-foreground">
                      <div className="flex flex-col items-center gap-1">
                        <span>PandaDoc</span>
                        <span className="text-xl font-bold text-red-500">$35–$65/mo</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feature: "AI Document Generation", signova: true, docusign: false, pandadoc: false },
                    { feature: "E-Signature", signova: true, docusign: true, pandadoc: true },
                    { feature: "ESIGN & UETA Compliant", signova: true, docusign: true, pandadoc: true },
                    { feature: "Audit Trail", signova: true, docusign: true, pandadoc: true },
                    { feature: "Per-Envelope Fees", signova: "None", docusign: "Up to $0.50/envelope", pandadoc: "None" },
                    { feature: "Bulk Send", signova: true, docusign: "Business+ only", pandadoc: "Business+ only" },
                    { feature: "Custom Branding", signova: true, docusign: "Business+ only", pandadoc: "Business+ only" },
                    { feature: "API Access", signova: true, docusign: "Enterprise only", pandadoc: "Business+ only" },
                    { feature: "30-Day Money-Back", signova: true, docusign: false, pandadoc: false },
                  ].map((row, i) => (
                    <tr key={i} className={`border-b border-border ${i % 2 === 0 ? "bg-background" : "bg-muted/20"}`}>
                      <td className="p-4 font-medium">{row.feature}</td>
                      <td className="p-4 text-center bg-indigo-50/50 dark:bg-indigo-700/10">
                        {typeof row.signova === "boolean" ? (
                          row.signova
                            ? <CheckCircle2 className="h-5 w-5 text-green-600 mx-auto" />
                            : <X className="h-5 w-5 text-red-500 mx-auto" />
                        ) : (
                          <span className="font-medium text-green-700 dark:text-green-400 text-sm">{row.signova}</span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        {typeof row.docusign === "boolean" ? (
                          row.docusign
                            ? <CheckCircle2 className="h-5 w-5 text-green-600 mx-auto" />
                            : <X className="h-5 w-5 text-red-500 mx-auto" />
                        ) : (
                          <span className="text-muted-foreground text-sm">{row.docusign}</span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        {typeof row.pandadoc === "boolean" ? (
                          row.pandadoc
                            ? <CheckCircle2 className="h-5 w-5 text-green-600 mx-auto" />
                            : <X className="h-5 w-5 text-red-500 mx-auto" />
                        ) : (
                          <span className="text-muted-foreground text-sm">{row.pandadoc}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="text-center">
              <p className="text-muted-foreground mb-4">
                Ready to stop overpaying? Switch to Signova AI today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => window.location.href = getSignupUrl()}
                  className="bg-indigo-700 hover:bg-indigo-800"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Link href="/docusign-alternative">
                  <Button variant="outline">
                    See Full Comparison
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* FAQ Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <Card key={index} className="border-2">
                  <div className="p-6">
                    <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of professionals using Signova to streamline their document workflows.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-indigo-600 hover:bg-gray-100"
              onClick={() => (window.location.href = getSignupUrl())}
            >
              {primaryCtaText}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10"
              onClick={() => (window.location.href = "mailto:sales@signova.ai")}
            >
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
