/**
 * UsageNudge.tsx — Enhanced
 * Intelligent upgrade nudge system per Signova Master Execution Directive Section III.
 *
 * Covers BOTH eSignature usage AND AI document usage.
 * Whichever metric is highest drives the nudge threshold.
 *
 * Thresholds:
 *   70% → soft suggestion (inline banner, dismissible for 24h)
 *   85% → visible upgrade banner (persistent, styled)
 *   95% → modal upgrade prompt (once per session)
 *  100% → hard block with CTA (never dismissible)
 *
 * Tone: Professional, Advisory, Empowering. Never desperate. No artificial urgency.
 */
import React, { useState, useEffect } from "react";
import { Link } from "wouter";
import { X, TrendingUp, Zap, AlertTriangle, FileSignature, FileText } from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface CreditsData {
  credits: number;
  subscriptionTier?: string;
  aiDocsUsedThisMonth?: number;
  monthlyAiDocLimit?: number;
  usagePercent?: number;
}

interface UsageStats {
  eSignatures: {
    monthlyAllowance: number;
    usedThisMonth: number;
    remaining: number;
    purchasedCredits: number;
  };
  aiDocs: {
    monthlyAllowance: number;
    usedThisMonth: number;
    remaining: number;
    purchasedCredits: number;
  };
  resetDate?: Date | string | null;
  tier?: string;
}

interface UsageNudgeProps {
  credits?: CreditsData;
  usageStats?: UsageStats;
  planName?: string;
  onDismiss?: () => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const NUDGE_DISMISSED_KEY = "signova_nudge_dismissed_at";
const DISMISS_COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 hours

const UPGRADE_PLANS = [
  { name: "Starter", price: "$9/mo", path: "/checkout?plan=starter", docs: 10, sigs: 10 },
  { name: "Professional", price: "$29/mo", path: "/checkout?plan=professional", docs: 50, sigs: 50 },
  { name: "Business", price: "$79/mo", path: "/checkout?plan=business", docs: 500, sigs: 500 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function wasDismissedRecently(): boolean {
  try {
    const ts = localStorage.getItem(NUDGE_DISMISSED_KEY);
    if (!ts) return false;
    return Date.now() - parseInt(ts, 10) < DISMISS_COOLDOWN_MS;
  } catch {
    return false;
  }
}

function markDismissed() {
  try {
    localStorage.setItem(NUDGE_DISMISSED_KEY, String(Date.now()));
  } catch {
    // ignore
  }
}

function calcPct(used: number, limit: number): number {
  if (limit === -1) return -1; // unlimited
  if (limit === 0) return 0;
  return Math.min(100, Math.round((used / limit) * 100));
}

// ─── UsageProgressBar (exported for sidebar use) ─────────────────────────────

export function UsageProgressBar({ credits }: { credits: CreditsData | undefined }) {
  if (!credits) return null;
  const limit = credits.monthlyAiDocLimit ?? 0;
  const used = credits.aiDocsUsedThisMonth ?? 0;

  if (limit === -1) {
    return (
      <div className="flex items-center gap-1 text-xs text-green-600">
        <span>∞</span>
        <span>Unlimited</span>
      </div>
    );
  }
  if (limit === 0) return null;

  const pct = Math.min(100, Math.round((used / limit) * 100));
  const remaining = Math.max(0, limit - used);
  let barColor = "bg-green-500";
  if (pct >= 95) barColor = "bg-red-500";
  else if (pct >= 85) barColor = "bg-orange-500";
  else if (pct >= 70) barColor = "bg-yellow-500";

  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>{remaining} AI docs left</span>
        <span>{pct}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-1.5">
        <div
          className={`${barColor} h-1.5 rounded-full transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ─── Dual Metric Progress Bar ─────────────────────────────────────────────────

export function DualUsageProgressBar({ usageStats }: { usageStats: UsageStats | undefined }) {
  if (!usageStats) return null;

  const sigPct = calcPct(usageStats.eSignatures.usedThisMonth, usageStats.eSignatures.monthlyAllowance);
  const docPct = calcPct(usageStats.aiDocs.usedThisMonth, usageStats.aiDocs.monthlyAllowance);

  const metrics = [
    {
      label: "E-Signatures",
      icon: <FileSignature size={12} />,
      used: usageStats.eSignatures.usedThisMonth,
      limit: usageStats.eSignatures.monthlyAllowance,
      pct: sigPct,
    },
    {
      label: "AI Documents",
      icon: <FileText size={12} />,
      used: usageStats.aiDocs.usedThisMonth,
      limit: usageStats.aiDocs.monthlyAllowance,
      pct: docPct,
    },
  ].filter((m) => m.limit !== 0 && m.pct !== -1);

  if (metrics.length === 0) return null;

  return (
    <div className="space-y-2">
      {metrics.map((m) => {
        let barColor = "bg-green-500";
        if (m.pct >= 95) barColor = "bg-red-500";
        else if (m.pct >= 85) barColor = "bg-orange-500";
        else if (m.pct >= 70) barColor = "bg-yellow-500";

        return (
          <div key={m.label}>
            <div className="flex justify-between items-center text-xs text-gray-500 mb-1">
              <span className="flex items-center gap-1">
                {m.icon}
                {m.label}
              </span>
              <span>
                {m.used}/{m.limit === -1 ? "∞" : m.limit}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className={`${barColor} h-1.5 rounded-full transition-all duration-500`}
                style={{ width: `${m.pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Main UsageNudge Component ────────────────────────────────────────────────

export default function UsageNudge({ credits, usageStats, planName, onDismiss }: UsageNudgeProps) {
  const [dismissed, setDismissed] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Derive metrics from either usageStats (preferred) or legacy credits
  const sigPct = usageStats
    ? calcPct(usageStats.eSignatures.usedThisMonth, usageStats.eSignatures.monthlyAllowance)
    : -1;

  const aiDocLimit = usageStats?.aiDocs.monthlyAllowance ?? credits?.monthlyAiDocLimit ?? 0;
  const aiDocUsed = usageStats?.aiDocs.usedThisMonth ?? credits?.aiDocsUsedThisMonth ?? 0;
  const aiDocPct = calcPct(aiDocUsed, aiDocLimit);

  // The highest non-unlimited percentage drives the nudge
  const activePcts = [sigPct, aiDocPct].filter((p) => p >= 0);
  const pct = activePcts.length > 0 ? Math.max(...activePcts) : 0;

  // Determine which metric is driving the nudge
  const drivingMetric =
    sigPct >= aiDocPct && sigPct >= 0
      ? "e-signatures"
      : aiDocPct >= 0
      ? "AI documents"
      : "usage";

  const tier = usageStats?.tier ?? credits?.subscriptionTier ?? "free";
  const displayPlan = planName || tier;

  // Suggest the next plan up
  const nextPlan =
    tier === "free"
      ? UPGRADE_PLANS[0]
      : tier === "starter"
      ? UPGRADE_PLANS[1]
      : UPGRADE_PLANS[2];

  useEffect(() => {
    if (wasDismissedRecently()) {
      setDismissed(true);
    }
  }, []);

  // 95%+ → show modal once per session
  useEffect(() => {
    if (pct >= 95 && !wasDismissedRecently()) {
      const shownKey = "signova_modal_shown_session";
      if (!sessionStorage.getItem(shownKey)) {
        setShowModal(true);
        sessionStorage.setItem(shownKey, "1");
      }
    }
  }, [pct]);

  const handleDismiss = () => {
    markDismissed();
    setDismissed(true);
    setShowModal(false);
    onDismiss?.();
  };

  // Nothing to show: unlimited or no data
  if (pct < 0 || pct === 0) return null;

  // ── 100% Hard Block ──────────────────────────────────────────────────────────
  if (pct >= 100) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
        <AlertTriangle className="text-red-500 mt-0.5 flex-shrink-0" size={18} />
        <div className="flex-1">
          <p className="text-sm font-semibold text-red-800">
            You have reached your {drivingMetric} limit for this billing period.
          </p>
          <p className="text-xs text-red-600 mt-1">
            Upgrade your plan to continue without interruption. Your work is safe — no data is lost.
          </p>
          <div className="flex gap-2 mt-3 flex-wrap">
            {UPGRADE_PLANS.slice(0, 2).map((plan) => (
              <Link
                key={plan.name}
                to={plan.path}
                className="inline-block px-4 py-1.5 bg-red-600 text-white text-xs font-medium rounded-md hover:bg-red-700 transition"
              >
                {plan.name} — {plan.price}
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── 95% Modal Prompt ─────────────────────────────────────────────────────────
  if (showModal && pct >= 95 && !dismissed) {
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="text-orange-500" size={20} />
              <h3 className="text-base font-semibold text-gray-900">
                Almost at your limit
              </h3>
            </div>
            <button
              onClick={handleDismiss}
              className="text-gray-400 hover:text-gray-600 transition"
              aria-label="Dismiss"
            >
              <X size={18} />
            </button>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            You have used <strong>{pct}%</strong> of your {drivingMetric} allowance on the{" "}
            <strong className="capitalize">{displayPlan}</strong> plan. Upgrading now ensures
            uninterrupted access for you and your signers.
          </p>
          {nextPlan && (
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 mb-4">
              <p className="text-xs font-semibold text-indigo-700 mb-1">
                Recommended: {nextPlan.name} Plan
              </p>
              <p className="text-xs text-indigo-600">
                {nextPlan.docs} documents/month · {nextPlan.sigs} e-signatures · {nextPlan.price}
              </p>
            </div>
          )}
          <div className="flex gap-2">
            {nextPlan && (
              <Link
                to={nextPlan.path}
                className="flex-1 text-center px-4 py-2 bg-indigo-700 text-white text-sm font-medium rounded-lg hover:bg-indigo-800 transition"
              >
                Upgrade to {nextPlan.name}
              </Link>
            )}
            <button
              onClick={handleDismiss}
              className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition"
            >
              Later
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── 85% Persistent Banner ────────────────────────────────────────────────────
  if (pct >= 85 && !dismissed) {
    return (
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-start gap-3">
        <TrendingUp className="text-orange-500 mt-0.5 flex-shrink-0" size={18} />
        <div className="flex-1">
          <p className="text-sm font-semibold text-orange-800">
            {pct}% of your {drivingMetric} used this month
          </p>
          <p className="text-xs text-orange-600 mt-1">
            Consider upgrading before you reach your limit to avoid any workflow disruptions.
          </p>
          <div className="flex items-center gap-3 mt-2">
            {nextPlan && (
              <Link
                to={nextPlan.path}
                className="text-xs font-medium text-orange-700 underline hover:text-orange-900 transition"
              >
                View {nextPlan.name} Plan ({nextPlan.price})
              </Link>
            )}
            <Link to="/pricing" className="text-xs text-orange-500 hover:text-orange-700 transition">
              Compare all plans
            </Link>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="text-orange-400 hover:text-orange-600 transition flex-shrink-0"
          aria-label="Dismiss"
        >
          <X size={16} />
        </button>
      </div>
    );
  }

  // ── 70% Soft Suggestion ──────────────────────────────────────────────────────
  if (pct >= 70 && !dismissed) {
    return (
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex items-start gap-3">
        <Zap className="text-blue-400 mt-0.5 flex-shrink-0" size={16} />
        <div className="flex-1">
          <p className="text-xs text-blue-700">
            You have used <strong>{pct}%</strong> of your {drivingMetric} this month.{" "}
            {nextPlan ? (
              <>
                <Link to={nextPlan.path} className="font-medium underline hover:text-blue-900">
                  Upgrade to {nextPlan.name}
                </Link>{" "}
                for more capacity.
              </>
            ) : (
              <Link to="/pricing" className="font-medium underline hover:text-blue-900">
                View upgrade options.
              </Link>
            )}
          </p>
        </div>
        <button
          onClick={handleDismiss}
          className="text-blue-300 hover:text-blue-500 transition flex-shrink-0"
          aria-label="Dismiss"
        >
          <X size={14} />
        </button>
      </div>
    );
  }

  return null;
}
