/**
 * AIPricingTab.tsx
 * Admin panel tab for the AI Pricing Intelligence Engine
 * Shows decision log, approve/reject queue, guardrails, and manual trigger
 * Design: Dark dashboard, monospace data, clean card layout
 */
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Brain, Zap, CheckCircle, XCircle, Clock, TrendingUp, TrendingDown, AlertTriangle, RefreshCw, DollarSign, List } from 'lucide-react';

interface AIDecision {
  decision_id: string;
  agent_name: string;
  decision_type: string;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'approved' | 'rejected' | 'pending_approval' | 'executed' | 'rolled_back';
  hypothesis: string;
  expected_impact: string;
  rollback_plan: string;
  action_payload: any;
  metric_evidence: any;
  created_at: string;
}

const RISK_COLORS: Record<string, string> = {
  LOW: 'bg-green-500/20 text-green-400 border-green-500/30',
  MEDIUM: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  HIGH: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  CRITICAL: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const STATUS_COLORS: Record<string, string> = {
  approved: 'bg-green-500/20 text-green-400',
  executed: 'bg-blue-500/20 text-blue-400',
  pending_approval: 'bg-yellow-500/20 text-yellow-400',
  rejected: 'bg-red-500/20 text-red-400',
  rolled_back: 'bg-gray-500/20 text-gray-400',
};

const STATUS_ICONS: Record<string, React.ReactNode> = {
  approved: <CheckCircle className="w-3 h-3" />,
  executed: <Zap className="w-3 h-3" />,
  pending_approval: <Clock className="w-3 h-3" />,
  rejected: <XCircle className="w-3 h-3" />,
  rolled_back: <RefreshCw className="w-3 h-3" />,
};

export default function AIPricingTab() {
  const [decisions, setDecisions] = useState<AIDecision[]>([]);
  const [loading, setLoading] = useState(false);
  const [running, setRunning] = useState(false);
  const [approving, setApproving] = useState<string | null>(null);
  const [rejecting, setRejecting] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [lastRunResult, setLastRunResult] = useState<any>(null);

  const fetchDecisions = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/pricing/ai-decisions?limit=50', {
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        setDecisions(data.decisions || []);
      }
    } catch (e) {
      console.error('Failed to fetch AI decisions:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDecisions();
  }, []);

  const runCycle = async () => {
    setRunning(true);
    setLastRunResult(null);
    try {
      const res = await fetch('/api/pricing/run-ai-cycle', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (res.ok) {
        setLastRunResult(data);
        toast.success(`AI Pricing cycle complete: ${data.summary}`);
        await fetchDecisions();
      } else {
        toast.error(data.error || 'AI cycle failed');
      }
    } catch (e: any) {
      toast.error('Failed to run AI cycle: ' + e.message);
    } finally {
      setRunning(false);
    }
  };

  const approveDecision = async (decisionId: string) => {
    setApproving(decisionId);
    try {
      const res = await fetch(`/api/pricing/ai-decisions/${decisionId}/approve`, {
        method: 'POST',
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Decision approved and executed');
        await fetchDecisions();
      } else {
        toast.error(data.error || 'Failed to approve');
      }
    } catch (e: any) {
      toast.error('Error: ' + e.message);
    } finally {
      setApproving(null);
    }
  };

  const rejectDecision = async (decisionId: string) => {
    setRejecting(decisionId);
    try {
      const res = await fetch(`/api/pricing/ai-decisions/${decisionId}/reject`, {
        method: 'POST',
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Decision rejected');
        await fetchDecisions();
      } else {
        toast.error(data.error || 'Failed to reject');
      }
    } catch (e: any) {
      toast.error('Error: ' + e.message);
    } finally {
      setRejecting(null);
    }
  };

  const pendingDecisions = decisions.filter(d => d.status === 'pending_approval');
  const executedDecisions = decisions.filter(d => d.status === 'executed' || d.status === 'approved');
  const rejectedDecisions = decisions.filter(d => d.status === 'rejected');

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="w-6 h-6 text-indigo-400" />
            AI Pricing Intelligence Engine
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Autonomous pricing optimization — monitors market signals, competitor pricing, and conversion data to update tiers and sync Stripe in real-time.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchDecisions} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            size="sm"
            onClick={runCycle}
            disabled={running}
            className="bg-indigo-700 hover:bg-indigo-800 text-white"
          >
            <Zap className={`w-4 h-4 mr-2 ${running ? 'animate-pulse' : ''}`} />
            {running ? 'Running AI Cycle...' : 'Run AI Cycle Now'}
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="border-border/50">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-500/10">
                <Clock className="w-4 h-4 text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pendingDecisions.length}</p>
                <p className="text-xs text-muted-foreground">Pending Approval</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Zap className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{executedDecisions.length}</p>
                <p className="text-xs text-muted-foreground">Executed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/10">
                <XCircle className="w-4 h-4 text-red-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{rejectedDecisions.length}</p>
                <p className="text-xs text-muted-foreground">Rejected</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-600/10">
                <Brain className="w-4 h-4 text-indigo-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{decisions.length}</p>
                <p className="text-xs text-muted-foreground">Total Decisions</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Last Run Result */}
      {lastRunResult && (
        <Card className="border-indigo-500/30 bg-indigo-600/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              Last AI Cycle Result
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium mb-2">{lastRunResult.summary}</p>
            {lastRunResult.decisions?.length > 0 && (
              <div className="space-y-1">
                {lastRunResult.decisions.map((d: any, i: number) => (
                  <div key={i} className="text-xs text-muted-foreground flex items-center gap-2">
                    <span className={`px-1.5 py-0.5 rounded text-xs font-mono ${RISK_COLORS[d.risk_level] || ''}`}>
                      {d.risk_level}
                    </span>
                    <span className="font-mono">{d.tier_key}</span>
                    <span>—</span>
                    <span>{d.decision_type}</span>
                    {d.current_price !== d.proposed_price && (
                      <span className="text-green-400 font-mono">
                        ${d.current_price} → ${d.proposed_price}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Pending Approval Queue */}
      {pendingDecisions.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-yellow-400 flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4" />
            Pending Approval ({pendingDecisions.length})
          </h3>
          <div className="space-y-3">
            {pendingDecisions.map(d => (
              <DecisionCard
                key={d.decision_id}
                decision={d}
                expanded={expandedId === d.decision_id}
                onToggle={() => setExpandedId(expandedId === d.decision_id ? null : d.decision_id)}
                onApprove={() => approveDecision(d.decision_id)}
                onReject={() => rejectDecision(d.decision_id)}
                approving={approving === d.decision_id}
                rejecting={rejecting === d.decision_id}
                showActions
              />
            ))}
          </div>
        </div>
      )}

      {/* Decision Log */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-2 mb-3">
          <List className="w-4 h-4" />
          Decision Log ({decisions.length})
        </h3>
        {loading ? (
          <div className="text-center py-8 text-muted-foreground text-sm">Loading decisions...</div>
        ) : decisions.length === 0 ? (
          <Card className="border-dashed border-border/50">
            <CardContent className="py-8 text-center">
              <Brain className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No AI pricing decisions yet.</p>
              <p className="text-xs text-muted-foreground mt-1">Click "Run AI Cycle Now" to trigger the first analysis.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {decisions.map(d => (
              <DecisionCard
                key={d.decision_id}
                decision={d}
                expanded={expandedId === d.decision_id}
                onToggle={() => setExpandedId(expandedId === d.decision_id ? null : d.decision_id)}
                onApprove={() => approveDecision(d.decision_id)}
                onReject={() => rejectDecision(d.decision_id)}
                approving={approving === d.decision_id}
                rejecting={rejecting === d.decision_id}
                showActions={d.status === 'pending_approval'}
              />
            ))}
          </div>
        )}
      </div>

      {/* Guardrails Info */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-orange-400" />
            Active Guardrails
          </CardTitle>
          <CardDescription className="text-xs">
            The AI engine operates within these hard limits. Changes outside these bounds require manual override.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="space-y-1">
              <p className="font-semibold text-muted-foreground uppercase tracking-wide">Price Bounds</p>
              <p>Starter: $9 – $39/mo</p>
              <p>Professional: $29 – $79/mo</p>
              <p>Growth: $59 – $149/mo</p>
              <p>Scale: $149 – $399/mo</p>
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-muted-foreground uppercase tracking-wide">Change Limits</p>
              <p>Max price change: ±20% per cycle</p>
              <p>Min days between changes: 7</p>
              <p>LOW risk: auto-execute</p>
              <p>HIGH/CRITICAL: requires approval</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Decision Card Component ────────────────────────────────────────────────
function DecisionCard({
  decision,
  expanded,
  onToggle,
  onApprove,
  onReject,
  approving,
  rejecting,
  showActions,
}: {
  decision: AIDecision;
  expanded: boolean;
  onToggle: () => void;
  onApprove: () => void;
  onReject: () => void;
  approving: boolean;
  rejecting: boolean;
  showActions: boolean;
}) {
  const payload = decision.action_payload || {};
  const evidence = decision.metric_evidence || {};

  return (
    <Card
      className={`border-border/50 cursor-pointer transition-colors hover:border-border ${expanded ? 'border-border' : ''}`}
      onClick={onToggle}
    >
      <CardContent className="py-3 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <span className={`px-2 py-0.5 rounded text-xs font-mono border ${RISK_COLORS[decision.risk_level] || ''}`}>
              {decision.risk_level}
            </span>
            <span className="font-mono text-sm font-medium truncate">
              {payload.tier_key || 'unknown'}
            </span>
            <span className="text-xs text-muted-foreground truncate">
              {decision.decision_type.replace('pricing_', '').replace(/_/g, ' ')}
            </span>
            {payload.old_price !== undefined && payload.new_price !== undefined && (
              <span className="text-xs font-mono text-green-400">
                ${payload.old_price} → ${payload.new_price}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs ${STATUS_COLORS[decision.status] || ''}`}>
              {STATUS_ICONS[decision.status]}
              {decision.status.replace('_', ' ')}
            </span>
            <span className="text-xs text-muted-foreground">
              {new Date(decision.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>

        {expanded && (
          <div className="mt-3 space-y-3 text-xs" onClick={e => e.stopPropagation()}>
            <Separator />
            <div>
              <p className="font-semibold text-muted-foreground mb-1">Rationale</p>
              <p className="text-foreground/80">{decision.hypothesis}</p>
            </div>
            {decision.expected_impact && (
              <div>
                <p className="font-semibold text-muted-foreground mb-1">Expected Impact</p>
                <p className="text-foreground/80">{decision.expected_impact}</p>
              </div>
            )}
            {decision.rollback_plan && (
              <div>
                <p className="font-semibold text-muted-foreground mb-1">Rollback Plan</p>
                <p className="text-foreground/80">{decision.rollback_plan}</p>
              </div>
            )}
            {Object.keys(evidence).length > 0 && (
              <div>
                <p className="font-semibold text-muted-foreground mb-1">Evidence</p>
                <pre className="bg-muted/30 rounded p-2 text-xs overflow-auto max-h-32 font-mono">
                  {JSON.stringify(evidence, null, 2)}
                </pre>
              </div>
            )}
            {showActions && (
              <div className="flex gap-2 pt-1">
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white h-7 text-xs"
                  onClick={onApprove}
                  disabled={approving || rejecting}
                >
                  <CheckCircle className="w-3 h-3 mr-1" />
                  {approving ? 'Approving...' : 'Approve & Execute'}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-red-500/50 text-red-400 hover:bg-red-500/10 h-7 text-xs"
                  onClick={onReject}
                  disabled={approving || rejecting}
                >
                  <XCircle className="w-3 h-3 mr-1" />
                  {rejecting ? 'Rejecting...' : 'Reject'}
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
