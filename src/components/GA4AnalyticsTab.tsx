import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from "recharts";
import {
  Users, Eye, MousePointer, TrendingUp, Globe, Activity,
  RefreshCw, ExternalLink, Clock, Zap
} from "lucide-react";

function fmtDur(secs: number): string {
  const m = Math.floor(secs / 60);
  const s = Math.round(secs % 60);
  return `${m}m ${s.toString().padStart(2, "0")}s`;
}

function fmtNum(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

const CHANNEL_COLORS: Record<string, string> = {
  "Direct": "#3b82f6",
  "Organic Search": "#10b981",
  "Referral": "#f59e0b",
  "Organic Social": "#8b5cf6",
  "Email": "#ef4444",
  "Paid Search": "#06b6d4",
  "Unassigned": "#6b7280",
};

export default function GA4AnalyticsTab() {
  const [days, setDays] = useState(30);

  const { data, isLoading, error, refetch, isFetching } = trpc.admin.getGA4Analytics.useQuery(
    { days },
    { staleTime: 5 * 60 * 1000 }
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Activity className="w-8 h-8 animate-pulse mx-auto mb-3 text-blue-500" />
          <p className="text-sm text-muted-foreground">Loading GA4 analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-500 font-medium mb-2">Failed to load GA4 data</p>
          <p className="text-sm text-muted-foreground mb-4">{error.message}</p>
          <Button onClick={() => refetch()} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" /> Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { summary, topPages, channels, keyEvents, dailyTrend, dateRange, fetchedAt } = data;

  const summaryCards = [
    { label: "Active Users", value: fmtNum(summary.activeUsers), icon: Users, color: "text-blue-500", sub: `${fmtNum(summary.newUsers)} new` },
    { label: "Sessions", value: fmtNum(summary.sessions), icon: Activity, color: "text-emerald-500", sub: `${summary.bounceRate.toFixed(1)}% bounce` },
    { label: "Page Views", value: fmtNum(summary.pageViews), icon: Eye, color: "text-violet-500", sub: `${(summary.pageViews / Math.max(summary.sessions, 1)).toFixed(1)} per session` },
    { label: "Conversions", value: fmtNum(summary.conversions), icon: Zap, color: "text-amber-500", sub: summary.sessions > 0 ? `${((summary.conversions / summary.sessions) * 100).toFixed(2)}% rate` : "0% rate" },
    { label: "Avg Session", value: fmtDur(summary.avgSessionDuration), icon: Clock, color: "text-rose-500", sub: "duration" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Google Analytics</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {dateRange.start} — {dateRange.end} &nbsp;·&nbsp;
            Last fetched: {new Date(fetchedAt).toLocaleTimeString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {[7, 14, 30, 90].map((d) => (
            <Button
              key={d}
              variant={days === d ? "default" : "outline"}
              size="sm"
              onClick={() => setDays(d)}
            >
              {d}d
            </Button>
          ))}
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
            <RefreshCw className={`w-4 h-4 mr-1 ${isFetching ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a href="https://analytics.google.com/analytics/web/#/a42323709p505802958" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4 mr-1" /> GA4
            </a>
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {summaryCards.map((card) => (
          <Card key={card.label} className="bg-card border border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <card.icon className={`w-4 h-4 ${card.color}`} />
                <span className="text-xs text-muted-foreground">{card.label}</span>
              </div>
              <div className="text-2xl font-bold text-foreground">{card.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{card.sub}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Daily Trend Chart */}
      <Card className="bg-card border border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-500" />
            Daily Traffic Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={dailyTrend} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="sessGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={(v) => v.slice(5)} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip
                contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }}
                labelStyle={{ color: "hsl(var(--foreground))", fontSize: 12 }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Area type="monotone" dataKey="sessions" stroke="#3b82f6" fill="url(#sessGrad)" strokeWidth={2} name="Sessions" />
              <Area type="monotone" dataKey="users" stroke="#10b981" fill="url(#userGrad)" strokeWidth={2} name="Users" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Bottom Row: Pages + Channels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <Card className="bg-card border border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Globe className="w-4 h-4 text-violet-500" />
              Top Pages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {topPages.slice(0, 10).map((p, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-5 text-right">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium truncate text-foreground">{p.page}</div>
                    <div className="text-xs text-muted-foreground">{p.sessions} sessions · {p.bounceRate.toFixed(0)}% bounce · {fmtDur(p.avgDuration)}</div>
                  </div>
                  <Badge variant="secondary" className="text-xs shrink-0">{fmtNum(p.views)}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Traffic Channels */}
        <Card className="bg-card border border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <MousePointer className="w-4 h-4 text-emerald-500" />
              Traffic Sources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={channels} layout="vertical" margin={{ top: 0, right: 10, left: 60, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10 }} />
                <YAxis type="category" dataKey="channel" tick={{ fontSize: 10 }} width={60} />
                <Tooltip
                  contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }}
                  labelStyle={{ color: "hsl(var(--foreground))", fontSize: 12 }}
                />
                <Bar dataKey="sessions" name="Sessions" radius={[0, 4, 4, 0]}>
                  {channels.map((entry, index) => (
                    <rect key={index} fill={CHANNEL_COLORS[entry.channel] || "#6b7280"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-3 space-y-1">
              {channels.map((ch, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: CHANNEL_COLORS[ch.channel] || "#6b7280" }} />
                    <span className="text-muted-foreground">{ch.channel}</span>
                  </div>
                  <span className="font-medium text-foreground">{ch.sessions} sessions</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key Events */}
      <Card className="bg-card border border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            Key Events & Conversions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {keyEvents.slice(0, 12).map((ev, i) => (
              <div key={i} className="bg-muted/30 rounded-lg p-3">
                <div className="text-xs font-mono text-muted-foreground truncate mb-1">{ev.eventName}</div>
                <div className="text-lg font-bold text-foreground">{fmtNum(ev.count)}</div>
                <div className="text-xs text-muted-foreground">{ev.users} users</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
