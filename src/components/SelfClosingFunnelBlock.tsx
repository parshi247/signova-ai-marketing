import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { Shield, FileCheck, Globe, Zap, ArrowRight, X } from "lucide-react";

// ============================================================
// SelfClosingFunnelBlock
// Required on all industry + competitor landing pages.
// Contains: dual CTA, trust block, savings calculator,
//           3-question plan qualifier, exit-intent capture.
// ============================================================

interface SelfClosingFunnelBlockProps {
  competitorName?: string;
  competitorPrice?: number; // monthly USD
  industryName?: string;
}

const PLANS = [
  { name: "Starter", price: 19, docs: 25, users: 1, ai: false },
  { name: "Professional", price: 39, docs: 100, users: 5, ai: true },
  { name: "Business", price: 79, docs: 500, users: 15, ai: true },
  { name: "Enterprise", price: 149, docs: -1, users: -1, ai: true },
];

export function SelfClosingFunnelBlock({
  competitorName = "DocuSign",
  competitorPrice = 49,
  industryName,
}: SelfClosingFunnelBlockProps) {
  const [, setLocation] = useLocation();
  const [docsPerMonth, setDocsPerMonth] = useState(20);
  const [qualifierStep, setQualifierStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [recommendedPlan, setRecommendedPlan] = useState<typeof PLANS[0] | null>(null);
  const [exitEmail, setExitEmail] = useState("");
  const [exitSubmitted, setExitSubmitted] = useState(false);
  const [showExitCapture, setShowExitCapture] = useState(false);

  // Savings calculator
  const signovaPrice = docsPerMonth <= 25 ? 19 : docsPerMonth <= 100 ? 39 : docsPerMonth <= 500 ? 79 : 149;
  const annualSavings = Math.max(0, (competitorPrice - signovaPrice) * 12);

  // Plan qualifier logic
  const qualifierQuestions = [
    {
      q: "How many documents do you send per month?",
      key: "docs",
      options: ["1–10", "11–50", "51–200", "200+"],
    },
    {
      q: "How many team members need access?",
      key: "users",
      options: ["Just me", "2–5", "6–20", "20+"],
    },
    {
      q: "Do you need AI document generation?",
      key: "ai",
      options: ["Yes, definitely", "Nice to have", "No, just signing"],
    },
  ];

  function handleAnswer(key: string, value: string) {
    const newAnswers = { ...answers, [key]: value };
    setAnswers(newAnswers);
    if (qualifierStep < qualifierQuestions.length - 1) {
      setQualifierStep(qualifierStep + 1);
    } else {
      // Recommend plan
      const docs = newAnswers.docs;
      const users = newAnswers.users;
      const ai = newAnswers.ai;
      let plan = PLANS[0];
      if (docs === "200+" || users === "20+") plan = PLANS[3];
      else if (docs === "51–200" || users === "6–20") plan = PLANS[2];
      else if (docs === "11–50" || users === "2–5" || ai === "Yes, definitely") plan = PLANS[1];
      setRecommendedPlan(plan);
    }
  }

  function handleExitSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Fire GA4 event
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "exit_intent_capture", { email: exitEmail });
    }
    setExitSubmitted(true);
  }

  return (
    <div className="w-full">
      {/* ── DUAL CTA ── */}
      <section className="py-16 px-4 bg-slate-900 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {industryName
              ? `The Smarter Document Platform for ${industryName}`
              : `Switch from ${competitorName} Today`}
          </h2>
          <p className="text-slate-300 text-lg mb-8">
            AI-assisted document generation and secure e-signing — always in your control.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-4 text-base shadow-lg transition-all duration-150 hover:-translate-y-0.5"
              onClick={() => {
                if (typeof window !== "undefined" && (window as any).gtag)
                  (window as any).gtag("event", "cta_click", { cta: "generate_with_ai" });
                setLocation("/register?path=generate");
              }}
            >
              <Zap className="mr-2 h-5 w-5" />
              Generate with AI
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-slate-400 text-white hover:bg-slate-800 font-semibold px-8 py-4 text-base transition-all duration-150 hover:-translate-y-0.5"
              onClick={() => {
                if (typeof window !== "undefined" && (window as any).gtag)
                  (window as any).gtag("event", "cta_click", { cta: "upload_and_send" });
                setLocation("/register?path=upload");
              }}
            >
              <FileCheck className="mr-2 h-5 w-5" />
              Upload &amp; Send
            </Button>
          </div>
        </div>
      </section>

      {/* ── TRUST BLOCK ── */}
      <section className="py-10 px-4 bg-slate-800 text-white border-t border-slate-700">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { icon: Shield, label: "256-bit AES Encryption" },
            { icon: FileCheck, label: "ESIGN & UETA Compliant" },
            { icon: Globe, label: "Multi-Jurisdiction Legal" },
            { icon: Zap, label: "Audit Trail — Every Action" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <Icon className="h-7 w-7 text-indigo-400" />
              <span className="text-sm text-slate-300 font-medium">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── SAVINGS CALCULATOR ── */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            How Much Could You Save vs. {competitorName}?
          </h2>
          <p className="text-slate-500 mb-8 text-sm">
            Adjust the slider to see your annual savings.
          </p>
          <div className="bg-slate-50 rounded-2xl p-8 shadow-sm border border-slate-200">
            <label className="block text-slate-700 font-medium mb-3">
              Documents sent per month: <span className="text-indigo-700 font-bold">{docsPerMonth}</span>
            </label>
            <input
              type="range"
              min={1}
              max={600}
              value={docsPerMonth}
              onChange={(e) => {
                setDocsPerMonth(Number(e.target.value));
                if (typeof window !== "undefined" && (window as any).gtag)
                  (window as any).gtag("event", "calculator_used", { docs: e.target.value });
              }}
              className="w-full accent-indigo-600 mb-6"
            />
            <div className="grid grid-cols-3 gap-4 text-center mb-6">
              <div className="bg-red-50 rounded-xl p-4">
                <div className="text-2xl font-bold text-red-600">${competitorPrice}/mo</div>
                <div className="text-xs text-slate-500 mt-1">{competitorName}</div>
              </div>
              <div className="bg-indigo-50 rounded-xl p-4">
                <div className="text-2xl font-bold text-indigo-700">${signovaPrice}/mo</div>
                <div className="text-xs text-slate-500 mt-1">Signova</div>
              </div>
              <div className="bg-green-50 rounded-xl p-4">
                <div className="text-2xl font-bold text-green-600">${annualSavings.toLocaleString()}/yr</div>
                <div className="text-xs text-slate-500 mt-1">Annual Savings</div>
              </div>
            </div>
            <Button
              className="bg-indigo-700 hover:bg-indigo-800 text-white w-full"
              onClick={() => setLocation("/register?path=generate")}
            >
              Start Saving — Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* ── PLAN QUALIFIER ── */}
      <section className="py-16 px-4 bg-indigo-50">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Find Your Right Plan</h2>
          <p className="text-slate-500 mb-8 text-sm">3 quick questions — we'll recommend the best fit.</p>

          {recommendedPlan ? (
            <Card className="p-8 shadow-md border-indigo-200 bg-white">
              <div className="text-indigo-600 font-semibold text-sm mb-1">Recommended for you</div>
              <div className="text-3xl font-bold text-slate-900 mb-1">{recommendedPlan.name}</div>
              <div className="text-4xl font-bold text-indigo-700 mb-4">${recommendedPlan.price}<span className="text-base font-normal text-slate-500">/mo</span></div>
              <ul className="text-sm text-slate-600 space-y-1 mb-6 text-left">
                <li>✓ {recommendedPlan.docs === -1 ? "Unlimited" : recommendedPlan.docs} documents/month</li>
                <li>✓ {recommendedPlan.users === -1 ? "Unlimited" : recommendedPlan.users} user{recommendedPlan.users !== 1 ? "s" : ""}</li>
                {recommendedPlan.ai && <li>✓ AI document generation included</li>}
                <li>✓ Audit trail &amp; encryption</li>
              </ul>
              <Button
                className="bg-indigo-700 hover:bg-indigo-800 text-white w-full"
                onClick={() => {
                  if (typeof window !== "undefined" && (window as any).gtag)
                    (window as any).gtag("event", "plan_recommended", { plan: recommendedPlan.name });
                  setLocation(`/checkout?plan=${recommendedPlan.name.toLowerCase()}`);
                }}
              >
                Get Started — {recommendedPlan.name} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <button
                className="mt-3 text-xs text-slate-400 hover:text-slate-600 underline"
                onClick={() => { setQualifierStep(0); setAnswers({}); setRecommendedPlan(null); }}
              >
                Start over
              </button>
            </Card>
          ) : (
            <Card className="p-8 shadow-md border-indigo-200 bg-white">
              <div className="text-xs text-slate-400 mb-4">
                Question {qualifierStep + 1} of {qualifierQuestions.length}
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5 mb-6">
                <div
                  className="bg-indigo-600 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${((qualifierStep) / qualifierQuestions.length) * 100}%` }}
                />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-6">
                {qualifierQuestions[qualifierStep].q}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {qualifierQuestions[qualifierStep].options.map((opt) => (
                  <button
                    key={opt}
                    className="border-2 border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 rounded-xl p-3 text-sm font-medium text-slate-700 transition-all duration-150"
                    onClick={() => handleAnswer(qualifierQuestions[qualifierStep].key, opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </Card>
          )}
        </div>
      </section>

      {/* ── EXIT-INTENT CAPTURE ── */}
      {showExitCapture && !exitSubmitted && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
            <button
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
              onClick={() => setShowExitCapture(false)}
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Before you go —</h3>
            <p className="text-slate-500 text-sm mb-6">
              Get a personalized Signova vs. {competitorName} comparison sent to your inbox. No spam, ever.
            </p>
            <form onSubmit={handleExitSubmit} className="space-y-3">
              <input
                type="email"
                required
                placeholder="your@email.com"
                value={exitEmail}
                onChange={(e) => setExitEmail(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <Button type="submit" className="bg-indigo-700 hover:bg-indigo-800 text-white w-full">
                Send My Comparison
              </Button>
            </form>
          </div>
        </div>
      )}
      {exitSubmitted && showExitCapture && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
            <div className="text-4xl mb-4">✓</div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">You're all set</h3>
            <p className="text-slate-500 text-sm mb-6">Check your inbox for the comparison guide.</p>
            <Button onClick={() => setShowExitCapture(false)} className="bg-indigo-700 text-white">Close</Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SelfClosingFunnelBlock;

