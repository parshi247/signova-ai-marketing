// OnboardingPage.tsx
// Design: Enterprise slate/indigo palette — no purple, no trial language
// Implements: Fork screen (Upload vs AI), 3-step AI path, upload escape hatch,
//             trust strip, GA4 events, post-action activation panel

import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Upload,
  Sparkles,
  ArrowRight,
  Shield,
  FileText,
  Users,
  CheckCircle2,
  ChevronRight,
  Lock,
  AlertCircle,
} from "lucide-react";

// ─── GA4 event helper ───────────────────────────────────────────────────────
function fireGA4(event: string, params?: Record<string, string>) {
  try {
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", event, params || {});
    }
  } catch (_) {}
}

// ─── Trust strip ────────────────────────────────────────────────────────────
function TrustStrip() {
  return (
    <div className="flex items-center justify-center gap-6 py-3 px-4 bg-slate-50 border-b border-slate-200 text-xs text-slate-500 font-medium tracking-wide">
      <span className="flex items-center gap-1.5">
        <Lock className="w-3 h-3 text-indigo-500" />
        256-bit encryption
      </span>
      <span className="hidden sm:flex items-center gap-1.5">
        <Shield className="w-3 h-3 text-indigo-500" />
        Audit trail enabled
      </span>
      <span className="flex items-center gap-1.5">
        <CheckCircle2 className="w-3 h-3 text-indigo-500" />
        ESIGN/UETA compliant
      </span>
    </div>
  );
}

// ─── Upload escape hatch ─────────────────────────────────────────────────────
function UploadEscapeHatch({ onSwitch }: { onSwitch: () => void }) {
  return (
    <div className="mt-6 text-center">
      <button
        onClick={onSwitch}
        className="text-sm text-slate-500 hover:text-indigo-600 transition-colors duration-150 underline underline-offset-2"
      >
        Prefer the traditional workflow? Upload your document instead →
      </button>
    </div>
  );
}

// ─── Step indicator ──────────────────────────────────────────────────────────
function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2 justify-center mb-6">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1.5 rounded-full transition-all duration-300 ${
            i < current
              ? "w-8 bg-indigo-600"
              : i === current
              ? "w-8 bg-indigo-400"
              : "w-4 bg-slate-200"
          }`}
        />
      ))}
      <span className="ml-2 text-xs text-slate-400 font-medium">
        {current + 1} / {total}
      </span>
    </div>
  );
}

// ─── AI Questionnaire (max 3 steps) ─────────────────────────────────────────
const DOC_TYPES = ["Contract", "NDA", "Offer Letter", "Other"];
const PARTY_TYPES = ["Client", "Vendor", "Employee", "Other"];

interface AIAnswers {
  docType: string;
  parties: string;
  terms: string;
}

function AIQuestionnaire({
  onComplete,
  onSwitchToUpload,
}: {
  onComplete: (answers: AIAnswers) => void;
  onSwitchToUpload: () => void;
}) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<AIAnswers>({
    docType: "",
    parties: "",
    terms: "",
  });

  const canAdvance = () => {
    if (step === 0) return !!answers.docType;
    if (step === 1) return !!answers.parties;
    if (step === 2) return true; // terms is optional
    return false;
  };

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      onComplete(answers);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <StepIndicator current={step} total={3} />

      {step === 0 && (
        <div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2 text-center">
            What are you creating?
          </h2>
          <p className="text-sm text-slate-500 text-center mb-6">
            Smart detection suggests fields — you approve.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {DOC_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => setAnswers({ ...answers, docType: type })}
                className={`p-4 rounded-lg border-2 text-sm font-medium transition-all duration-150 text-left ${
                  answers.docType === type
                    ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                    : "border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:bg-slate-50"
                }`}
              >
                <FileText className="w-4 h-4 mb-2 text-indigo-500" />
                {type}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 1 && (
        <div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2 text-center">
            Who is involved?
          </h2>
          <p className="text-sm text-slate-500 text-center mb-6">
            Smart detection suggests fields — you approve.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {PARTY_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => setAnswers({ ...answers, parties: type })}
                className={`p-4 rounded-lg border-2 text-sm font-medium transition-all duration-150 text-left ${
                  answers.parties === type
                    ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                    : "border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:bg-slate-50"
                }`}
              >
                <Users className="w-4 h-4 mb-2 text-indigo-500" />
                {type}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2 text-center">
            Any special terms?
          </h2>
          <p className="text-sm text-slate-500 text-center mb-6">
            Optional — describe any specific clauses or requirements.
          </p>
          <Textarea
            placeholder="e.g. 90-day non-compete, jurisdiction: Ontario, Canada..."
            value={answers.terms}
            onChange={(e) => setAnswers({ ...answers, terms: e.target.value })}
            className="min-h-[120px] border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 text-slate-800 placeholder:text-slate-400 resize-none"
          />
        </div>
      )}

      <div className="mt-6 flex gap-3">
        {step > 0 && (
          <Button
            variant="outline"
            onClick={() => setStep(step - 1)}
            className="flex-1 border-slate-200 text-slate-600 hover:bg-slate-50"
          >
            Back
          </Button>
        )}
        <Button
          onClick={handleNext}
          disabled={!canAdvance()}
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-all duration-150 disabled:opacity-40"
        >
          {step === 2 ? (
            <>
              Generate Draft <Sparkles className="w-4 h-4 ml-2" />
            </>
          ) : (
            <>
              Continue <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>

      <UploadEscapeHatch onSwitch={onSwitchToUpload} />
    </div>
  );
}

// ─── Draft preview (post-AI generation) ─────────────────────────────────────
function DraftPreview({
  answers,
  onEdit,
  onSend,
}: {
  answers: AIAnswers;
  onEdit: () => void;
  onSend: () => void;
}) {
  useEffect(() => {
    fireGA4("first_document_created", { path: "ai" });
  }, []);

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <CheckCircle2 className="w-5 h-5 text-green-500" />
        <h2 className="text-xl font-semibold text-slate-900">Draft ready</h2>
      </div>

      <Card className="border border-slate-200 shadow-sm mb-6">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <Badge className="bg-indigo-100 text-indigo-700 border-0 text-xs font-medium">
              {answers.docType}
            </Badge>
            <span className="text-xs text-slate-400">AI-assisted draft</span>
          </div>
          <div className="space-y-2 text-sm text-slate-600">
            <div className="flex gap-2">
              <span className="font-medium text-slate-700 w-20 shrink-0">Party type:</span>
              <span>{answers.parties}</span>
            </div>
            {answers.terms && (
              <div className="flex gap-2">
                <span className="font-medium text-slate-700 w-20 shrink-0">Terms:</span>
                <span className="line-clamp-2">{answers.terms}</span>
              </div>
            )}
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs text-slate-400">
            <AlertCircle className="w-3 h-3" />
            Smart detection suggests fields — you approve.
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={onEdit}
          className="flex-1 border-slate-200 text-slate-700 hover:bg-slate-50 font-medium"
        >
          Edit Draft
        </Button>
        <Button
          onClick={onSend}
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-all duration-150"
        >
          Send for Signature <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

// ─── Activation panel (post first action) ───────────────────────────────────
function ActivationPanel({
  path,
  onSend,
  onAddTeammate,
  fromCompetitor,
}: {
  path: "upload" | "ai";
  onSend: () => void;
  onAddTeammate: () => void;
  fromCompetitor: boolean;
}) {
  useEffect(() => {
    fireGA4("onboarding_completed", { path });
  }, [path]);

  return (
    <div className="max-w-lg mx-auto">
      <div className="text-center mb-8">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-6 h-6 text-green-600" />
        </div>
        <h2 className="text-xl font-semibold text-slate-900 mb-2">
          You're ready to go
        </h2>
        <p className="text-sm text-slate-500">
          Your workspace is configured. Take your first action.
        </p>
      </div>

      {fromCompetitor && (
        <Card className="border border-indigo-200 bg-indigo-50 mb-4">
          <CardContent className="p-4">
            <p className="text-sm font-medium text-indigo-800">
              Switching from DocuSign or Adobe Sign?
            </p>
            <p className="text-xs text-indigo-600 mt-1">
              Most teams save 60–80% on annual contract costs. Your plan includes unlimited templates and API access.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        <Button
          onClick={onSend}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 text-base transition-all duration-150 shadow-sm hover:shadow-md"
        >
          Send Your First Document <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
        <Button
          variant="outline"
          onClick={onAddTeammate}
          className="w-full border-slate-200 text-slate-700 hover:bg-slate-50 font-medium py-3 text-base"
        >
          <Users className="w-4 h-4 mr-2" />
          Add Teammate
        </Button>
      </div>
    </div>
  );
}

// ─── Main OnboardingPage ─────────────────────────────────────────────────────
type OnboardingView =
  | "fork"
  | "ai-q1"
  | "ai-q2"
  | "ai-q3"
  | "ai-draft"
  | "upload"
  | "activation";

export default function OnboardingPage() {
  const [, navigate] = useLocation();
  const [view, setView] = useState<OnboardingView>("fork");
  const [path, setPath] = useState<"upload" | "ai">("upload");
  const [aiAnswers, setAIAnswers] = useState<AIAnswers | null>(null);

  // Detect if user came from competitor page
  const fromCompetitor =
    typeof window !== "undefined" &&
    (document.referrer.includes("docusign") ||
      document.referrer.includes("adobe") ||
      document.referrer.includes("hellosign") ||
      document.referrer.includes("pandadoc") ||
      window.location.search.includes("from=competitor"));

  const handleForkUpload = () => {
    setPath("upload");
    fireGA4("onboarding_started", { path: "upload" });
    navigate("/upload");
  };

  const handleForkAI = () => {
    setPath("ai");
    fireGA4("onboarding_started", { path: "ai" });
    setView("ai-q1");
  };

  const handleAIComplete = (answers: AIAnswers) => {
    setAIAnswers(answers);
    setView("ai-draft");
  };

  const handleSwitchToUpload = () => {
    setPath("upload");
    fireGA4("onboarding_started", { path: "upload" });
    navigate("/upload");
  };

  const handleEditDraft = () => {
    navigate("/generate");
  };

  const handleSendDraft = () => {
    fireGA4("first_document_sent", { path: "ai" });
    setView("activation");
  };

  const handleSendFirst = () => {
    navigate("/upload");
  };

  const handleAddTeammate = () => {
    navigate("/settings?tab=team");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Trust strip */}
      <TrustStrip />

      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-indigo-600 rounded-md flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-slate-900 text-sm">Signova</span>
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
          >
            Skip for now
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">

          {/* ── Fork screen ── */}
          {view === "fork" && (
            <div>
              <div className="text-center mb-10">
                <h1 className="text-2xl font-bold text-slate-900 mb-2">
                  How would you like to start?
                </h1>
                <p className="text-slate-500 text-sm">
                  Choose the workflow that fits your process.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {/* Upload path */}
                <button
                  onClick={handleForkUpload}
                  className="group p-6 bg-white rounded-xl border-2 border-slate-200 hover:border-indigo-500 hover:shadow-md transition-all duration-150 text-left"
                >
                  <div className="w-10 h-10 bg-slate-100 group-hover:bg-indigo-100 rounded-lg flex items-center justify-center mb-4 transition-colors duration-150">
                    <Upload className="w-5 h-5 text-slate-600 group-hover:text-indigo-600 transition-colors duration-150" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-1 text-base">
                    Upload &amp; Send
                    <Badge className="ml-2 bg-green-100 text-green-700 border-0 text-xs font-medium">
                      Fastest
                    </Badge>
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Upload your document and send for signature in under 60 seconds.
                  </p>
                  <div className="mt-4 flex items-center gap-1 text-indigo-600 text-sm font-medium">
                    Get started <ChevronRight className="w-4 h-4" />
                  </div>
                </button>

                {/* AI path */}
                <button
                  onClick={handleForkAI}
                  className="group p-6 bg-white rounded-xl border-2 border-slate-200 hover:border-indigo-500 hover:shadow-md transition-all duration-150 text-left"
                >
                  <div className="w-10 h-10 bg-slate-100 group-hover:bg-indigo-100 rounded-lg flex items-center justify-center mb-4 transition-colors duration-150">
                    <Sparkles className="w-5 h-5 text-slate-600 group-hover:text-indigo-600 transition-colors duration-150" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-1 text-base">
                    Generate with AI
                    <Badge className="ml-2 bg-slate-100 text-slate-600 border-0 text-xs font-medium">
                      Optional
                    </Badge>
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Answer 3 quick questions and generate a draft instantly.
                  </p>
                  <div className="mt-4 flex items-center gap-1 text-indigo-600 text-sm font-medium">
                    Start generating <ChevronRight className="w-4 h-4" />
                  </div>
                </button>
              </div>

              <p className="text-center text-xs text-slate-400">
                AI is optional. You can upload your own document and place fields manually anytime.
              </p>
            </div>
          )}

          {/* ── AI Questionnaire (3 steps max) ── */}
          {(view === "ai-q1" || view === "ai-q2" || view === "ai-q3") && (
            <Card className="border border-slate-200 shadow-sm">
              <CardContent className="p-8">
                <AIQuestionnaire
                  onComplete={handleAIComplete}
                  onSwitchToUpload={handleSwitchToUpload}
                />
              </CardContent>
            </Card>
          )}

          {/* ── Draft preview ── */}
          {view === "ai-draft" && aiAnswers && (
            <Card className="border border-slate-200 shadow-sm">
              <CardContent className="p-8">
                <DraftPreview
                  answers={aiAnswers}
                  onEdit={handleEditDraft}
                  onSend={handleSendDraft}
                />
                <UploadEscapeHatch onSwitch={handleSwitchToUpload} />
              </CardContent>
            </Card>
          )}

          {/* ── Activation panel ── */}
          {view === "activation" && (
            <Card className="border border-slate-200 shadow-sm">
              <CardContent className="p-8">
                <ActivationPanel
                  path={path}
                  onSend={handleSendFirst}
                  onAddTeammate={handleAddTeammate}
                  fromCompetitor={fromCompetitor}
                />
              </CardContent>
            </Card>
          )}

        </div>
      </main>
    </div>
  );
}

