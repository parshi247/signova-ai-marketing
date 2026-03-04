/**
 * VerticalLandingPage.tsx
 * 
 * Shared component for all 8 vertical landing pages.
 * Design: Dark enterprise aesthetic — deep navy/slate backgrounds,
 * amber/gold accent for CTAs, clean sans-serif typography.
 * 
 * Required sections per directive:
 * 1. Industry pain breakdown
 * 2. Automation workflow diagram
 * 3. ROI calculator placeholder
 * 4. Hiring cost comparison
 * 5. DocuSign displacement section
 * 6. Enterprise tier highlight
 * 7. CTA: "Run Your AI Workflow Audit"
 * 8. CTA: "Activate Automation Now"
 */
import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import MarketingNav from "@/components/MarketingNav";
import MarketingFooter from "@/components/MarketingFooter";
import {
  ArrowRight,
  CheckCircle2,
  XCircle,
  TrendingDown,
  TrendingUp,
  Clock,
  DollarSign,
  Users,
  FileText,
  Zap,
  Shield,
  BarChart3,
  AlertTriangle,
  ChevronRight,
  Building2,
  Star,
} from "lucide-react";

export interface WorkflowStep {
  step: number;
  title: string;
  description: string;
  time: string;
}

export interface PainPoint {
  icon: any;
  title: string;
  description: string;
  cost: string;
}

export interface VerticalConfig {
  vertical: string;
  slug: string;
  heroHeadline: string;
  heroSubheadline: string;
  heroStat: { value: string; label: string };
  painPoints: PainPoint[];
  workflowSteps: WorkflowStep[];
  roiInputs: {
    teamSize: number;
    docsPerMonth: number;
    hoursPerDoc: number;
    hourlyRate: number;
  };
  hiringComparison: {
    adminSalary: number;
    signovaCost: number;
    tasksReplaced: string[];
  };
  docusignDisplacement: {
    docusignMonthly: number;
    signovaMonthly: number;
    featuresMissing: string[];
    featuresGained: string[];
  };
  testimonial: {
    quote: string;
    name: string;
    title: string;
    company: string;
  };
}

interface ROIState {
  teamSize: number;
  docsPerMonth: number;
  hoursPerDoc: number;
  hourlyRate: number;
}

export default function VerticalLandingPage({ config }: { config: VerticalConfig }) {
  const [roi, setRoi] = useState<ROIState>(config.roiInputs);

  const hoursSaved = roi.docsPerMonth * roi.hoursPerDoc * 0.85; // 85% time reduction
  const dollarsaved = hoursSaved * roi.hourlyRate;
  const annualSavings = dollarsaved * 12;
  const signovaAnnual = 99 * 12; // Professional tier
  const netROI = annualSavings - signovaAnnual;
  const roiMultiple = Math.round(netROI / signovaAnnual);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <MarketingNav />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 opacity-90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(59,130,246,0.15),_transparent_60%)]" />
        <div className="relative container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-400 mb-6">
              <Zap className="h-3 w-3" />
              AI Automation for {config.vertical}
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6 leading-tight">
              {config.heroHeadline}
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl leading-relaxed">
              {config.heroSubheadline}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button
                size="lg"
                className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-8 py-6 text-base"
                onClick={() => window.location.href = `/ai-workflow-audit?vertical=${config.slug}`}
              >
                Run Your AI Workflow Audit
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-slate-600 text-slate-200 hover:bg-slate-800 px-8 py-6 text-base"
                onClick={() => window.location.href = `/checkout?plan=professional&vertical=${config.slug}`}
              >
                Activate Automation Now
              </Button>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-800/50 border border-slate-700 w-fit">
              <div className="text-3xl font-bold text-amber-400">{config.heroStat.value}</div>
              <div className="text-sm text-slate-400">{config.heroStat.label}</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 1: INDUSTRY PAIN BREAKDOWN ── */}
      <section className="py-20 border-b border-slate-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-red-400 text-sm font-medium mb-3">
              <AlertTriangle className="h-4 w-4" />
              The Problem
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why {config.vertical} Firms Lose Revenue to Paperwork
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Every hour spent on manual document processing is an hour not spent on billable work, client relationships, or growth.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {config.painPoints.map((pain, i) => (
              <Card key={i} className="bg-slate-900 border-slate-800 hover:border-red-900/50 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-red-950/50 border border-red-900/30">
                      <pain.icon className="h-5 w-5 text-red-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white mb-2">{pain.title}</h3>
                      <p className="text-slate-400 text-sm mb-3">{pain.description}</p>
                      <div className="text-red-400 text-sm font-medium">{pain.cost}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 2: AUTOMATION WORKFLOW DIAGRAM ── */}
      <section className="py-20 border-b border-slate-800 bg-slate-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-blue-400 text-sm font-medium mb-3">
              <Zap className="h-4 w-4" />
              The Solution
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Your Automated {config.vertical} Workflow
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              From intake to signed document — fully automated. No manual steps, no bottlenecks.
            </p>
          </div>
          <div className="relative max-w-4xl mx-auto">
            {config.workflowSteps.map((step, i) => (
              <div key={i} className="flex gap-6 mb-8 last:mb-0">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-600 border-2 border-blue-400 flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {step.step}
                  </div>
                  {i < config.workflowSteps.length - 1 && (
                    <div className="w-0.5 flex-1 bg-gradient-to-b from-blue-600 to-slate-700 mt-2" />
                  )}
                </div>
                <div className="flex-1 pb-8 last:pb-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-white text-lg">{step.title}</h3>
                    <span className="text-xs text-blue-400 bg-blue-950/50 border border-blue-900/30 rounded-full px-3 py-1">
                      {step.time}
                    </span>
                  </div>
                  <p className="text-slate-400">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 3: ROI CALCULATOR ── */}
      <section className="py-20 border-b border-slate-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-green-400 text-sm font-medium mb-3">
              <BarChart3 className="h-4 w-4" />
              ROI Calculator
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Calculate Your Exact Savings
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Adjust the inputs below to see your firm's projected return on automation.
            </p>
          </div>
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
            {/* Inputs */}
            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="p-6">
                <h3 className="font-semibold text-white mb-6">Your Firm's Numbers</h3>
                <div className="space-y-5">
                  <div>
                    <label className="text-sm text-slate-400 mb-2 block">Team size (staff)</label>
                    <input
                      type="range" min={1} max={50} value={roi.teamSize}
                      onChange={e => setRoi(r => ({ ...r, teamSize: +e.target.value }))}
                      className="w-full accent-amber-500"
                    />
                    <div className="text-right text-amber-400 font-bold">{roi.teamSize} people</div>
                  </div>
                  <div>
                    <label className="text-sm text-slate-400 mb-2 block">Documents processed per month</label>
                    <input
                      type="range" min={5} max={500} step={5} value={roi.docsPerMonth}
                      onChange={e => setRoi(r => ({ ...r, docsPerMonth: +e.target.value }))}
                      className="w-full accent-amber-500"
                    />
                    <div className="text-right text-amber-400 font-bold">{roi.docsPerMonth} docs</div>
                  </div>
                  <div>
                    <label className="text-sm text-slate-400 mb-2 block">Hours spent per document (manual)</label>
                    <input
                      type="range" min={0.5} max={8} step={0.5} value={roi.hoursPerDoc}
                      onChange={e => setRoi(r => ({ ...r, hoursPerDoc: +e.target.value }))}
                      className="w-full accent-amber-500"
                    />
                    <div className="text-right text-amber-400 font-bold">{roi.hoursPerDoc} hrs</div>
                  </div>
                  <div>
                    <label className="text-sm text-slate-400 mb-2 block">Staff hourly cost (salary + overhead)</label>
                    <input
                      type="range" min={20} max={200} step={5} value={roi.hourlyRate}
                      onChange={e => setRoi(r => ({ ...r, hourlyRate: +e.target.value }))}
                      className="w-full accent-amber-500"
                    />
                    <div className="text-right text-amber-400 font-bold">${roi.hourlyRate}/hr</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Results */}
            <Card className="bg-gradient-to-br from-blue-950 to-slate-900 border-blue-900/50">
              <CardContent className="p-6">
                <h3 className="font-semibold text-white mb-6">Your Projected Savings</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-slate-700">
                    <span className="text-slate-400">Hours saved per month</span>
                    <span className="text-white font-bold">{Math.round(hoursSaved)} hrs</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-slate-700">
                    <span className="text-slate-400">Monthly cost savings</span>
                    <span className="text-green-400 font-bold">${Math.round(dollarsaved).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-slate-700">
                    <span className="text-slate-400">Annual savings</span>
                    <span className="text-green-400 font-bold text-xl">${Math.round(annualSavings).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-slate-700">
                    <span className="text-slate-400">Signova annual cost</span>
                    <span className="text-slate-300 font-medium">${signovaAnnual.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-white font-semibold">Net annual ROI</span>
                    <span className="text-amber-400 font-bold text-2xl">${Math.round(netROI).toLocaleString()}</span>
                  </div>
                  {roiMultiple > 0 && (
                    <div className="mt-4 p-4 rounded-lg bg-amber-500/10 border border-amber-500/30 text-center">
                      <div className="text-3xl font-bold text-amber-400">{roiMultiple}x</div>
                      <div className="text-sm text-slate-400">return on investment</div>
                    </div>
                  )}
                </div>
                <Button
                  className="w-full mt-6 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold"
                  onClick={() => window.location.href = `/ai-workflow-audit?vertical=${config.slug}&teamSize=${roi.teamSize}&docs=${roi.docsPerMonth}`}
                >
                  Get Your Full AI Audit Report
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ── SECTION 4: HIRING COST COMPARISON ── */}
      <section className="py-20 border-b border-slate-800 bg-slate-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-purple-400 text-sm font-medium mb-3">
              <Users className="h-4 w-4" />
              Hiring Cost Comparison
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Signova vs. Hiring an Admin
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              The real cost of a full-time document admin is 4–6x their base salary. Signova replaces that cost entirely.
            </p>
          </div>
          <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-6">
            {/* Hiring cost */}
            <Card className="bg-red-950/20 border-red-900/40">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="h-6 w-6 text-red-400" />
                  <h3 className="font-bold text-white text-lg">Hiring a Document Admin</h3>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Base salary</span>
                    <span className="text-white">${(config.hiringComparison.adminSalary).toLocaleString()}/yr</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Benefits + overhead (40%)</span>
                    <span className="text-white">${Math.round(config.hiringComparison.adminSalary * 0.4).toLocaleString()}/yr</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Recruiting + onboarding</span>
                    <span className="text-white">$8,000–$15,000</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Training time (lost productivity)</span>
                    <span className="text-white">3–6 months</span>
                  </div>
                  <div className="border-t border-red-900/40 pt-3 flex justify-between font-bold">
                    <span className="text-red-400">Total first-year cost</span>
                    <span className="text-red-400">${Math.round(config.hiringComparison.adminSalary * 1.4 + 11500).toLocaleString()}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  {["Still makes errors", "Needs vacation/sick days", "Cannot scale instantly", "Requires management overhead"].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-red-300">
                      <XCircle className="h-4 w-4 text-red-500 shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            {/* Signova cost */}
            <Card className="bg-green-950/20 border-green-900/40">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Zap className="h-6 w-6 text-green-400" />
                  <h3 className="font-bold text-white text-lg">Signova AI Automation</h3>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Professional plan</span>
                    <span className="text-white">$29/mo</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Setup time</span>
                    <span className="text-white">Under 1 hour</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Benefits + overhead</span>
                    <span className="text-white">$0</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Recruiting + onboarding</span>
                    <span className="text-white">$0</span>
                  </div>
                  <div className="border-t border-green-900/40 pt-3 flex justify-between font-bold">
                    <span className="text-green-400">Total first-year cost</span>
                    <span className="text-green-400">$348</span>
                  </div>
                </div>
                <div className="space-y-2">
                  {config.hiringComparison.tasksReplaced.map((task, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-green-300">
                      <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                      {task}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ── SECTION 5: DOCUSIGN DISPLACEMENT ── */}
      <section className="py-20 border-b border-slate-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-orange-400 text-sm font-medium mb-3">
              <TrendingDown className="h-4 w-4" />
              DocuSign Displacement
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why {config.vertical} Firms Are Leaving DocuSign
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              DocuSign raised prices 40% in 2023. Signova delivers more — at a fraction of the cost.
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6 mb-10">
              <Card className="bg-slate-900 border-slate-700 text-center">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-red-400 mb-1">${config.docusignDisplacement.docusignMonthly}/mo</div>
                  <div className="text-sm text-slate-400">DocuSign Business Pro</div>
                  <div className="text-xs text-red-400 mt-2">+40% price increase in 2023</div>
                </CardContent>
              </Card>
              <Card className="bg-amber-500/10 border-amber-500/30 text-center">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-amber-400 mb-1">
                    ${config.docusignDisplacement.docusignMonthly - config.docusignDisplacement.signovaMonthly}/mo
                  </div>
                  <div className="text-sm text-slate-400">You save every month</div>
                  <div className="text-xs text-green-400 mt-2">
                    ${(config.docusignDisplacement.docusignMonthly - config.docusignDisplacement.signovaMonthly) * 12}/year saved
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-slate-900 border-slate-700 text-center">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-green-400 mb-1">${config.docusignDisplacement.signovaMonthly}/mo</div>
                  <div className="text-sm text-slate-400">Signova Professional</div>
                  <div className="text-xs text-green-400 mt-2">AI generation included</div>
                </CardContent>
              </Card>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-slate-900 border-slate-800">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-red-400 mb-4 flex items-center gap-2">
                    <XCircle className="h-5 w-5" />
                    What DocuSign Doesn't Have
                  </h3>
                  <div className="space-y-3">
                    {config.docusignDisplacement.featuresMissing.map((f, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-slate-300">
                        <XCircle className="h-4 w-4 text-red-500 shrink-0" />
                        {f}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-slate-900 border-slate-800">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-green-400 mb-4 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5" />
                    What Signova Adds
                  </h3>
                  <div className="space-y-3">
                    {config.docusignDisplacement.featuresGained.map((f, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-slate-300">
                        <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                        {f}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 6: ENTERPRISE TIER HIGHLIGHT ── */}
      <section className="py-20 border-b border-slate-800 bg-gradient-to-br from-blue-950/50 to-slate-950">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <Building2 className="h-8 w-8 text-amber-400" />
              <div>
                <div className="text-sm text-amber-400 font-medium">Enterprise Tier</div>
                <h2 className="text-3xl font-bold text-white">Built for {config.vertical} Firms at Scale</h2>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <p className="text-slate-300 mb-6 leading-relaxed">
                  The Enterprise tier is designed for {config.vertical.toLowerCase()} organizations with complex workflows, 
                  multi-office operations, and compliance requirements. Unlimited documents, unlimited users, 
                  dedicated onboarding, and a custom SLA.
                </p>
                <div className="space-y-3">
                  {[
                    "Unlimited documents and AI generations",
                    "Unlimited team members and roles",
                    "Custom branding and white-label options",
                    "Dedicated account manager",
                    "Custom SLA with 99.9% uptime guarantee",
                    "Priority support with 2-hour response",
                    "Full audit trail and compliance reporting",
                    "API access for system integrations",
                    "Custom onboarding and migration assistance",
                    "Annual pricing with volume discounts",
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-slate-300">
                      <Star className="h-4 w-4 text-amber-400 shrink-0" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <Card className="bg-slate-900 border-amber-500/30">
                  <CardContent className="p-8 text-center">
                    <div className="text-amber-400 text-sm font-medium mb-2">Enterprise Pricing</div>
                    <div className="text-5xl font-bold text-white mb-2">Custom</div>
                    <div className="text-slate-400 mb-6">Based on team size and volume</div>
                    <div className="text-slate-300 text-sm mb-8">
                      Most {config.vertical.toLowerCase()} enterprise clients save $50,000–$200,000 annually 
                      compared to DocuSign + manual admin costs combined.
                    </div>
                    <Button
                      size="lg"
                      className="w-full bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold"
                      onClick={() => window.location.href = `/ai-workflow-audit?vertical=${config.slug}&plan=enterprise`}
                    >
                      Run Your AI Workflow Audit
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <div className="mt-4 text-xs text-slate-500">No commitment required. Results in 2 minutes.</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIAL ── */}
      <section className="py-16 border-b border-slate-800">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="text-4xl text-slate-600 mb-4">"</div>
            <blockquote className="text-xl text-slate-200 italic mb-6 leading-relaxed">
              {config.testimonial.quote}
            </blockquote>
            <div className="text-slate-400">
              <span className="font-semibold text-white">{config.testimonial.name}</span>
              {" · "}{config.testimonial.title}
              {" · "}{config.testimonial.company}
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Ready to Automate Your {config.vertical} Workflow?
          </h2>
          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
            Join hundreds of {config.vertical.toLowerCase()} firms already using Signova to eliminate document bottlenecks and close more business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-10 py-6 text-lg"
              onClick={() => window.location.href = `/ai-workflow-audit?vertical=${config.slug}`}
            >
              Run Your AI Workflow Audit
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-slate-600 text-slate-200 hover:bg-slate-800 px-10 py-6 text-lg"
              onClick={() => window.location.href = `/checkout?plan=professional&vertical=${config.slug}`}
            >
              Activate Automation Now
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-slate-500">
            <span className="flex items-center gap-1"><CheckCircle2 className="h-4 w-4 text-green-500" /> No credit card required</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="h-4 w-4 text-green-500" /> Setup in under 1 hour</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="h-4 w-4 text-green-500" /> Cancel anytime</span>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
