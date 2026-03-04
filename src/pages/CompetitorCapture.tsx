import { ga4Tracker } from "@/lib/ga4-tracking";
import React from 'react';
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import MarketingNav from "@/components/MarketingNav";
import MarketingFooter from "@/components/MarketingFooter";
import { getSignupUrl } from "@/const";
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  TrendingUp,
  DollarSign,
  Shield,
  Zap,
  FileText,
  Star,
} from "lucide-react";

interface CompetitorConfig {
  slug: string;
  competitorName: string;
  heroHeadline: string;
  heroSubheadline: string;
  comparisonTitle: string;
  signovaMonthly: string;
  competitorMonthly: string;
  savingsPercent: string;
  comparisonRows: Array<{
    feature: string;
    signova: string | boolean;
    competitor: string | boolean;
  }>;
  switchReasons: string[];
  testimonialQuote?: string;
  testimonialAuthor?: string;
}

export const competitorConfigs: Record<string, CompetitorConfig> = {
  "docusign-alternative": {
    slug: "docusign-alternative",
    competitorName: "DocuSign",
    heroHeadline: "The Best DocuSign Alternative in 2025",
    heroSubheadline: "Same legal enforceability. AI document generation. 95% cheaper than DocuSign. No per-envelope pricing.",
    comparisonTitle: "Signova AI vs. DocuSign",
    signovaMonthly: "$19/mo",
    competitorMonthly: "$45–$125/mo",
    savingsPercent: "Save up to 85%",
    comparisonRows: [
      { feature: "Monthly Price", signova: "From $19/mo", competitor: "$45–$125/mo" },
      { feature: "Per-Envelope Fees", signova: "None — unlimited", competitor: "$0.10–$0.50 per envelope" },
      { feature: "AI Document Generation", signova: true, competitor: false },
      { feature: "ESIGN & UETA Compliant", signova: true, competitor: true },
      { feature: "Audit Trail", signova: true, competitor: true },
      { feature: "Mobile Signing", signova: true, competitor: true },
      { feature: "Bulk Send", signova: true, competitor: "Business+ only" },
      { feature: "Custom Branding", signova: true, competitor: "Business+ only ($125/mo)" },
      { feature: "API Access", signova: true, competitor: "Enterprise only" },
      { feature: "30-Day Money-Back", signova: true, competitor: false },
    ],
    switchReasons: [
      "DocuSign charges per envelope — costs explode as you scale",
      "No AI document generation — you still need to create documents elsewhere",
      "Advanced features locked behind $125/mo Business tier",
      "No flat-rate pricing for small businesses",
      "Signova includes AI generation + e-signature in one platform",
    ],
  },
  "pandadoc-alternative": {
    slug: "pandadoc-alternative",
    competitorName: "PandaDoc",
    heroHeadline: "The Best PandaDoc Alternative in 2025",
    heroSubheadline: "AI document automation + e-signature. More powerful than PandaDoc. Starting at $19/month.",
    comparisonTitle: "Signova AI vs. PandaDoc",
    signovaMonthly: "$19/mo",
    competitorMonthly: "$35–$65/mo",
    savingsPercent: "Save up to 70%",
    comparisonRows: [
      { feature: "Monthly Price", signova: "From $19/mo", competitor: "$35–$65/mo" },
      { feature: "AI Document Generation", signova: true, competitor: "Template-only" },
      { feature: "E-Signature", signova: true, competitor: true },
      { feature: "ESIGN Compliant", signova: true, competitor: true },
      { feature: "Audit Trail", signova: true, competitor: true },
      { feature: "Any Industry/Jurisdiction", signova: true, competitor: "Limited templates" },
      { feature: "Custom Branding", signova: true, competitor: "Business+ only" },
      { feature: "API Access", signova: true, competitor: "Business+ only" },
      { feature: "30-Day Money-Back", signova: true, competitor: false },
    ],
    switchReasons: [
      "PandaDoc requires templates — Signova generates any document from scratch",
      "PandaDoc's AI is limited to template filling, not true generation",
      "Advanced features require $65/mo Business tier",
      "Signova covers any industry and jurisdiction without pre-built templates",
      "Signova is built for document automation, not just proposals",
    ],
  },
  "hellosign-alternative": {
    slug: "hellosign-alternative",
    competitorName: "HelloSign (Dropbox Sign)",
    heroHeadline: "The Best HelloSign Alternative in 2025",
    heroSubheadline: "AI document generation + legally binding e-signatures. Everything HelloSign does — plus AI. Starting at $19/month.",
    comparisonTitle: "Signova AI vs. HelloSign (Dropbox Sign)",
    signovaMonthly: "$19/mo",
    competitorMonthly: "$25–$40/mo",
    savingsPercent: "Save up to 50% + AI generation",
    comparisonRows: [
      { feature: "Monthly Price", signova: "From $19/mo", competitor: "$25–$40/mo" },
      { feature: "AI Document Generation", signova: true, competitor: false },
      { feature: "E-Signature", signova: true, competitor: true },
      { feature: "ESIGN Compliant", signova: true, competitor: true },
      { feature: "Audit Trail", signova: true, competitor: true },
      { feature: "Templates", signova: true, competitor: true },
      { feature: "Bulk Send", signova: true, competitor: "Essentials+ only" },
      { feature: "Custom Branding", signova: true, competitor: "Essentials+ only" },
      { feature: "30-Day Money-Back", signova: true, competitor: false },
    ],
    switchReasons: [
      "HelloSign has no AI document generation — you still need to create documents elsewhere",
      "HelloSign is e-signature only — Signova is a complete document automation platform",
      "Bulk send and custom branding require higher-tier plans",
      "Signova generates any document for any industry in any jurisdiction",
      "One platform for creation, automation, and signing",
    ],
  },
  "cut-docusign-costs": {
    slug: "cut-docusign-costs",
    competitorName: "DocuSign",
    heroHeadline: "Cut Your DocuSign Costs by 85%",
    heroSubheadline: "Stop paying per envelope. Switch to Signova AI — flat-rate pricing with AI document generation included.",
    comparisonTitle: "Real Cost Comparison: DocuSign vs. Signova",
    signovaMonthly: "$19/mo",
    competitorMonthly: "$45–$125/mo + per-envelope fees",
    savingsPercent: "Save $300–$1,200/year",
    comparisonRows: [
      { feature: "Base Monthly Cost", signova: "$19/mo", competitor: "$45/mo minimum" },
      { feature: "Per-Envelope Fees", signova: "None", competitor: "Up to $0.50/envelope" },
      { feature: "100 envelopes/mo cost", signova: "$19/mo flat", competitor: "$45 + $50 = $95/mo" },
      { feature: "500 envelopes/mo cost", signova: "$49/mo flat", competitor: "$45 + $250 = $295/mo" },
      { feature: "AI Document Generation", signova: true, competitor: false },
      { feature: "Annual Savings (100 env/mo)", signova: "—", competitor: "Save $912/year" },
    ],
    switchReasons: [
      "DocuSign's per-envelope pricing means costs grow with your business",
      "At 100 envelopes/month, DocuSign costs 5x more than Signova",
      "Signova includes AI document generation — DocuSign doesn't",
      "No surprise bills — Signova is flat-rate",
      "Same legal enforceability at a fraction of the cost",
    ],
  },
  "replace-docusign-for-small-business": {
    slug: "replace-docusign-for-small-business",
    competitorName: "DocuSign",
    heroHeadline: "Replace DocuSign for Your Small Business",
    heroSubheadline: "Small businesses don't need enterprise pricing. Signova gives you everything DocuSign offers — plus AI — starting at $19/month.",
    comparisonTitle: "DocuSign vs. Signova: Built for Small Business",
    signovaMonthly: "$19/mo",
    competitorMonthly: "$45/mo",
    savingsPercent: "Save $312/year",
    comparisonRows: [
      { feature: "Monthly Price", signova: "$19/mo", competitor: "$45/mo" },
      { feature: "Annual Cost", signova: "$228/year", competitor: "$540/year" },
      { feature: "AI Document Generation", signova: true, competitor: false },
      { feature: "E-Signature", signova: true, competitor: true },
      { feature: "ESIGN Compliant", signova: true, competitor: true },
      { feature: "Audit Trail", signova: true, competitor: true },
      { feature: "Mobile Signing", signova: true, competitor: true },
      { feature: "30-Day Money-Back", signova: true, competitor: false },
      { feature: "Small Business Pricing", signova: true, competitor: false },
    ],
    switchReasons: [
      "DocuSign was built for enterprise — pricing reflects that",
      "Small businesses pay the same as Fortune 500 companies",
      "Signova is purpose-built for small business document workflows",
      "AI document generation means you don't need a separate tool",
      "Flat-rate pricing that scales with your business, not against it",
    ],
  },
};

interface CompetitorCapturePageProps {
  config: CompetitorConfig;
}

export function CompetitorCapturePage({ config }: CompetitorCapturePageProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <MarketingNav />
      <main className="flex-1">
        {/* Hero */}
        <section className="py-20 md:py-28 bg-white">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 bg-slate-50 text-slate-600 text-sm font-medium">
                <DollarSign className="h-4 w-4" />
                {config.savingsPercent}
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                {config.heroHeadline}
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                {config.heroSubheadline}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                <Button
                  onClick={() => window.location.href = getSignupUrl()}
                  size="lg"
                  className="text-lg px-8 bg-gradient-to-r from-indigo-700 to-indigo-900 hover:from-indigo-700 hover:to-blue-700"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Link href="/pricing">
                  <Button size="lg" variant="outline" className="text-lg px-8">
                    View Pricing
                  </Button>
                </Link>
              </div>
              <p className="text-sm text-muted-foreground">No credit card required • Cancel anytime • 30-day money-back guarantee</p>
            </div>
          </div>
        </section>

        {/* Pricing Comparison */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">{config.comparisonTitle}</h2>
              <div className="overflow-x-auto rounded-2xl border border-border shadow-sm">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-4 font-semibold text-muted-foreground">Feature</th>
                      <th className="text-center p-4 font-bold text-indigo-600 bg-indigo-50 dark:bg-purple-950/20">
                        <div className="flex flex-col items-center gap-1">
                          <span>Signova AI</span>
                          <span className="text-2xl font-bold text-green-600">{config.signovaMonthly}</span>
                        </div>
                      </th>
                      <th className="text-center p-4 font-semibold text-muted-foreground">
                        <div className="flex flex-col items-center gap-1">
                          <span>{config.competitorName}</span>
                          <span className="text-2xl font-bold text-red-500">{config.competitorMonthly}</span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {config.comparisonRows.map((row, i) => (
                      <tr key={i} className={`border-b border-border ${i % 2 === 0 ? 'bg-background' : 'bg-muted/20'}`}>
                        <td className="p-4 font-medium">{row.feature}</td>
                        <td className="p-4 text-center bg-indigo-50/50 dark:bg-purple-950/10">
                          {typeof row.signova === 'boolean' ? (
                            row.signova
                              ? <CheckCircle2 className="h-5 w-5 text-green-600 mx-auto" />
                              : <XCircle className="h-5 w-5 text-red-500 mx-auto" />
                          ) : (
                            <span className="font-medium text-green-700 dark:text-green-400">{row.signova}</span>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          {typeof row.competitor === 'boolean' ? (
                            row.competitor
                              ? <CheckCircle2 className="h-5 w-5 text-green-600 mx-auto" />
                              : <XCircle className="h-5 w-5 text-red-500 mx-auto" />
                          ) : (
                            <span className="text-muted-foreground">{row.competitor}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Why Switch */}
        <section className="py-20">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
                5 Reasons to Switch from {config.competitorName}
              </h2>
              <ul className="space-y-4">
                {config.switchReasons.map((reason, i) => (
                  <li key={i} className="flex items-start gap-3 p-4 rounded-xl bg-muted/30 border border-border">
                    <div className="h-7 w-7 rounded-full bg-indigo-100 dark:bg-purple-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-sm font-bold text-indigo-600">{i + 1}</span>
                    </div>
                    <span className="text-base">{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        
        {/* ─── Savings Calculator ─────────────────────────────────────────── */}
        <section className="py-16 bg-gradient-to-br from-blue-900 to-slate-900 text-white">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-3">Calculate Your Savings</h2>
              <p className="text-blue-200 text-lg">See exactly how much you'll save by switching to Signova</p>
            </div>
            <SavingsCalculator competitorName={config.competitorName} competitorMonthly={config.competitorMonthly} />
          </div>
        </section>

        {/* ─── Plan Qualification Flow ─────────────────────────────────── */}
        <section className="py-16 bg-slate-50 border-t border-slate-100">
          <div className="max-w-2xl mx-auto px-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Which Signova Plan Is Right for You?</h2>
              <p className="text-slate-500">Answer 3 quick questions — we'll recommend the perfect plan.</p>
            </div>
            <PlanQualificationFlow />
          </div>
        </section>

        {/* ─── Migration CTA ───────────────────────────────────────────────── */}
        <section className="py-14 bg-green-50 border-y border-green-100">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              Fast Migration
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Switch in Under 10 Minutes</h2>
            <p className="text-slate-600 text-lg mb-8">
              Import your existing documents, invite your team, and start sending for signature — all in one afternoon.
              No training required. No IT department needed.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {[
                { step: '1', title: 'Create Free Account', desc: 'Sign up in 30 seconds — no credit card required' },
                { step: '2', title: 'Upload or Generate', desc: 'Import existing docs or let AI generate new ones instantly' },
                { step: '3', title: 'Send & Sign', desc: 'Add recipients, place signature fields, send — done' },
              ].map((item) => (
                <div key={item.step} className="bg-white rounded-xl p-6 shadow-sm border border-green-100 text-left">
                  <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4">{item.step}</div>
                  <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-600 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
            <a href="/register" className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-4 rounded-xl text-lg transition-colors">
              Start Free — Switch Today
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </a>
          </div>
        </section>

        {/* ─── Testimonial Placeholders ────────────────────────────────────── */}
        <section className="py-16 bg-white">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-2xl font-bold text-slate-900 text-center mb-10">What Our Customers Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  quote: "Switched from DocuSign and cut our monthly document costs by 80%. The AI generation feature alone is worth the price — we no longer need a separate tool to create contracts.",
                  author: "Sarah M.",
                  role: "Operations Manager, Real Estate Agency",
                  saving: "Saves $180/mo",
                },
                {
                  quote: "We were paying $95/month for DocuSign with per-envelope fees. Signova is $49/month flat — and it generates the documents too. Should have switched years ago.",
                  author: "James K.",
                  role: "Owner, Contracting Business",
                  saving: "Saves $552/yr",
                },
                {
                  quote: "The migration took less than an hour. Our team was up and running the same day. The AI document generator is genuinely impressive — it handles all our engagement letters.",
                  author: "Priya L.",
                  role: "Partner, Accounting Firm",
                  saving: "Saves $312/yr",
                },
              ].map((t, i) => (
                <div key={i} className="bg-slate-50 rounded-xl p-6 border border-slate-100">
                  <div className="flex items-center gap-1 mb-4">
                    {[1,2,3,4,5].map(s => (
                      <svg key={s} className="w-4 h-4 text-yellow-400 fill-yellow-400" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    ))}
                  </div>
                  <p className="text-slate-700 text-sm mb-4 italic">"{t.quote}"</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">{t.author}</p>
                      <p className="text-slate-500 text-xs">{t.role}</p>
                    </div>
                    <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">{t.saving}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 bg-gradient-to-r from-indigo-700 to-indigo-900 text-white">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h2 className="text-3xl md:text-5xl font-bold">
                Ready to Switch from {config.competitorName}?
              </h2>
              <p className="text-xl opacity-90">
                Join thousands of businesses who made the switch. Get started free today.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  onClick={() => window.location.href = getSignupUrl()}
                  size="lg"
                  variant="secondary"
                  className="text-lg px-8"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Link href="/pricing">
                  <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent border-white text-white hover:bg-white hover:text-indigo-600">
                    View Pricing
                  </Button>
                </Link>
              </div>
              <p className="text-sm opacity-75">No credit card required • 30-day money-back guarantee</p>
            </div>
          </div>
        </section>
      </main>
      <MarketingFooter />
    </div>
  );
}

// SavingsCalculator component for competitor capture pages
function SavingsCalculator({ competitorName, competitorMonthly }: { competitorName: string; competitorMonthly: string }) {
  const [envelopes, setEnvelopes] = React.useState(50);
  const signovaMonthly = 49;
  
  // Parse competitor monthly cost (remove $ and convert to number)
  const competitorCost = parseFloat(competitorMonthly.replace(/[$,]/g, '')) || 125;
  
  // Calculate per-envelope cost for DocuSign-style pricing
  const competitorPerEnvelope = competitorCost > 100 ? (competitorCost / 100) : 0;
  const competitorTotal = competitorCost + (competitorPerEnvelope * Math.max(0, envelopes - 100));
  const signovaTotal = signovaMonthly;
  const monthlySavings = Math.max(0, competitorTotal - signovaTotal);
  const annualSavings = monthlySavings * 12;

  return (
    <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-8 my-8">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          💰 How Much Are You Overpaying?
        </h3>
        <p className="text-gray-600">Drag the slider to see your potential savings</p>
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Monthly Documents / Envelopes: <span className="text-green-600 text-lg">{envelopes}</span>
        </label>
        <input
          type="range"
          min="10"
          max="500"
          step="10"
          value={envelopes}
          onChange={(e) => {
            const val = parseInt(e.target.value);
            setEnvelopes(val);
            // Debounce: track after user settles on a value
            clearTimeout((window as any)._calcTimer);
            (window as any)._calcTimer = setTimeout(() => {
              const cCost = parseFloat(competitorMonthly.replace(/[$,]/g, '')) || 125;
              const cPerEnv = cCost > 100 ? (cCost / 100) : 0;
              const cTotal = cCost + (cPerEnv * Math.max(0, val - 100));
              const savings = Math.max(0, cTotal - 49) * 12;
              ga4Tracker.trackCalculatorUsed(competitorName, val, savings);
            }, 1500);
          }}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-500"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>10</span><span>100</span><span>250</span><span>500</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
          <div className="text-sm text-red-600 font-medium mb-1">{competitorName}</div>
          <div className="text-2xl font-bold text-red-700">${competitorTotal.toFixed(0)}<span className="text-sm font-normal">/mo</span></div>
          <div className="text-xs text-red-500 mt-1">Per-envelope fees add up fast</div>
        </div>
        <div className="bg-green-100 border-2 border-green-400 rounded-xl p-4 text-center relative">
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">BEST VALUE</div>
          <div className="text-sm text-green-700 font-medium mb-1">Signova AI</div>
          <div className="text-2xl font-bold text-green-700">${signovaTotal}<span className="text-sm font-normal">/mo</span></div>
          <div className="text-xs text-green-600 mt-1">Flat rate, unlimited</div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
          <div className="text-sm text-blue-600 font-medium mb-1">Your Annual Savings</div>
          <div className="text-2xl font-bold text-blue-700">${annualSavings.toFixed(0)}</div>
          <div className="text-xs text-blue-500 mt-1">per year with Signova</div>
        </div>
      </div>

      {annualSavings > 0 && (
        <div className="text-center">
          <a
            href="/register"
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-xl transition-colors text-lg"
          >
            Start Saving ${annualSavings.toFixed(0)}/year →
          </a>
          <p className="text-sm text-gray-500 mt-2">No credit card required · Cancel anytime</p>
        </div>
      )}
    </div>
  );
}



// PlanQualificationFlow — 3-question self-closing plan recommender
function PlanQualificationFlow() {
  const [step, setStep] = React.useState(0);
  const [answers, setAnswers] = React.useState<Record<string, string>>({});
  const [recommended, setRecommended] = React.useState<{
    plan: string; price: string; checkoutPath: string; reason: string;
  } | null>(null);

  const questions = [
    {
      id: "docs",
      question: "How many documents do you send per month?",
      options: [
        { label: "1–10 documents", value: "low" },
        { label: "11–50 documents", value: "medium" },
        { label: "51–200 documents", value: "high" },
        { label: "200+ documents", value: "enterprise" },
      ],
    },
    {
      id: "team",
      question: "How large is your team?",
      options: [
        { label: "Just me", value: "solo" },
        { label: "2–5 people", value: "small" },
        { label: "6–20 people", value: "medium" },
        { label: "20+ people", value: "large" },
      ],
    },
    {
      id: "ai",
      question: "Do you need AI document generation?",
      options: [
        { label: "Yes — I want AI to draft contracts", value: "yes" },
        { label: "No — I'll upload my own documents", value: "no" },
        { label: "Both — I want the option", value: "both" },
      ],
    },
  ];

  function handleAnswer(questionId: string, value: string) {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);

    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      // Determine recommendation
      const docs = newAnswers.docs || "medium";
      const team = newAnswers.team || "small";

      if (docs === "low" && team === "solo") {
        const starterRec = {
          plan: "Starter",
          price: "$19/month",
          checkoutPath: "/checkout?plan=Starter",
          reason: "Perfect for solo users sending under 10 documents per month.",
        };
        setRecommended(starterRec);
        ga4Tracker.trackPlanRecommended(starterRec.plan, starterRec.price, newAnswers);
      } else if (docs === "enterprise" || team === "large") {
        const businessRec = {
          plan: "Business",
          price: "$99/month",
          checkoutPath: "/checkout?plan=Business",
          reason: "Designed for high-volume teams with advanced workflow needs.",
        };
        setRecommended(businessRec);
        ga4Tracker.trackPlanRecommended(businessRec.plan, businessRec.price, newAnswers);
      } else {
        const proRec = {
          plan: "Professional",
          price: "$49/month",
          checkoutPath: "/checkout?plan=Professional",
          reason: "Our most popular plan — flat rate, unlimited documents, AI included.",
        };
        setRecommended(proRec);
        ga4Tracker.trackPlanRecommended(proRec.plan, proRec.price, newAnswers);
      }
    }
  }

  if (recommended) {
    return (
      <div className="bg-white border-2 border-blue-900 rounded-2xl p-8 text-center shadow-lg">
        <div className="w-12 h-12 bg-blue-900 text-white rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-sm text-slate-500 mb-1">Based on your answers, we recommend</p>
        <h3 className="text-2xl font-bold text-slate-900 mb-1">Signova {recommended.plan}</h3>
        <p className="text-3xl font-extrabold text-blue-900 mb-3">{recommended.price}</p>
        <p className="text-slate-600 text-sm mb-6 max-w-sm mx-auto">{recommended.reason}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href={recommended.checkoutPath}
            className="inline-flex items-center justify-center gap-2 bg-blue-900 hover:bg-blue-950 text-white font-bold py-3 px-8 rounded-xl transition-colors text-base"
          >
            Start Free with {recommended.plan}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
          <a
            href="/pricing"
            className="inline-flex items-center justify-center gap-2 border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium py-3 px-6 rounded-xl transition-colors text-base"
          >
            Compare All Plans
          </a>
        </div>
        <p className="text-xs text-slate-400 mt-4">No credit card required · Cancel anytime</p>
        <button
          onClick={() => { setStep(0); setAnswers({}); setRecommended(null); }}
          className="text-xs text-slate-400 hover:text-slate-600 mt-2 underline"
        >
          Start over
        </button>
      </div>
    );
  }

  const currentQ = questions[step];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
      {/* Progress */}
      <div className="flex items-center gap-2 mb-6">
        {questions.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i <= step ? "bg-blue-900" : "bg-slate-200"
            }`}
          />
        ))}
      </div>
      <p className="text-xs text-slate-400 mb-2">Question {step + 1} of {questions.length}</p>
      <h3 className="text-xl font-bold text-slate-900 mb-6">{currentQ.question}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {currentQ.options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => handleAnswer(currentQ.id, opt.value)}
            className="text-left px-5 py-4 rounded-xl border-2 border-slate-200 hover:border-blue-900 hover:bg-blue-50 transition-all font-medium text-slate-700 hover:text-blue-900"
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default CompetitorCapturePage;
