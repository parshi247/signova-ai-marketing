import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import MarketingNav from "@/components/MarketingNav";
import MarketingFooter from "@/components/MarketingFooter";
import { getSignupUrl } from "@/const";
import { usePricingConfig } from '../hooks/usePricingConfig';
import {
  FileSignature,
  Shield,
  Zap,
  Users,
  Globe,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  FileText,
  Clock,
  Brain,
  Rocket,
  DollarSign,
} from "lucide-react";

export default function MarketingHome() {
  const { freePlanEnabled, showNoCreditCardCopy, showFreeForeverCopy, primaryCtaText } = usePricingConfig();
  const features = [
    {
      icon: Brain,
      title: "AI-Assisted Document Creation",
      description:
        "Generate contracts in minutes with AI assistance — or upload your own documents. Full manual control always available.",
      highlight: true,
    },
    {
      icon: FileSignature,
      title: "Smart E-Signatures",
      description:
        "Drag-and-drop signature fields, automatic placement suggestions, and legally binding e-signatures",
    },
    {
      icon: Shield,
      title: "Bank-Level Security",
      description:
        "256-bit encryption, legally binding signatures, and enterprise-grade security",
    },
    {
      icon: Zap,
      title: "Operational Speed",
      description:
        "Documents sent for signature in under 60 seconds. Integrate with your existing workflow via API or use standalone.",
    },
    {
      icon: Globe,
      title: "Universal Coverage",
      description:
        "Support for ANY jurisdiction worldwide. US, Canada, UK, Australia, and 180+ countries",
    },
    {
      icon: Shield,
      title: "Compliance Ready",
      description:
        "Audit trails, data residency options, and SOC2 roadmap. Built for regulated industries and enterprise procurement.",
    },
  ];

  const stats = [
    { value: "99.9%", label: "Uptime SLA" },
    { value: "256-bit", label: "AES Encryption" },
    { value: "180+", label: "Jurisdictions" },
    { value: "SOC2", label: "In Progress" },
  ];

  const benefits = [
    "AI-Assisted Document Generation — optional, always in your control",
    "Unlimited e-signatures",
    "Smart document analysis and field detection",
    "Advanced security & encryption",
    "Real-time tracking & notifications",
    "Custom branding & templates",
    "API access & integrations",
  ];

  const aiFeatures = [
    {
      title: "Intelligent Questionnaires",
      description: "AI asks smart, jurisdiction-specific questions to gather all necessary information",
    },
    {
      title: "On-the-Fly Generation",
      description: "No templates - every document is custom-generated for your specific situation",
    },
    {
      title: "Universal Coverage",
      description: "Legal, Business, Real Estate, HR, Accounting - ANY industry, ANY jurisdiction",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <MarketingNav />

            {/* Enterprise Trust Strip */}
      <div className="border-b bg-slate-900 py-3 overflow-x-hidden">
        <div className="container">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-xs text-slate-400">
            {[
              "Bank-Level Security",
              "Data Residency Options",
              "Full Audit Logs",
              "SOC2 In Progress",
              "GDPR Compliant",
              "Built for Teams 1–10,000+",
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Trust Bar — Executive */}
      <div className="border-b bg-slate-50 py-2.5 overflow-x-hidden">
        <div className="container">
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-slate-600 overflow-x-hidden">
            {stats.map((stat, index) => (
              <div key={index} className="flex items-center gap-2 whitespace-nowrap">
                <span className="font-semibold text-slate-900">{stat.value}</span>
                <span>{stat.label}</span>
                {index < stats.length - 1 && (
                  <span className="text-slate-300 ml-8">|</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <main className="flex-1">
        {/* Hero Section — Executive */}
        <section className="py-24 md:py-36 bg-white">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 bg-slate-50 text-slate-600 text-sm font-medium mb-8">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                Legally binding in all 50 states · 180+ countries
              </div>

              {/* H1 — Outcome Without Pain */}
              <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6" style={{letterSpacing: '-0.03em', lineHeight: '1.05'}}>
                Global Document Infrastructure<br />
                <span className="text-blue-900">Built for Modern Business.</span>
              </h1>

              {/* Subheadline */}
              <p className="text-xl md:text-2xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
                Generate, sign, and manage documents at any scale — from solo operators to enterprise teams.{" "}
                <span className="text-slate-700 font-medium">Reliable. Compliant. Built for teams from 1 to 10,000+.</span>
              </p>

              {/* Dual CTA */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                <Button
                  onClick={() => window.location.href = getSignupUrl() + '?path=generate'}
                  size="lg"
                  className="text-base px-8 py-6 bg-blue-900 hover:bg-blue-950 text-white shadow-lg shadow-slate-900/10 transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate with AI
                </Button>
                <Button
                  onClick={() => window.location.href = getSignupUrl() + '?path=upload'}
                  size="lg"
                  variant="outline"
                  className="text-base px-8 py-6 border-slate-300 text-slate-700 hover:bg-slate-50 transition-all duration-200"
                >
                  <FileText className="mr-2 h-5 w-5" />
                  Upload &amp; Send
                </Button>
              </div>

              {/* Trust line */}
              <p className="text-sm text-slate-400 mb-12">
                {showNoCreditCardCopy && "Enterprise-ready from day one · "}Get started free · Cancel anytime
              </p>

              {/* 3-Step Workflow Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 max-w-2xl mx-auto border border-slate-100 rounded-2xl overflow-hidden bg-slate-50">
                {[
                  { step: "1", label: "Upload or Generate", desc: "Your document or AI-created" },
                  { step: "2", label: "Place Fields", desc: "AI-assisted or manual" },
                  { step: "3", label: "Send & Track", desc: "Signed in minutes" },
                ].map((item, i) => (
                  <div key={i} className={`flex flex-col items-center gap-2 px-6 py-6 ${i < 2 ? 'sm:border-r border-slate-200' : ''}`}>
                    <div className="w-8 h-8 rounded-full bg-blue-900 text-white text-sm font-bold flex items-center justify-center">
                      {item.step}
                    </div>
                    <span className="font-semibold text-slate-800 text-sm">{item.label}</span>
                    <span className="text-xs text-slate-400 text-center">{item.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Anchor — Mid-page */}
        <section className="py-12 bg-slate-50 border-y border-slate-100">
          <div className="container">
            <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <p className="text-sm text-slate-500 mb-1">Most Popular Plan</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-slate-900">$49</span>
                  <span className="text-slate-500">/month</span>
                  <span className="ml-2 text-sm text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-full">Save 20% annually</span>
                </div>
                <p className="text-sm text-slate-500 mt-1">
                  DocuSign equivalent: <span className="line-through text-slate-400">$80+/month</span>
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => window.location.href = getSignupUrl()}
                  className="bg-blue-900 hover:bg-blue-950 text-white px-6"
                >
                  Get Started Free
                </Button>
                <Link href="/pricing">
                  <Button variant="outline" className="border-slate-300 text-slate-700 px-6">
                    See All Plans
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* AI Document Generator Showcase Section - NEW! */}
        <section className="py-20 bg-slate-50">
          <div className="container">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-medium mb-4">
                <Rocket className="h-4 w-4" />
                NEW FEATURE
              </div>
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                AI-Assisted Document Creation
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Generate any contract in minutes with AI assistance — or upload your existing documents and send for signature. Your workflow, your choice.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {aiFeatures.map((feature, index) => (
                <Card key={index} className="border-2 border-indigo-600 dark:border-indigo-600">
                  <CardContent className="pt-6">
                    <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-indigo-700 to-indigo-900 flex items-center justify-center mb-4">
                      <Sparkles className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-xl max-w-3xl mx-auto">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-indigo-700 dark:bg-indigo-700 flex items-center justify-center flex-shrink-0">
                    <span className="text-indigo-400 dark:text-indigo-400 font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Describe What You Need</h4>
                    <p className="text-muted-foreground">"I need a restraining order in California" or "Start an LLC in Delaware"</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-indigo-700 dark:bg-indigo-700 flex items-center justify-center flex-shrink-0">
                    <span className="text-indigo-400 dark:text-indigo-400 font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Answer Smart Questions</h4>
                    <p className="text-muted-foreground">AI asks 10-20 intelligent, jurisdiction-specific questions</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-indigo-700 dark:bg-indigo-700 flex items-center justify-center flex-shrink-0">
                    <span className="text-indigo-400 dark:text-indigo-400 font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Get Your Document + Sign It</h4>
                    <p className="text-muted-foreground">Professional document generated in minutes, ready to sign and file</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground">Competitor Price</div>
                    <div className="text-2xl font-bold line-through text-red-600">$999/month</div>
                  </div>
                  <div className="text-3xl font-bold text-muted-foreground">→</div>
                  <div>
                    <div className="text-sm text-muted-foreground">Signova Price</div>
                    <div className="text-2xl font-bold text-green-600">From $19/month</div>
                  </div>
                  <div className="bg-green-100 dark:bg-green-900 px-4 py-2 rounded-lg">
                    <div className="text-2xl font-bold text-green-700 dark:text-green-300">Save 98%+</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 text-center">
                <Link href="/templates">
                  <Button size="lg" className="bg-gradient-to-r from-indigo-700 to-indigo-900 hover:from-indigo-700 hover:to-blue-700">
                    <Brain className="mr-2 h-5 w-5" />
                    Start Free Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Block — Traditional vs AI Path */}
        <section className="py-16 bg-muted/20 border-y border-border">
          <div className="container">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">Prefer the traditional workflow?</h2>
              <p className="text-muted-foreground">AI is optional. Full manual control always available.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="rounded-2xl border border-border bg-background p-8 space-y-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold">Traditional Workflow</h3>
                </div>
                <div className="space-y-4">
                  {[
                    { step: "1", text: "Upload your document" },
                    { step: "2", text: "Drag signature fields" },
                    { step: "3", text: "Send for signature" },
                  ].map((item) => (
                    <div key={item.step} className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-full bg-blue-600 text-white text-sm font-bold flex items-center justify-center flex-shrink-0">{item.step}</span>
                      <span className="text-foreground">{item.text}</span>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-2 bg-background" onClick={() => window.location.href = getSignupUrl() + '?path=upload'}>Upload &amp; Send Now</Button>
              </div>
              <div className="rounded-2xl border border-indigo-600 bg-gradient-to-br from-indigo-700 to-blue-50 dark:from-indigo-700/20 dark:to-blue-950/20 p-8 space-y-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-indigo-700 flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-indigo-400" />
                  </div>
                  <h3 className="text-lg font-semibold">Want speed?</h3>
                </div>
                <p className="text-muted-foreground">Generate a complete contract in seconds with AI assistance. Answer a few questions — Signova builds the document for you.</p>
                <div className="space-y-2">
                  {[
                    "Any document type, any industry",
                    "Jurisdiction-specific language",
                    "Ready to send in minutes",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-indigo-400 flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-2 bg-gradient-to-r from-indigo-700 to-indigo-900 hover:from-indigo-700 hover:to-blue-700" onClick={() => window.location.href = getSignupUrl() + '?path=generate'}>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate with AI
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 bg-background">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Everything You Need in One Platform
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Powerful features designed for modern businesses
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card 
                  key={index} 
                  className={`border-2 hover:border-primary/50 transition-colors ${
                    feature.highlight ? 'border-blue-200 bg-blue-50/50' : ''
                  }`}
                >
                  <CardContent className="pt-6">
                    {feature.highlight && (
                      <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium mb-3">
                        <Rocket className="h-3 w-3" />
                        NEW
                      </div>
                    )}
                    <div className={`h-12 w-12 rounded-lg flex items-center justify-center mb-4 ${
                      feature.highlight 
                        ? 'bg-blue-900' 
                        : 'bg-primary/10'
                    }`}>
                      <feature.icon className={`h-6 w-6 ${
                        feature.highlight ? 'text-white' : 'text-primary'
                      }`} />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Why Choose Signova AI?
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Join thousands of businesses who trust Signova AI for their
                  document generation and signing needs. Experience the perfect blend of
                  speed, security, and intelligence.
                </p>
                <ul className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <span className="text-lg">{benefit}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex gap-4">
                  <Link href="/templates">
                    <Button size="lg" className="bg-gradient-to-r from-indigo-700 to-indigo-900 hover:from-indigo-700 hover:to-blue-700">
                      <Brain className="mr-2 h-5 w-5" />
                      Start Free
                    </Button>
                  </Link>
                  <Button onClick={() => window.location.href = getSignupUrl()} size="lg" variant="outline">
                    {primaryCtaText}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>

              <div className="relative">
                <div className="rounded-2xl bg-slate-900 p-8 shadow-2xl">
                  <div className="bg-white rounded-xl p-6 space-y-4">
                    {/* Document Preview */}
                    <div className="flex items-center gap-3 pb-4 border-b">
                      <FileText className="h-8 w-8 text-blue-600" />
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">Contract_Agreement.pdf</div>
                        <div className="text-sm text-gray-500">Ready for signature</div>
                      </div>
                    </div>
                    
                    {/* Signature Fields */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">John Smith</div>
                          <div className="text-xs text-gray-500">Signed 2 min ago</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <Clock className="h-5 w-5 text-blue-600" />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">Sarah Johnson</div>
                          <div className="text-xs text-gray-500">Awaiting signature</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <Users className="h-5 w-5 text-gray-600" />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">Michael Chen</div>
                          <div className="text-xs text-gray-500">Pending</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* AI Badge */}
                    <div className="flex items-center gap-2 pt-3 border-t">
                      <Sparkles className="h-4 w-4 text-indigo-400" />
                      <span className="text-xs font-medium text-indigo-400">AI-Generated & Signed in 5 Minutes</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        {/* Objection Killer Block */}
        <section className="py-16 bg-white border-t border-slate-100">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <h3 className="text-xl font-semibold text-slate-900 text-center mb-8">Everything you need. Nothing you don't.</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { text: "AI is optional — upload your own documents anytime" },
                  { text: "Legally binding in all 50 states and 180+ countries" },
                  { text: "Cancel anytime — no long-term contracts" },
                  { text: "Enterprise-ready from day one to get started" },
                  { text: "Bank-level 256-bit encryption on every document" },
                  { text: "Full audit trail and tamper-evident records" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 rounded-lg bg-slate-50">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-slate-700">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-slate-900 text-white">
          <div className="container text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Your Document Workflow?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of businesses using Signova AI to generate and sign documents
              faster, smarter, and more securely.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/templates">
                <Button
                  size="lg"
                  variant="secondary"
                  className="text-lg px-8"
                >
                  <Brain className="mr-2 h-5 w-5" />
                  Start Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button onClick={() => window.location.href = getSignupUrl()}
                size="lg"
                variant="outline"
                className="text-lg px-8 bg-transparent border-white text-white hover:bg-white hover:text-indigo-400"
              >
                {primaryCtaText}
              </Button>
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
