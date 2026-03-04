/**
 * AIWorkflowAudit.tsx
 * 
 * Phase 3: AI Workflow Audit + ROI Calculator Engine
 * 
 * Design: Dark enterprise, amber/gold CTAs, slate backgrounds.
 * 
 * Flow:
 * Step 1: Vertical selection + firm size
 * Step 2: Current workflow pain questionnaire (5 questions)
 * Step 3: Document volume + hourly cost inputs
 * Step 4: Rule-based ROI calculation (deterministic math)
 * Step 5: AI-personalized audit report + Stripe plan routing
 * 
 * No AI API calls in the calculator — pure math.
 * AI personalization is template-based string interpolation.
 * Stripe routing: starter (<$10k savings), professional ($10k-$50k), enterprise (>$50k)
 */
import { useState, useEffect } from "react";
import { Link, useLocation, useSearch } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import MarketingNav from "@/components/MarketingNav";
import MarketingFooter from "@/components/MarketingFooter";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  BarChart3,
  Clock,
  DollarSign,
  TrendingUp,
  Zap,
  Building2,
  FileText,
  Users,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";

// ── TYPES ──────────────────────────────────────────────────────────────────
interface AuditState {
  vertical: string;
  firmSize: number;
  painScores: Record<string, number>; // 1-5 scale
  docsPerMonth: number;
  hoursPerDoc: number;
  hourlyRate: number;
  currentTool: string;
  currentToolCost: number;
}

interface AuditResult {
  hoursSavedMonthly: number;
  dollarsSavedMonthly: number;
  annualSavings: number;
  signovaAnnualCost: number;
  netROI: number;
  roiMultiple: number;
  recommendedPlan: "starter" | "professional" | "enterprise";
  topPainAreas: string[];
  personalizedInsights: string[];
}

// ── VERTICAL CONFIG ─────────────────────────────────────────────────────────
const VERTICALS = [
  { id: "law", label: "Law Firm", icon: "⚖️" },
  { id: "real-estate", label: "Real Estate", icon: "🏠" },
  { id: "construction", label: "Construction", icon: "🏗️" },
  { id: "staffing", label: "Staffing Agency", icon: "👥" },
  { id: "insurance", label: "Insurance Agency", icon: "🛡️" },
  { id: "mortgage", label: "Mortgage Broker", icon: "🏦" },
  { id: "accounting", label: "Accounting Firm", icon: "📊" },
  { id: "healthcare", label: "Healthcare Practice", icon: "🏥" },
];

const PAIN_QUESTIONS: Record<string, { id: string; question: string; weight: number }[]> = {
  law: [
    { id: "drafting", question: "How much time does your team spend drafting documents manually?", weight: 1.5 },
    { id: "signatures", question: "How often do signature delays slow down client onboarding?", weight: 1.2 },
    { id: "compliance", question: "How concerned are you about compliance errors in documents?", weight: 1.3 },
    { id: "templates", question: "How inconsistent are your document templates across the firm?", weight: 1.0 },
    { id: "billing", question: "How much billable time is lost to administrative document work?", weight: 1.4 },
  ],
  "real-estate": [
    { id: "speed", question: "How often do paperwork delays cause you to lose deals?", weight: 1.5 },
    { id: "disclosures", question: "How difficult is it to keep disclosure forms compliant?", weight: 1.3 },
    { id: "coordination", question: "How challenging is multi-party signature coordination?", weight: 1.2 },
    { id: "templates", question: "How much time is spent on offer and contract preparation?", weight: 1.4 },
    { id: "storage", question: "How organized is your document storage and retrieval?", weight: 0.8 },
  ],
  construction: [
    { id: "changeorders", question: "How often are change orders disputed due to poor documentation?", weight: 1.5 },
    { id: "liens", question: "How difficult is lien waiver compliance across subcontractors?", weight: 1.4 },
    { id: "contracts", question: "How long does subcontractor agreement preparation take?", weight: 1.2 },
    { id: "tracking", question: "How hard is it to track who has signed what across projects?", weight: 1.1 },
    { id: "bids", question: "How much time is spent preparing bid packages?", weight: 1.0 },
  ],
  staffing: [
    { id: "placement", question: "How often do contract delays cause you to lose placements?", weight: 1.5 },
    { id: "fees", question: "How often are placement fees disputed due to contract gaps?", weight: 1.4 },
    { id: "onboarding", question: "How long does contractor onboarding documentation take?", weight: 1.2 },
    { id: "classification", question: "How concerned are you about worker classification compliance?", weight: 1.3 },
    { id: "msa", question: "How difficult is MSA negotiation with enterprise clients?", weight: 1.0 },
  ],
  insurance: [
    { id: "eo", question: "How concerned are you about E&O exposure from documentation errors?", weight: 1.5 },
    { id: "onboarding", question: "How long does new client policy documentation take?", weight: 1.3 },
    { id: "compliance", question: "How difficult is state regulatory compliance documentation?", weight: 1.4 },
    { id: "claims", question: "How often do claims documentation delays create problems?", weight: 1.2 },
    { id: "renewals", question: "How much time is spent on policy renewal documentation?", weight: 1.0 },
  ],
  mortgage: [
    { id: "respa", question: "How concerned are you about RESPA compliance in disclosures?", weight: 1.5 },
    { id: "speed", question: "How often do disclosure delays slow loan processing?", weight: 1.4 },
    { id: "closing", question: "How challenging is multi-party closing coordination?", weight: 1.2 },
    { id: "ratelocks", question: "How often do rate lock expirations cause problems?", weight: 1.3 },
    { id: "volume", question: "How difficult is managing documentation across 20+ loans?", weight: 1.1 },
  ],
  accounting: [
    { id: "engagement", question: "How much time is spent on engagement letter preparation?", weight: 1.5 },
    { id: "scope", question: "How often does scope creep reduce your firm's profitability?", weight: 1.4 },
    { id: "renewals", question: "How burdensome is the annual engagement letter renewal process?", weight: 1.3 },
    { id: "auth", question: "How difficult is managing tax authorization forms for clients?", weight: 1.2 },
    { id: "onboarding", question: "How long does new client onboarding documentation take?", weight: 1.0 },
  ],
  healthcare: [
    { id: "hipaa", question: "How concerned are you about HIPAA compliance in patient documents?", weight: 1.5 },
    { id: "intake", question: "How much time does patient intake documentation consume?", weight: 1.4 },
    { id: "consent", question: "How difficult is managing procedure-specific consent forms?", weight: 1.3 },
    { id: "capacity", question: "How much does intake bottleneck limit your daily patient capacity?", weight: 1.2 },
    { id: "providers", question: "How complex is provider agreement documentation?", weight: 1.0 },
  ],
};

// ── ROI CALCULATION ENGINE ──────────────────────────────────────────────────
function calculateROI(state: AuditState): AuditResult {
  const timeReductionFactor = 0.85; // 85% time reduction
  const hoursSavedMonthly = state.docsPerMonth * state.hoursPerDoc * timeReductionFactor;
  const dollarsSavedMonthly = hoursSavedMonthly * state.hourlyRate;
  const annualSavings = dollarsSavedMonthly * 12;

  // Current tool displacement savings
  const toolDisplacement = state.currentToolCost * 12;
  const totalAnnualSavings = annualSavings + toolDisplacement;

  // Recommended plan based on savings
  let recommendedPlan: "starter" | "professional" | "enterprise";
  let signovaAnnualCost: number;
  if (state.firmSize >= 20 || totalAnnualSavings >= 50000) {
    recommendedPlan = "enterprise";
    signovaAnnualCost = 2988; // $249/mo
  } else if (totalAnnualSavings >= 10000 || state.firmSize >= 5) {
    recommendedPlan = "professional";
    signovaAnnualCost = 348; // $29/mo
  } else {
    recommendedPlan = "starter";
    signovaAnnualCost = 228; // $19/mo
  }

  const netROI = totalAnnualSavings - signovaAnnualCost;
  const roiMultiple = Math.max(1, Math.round(netROI / signovaAnnualCost));

  // Identify top pain areas
  const painEntries = Object.entries(state.painScores)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);
  const topPainAreas = painEntries.map(([id]) => id);

  // Generate personalized insights
  const insights = generateInsights(state, topPainAreas, hoursSavedMonthly, dollarsSavedMonthly);

  return {
    hoursSavedMonthly: Math.round(hoursSavedMonthly),
    dollarsSavedMonthly: Math.round(dollarsSavedMonthly),
    annualSavings: Math.round(totalAnnualSavings),
    signovaAnnualCost,
    netROI: Math.round(netROI),
    roiMultiple,
    recommendedPlan,
    topPainAreas,
    personalizedInsights: insights,
  };
}

function generateInsights(
  state: AuditState,
  topPains: string[],
  hoursSaved: number,
  dollarsSaved: number
): string[] {
  const vertical = VERTICALS.find(v => v.id === state.vertical)?.label || "your industry";
  const insights: string[] = [];

  // Insight 1: Time savings framing
  if (hoursSaved >= 40) {
    insights.push(`Your team is losing the equivalent of a full-time employee to document administration. At ${state.docsPerMonth} documents per month, Signova would recover ${Math.round(hoursSaved)} hours — enough to handle ${Math.round(hoursSaved / 8)} additional client engagements monthly.`);
  } else if (hoursSaved >= 10) {
    insights.push(`Signova would recover ${Math.round(hoursSaved)} hours per month for your team — time that can be redirected to billable work or client acquisition.`);
  } else {
    insights.push(`Even at your current volume, Signova would save ${Math.round(hoursSaved)} hours per month and eliminate the compliance risk that comes with manual document preparation.`);
  }

  // Insight 2: Pain-specific insight
  const painInsights: Record<string, string> = {
    drafting: `Manual document drafting is your biggest time sink. Signova's AI generation reduces drafting time by 85% — from hours to minutes per document.`,
    signatures: `Signature delays are costing you client relationships. Signova's automated reminders and mobile-friendly signing eliminate the follow-up burden entirely.`,
    compliance: `Compliance errors in ${vertical.toLowerCase()} documents create serious liability. Signova's templates are maintained for regulatory compliance so you don't have to track changes manually.`,
    changeorders: `Undocumented change orders are the #1 cause of contractor disputes. Signova makes it effortless to generate and get signed change orders in real-time.`,
    fees: `Placement fee disputes stem from contract gaps. Signova's non-circumvention clauses and fee protection language are built into every placement agreement.`,
    eo: `E&O exposure from documentation errors is your highest-cost risk. Signova's audit trail provides defensible documentation for every client interaction.`,
    respa: `RESPA compliance requires precise timing and content. Signova generates CFPB-compliant disclosures with timestamps that satisfy regulatory requirements.`,
    engagement: `Engagement letter delays cost your firm billable time at the start of every client relationship. Signova reduces engagement letter prep from hours to minutes.`,
    hipaa: `HIPAA compliance in patient documentation requires specific language and audit trails. Signova's templates are HIPAA-compliant by design.`,
    speed: `In competitive markets, speed wins. Signova lets you prepare and send a complete document package in under 15 minutes.`,
  };

  const topPain = topPains[0];
  if (topPain && painInsights[topPain]) {
    insights.push(painInsights[topPain]);
  }

  // Insight 3: Competitor displacement
  if (state.currentTool === "docusign") {
    insights.push(`You're currently paying for DocuSign but still drafting documents manually. Signova replaces both the drafting time AND the DocuSign cost — saving you $${Math.round(dollarsSaved + state.currentToolCost)} per month total.`);
  } else if (state.currentTool === "manual") {
    insights.push(`Moving from fully manual processes to Signova automation typically delivers the fastest ROI — most ${vertical.toLowerCase()} firms see payback within the first week of use.`);
  } else {
    insights.push(`Consolidating from your current tool to Signova eliminates the gap between document generation and e-signature — one platform, one workflow, one price.`);
  }

  return insights;
}

// ── PLAN DETAILS ────────────────────────────────────────────────────────────
const PLAN_DETAILS = {
  starter: {
    name: "Starter",
    price: "$19/mo",
    priceId: "starter",
    features: ["50 documents/month", "E-signature included", "5 templates", "Email support"],
    color: "blue",
  },
  professional: {
    name: "Professional",
    price: "$29/mo",
    priceId: "professional",
    features: ["Unlimited documents", "AI generation included", "Unlimited templates", "Priority support", "Full audit trail"],
    color: "amber",
  },
  enterprise: {
    name: "Enterprise",
    price: "Custom",
    priceId: "enterprise",
    features: ["Unlimited everything", "Dedicated account manager", "Custom SLA", "API access", "White-label options", "Custom onboarding"],
    color: "purple",
  },
};

// ── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function AIWorkflowAudit() {
  const [step, setStep] = useState(1);
  const [auditState, setAuditState] = useState<AuditState>({
    vertical: "",
    firmSize: 5,
    painScores: {},
    docsPerMonth: 30,
    hoursPerDoc: 2,
    hourlyRate: 75,
    currentTool: "docusign",
    currentToolCost: 65,
  });
  const [result, setResult] = useState<AuditResult | null>(null);
  // Conversion tracking
  const searchStr = typeof window !== 'undefined' ? window.location.search : '';
  const urlParams = new URLSearchParams(searchStr);
  const conversionSource = urlParams.get('source') || 'direct';
  const auditMode = urlParams.get('mode') || 'standard';
  const [sessionId] = useState(() => Math.random().toString(36).slice(2) + Date.now().toString(36));

  // cost_mode_skip: if ?mode=cost, jump to document volume step
  useEffect(() => {
    if (auditMode === 'cost' && step === 1) {
      setStep(3);
    }
  }, [auditMode]);

  // Log audit event to server (non-blocking)
  const logAuditEvent = async (event: string, extra: Record<string, any> = {}) => {
    try {
      await fetch('/api/audit/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event,
          sessionId,
          conversionSource,
          mode: auditMode,
          vertical: auditState.vertical || null,
          firmSize: auditState.firmSize || null,
          docsPerMonth: auditState.docsPerMonth || null,
          currentProvider: auditState.currentTool || null,
          ...extra,
        }),
      });
    } catch (_) { /* non-fatal */ }
  };
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Read URL params for pre-fill
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const vertical = params.get("vertical");
    const teamSize = params.get("teamSize");
    const docs = params.get("docs");
    if (vertical) setAuditState(s => ({ ...s, vertical }));
    if (teamSize) setAuditState(s => ({ ...s, firmSize: parseInt(teamSize) }));
    if (docs) setAuditState(s => ({ ...s, docsPerMonth: parseInt(docs) }));
  }, []);

  const questions = auditState.vertical ? (PAIN_QUESTIONS[auditState.vertical] || PAIN_QUESTIONS.law) : [];

  const handlePainScore = (id: string, score: number) => {
    setAuditState(s => ({ ...s, painScores: { ...s.painScores, [id]: score } }));
  };

  const handleCalculate = () => {
    const r = calculateROI(auditState);
    setResult(r);
    setStep(5);
    logAuditEvent("audit_completed", {
      annualSavings: r.annualSavings,
      recommendedPlan: r.recommendedPlan,
    });
  };

  const handleActivate = async (plan: string) => {
    await logAuditEvent("checkout_initiated", { recommendedPlan: plan });
    window.location.href = `/checkout?plan=${plan}&source=${conversionSource}&vertical=${auditState.vertical}&audit=1`;
  };

  const progressPct = Math.round((step / 5) * 100);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <MarketingNav />

      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="h-6 w-6 text-amber-400" />
            <span className="text-amber-400 text-sm font-medium">AI Workflow Audit</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Your Free AI Workflow Audit</h1>
          <p className="text-slate-400">2-minute questionnaire. Personalized ROI report. No credit card required.</p>
          {/* Progress bar */}
          <div className="mt-6 max-w-md">
            <div className="flex justify-between text-xs text-slate-500 mb-2">
              <span>Step {step} of 5</span>
              <span>{progressPct}% complete</span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-amber-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-3xl">

        {/* ── STEP 1: VERTICAL + FIRM SIZE ── */}
        {step === 1 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">What type of firm do you run?</h2>
            <p className="text-slate-400 mb-8">Select your industry to get a personalized audit.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
              {VERTICALS.map(v => (
                <button
                  key={v.id}
                  onClick={() => setAuditState(s => ({ ...s, vertical: v.id }))}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    auditState.vertical === v.id
                      ? "border-amber-500 bg-amber-500/10 text-white"
                      : "border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-500"
                  }`}
                >
                  <div className="text-2xl mb-2">{v.icon}</div>
                  <div className="text-sm font-medium">{v.label}</div>
                </button>
              ))}
            </div>
            <div className="mb-8">
              <label className="text-sm text-slate-400 mb-3 block">How many people are on your team?</label>
              <input
                type="range" min={1} max={100} value={auditState.firmSize}
                onChange={e => setAuditState(s => ({ ...s, firmSize: +e.target.value }))}
                className="w-full accent-amber-500 mb-2"
              />
              <div className="text-amber-400 font-bold text-xl">{auditState.firmSize} {auditState.firmSize === 1 ? "person" : "people"}</div>
            </div>
            <Button
              size="lg"
              disabled={!auditState.vertical}
              onClick={() => { setStep(2); logAuditEvent("audit_started"); }}
              className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-8"
            >
              Continue
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        )}

        {/* ── STEP 2: PAIN QUESTIONNAIRE ── */}
        {step === 2 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Rate your current pain points</h2>
            <p className="text-slate-400 mb-8">1 = Not a problem, 5 = Critical pain point</p>
            <div className="space-y-6 mb-8">
              {questions.map(q => (
                <div key={q.id} className="p-5 rounded-xl bg-slate-900 border border-slate-800">
                  <p className="text-slate-200 mb-4">{q.question}</p>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(score => (
                      <button
                        key={score}
                        onClick={() => handlePainScore(q.id, score)}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                          auditState.painScores[q.id] === score
                            ? score >= 4
                              ? "bg-red-600 text-white"
                              : score >= 3
                              ? "bg-amber-600 text-white"
                              : "bg-blue-600 text-white"
                            : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                        }`}
                      >
                        {score}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-slate-600 mt-1">
                    <span>Not a problem</span>
                    <span>Critical</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(1)} className="border-slate-700 text-slate-300">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button
                size="lg"
                disabled={Object.keys(auditState.painScores).length < questions.length}
                onClick={() => setStep(3)}
                className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-8"
              >
                Continue <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        )}

        {/* ── STEP 3: DOCUMENT VOLUME + COSTS ── */}
        {step === 3 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Tell us about your document volume</h2>
            <p className="text-slate-400 mb-8">We'll calculate your exact ROI from automation.</p>
            <div className="space-y-6 mb-8">
              <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
                <label className="text-slate-300 font-medium mb-4 block">Documents processed per month</label>
                <input
                  type="range" min={5} max={500} step={5} value={auditState.docsPerMonth}
                  onChange={e => setAuditState(s => ({ ...s, docsPerMonth: +e.target.value }))}
                  className="w-full accent-amber-500 mb-2"
                />
                <div className="text-amber-400 font-bold text-2xl">{auditState.docsPerMonth} documents/month</div>
              </div>
              <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
                <label className="text-slate-300 font-medium mb-4 block">Average hours spent per document (manual process)</label>
                <input
                  type="range" min={0.25} max={8} step={0.25} value={auditState.hoursPerDoc}
                  onChange={e => setAuditState(s => ({ ...s, hoursPerDoc: +e.target.value }))}
                  className="w-full accent-amber-500 mb-2"
                />
                <div className="text-amber-400 font-bold text-2xl">{auditState.hoursPerDoc} hours/document</div>
              </div>
              <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
                <label className="text-slate-300 font-medium mb-4 block">Staff hourly cost (salary + benefits + overhead)</label>
                <input
                  type="range" min={20} max={300} step={5} value={auditState.hourlyRate}
                  onChange={e => setAuditState(s => ({ ...s, hourlyRate: +e.target.value }))}
                  className="w-full accent-amber-500 mb-2"
                />
                <div className="text-amber-400 font-bold text-2xl">${auditState.hourlyRate}/hour</div>
              </div>
              <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
                <label className="text-slate-300 font-medium mb-3 block">Current document tool</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[
                    { id: "docusign", label: "DocuSign", cost: 65 },
                    { id: "adobe", label: "Adobe Sign", cost: 45 },
                    { id: "pandadoc", label: "PandaDoc", cost: 49 },
                    { id: "manual", label: "Manual/Email", cost: 0 },
                  ].map(tool => (
                    <button
                      key={tool.id}
                      onClick={() => setAuditState(s => ({ ...s, currentTool: tool.id, currentToolCost: tool.cost }))}
                      className={`p-3 rounded-lg text-sm font-medium transition-all ${
                        auditState.currentTool === tool.id
                          ? "border border-amber-500 bg-amber-500/10 text-white"
                          : "border border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-500"
                      }`}
                    >
                      {tool.label}
                      {tool.cost > 0 && <div className="text-xs text-slate-500 mt-1">${tool.cost}/mo</div>}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => { setStep(2); logAuditEvent("audit_started"); }} className="border-slate-700 text-slate-300">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button
                size="lg"
                onClick={() => setStep(4)}
                className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-8"
              >
                Continue <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        )}

        {/* ── STEP 4: CONFIRM + CALCULATE ── */}
        {step === 4 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Ready to calculate your ROI</h2>
            <p className="text-slate-400 mb-8">Here's a summary of your audit inputs. Click Calculate to see your personalized report.</p>
            <Card className="bg-slate-900 border-slate-800 mb-8">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex justify-between py-2 border-b border-slate-800">
                    <span className="text-slate-400">Industry</span>
                    <span className="text-white font-medium">{VERTICALS.find(v => v.id === auditState.vertical)?.label}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-800">
                    <span className="text-slate-400">Team size</span>
                    <span className="text-white font-medium">{auditState.firmSize} people</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-800">
                    <span className="text-slate-400">Docs/month</span>
                    <span className="text-white font-medium">{auditState.docsPerMonth}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-800">
                    <span className="text-slate-400">Hours/doc</span>
                    <span className="text-white font-medium">{auditState.hoursPerDoc} hrs</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-800">
                    <span className="text-slate-400">Hourly cost</span>
                    <span className="text-white font-medium">${auditState.hourlyRate}/hr</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-800">
                    <span className="text-slate-400">Current tool</span>
                    <span className="text-white font-medium capitalize">{auditState.currentTool}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className="mb-6">
              <label className="text-sm text-slate-400 mb-2 block">Email address (to receive your full report)</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@yourfirm.com"
                className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(3)} className="border-slate-700 text-slate-300">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button
                size="lg"
                onClick={handleCalculate}
                className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-8"
              >
                <BarChart3 className="mr-2 h-5 w-5" />
                Calculate My ROI
              </Button>
            </div>
          </div>
        )}

        {/* ── STEP 5: RESULTS ── */}
        {step === 5 && result && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-full bg-green-500/20 border border-green-500/30">
                <CheckCircle2 className="h-6 w-6 text-green-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Your AI Workflow Audit Report</h2>
                <p className="text-slate-400 text-sm">Based on your {VERTICALS.find(v => v.id === auditState.vertical)?.label.toLowerCase()} workflow</p>
              </div>
            </div>

            {/* ROI Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Hours saved/month", value: `${result.hoursSavedMonthly} hrs`, icon: Clock, color: "blue" },
                { label: "Monthly savings", value: `$${result.dollarsSavedMonthly.toLocaleString()}`, icon: DollarSign, color: "green" },
                { label: "Annual savings", value: `$${result.annualSavings.toLocaleString()}`, icon: TrendingUp, color: "amber" },
                { label: "ROI multiple", value: `${result.roiMultiple}x`, icon: BarChart3, color: "purple" },
              ].map((metric, i) => (
                <Card key={i} className="bg-slate-900 border-slate-800">
                  <CardContent className="p-4 text-center">
                    <metric.icon className={`h-5 w-5 mx-auto mb-2 ${
                      metric.color === "blue" ? "text-blue-400" :
                      metric.color === "green" ? "text-green-400" :
                      metric.color === "amber" ? "text-amber-400" : "text-purple-400"
                    }`} />
                    <div className={`text-2xl font-bold mb-1 ${
                      metric.color === "blue" ? "text-blue-400" :
                      metric.color === "green" ? "text-green-400" :
                      metric.color === "amber" ? "text-amber-400" : "text-purple-400"
                    }`}>{metric.value}</div>
                    <div className="text-xs text-slate-500">{metric.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Personalized Insights */}
            <Card className="bg-slate-900 border-slate-800 mb-8">
              <CardContent className="p-6">
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <Zap className="h-5 w-5 text-amber-400" />
                  Personalized Insights for Your Firm
                </h3>
                <div className="space-y-4">
                  {result.personalizedInsights.map((insight, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 text-xs font-bold shrink-0 mt-0.5">
                        {i + 1}
                      </div>
                      <p className="text-slate-300 text-sm leading-relaxed">{insight}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recommended Plan */}
            <div className="mb-8">
              <h3 className="font-semibold text-white mb-4">Recommended Plan for Your Firm</h3>
              {(() => {
                const plan = PLAN_DETAILS[result.recommendedPlan];
                return (
                  <Card className={`border-2 ${
                    result.recommendedPlan === "enterprise" ? "border-purple-500/50 bg-purple-950/20" :
                    result.recommendedPlan === "professional" ? "border-amber-500/50 bg-amber-950/20" :
                    "border-blue-500/50 bg-blue-950/20"
                  }`}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <div className={`text-sm font-medium mb-1 ${
                            result.recommendedPlan === "enterprise" ? "text-purple-400" :
                            result.recommendedPlan === "professional" ? "text-amber-400" : "text-blue-400"
                          }`}>Recommended</div>
                          <h4 className="text-xl font-bold text-white">{plan.name}</h4>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold text-white">{plan.price}</div>
                          {result.recommendedPlan !== "enterprise" && <div className="text-slate-400 text-sm">billed monthly</div>}
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-2 mb-6">
                        {plan.features.map((f, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm text-slate-300">
                            <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                            {f}
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-3">
                        <Button
                          size="lg"
                          className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold"
                          onClick={() => handleActivate(result.recommendedPlan)}
                        >
                          Activate Automation Now
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                        {result.recommendedPlan !== "enterprise" && (
                          <Button
                            variant="outline"
                            className="border-slate-600 text-slate-300 hover:bg-slate-800"
                            onClick={() => handleActivate("enterprise")}
                          >
                            <Building2 className="mr-2 h-4 w-4" />
                            Enterprise
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })()}
            </div>

            {/* Cost comparison */}
            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="p-6">
                <h3 className="font-semibold text-white mb-4">Your Investment vs. Return</h3>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-slate-800">
                    <span className="text-slate-400">Signova annual cost</span>
                    <span className="text-white">${result.signovaAnnualCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-800">
                    <span className="text-slate-400">Annual savings from automation</span>
                    <span className="text-green-400 font-medium">${result.annualSavings.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-white font-semibold">Net annual return</span>
                    <span className="text-amber-400 font-bold text-xl">${result.netROI.toLocaleString()}</span>
                  </div>
                </div>
                <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-center text-sm text-amber-300">
                  Signova pays for itself in the first {result.roiMultiple > 10 ? "week" : result.roiMultiple > 5 ? "2 weeks" : "month"} of use.
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <MarketingFooter />
    </div>
  );
}
