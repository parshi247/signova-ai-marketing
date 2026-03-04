import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import MarketingNav from "@/components/MarketingNav";
import MarketingFooter from "@/components/MarketingFooter";
import { getSignupUrl } from "@/const";
import {
  Shield, Key, Users, FileText, Globe, Zap, Lock,
  CheckCircle2, ArrowRight, Building2, BarChart3,
  Headphones, Code2, Server, Eye, AlertCircle, Mail
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function EnterprisePage() {
  const [formData, setFormData] = useState({
    name: "", title: "", company: "", email: "", teamSize: "", useCase: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.company) {
      toast.error("Please fill in all required fields.");
      return;
    }
    // In production this would POST to /api/enterprise-intake
    toast.success("Request received. Our enterprise team will contact you within 1 business day.");
    setSubmitted(true);
  };

  const features = [
    {
      icon: Key,
      title: "Single Sign-On (SSO)",
      description: "SAML 2.0 and OIDC support. Connect your existing identity provider — Okta, Azure AD, Google Workspace, or any SAML-compatible IdP.",
    },
    {
      icon: Users,
      title: "Role-Based Permissions",
      description: "Granular access control. Define who can create, send, view, or sign documents. Department-level and team-level isolation.",
    },
    {
      icon: Eye,
      title: "Full Audit Trails",
      description: "Immutable, timestamped audit logs for every action. Document views, edits, sends, signatures, and access events — exportable for compliance.",
    },
    {
      icon: Code2,
      title: "API Access",
      description: "RESTful API with webhook support. Integrate document generation and e-signature workflows directly into your existing systems.",
    },
    {
      icon: BarChart3,
      title: "Volume Pricing",
      description: "Custom pricing for teams of 25+. Flat-rate enterprise contracts available. No per-document fees at scale.",
    },
    {
      icon: Headphones,
      title: "Dedicated Support",
      description: "Named account manager. Priority support queue. SLA-backed response times. Onboarding and implementation assistance.",
    },
    {
      icon: Shield,
      title: "Security Posture",
      description: "256-bit AES encryption at rest and in transit. Data residency options. Penetration testing reports available under NDA.",
    },
    {
      icon: AlertCircle,
      title: "SOC 2 Roadmap",
      description: "SOC 2 Type II audit in progress. GDPR-compliant data handling. HIPAA-ready configurations available (not HIPAA-certified — consult your compliance officer before use with protected health information).",
    },
    {
      icon: Server,
      title: "Data Residency",
      description: "Choose where your data lives. US, Canada, EU, or UK data residency options. No cross-border data transfer without explicit consent.",
    },
  ];

  const trustItems = [
    { label: "Uptime SLA", value: "99.9%" },
    { label: "Encryption", value: "256-bit AES" },
    { label: "Jurisdictions", value: "180+" },
    { label: "Audit Retention", value: "7 Years" },
    { label: "SOC 2", value: "In Progress" },
    { label: "GDPR", value: "Compliant" },
  ];

  const useCases = [
    { icon: Building2, label: "Legal & Compliance", desc: "Contract lifecycle management, matter intake, client agreements" },
    { icon: FileText, label: "HR & People Ops", desc: "Offer letters, NDAs, policy acknowledgments, onboarding packets" },
    { icon: Globe, label: "Real Estate", desc: "Purchase agreements, lease renewals, disclosure packages at volume" },
    { icon: BarChart3, label: "Finance & Accounting", desc: "Engagement letters, audit confirmations, vendor agreements" },
    { icon: Zap, label: "Operations", desc: "Vendor contracts, SOWs, procurement documents, SLAs" },
    { icon: Code2, label: "Technology", desc: "MSAs, SaaS agreements, data processing addenda, IP assignments" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <MarketingNav />

      {/* Hero */}
      <section className="py-24 md:py-36 bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(59,130,246,0.08),_transparent_60%)]" />
        <div className="container relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-700 bg-slate-800/50 text-slate-300 text-sm font-medium mb-8">
              <Building2 className="h-3.5 w-3.5 text-blue-400" />
              Enterprise Infrastructure
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6" style={{letterSpacing: '-0.03em', lineHeight: '1.05'}}>
              Document Infrastructure<br />
              <span className="text-blue-400">Built for Scale.</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              SSO, audit trails, role-based permissions, API access, and dedicated support — for teams from 25 to 10,000+.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                onClick={() => document.getElementById("enterprise-intake")?.scrollIntoView({ behavior: "smooth" })}
                size="lg"
                className="text-base px-8 py-6 bg-blue-600 hover:bg-blue-500 text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5"
              >
                <Mail className="mr-2 h-5 w-5" />
                Talk to Enterprise Team
              </Button>
              <Button
                onClick={() => window.location.href = getSignupUrl()}
                size="lg"
                variant="outline"
                className="text-base px-8 py-6 border-slate-600 text-slate-300 hover:bg-slate-800 bg-transparent transition-all duration-200"
              >
                Start Self-Serve
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Metrics */}
      <section className="py-6 border-b bg-slate-50">
        <div className="container">
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
            {trustItems.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span className="text-sm font-semibold text-slate-900">{item.value}</span>
                <span className="text-sm text-slate-500">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise Features Grid */}
      <section className="py-24">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4" style={{letterSpacing: '-0.02em'}}>
              Everything Enterprise Teams Require
            </h2>
            <p className="text-lg text-slate-500">
              Not a consumer product with enterprise features bolted on. Built from the ground up for organizational control, compliance, and scale.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <Card key={i} className="border border-slate-200 bg-white hover:shadow-md transition-shadow duration-200">
                <CardContent className="p-6">
                  <div className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center mb-4">
                    <feature.icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-24 bg-slate-950 text-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4" style={{letterSpacing: '-0.02em'}}>
              Deployed Across Every Function
            </h2>
            <p className="text-lg text-slate-400">
              From legal to HR to finance — one platform, one contract, one audit trail.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {useCases.map((uc, i) => (
              <div key={i} className="flex gap-4 p-6 rounded-xl border border-slate-800 bg-slate-900/50">
                <div className="w-10 h-10 rounded-lg bg-blue-600/20 flex items-center justify-center shrink-0">
                  <uc.icon className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white mb-1">{uc.label}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{uc.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="py-24">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4" style={{letterSpacing: '-0.02em'}}>
              Transparent Enterprise Pricing
            </h2>
            <p className="text-lg text-slate-500">
              No per-document fees. No surprise overages. Flat-rate contracts for predictable budgeting.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                name: "Business",
                price: "$149",
                period: "/month",
                desc: "For growing teams",
                features: ["Up to 25 users", "Unlimited documents", "API access", "Priority support", "Audit logs (90 days)"],
                cta: "Get Started",
                href: getSignupUrl ? "/register" : "/register",
                highlight: false,
              },
              {
                name: "Enterprise",
                price: "Custom",
                period: "",
                desc: "For organizations of 25+",
                features: ["Unlimited users", "SSO / SAML 2.0", "Role-based permissions", "Dedicated account manager", "Audit logs (7 years)", "Data residency choice", "SLA guarantee", "Custom integrations"],
                cta: "Talk to Enterprise Team",
                href: "#enterprise-intake",
                highlight: true,
              },
              {
                name: "Government / Regulated",
                price: "Custom",
                period: "",
                desc: "For regulated industries",
                features: ["HIPAA-ready config", "FedRAMP roadmap", "On-premise option", "Custom DPA", "Compliance reporting", "Dedicated security review"],
                cta: "Contact Us",
                href: "#enterprise-intake",
                highlight: false,
              },
            ].map((tier, i) => (
              <Card key={i} className={`border ${tier.highlight ? "border-blue-600 shadow-lg shadow-blue-600/10" : "border-slate-200"} bg-white`}>
                <CardContent className="p-6">
                  {tier.highlight && (
                    <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-3">Most Popular</div>
                  )}
                  <div className="mb-4">
                    <div className="text-lg font-bold text-slate-900">{tier.name}</div>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-3xl font-extrabold text-slate-900">{tier.price}</span>
                      <span className="text-slate-500 text-sm">{tier.period}</span>
                    </div>
                    <div className="text-sm text-slate-500 mt-1">{tier.desc}</div>
                  </div>
                  <ul className="space-y-2 mb-6">
                    {tier.features.map((f, fi) => (
                      <li key={fi} className="flex items-start gap-2 text-sm text-slate-600">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button
                    onClick={() => {
                      if (tier.href.startsWith("#")) {
                        document.getElementById("enterprise-intake")?.scrollIntoView({ behavior: "smooth" });
                      } else {
                        window.location.href = tier.href;
                      }
                    }}
                    className={`w-full ${tier.highlight ? "bg-blue-600 hover:bg-blue-500 text-white" : "bg-slate-900 hover:bg-slate-800 text-white"}`}
                  >
                    {tier.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise Intake Form */}
      <section id="enterprise-intake" className="py-24 bg-slate-50">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-slate-900 mb-4" style={{letterSpacing: '-0.02em'}}>
                Talk to Our Enterprise Team
              </h2>
              <p className="text-lg text-slate-500">
                Not a demo request. A structured intake to understand your requirements and build a custom proposal within 1 business day.
              </p>
            </div>
            {submitted ? (
              <Card className="border border-emerald-200 bg-emerald-50">
                <CardContent className="p-8 text-center">
                  <CheckCircle2 className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Request Received</h3>
                  <p className="text-slate-600">Our enterprise team will contact you at <strong>{formData.email}</strong> within 1 business day.</p>
                </CardContent>
              </Card>
            ) : (
              <Card className="border border-slate-200 bg-white shadow-sm">
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name *</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                          className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Jane Smith"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Title</label>
                        <input
                          type="text"
                          value={formData.title}
                          onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
                          className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="CFO, Operations Director..."
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Company *</label>
                        <input
                          type="text"
                          required
                          value={formData.company}
                          onChange={e => setFormData(p => ({ ...p, company: e.target.value }))}
                          className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Acme Corp"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Work Email *</label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                          className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="jane@company.com"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Team Size</label>
                      <select
                        value={formData.teamSize}
                        onChange={e => setFormData(p => ({ ...p, teamSize: e.target.value }))}
                        className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      >
                        <option value="">Select team size</option>
                        <option value="25-50">25–50 people</option>
                        <option value="51-200">51–200 people</option>
                        <option value="201-1000">201–1,000 people</option>
                        <option value="1000+">1,000+ people</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Primary Use Case</label>
                      <textarea
                        rows={3}
                        value={formData.useCase}
                        onChange={e => setFormData(p => ({ ...p, useCase: e.target.value }))}
                        className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        placeholder="Describe your document workflow needs, current tools, and what you're looking to solve..."
                      />
                    </div>
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white py-6 text-base font-semibold"
                    >
                      Submit Enterprise Request
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                    <p className="text-xs text-center text-slate-400">
                      Response within 1 business day · No sales pressure · Custom proposal included
                    </p>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
