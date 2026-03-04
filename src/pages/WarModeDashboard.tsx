/**
 * Signova AI — War Mode Metrics Dashboard
 * Design: Dark slate command center, indigo accents, no purple
 * Shows: Daily + weekly KPIs, funnel metrics, vertical breakdown, MRR tracker
 */

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

// ─── Types ───────────────────────────────────────────────────────────────────

interface VerticalMetrics {
  name: string;
  leads: number;
  sent: number;
  opened: number;
  replied: number;
  demos: number;
  converted: number;
  mrr: number;
  color: string;
}

interface DailySnapshot {
  date: string;
  sent: number;
  opened: number;
  replied: number;
  demos: number;
  signups: number;
  mrr_added: number;
}

// ─── Mock Data (replace with live API calls) ─────────────────────────────────

const VERTICALS: VerticalMetrics[] = [
  { name: "Real Estate", leads: 750, sent: 0, opened: 0, replied: 0, demos: 0, converted: 0, mrr: 0, color: "bg-indigo-500" },
  { name: "Law Firms",   leads: 750, sent: 0, opened: 0, replied: 0, demos: 0, converted: 0, mrr: 0, color: "bg-sky-500" },
  { name: "Staffing",    leads: 750, sent: 0, opened: 0, replied: 0, demos: 0, converted: 0, mrr: 0, color: "bg-teal-500" },
  { name: "Construction",leads: 750, sent: 0, opened: 0, replied: 0, demos: 0, converted: 0, mrr: 0, color: "bg-amber-500" },
];

const TARGETS = {
  month_1_mrr: 75000,
  demos_needed: 250,
  conversion_rate: 0.30,
  avg_deal_size: 99,
};

// ─── Metric Card ─────────────────────────────────────────────────────────────

function MetricCard({
  label,
  value,
  sub,
  delta,
  highlight = false,
}: {
  label: string;
  value: string | number;
  sub?: string;
  delta?: string;
  highlight?: boolean;
}) {
  return (
    <Card className={`border-0 ${highlight ? "bg-indigo-600" : "bg-slate-800"}`}>
      <CardContent className="p-5">
        <p className={`text-xs font-medium uppercase tracking-widest mb-1 ${highlight ? "text-indigo-200" : "text-slate-400"}`}>
          {label}
        </p>
        <p className={`text-3xl font-bold tabular-nums ${highlight ? "text-white" : "text-slate-100"}`}>
          {value}
        </p>
        {sub && <p className={`text-xs mt-1 ${highlight ? "text-indigo-200" : "text-slate-500"}`}>{sub}</p>}
        {delta && (
          <p className={`text-xs mt-1 font-medium ${delta.startsWith("+") ? "text-emerald-400" : "text-rose-400"}`}>
            {delta} vs yesterday
          </p>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Funnel Bar ──────────────────────────────────────────────────────────────

function FunnelBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="w-24 text-xs text-slate-400 text-right shrink-0">{label}</span>
      <div className="flex-1 bg-slate-700 rounded-full h-2">
        <div className={`h-2 rounded-full ${color} transition-all duration-700`} style={{ width: `${pct}%` }} />
      </div>
      <span className="w-16 text-xs text-slate-300 tabular-nums">{value.toLocaleString()} ({pct}%)</span>
    </div>
  );
}

// ─── Main Dashboard ──────────────────────────────────────────────────────────

export default function WarModeDashboard() {
  const [day, setDay] = useState(1);
  const [totals, setTotals] = useState({
    leads: 3000,
    sent: 0,
    opened: 0,
    replied: 0,
    demos: 0,
    signups: 0,
    mrr: 0,
  });

  // Simulate live data updates (replace with real API polling)
  useEffect(() => {
    const interval = setInterval(() => {
      setTotals(prev => ({
        ...prev,
        // In production: fetch from /api/war-mode/metrics
      }));
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const mrrProgress = Math.min((totals.mrr / TARGETS.month_1_mrr) * 100, 100);
  const demosProgress = Math.min((totals.demos / TARGETS.demos_needed) * 100, 100);
  const openRate = totals.sent > 0 ? ((totals.opened / totals.sent) * 100).toFixed(1) : "0.0";
  const replyRate = totals.sent > 0 ? ((totals.replied / totals.sent) * 100).toFixed(1) : "0.0";
  const demoRate = totals.replied > 0 ? ((totals.demos / totals.replied) * 100).toFixed(1) : "0.0";
  const closeRate = totals.demos > 0 ? ((totals.signups / totals.demos) * 100).toFixed(1) : "0.0";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <img src="/signova-logo-white.png" alt="Signova AI" className="h-10 w-auto object-contain" />
            <Badge className="bg-rose-600 text-white text-xs font-bold tracking-wider px-2 py-0.5 rounded">
              WAR MODE ACTIVE
            </Badge>
          </div>
          <p className="text-slate-400 text-sm">30-Day Revenue Sprint · Target: $75,000 MRR by March 31, 2026</p>
        </div>
        <div className="text-right">
          <p className="text-slate-400 text-xs">Day</p>
          <p className="text-4xl font-bold text-white tabular-nums">{day}<span className="text-slate-500 text-lg">/30</span></p>
        </div>
      </div>

      {/* MRR Progress Bar */}
      <Card className="border-0 bg-slate-900 mb-6">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-slate-300">MRR Progress to $75,000 Target</span>
            <span className="text-2xl font-bold text-indigo-400 tabular-nums">
              ${totals.mrr.toLocaleString()} <span className="text-slate-500 text-sm font-normal">/ $75,000</span>
            </span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-3">
            <div
              className="h-3 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-400 transition-all duration-1000"
              style={{ width: `${mrrProgress}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-slate-500">
            <span>$0</span>
            <span className="text-indigo-400">{mrrProgress.toFixed(1)}% of target</span>
            <span>$75,000</span>
          </div>
        </CardContent>
      </Card>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <MetricCard label="Emails Sent" value={totals.sent.toLocaleString()} sub={`of ${totals.leads.toLocaleString()} leads`} />
        <MetricCard label="Open Rate" value={`${openRate}%`} sub="Target: 35%+" />
        <MetricCard label="Reply Rate" value={`${replyRate}%`} sub="Target: 8%+" />
        <MetricCard label="Demos Booked" value={totals.demos} sub={`Target: ${TARGETS.demos_needed}`} highlight />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <MetricCard label="Demo → Close" value={`${closeRate}%`} sub="Target: 30%+" />
        <MetricCard label="New Signups" value={totals.signups} sub="Paying customers" />
        <MetricCard label="MRR Added" value={`$${totals.mrr.toLocaleString()}`} sub="This month" />
        <MetricCard label="ARR Run Rate" value={`$${(totals.mrr * 12).toLocaleString()}`} sub="Annualized" highlight />
      </div>

      {/* Funnel + Verticals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Funnel */}
        <Card className="border-0 bg-slate-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Email Funnel</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <FunnelBar label="Sent" value={totals.sent} max={totals.leads} color="bg-slate-500" />
            <FunnelBar label="Opened" value={totals.opened} max={totals.sent || 1} color="bg-indigo-500" />
            <FunnelBar label="Replied" value={totals.replied} max={totals.opened || 1} color="bg-sky-500" />
            <FunnelBar label="Demo Booked" value={totals.demos} max={totals.replied || 1} color="bg-teal-500" />
            <FunnelBar label="Converted" value={totals.signups} max={totals.demos || 1} color="bg-emerald-500" />
          </CardContent>
        </Card>

        {/* Vertical Breakdown */}
        <Card className="border-0 bg-slate-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-300 uppercase tracking-wider">By Vertical</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {VERTICALS.map(v => (
              <div key={v.name}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">{v.name}</span>
                  <span className="text-slate-400">{v.leads} leads · {v.demos} demos · ${v.mrr.toLocaleString()} MRR</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-1.5">
                  <div className={`h-1.5 rounded-full ${v.color}`} style={{ width: `${(v.mrr / (TARGETS.month_1_mrr / 4)) * 100}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Targets Checklist */}
      <Card className="border-0 bg-slate-900 mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-slate-300 uppercase tracking-wider">30-Day War Mode Targets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: "3,000 leads loaded", done: true },
              { label: "mail.signova.ai DNS configured", done: true },
              { label: "go.signova.ai DNS configured", done: false },
              { label: "Outbound mailboxes created", done: false },
              { label: "Email sequences deployed", done: true },
              { label: "Reply classifier active", done: true },
              { label: "G2 listing submitted", done: false },
              { label: "Capterra listing submitted", done: false },
              { label: "LinkedIn campaign live", done: false },
              { label: "Google Ads campaign live", done: false },
              { label: "250 demos booked", done: totals.demos >= 250 },
              { label: "$75,000 MRR achieved", done: totals.mrr >= 75000 },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-2 text-sm">
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${item.done ? "bg-emerald-500 text-white" : "bg-slate-700 text-slate-500"}`}>
                  {item.done ? "✓" : "·"}
                </span>
                <span className={item.done ? "text-slate-300" : "text-slate-500"}>{item.label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <p className="text-center text-xs text-slate-600">
        Signova AI War Mode Dashboard · Auto-refreshes every 30s · All times UTC
      </p>
    </div>
  );
}
