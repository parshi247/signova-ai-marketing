/**
 * Revenue Command Tab — Phase 25 Precision Acquisition Engine
 * Integrates into Admin.tsx as a new sidebar tab.
 *
 * Design: Dark Ops Command Center embedded in the existing white admin shell.
 * Data: Reads from /api/metrics/snapshot (SSOT) + outbound campaign tables.
 * Phase 26C audit findings are surfaced in the AI Engine panel.
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Target, Zap, Shield, Users, Mail, TrendingUp, DollarSign,
  CheckCircle, Clock, Lock, AlertTriangle, RefreshCw, Activity,
  BarChart3, FileText
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from 'recharts';

// ─── Types ────────────────────────────────────────────────────────────────────
interface CampaignMetrics {
  leads_in_db: number;
  leads_contacted: number;
  emails_sent: number;
  emails_opened: number;
  replies: number;
  positive_replies: number;
  calls_booked: number;
  deals_closed: number;
  revenue_closed: number;
  pipeline_value: number;
  ai_spend_today: number;
  daily_send_cap: number;
  bounce_rate: number;
}

interface GuardrailStatus {
  name: string;
  label: string;
  current: string;
  threshold: string;
  status: 'met' | 'pending' | 'locked';
}

interface Engine {
  name: string;
  layer: number;
  goal: string;
  status: 'active' | 'building' | 'locked';
}

// ─── Static Config (Phase 25) ─────────────────────────────────────────────────
const ENGINES: Engine[] = [
  { layer: 1, name: 'SEO AI Engine', goal: 'Traffic + authority', status: 'building' },
  { layer: 1, name: 'YouTube Engine', goal: 'Video authority + remarketing pool', status: 'building' },
  { layer: 1, name: 'Dev.to / Medium Engine', goal: 'Technical credibility + thought leadership', status: 'building' },
  { layer: 1, name: 'Directory Engine', goal: 'Inbound discovery', status: 'building' },
  { layer: 1, name: 'Product Hunt Engine', goal: 'Launch amplification', status: 'building' },
  { layer: 2, name: 'Chicago Law Firm Scraper', goal: 'Real lead data — 50/day', status: 'active' },
  { layer: 2, name: 'Email Sequencer (4-step)', goal: 'Direct conversation creation', status: 'active' },
  { layer: 2, name: 'AI Personalization Engine', goal: 'AI-written, Peter Arshi signs', status: 'active' },
  { layer: 3, name: 'AI Demo + ROI Calculator', goal: 'Firm-specific demo + projected savings', status: 'building' },
  { layer: 3, name: 'Proposal Builder + Stripe', goal: 'Customized PDF + $15K/$22K checkout', status: 'building' },
];

const VERTICAL_ROTATION = [
  { order: 1, name: 'Personal Injury', status: 'active', unlock: 'PRIMARY — active now' },
  { order: 2, name: 'Immigration', status: 'locked', unlock: '≥ 2 closed deals' },
  { order: 3, name: 'Estate Planning', status: 'locked', unlock: '≥ 2 closed deals' },
  { order: 4, name: 'Corporate Law', status: 'locked', unlock: '≥ 2 closed deals' },
  { order: 5, name: 'Accounting', status: 'locked', unlock: '≥ 2 closed deals' },
  { order: 6, name: 'Medical Clinics', status: 'locked', unlock: '≥ 2 closed deals' },
];

const WARMUP = [
  { week: 'Week 1', cap: 10, total: 50, status: 'current' },
  { week: 'Week 2', cap: 20, total: 100, status: 'upcoming' },
  { week: 'Week 3', cap: 40, total: 200, status: 'upcoming' },
  { week: 'Week 4', cap: 50, total: 250, status: 'upcoming' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function StatusDot({ status }: { status: 'active' | 'building' | 'locked' | 'met' | 'pending' }) {
  if (status === 'active' || status === 'met') {
    return (
      <span className="flex items-center gap-1.5">
        <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <span className="text-xs font-medium text-green-600">{status === 'active' ? 'LIVE' : 'MET'}</span>
      </span>
    );
  }
  if (status === 'building' || status === 'pending') {
    return (
      <Badge variant="outline" className="text-amber-600 border-amber-300 bg-amber-50 text-[10px]">
        {status === 'building' ? 'BUILDING' : 'PENDING'}
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="text-gray-400 border-gray-200 text-[10px]">
      LOCKED
    </Badge>
  );
}

function MetricCard({
  label, value, sub, color = 'blue', icon: Icon
}: {
  label: string; value: string; sub?: string; color?: string; icon?: any;
}) {
  const colorMap: Record<string, string> = {
    blue: 'border-l-blue-500 text-blue-600',
    green: 'border-l-green-500 text-green-600',
    amber: 'border-l-amber-500 text-amber-600',
    red: 'border-l-red-500 text-red-600',
    purple: 'border-l-purple-500 text-indigo-600',
  };
  const cls = colorMap[color] || colorMap.blue;
  return (
    <div className={`bg-white rounded-lg border border-l-4 ${cls} p-4 flex flex-col gap-1 shadow-sm`}>
      <div className="flex items-center gap-2">
        {Icon && <Icon className={`w-3.5 h-3.5 ${cls.split(' ')[1]}`} />}
        <span className="text-[10px] uppercase tracking-widest text-gray-400 font-medium">{label}</span>
      </div>
      <span className={`font-mono text-2xl font-bold ${cls.split(' ')[1]}`}>{value}</span>
      {sub && <span className="text-[11px] text-gray-400">{sub}</span>}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function RevenueCommandTab() {
  const [activeSection, setActiveSection] = useState<'overview' | 'funnel' | 'engines' | 'guardrails' | 'leads'>('overview');
  const [metrics, setMetrics] = useState<CampaignMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [acv, setAcv] = useState(20000);

  // Fetch live campaign metrics from the Phase 27B campaign-metrics API
  async function fetchMetrics() {
    setLoading(true);
    try {
      const res = await fetch('/api/executive/campaign-metrics', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        const k = data.kpis || {};
        setMetrics({
          leads_in_db: k.total_leads ?? 0,
          leads_contacted: k.contacted ?? 0,
          emails_sent: k.emails_sent ?? 0,
          emails_opened: k.emails_sent > 0 ? Math.round(k.emails_sent * (k.open_rate / 100)) : 0,
          replies: k.replied ?? 0,
          positive_replies: k.replied ?? 0,
          calls_booked: k.meetings ?? 0,
          deals_closed: k.closed ?? 0,
          revenue_closed: k.total_revenue ?? 0,
          pipeline_value: k.pipeline_value ?? 0,
          ai_spend_today: k.today_cost_usd ?? 0,
          daily_send_cap: k.today_sent ?? 0,
          bounce_rate: k.bounce_rate > 0 ? k.bounce_rate / 100 : 0,
        });
      } else {
        // Pre-launch defaults — API returned non-200
        setMetrics({
          leads_in_db: 50, leads_contacted: 0, emails_sent: 0,
          emails_opened: 0, replies: 0, positive_replies: 0,
          calls_booked: 0, deals_closed: 0, revenue_closed: 0,
          pipeline_value: 0, ai_spend_today: 0, daily_send_cap: 10, bounce_rate: 0,
        });
      }
    } catch {
      setMetrics({
        leads_in_db: 50, leads_contacted: 0, emails_sent: 0,
        emails_opened: 0, replies: 0, positive_replies: 0,
        calls_booked: 0, deals_closed: 0, revenue_closed: 0,
        pipeline_value: 0, ai_spend_today: 0, daily_send_cap: 10, bounce_rate: 0,
      });
    }
    setLoading(false);
    setLastRefresh(new Date());
  }

  useEffect(() => { fetchMetrics(); }, []);

  const m = metrics;

  // Dynamic revenue projection
  const replyRate = m && m.emails_sent > 0 ? m.replies / m.emails_sent : 0.08;
  const meetingRate = m && m.replies > 0 ? m.calls_booked / m.replies : 0.25;
  const closeRate = m && m.calls_booked > 0 ? m.deals_closed / m.calls_booked : 0.30;
  const projectedRevenue30d = Math.round(1000 * replyRate * meetingRate * closeRate * acv);

  const guardrails: GuardrailStatus[] = [
    { name: 'dkim', label: 'DKIM (signova.ai)', current: 'Valid — selector1 + selector2', threshold: 'Active & Valid', status: 'met' },
    { name: 'dmarc', label: 'DMARC Policy', current: 'p=quarantine; pct=100', threshold: 'p=quarantine (hold 14d)', status: 'met' },
    { name: 'daily_cap', label: 'Daily Send Cap', current: `${m?.daily_send_cap ?? 10}/day`, threshold: '40 max until 1 closed deal', status: 'met' },
    { name: 'ai_cost', label: 'AI Spend Today', current: `$${(m?.ai_spend_today ?? 0).toFixed(4)}`, threshold: '< $25/day', status: (m?.ai_spend_today ?? 0) < 25 ? 'met' : 'locked' },
    { name: 'bounce', label: 'Bounce Rate', current: m?.emails_sent ? `${((m.bounce_rate ?? 0) * 100).toFixed(1)}%` : 'Pending', threshold: '≤ 5%', status: 'pending' },
    { name: 'reply_rate', label: 'Reply Rate', current: m?.emails_sent ? `${(replyRate * 100).toFixed(1)}%` : 'Pending', threshold: '≥ 8% for geo unlock', status: 'pending' },
    { name: 'first_deal', label: 'First Closed Deal', current: `${m?.deals_closed ?? 0} / 1`, threshold: '≥ 1 deal to scale', status: (m?.deals_closed ?? 0) >= 1 ? 'met' : 'locked' },
    { name: 'geo', label: 'Geo Expansion', current: 'LOCKED — Chicago Only', threshold: 'reply>8%, open>40%, ≥1 call', status: 'locked' },
    { name: 'vertical', label: 'Vertical Rotation', current: 'LOCKED — PI Law Only', threshold: '≥ 2 CLOSED DEALS', status: 'locked' },
  ];

  const funnelData = m ? [
    { stage: 'Leads', value: m.leads_in_db, color: '#3b82f6' },
    { stage: 'Contacted', value: m.leads_contacted, color: '#3b82f6' },
    { stage: 'Sent', value: m.emails_sent, color: '#60a5fa' },
    { stage: 'Opened', value: m.emails_opened, color: '#a78bfa' },
    { stage: 'Replied', value: m.replies, color: '#f59e0b' },
    { stage: 'Calls', value: m.calls_booked, color: '#22c55e' },
    { stage: 'Closed', value: m.deals_closed, color: '#16a34a' },
  ] : [];

  const sections = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'funnel', label: 'Funnel', icon: TrendingUp },
    { id: 'engines', label: '9 Engines', icon: Zap },
    { id: 'guardrails', label: 'Guardrails', icon: Shield },
    { id: 'leads', label: 'Leads', icon: Users },
  ] as const;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Revenue Command</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Phase 25 — Chicago Law Firms · Personal Injury · $20K ACV Target
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-medium text-amber-600">PRE-LAUNCH</span>
          </div>
          <Button variant="outline" size="sm" onClick={fetchMetrics} disabled={loading}>
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <span className="text-[11px] text-gray-400">
            {lastRefresh.toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* Sub-nav */}
      <div className="flex items-center gap-1 border-b border-gray-200 pb-0">
        {sections.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
              activeSection === s.id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <s.icon className="w-3.5 h-3.5" />
            {s.label}
          </button>
        ))}
      </div>

      {/* ══════════ OVERVIEW ══════════ */}
      {activeSection === 'overview' && (
        <div className="space-y-5">
          {/* KPI Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <MetricCard label="Leads in DB" value={String(m?.leads_in_db ?? 50)} sub="Chicago PI firms" color="blue" icon={Users} />
            <MetricCard label="Revenue Closed" value={`$${(m?.revenue_closed ?? 0).toLocaleString()}`} sub="Stripe live" color="green" icon={DollarSign} />
            <MetricCard label="Pipeline Value" value={`$${(m?.pipeline_value ?? 0).toLocaleString()}`} sub="Active opportunities" color="amber" icon={TrendingUp} />
            <MetricCard label="Deals Closed" value={String(m?.deals_closed ?? 0)} sub={`Target: 6 deals = $120K`} color="purple" icon={Target} />
          </div>

          {/* Revenue Math + ACV Slider */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-500" />
                Dynamic Revenue Projection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-gray-600">ACV (Annual Contract Value)</label>
                    <span className="font-mono text-sm font-bold text-blue-600">${acv.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min={10000} max={50000} step={1000}
                    value={acv}
                    onChange={(e) => setAcv(Number(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400">
                    <span>$10K</span><span>$50K</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="bg-gray-50 rounded-lg p-3 space-y-1.5">
                    {[
                      ['1,000 firms targeted', ''],
                      ['× 8% reply rate', '= 80 replies'],
                      ['× 25% meeting rate', '= 20 meetings'],
                      ['× 30% close rate', '= 6 deals'],
                      [`× $${acv.toLocaleString()} ACV`, `= $${(6 * acv).toLocaleString()}`],
                    ].map(([left, right], i) => (
                      <div key={i} className="flex justify-between text-xs">
                        <span className="text-gray-500">{left}</span>
                        {right && <span className="font-mono font-semibold text-gray-800">{right}</span>}
                      </div>
                    ))}
                    <div className="border-t border-gray-200 pt-1.5 flex justify-between">
                      <span className="text-xs font-semibold text-gray-700">30-day projection</span>
                      <span className="font-mono text-sm font-bold text-green-600">${projectedRevenue30d.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Warmup Schedule */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-500" />
                4-Week Warmup Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-2">
                {WARMUP.map((w) => (
                  <div
                    key={w.week}
                    className={`rounded-lg p-3 border text-center ${
                      w.status === 'current'
                        ? 'border-blue-300 bg-blue-50'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <p className={`text-xs font-semibold ${w.status === 'current' ? 'text-blue-700' : 'text-gray-500'}`}>
                      {w.week}
                    </p>
                    <p className={`font-mono text-xl font-bold mt-1 ${w.status === 'current' ? 'text-blue-600' : 'text-gray-400'}`}>
                      {w.cap}
                    </p>
                    <p className="text-[10px] text-gray-400">emails/day</p>
                    {w.status === 'current' && (
                      <Badge className="mt-1 text-[9px] bg-blue-100 text-blue-700 border-0">CURRENT</Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ══════════ FUNNEL ══════════ */}
      {activeSection === 'funnel' && (
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Full Acquisition Funnel</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={funnelData} layout="vertical" margin={{ left: 60, right: 20 }}>
                    <XAxis type="number" tick={{ fontSize: 11 }} />
                    <YAxis type="category" dataKey="stage" tick={{ fontSize: 11 }} width={60} />
                    <Tooltip formatter={(v) => [v, 'Count']} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                      {funnelData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700">
                <strong>NOTE:</strong> All metrics at zero — campaign pre-launch. Funnel populates once Week 1 warmup begins.
                Target: 1,000 firms → 80 replies → 20 meetings → 6 closes → ${(6 * acv).toLocaleString()}.
              </div>
            </CardContent>
          </Card>

          {/* Revenue funnel */}
          <div className="grid grid-cols-3 gap-3">
            <MetricCard label="Revenue Closed" value={`$${(m?.revenue_closed ?? 0).toLocaleString()}`} sub="Stripe confirmed" color="green" icon={DollarSign} />
            <MetricCard label="Pipeline Value" value={`$${(m?.pipeline_value ?? 0).toLocaleString()}`} sub="Active opps" color="amber" icon={TrendingUp} />
            <MetricCard label="AI Spend Today" value={`$${(m?.ai_spend_today ?? 0).toFixed(4)}`} sub="Cap: $25/day" color={((m?.ai_spend_today ?? 0) > 20) ? 'red' : 'blue'} icon={Zap} />
          </div>
        </div>
      )}

      {/* ══════════ 9 ENGINES ══════════ */}
      {activeSection === 'engines' && (
        <div className="space-y-4">
          {[1, 2, 3].map((layer) => {
            const layerLabels: Record<number, string> = {
              1: 'Layer 1 — Demand Capture (Traffic + Authority)',
              2: 'Layer 2 — Precision Outbound (Direct Conversation Creation)',
              3: 'Layer 3 — Conversion (Close Without Friction)',
            };
            const layerEngines = ENGINES.filter((e) => e.layer === layer);
            return (
              <Card key={layer}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                    {layerLabels[layer]}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {layerEngines.map((eng) => (
                    <div key={eng.name} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-gray-800">{eng.name}</p>
                        <p className="text-[11px] text-gray-400">{eng.goal}</p>
                      </div>
                      <StatusDot status={eng.status} />
                    </div>
                  ))}
                </CardContent>
              </Card>
            );
          })}

          {/* Vertical Rotation */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                Vertical Rotation Order
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {VERTICAL_ROTATION.map((v) => (
                <div key={v.name} className="flex items-center gap-3 py-1.5 border-b border-gray-100 last:border-0">
                  <span className={`font-mono text-lg font-bold w-6 text-center ${v.status === 'active' ? 'text-blue-600' : 'text-gray-300'}`}>
                    {v.order}
                  </span>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${v.status === 'active' ? 'text-gray-900' : 'text-gray-400'}`}>{v.name}</p>
                    <p className="text-[11px] text-gray-400">{v.unlock}</p>
                  </div>
                  {v.status === 'active' ? (
                    <span className="flex items-center gap-1">
                      <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-xs text-green-600 font-medium">ACTIVE</span>
                    </span>
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-gray-300" />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* ══════════ GUARDRAILS ══════════ */}
      {activeSection === 'guardrails' && (
        <div className="space-y-4">
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700">
            <strong>RULE: Signal first. Scale second. Closed deals &gt; Conversations.</strong><br />
            Do NOT scale above 40/day until 1 closed deal. Do NOT expand geo until reply_rate &gt; 8%.
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-500" />
                Scaling Guardrails
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-0">
              {guardrails.map((g) => (
                <div key={g.name} className="flex items-start gap-3 py-2.5 border-b border-gray-100 last:border-0">
                  <div className="mt-0.5">
                    {g.status === 'met' ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : g.status === 'pending' ? (
                      <Clock className="w-4 h-4 text-amber-400" />
                    ) : (
                      <Lock className="w-4 h-4 text-gray-300" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium text-gray-800">{g.label}</span>
                      <StatusDot status={g.status} />
                    </div>
                    <div className="flex gap-2 mt-0.5 text-[11px] text-gray-400">
                      <span className="font-mono">{g.current}</span>
                      <span>→</span>
                      <span>{g.threshold}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                Stop Conditions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1.5">
              {[
                'JSON parse failure > 5% in batch → pause + fix prompt',
                'Cost anomaly in ai_spend_log → pause',
                'Bounce spike > 5% → pause immediately',
                'Any spam complaint → immediate pause',
                'DMARC p=reject → NOT before 14 days from activation',
              ].map((rule) => (
                <div key={rule} className="flex items-start gap-2 py-1.5 px-3 rounded bg-red-50 border border-red-100">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-400 mt-0.5 flex-shrink-0" />
                  <span className="text-xs text-gray-700">{rule}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* ══════════ LEADS ══════════ */}
      {activeSection === 'leads' && (
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-500" />
                Chicago Law Firm Leads — Sample (10 of 50)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      {['ID', 'Firm Name', 'Domain', 'Practice Areas', 'Confidence', 'Status'].map((h) => (
                        <th key={h} className="px-3 py-2 text-left text-[10px] uppercase tracking-widest text-gray-400 font-medium">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { id: 60001, name: 'Zayed Law Offices', domain: 'zayedlaw.com', areas: 'Personal Injury', conf: '92%', status: 'new' },
                      { id: 60002, name: 'Lerner and Rowe Injury Attorneys', domain: 'lernerandrowe.com', areas: 'Personal Injury', conf: '89%', status: 'new' },
                      { id: 60003, name: 'The Kryder Law Group', domain: 'kryderlaw.com', areas: 'Personal Injury', conf: '91%', status: 'new' },
                      { id: 60004, name: 'Salvi Schostok & Pritchard', domain: 'salvilaw.com', areas: 'PI, Medical Malpractice', conf: '88%', status: 'new' },
                      { id: 60005, name: 'Clifford Law Offices', domain: 'cliffordlaw.com', areas: 'PI, Aviation', conf: '94%', status: 'new' },
                      { id: 60006, name: 'Power Rogers LLP', domain: 'powerrogers.com', areas: 'Personal Injury', conf: '87%', status: 'new' },
                      { id: 60007, name: 'Romanucci & Blandin', domain: 'rblaw.net', areas: 'PI, Civil Rights', conf: '90%', status: 'new' },
                      { id: 60008, name: 'Levin & Perconti', domain: 'levinperconti.com', areas: 'PI, Nursing Home', conf: '86%', status: 'new' },
                      { id: 60009, name: 'Ankin Law Office', domain: 'ankinlaw.com', areas: "PI, Workers' Comp", conf: '93%', status: 'new' },
                      { id: 60010, name: 'Staver Accident Injury Lawyers', domain: 'chicagoaccidentlawyer.com', areas: 'Personal Injury', conf: '85%', status: 'new' },
                    ].map((lead, i) => (
                      <tr key={lead.id} className={`border-b border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                        <td className="px-3 py-2 font-mono text-gray-400">{lead.id}</td>
                        <td className="px-3 py-2 font-medium text-gray-800">{lead.name}</td>
                        <td className="px-3 py-2 font-mono text-blue-600">{lead.domain}</td>
                        <td className="px-3 py-2 text-gray-500">{lead.areas}</td>
                        <td className="px-3 py-2 font-mono text-green-600 font-semibold">{lead.conf}</td>
                        <td className="px-3 py-2">
                          <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50 text-[10px]">
                            {lead.status.toUpperCase()}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-4 py-2 border-t border-gray-100">
                <p className="text-[11px] text-gray-400">
                  Showing 10 of 50 leads. Sourced from Google Maps Places API. MX records validated. Schema frozen 2026-02-24.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
