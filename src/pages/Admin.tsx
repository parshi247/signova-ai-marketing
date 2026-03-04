/**
 * Complete Enterprise Executive Dashboard
 * Full implementation with Revenue, Customers, Marketing tabs + AI Agent
 * Integrated with Stripe, Google Analytics, and AI recommendations
 */

import { useState, useEffect } from 'react';
import ExecutiveLogin from '@/components/ExecutiveLogin';
import MarketingEnginesTab from '@/components/MarketingEnginesTab';
import EmailTab from '@/components/EmailTab';
import SocialMediaTab from '@/components/SocialMediaTab';
import DatabaseTab from '@/components/DatabaseTab';
import DocumentsTab from '@/components/DocumentsTab';
import SupportTab from '@/components/SupportTab';
import RevenueCommandTab from '@/components/RevenueCommandTab';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Users, FileText, DollarSign, Activity, AlertCircle, CheckCircle, 
  TrendingUp, TrendingDown, Server, Database, Zap, Target, Brain,
  ThumbsUp, ThumbsDown, Play, Clock, BarChart3, PieChart, LineChart,
  LogOut, Menu, X, Download, Mail, Share2, Headphones, RefreshCw, Calendar, Bell, Settings,
  ArrowUp, ArrowDown, Eye, Filter, Search, Star, ExternalLink
} from 'lucide-react';
import {
  LineChart as RechartsLine, Line, AreaChart, Area, BarChart, Bar,
  PieChart as RechartsPie, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import AIPricingTab from '@/components/AIPricingTab';
import GA4AnalyticsTab from '@/components/GA4AnalyticsTab';
import IndustryIntelligenceTab from '@/components/IndustryIntelligenceTab';

// Types remain the same...
interface HealthMetrics {
  status: string;
  uptime: number;
  memory: { used: number; total: number; percentage: number };
  database: { connected: boolean; responseTime?: number };
  errors: { last24h: number; last1h: number };
}

interface ExecutiveMetrics {
  revenue: {
    mrr: number;
    growth: number;
    byTier: { tier: string; revenue: number; customers: number }[];
    trend: { date: string; value: number }[];
  };
  customers: {
    total: number;
    active: number;
    trial: number;
    churn: number;
    ltv: number;
    cac: number;
  };
  marketing: {
    visitors: number;
    signups: number;
    conversion: number;
    topSources: { source: string; visitors: number; conversions: number }[];
  };
  product: {
    documentsProcessed: number;
    activeUsers: number;
    avgSessionTime: number;
    topFeatures: { feature: string; usage: number }[];
  };
}

interface AIRecommendation {
  id: string;
  title: string;
  description: string;
  impact: {
    metric: string;
    projected: string;
    confidence: number;
  };
  priority: 'critical' | 'high' | 'medium' | 'low';
  category: 'revenue' | 'marketing' | 'product' | 'operations';
  status: 'pending' | 'approved' | 'executing' | 'completed' | 'rejected';
  createdAt: string;
  executionPlan?: string[];
}


// ─── SSOT Snapshot Types ─────────────────────────────────────────────────────
interface MetricValue<T = number | null> {
  value: T;
  window: string;
  dataSource: 'stripe_live' | 'db' | 'ga4' | 'computed' | 'unavailable';
  confidence: 'high' | 'medium' | 'low';
  lastRefreshedAt: string;
  notes?: string;
}
interface SSOTSnapshot {
  version: string;
  snapshotId: string;
  generatedAt: string;
  revenue: {
    mrr: MetricValue;
    arr: MetricValue;
    mrrGrowthPct: MetricValue;
    totalRevenueMtd: MetricValue;
    totalRevenueLtd: MetricValue;
    activeSubscriptions: MetricValue;
    churnedSubscriptions30d: MetricValue;
    failedPayments30d: MetricValue;
    byTier: MetricValue<{ tier: string; mrr: number; count: number }[] | null>;
    trend30d: MetricValue<{ date: string; revenue: number }[] | null>;
  };
  subscribers: {
    total: MetricValue;
    paid: MetricValue;
    free: MetricValue;
    trial: MetricValue;
    newLast30d: MetricValue;
    churnedLast30d: MetricValue;
    netNew30d: MetricValue;
    churnRatePct: MetricValue;
    ltv: MetricValue;
    cac: MetricValue;
    byTier: MetricValue<{ tier: string; count: number }[] | null>;
  };
  usage: {
    documentsCreated30d: MetricValue;
    documentsCreatedAllTime: MetricValue;
    eSignsSent30d: MetricValue;
    eSignsCompletedAllTime: MetricValue;
    activeUsersLast7d: MetricValue;
    activeUsersLast30d: MetricValue;
    avgSessionMinutes: MetricValue;
    topFeatures: MetricValue<{ feature: string; usageCount: number }[] | null>;
  };
  marketing: {
    visitorsLast30d: MetricValue;
    pageviewsLast30d: MetricValue;
    signupsLast30d: MetricValue;
    signupConversionPct: MetricValue;
    topSources: MetricValue<{ source: string; visitors: number; conversions: number }[] | null>;
    campaignOutcomes30d: MetricValue<{ engine: string; channel: string; clicks: number | null; conversions: number | null }[] | null>;
  };
  system: {
    uptimeSeconds: MetricValue;
    memoryUsedMb: MetricValue;
    memoryTotalMb: MetricValue;
    dbConnected: MetricValue<boolean | null>;
    dbResponseMs: MetricValue;
    errorsLast24h: MetricValue;
    errorsLast1h: MetricValue;
  };
  _meta?: { fromCache?: boolean; fallback?: boolean; _ssotError?: string };
}

export default function CompleteEnhancedAdmin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  
  const [healthMetrics, setHealthMetrics] = useState<HealthMetrics | null>(null);
  const [execMetrics, setExecMetrics] = useState<ExecutiveMetrics | null>(null);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'revenue' | 'customers' | 'marketing' | 'ai-agent' | 'marketing-engines' | 'email' | 'social' | 'database' | 'documents' | 'support' | 'revenue-command' | 'ai-pricing' | 'analytics' | 'industry-intel'>('overview');
  const [dateRange, setDateRange] = useState('30d');
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [ssotSnapshot, setSsotSnapshot] = useState<SSOTSnapshot | null>(null);
  const [ssotLoading, setSsotLoading] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/executive/verify', {
        credentials: 'include',
      });
      const data = await response.json();
      
      if (data.authenticated) {
        setIsAuthenticated(true);
        setUsername(data.username);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/executive/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        credentials: 'include',
      });

      if (response.ok) {
        setIsAuthenticated(true);
        setUsername(username);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/executive/logout', {
        method: 'POST',
        credentials: 'include',
      });
      setIsAuthenticated(false);
      setUsername('');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Fetch metrics when authenticated
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchMetrics = async () => {
      try {
        const healthRes = await fetch('/api/health');
        const healthData = await healthRes.json();
        setHealthMetrics(healthData);

        const execRes = await fetch('/api/executive/metrics', {
          credentials: 'include',
        });
        const execData = await execRes.json();
        setExecMetrics(execData);
        // SSOT v2.0 — same endpoint returns canonical snapshot
        setSsotSnapshot(execData as SSOTSnapshot);

        const aiRes = await fetch('/api/executive/recommendations', {
          credentials: 'include',
        });
        const aiData = await aiRes.json();
        setRecommendations(aiData);

        setLastRefresh(new Date());
      } catch (error) {
        console.error('Failed to fetch metrics:', error);
      }
    };

    fetchMetrics();
    
    if (autoRefresh) {
      const interval = setInterval(fetchMetrics, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, autoRefresh]);

  const handleApproveRecommendation = async (id: string) => {
    try {
      await fetch(`/api/executive/recommendations/${id}/approve`, {
        method: 'POST',
        credentials: 'include',
      });
      const response = await fetch('/api/executive/recommendations', {
        credentials: 'include',
      });
      const data = await response.json();
      setRecommendations(data);
    } catch (error) {
      console.error('Failed to approve recommendation:', error);
    }
  };

  const handleRejectRecommendation = async (id: string) => {
    try {
      await fetch(`/api/executive/recommendations/${id}/reject`, {
        method: 'POST',
        credentials: 'include',
      });
      const response = await fetch('/api/executive/recommendations', {
        credentials: 'include',
      });
      const data = await response.json();
      setRecommendations(data);
    } catch (error) {
      console.error('Failed to reject recommendation:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <ExecutiveLogin onLogin={handleLogin} />;
  }

  // Helper functions
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercent = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    return `${days}d ${hours}h`;
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-slate-800 text-slate-200 border-slate-700';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'revenue': return DollarSign;
      case 'marketing': return Target;
      case 'product': return Zap;
      case 'operations': return Server;
      default: return Activity;
    }
  };

  const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];
  // ─── SSOT Metadata Badge ─────────────────────────────────────────────────────
  const sourceColor: Record<string, string> = {
    stripe_live: 'bg-green-100 text-green-800 border-green-200',
    db: 'bg-blue-100 text-blue-800 border-blue-200',
    ga4: 'bg-orange-100 text-orange-800 border-orange-200',
    computed: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    unavailable: 'bg-slate-800 text-slate-400 border-slate-700',
  };
  const confidenceColor: Record<string, string> = {
    high: 'text-green-600',
    medium: 'text-yellow-600',
    low: 'text-red-600',
  };
  const MetricBadge = ({ metric, className = '' }: { metric?: MetricValue<any>; className?: string }) => {
    if (!metric) return null;
    const src = metric.dataSource || 'unavailable';
    const conf = metric.confidence || 'low';
    const refreshed = metric.lastRefreshedAt
      ? new Date(metric.lastRefreshedAt).toLocaleTimeString()
      : 'unknown';
    return (
      <div className={`flex items-center gap-1 flex-wrap ${className}`}>
        <span className={`text-xs px-1.5 py-0.5 rounded border font-mono ${sourceColor[src] || sourceColor.unavailable}`}>
          {src}
        </span>
        <span className={`text-xs ${confidenceColor[conf] || 'text-slate-400'}`}>
          {conf} confidence
        </span>
        <span className="text-xs text-gray-400">· {refreshed}</span>
        {metric.notes && <span className="text-xs text-gray-400 italic">· {metric.notes}</span>}
      </div>
    );
  };
  // Helper: safely extract value from MetricValue or plain number
  const mv = <T,>(metric: MetricValue<T> | T | undefined, fallback: T): T => {
    if (metric === undefined || metric === null) return fallback;
    if (typeof metric === 'object' && 'value' in (metric as any)) {
      const v = (metric as MetricValue<T>).value;
      return v !== null && v !== undefined ? v : fallback;
    }
    return metric as T;
  };
  const mvMetric = <T,>(metric: MetricValue<T> | T | undefined): MetricValue<T> | undefined => {
    if (metric && typeof metric === 'object' && 'value' in (metric as any)) {
      return metric as MetricValue<T>;
    }
    return undefined;
  };


  // Mock data for demonstration (will be replaced with real data)
  const revenueByMonth = [
    { month: 'Jan', revenue: 4500, target: 5000 },
    { month: 'Feb', revenue: 5200, target: 5500 },
    { month: 'Mar', revenue: 6100, target: 6000 },
    { month: 'Apr', revenue: 7300, target: 6500 },
    { month: 'May', revenue: 8200, target: 7000 },
    { month: 'Jun', revenue: 9100, target: 7500 },
  ];

  const customerGrowth = [
    { month: 'Jan', customers: 45, churn: 3 },
    { month: 'Feb', customers: 52, churn: 2 },
    { month: 'Mar', customers: 61, churn: 4 },
    { month: 'Apr', customers: 73, churn: 3 },
    { month: 'May', customers: 82, churn: 5 },
    { month: 'Jun', customers: 91, churn: 2 },
  ];

  const trafficSources = [
    { source: 'Organic Search', visitors: 12500, conversions: 450 },
    { source: 'Direct', visitors: 8300, conversions: 320 },
    { source: 'Social Media', visitors: 6700, conversions: 180 },
    { source: 'Referral', visitors: 4200, conversions: 150 },
    { source: 'Email', visitors: 3100, conversions: 220 },
  ];

  const conversionFunnel = [
    { stage: 'Visitors', count: 35000, percentage: 100 },
    { stage: 'Signups', count: 1320, percentage: 3.8 },
    { stage: 'Trials', count: 890, percentage: 2.5 },
    { stage: 'Paid', count: 425, percentage: 1.2 },
  ];

  // Render dashboard
  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            
            <div>
              <h1 className="text-2xl font-bold text-slate-100">Executive Dashboard</h1>
              <p className="text-sm text-slate-400">Signova AI - CEO Command Center</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Clock className="w-3 h-3" />
              Last updated: {lastRefresh.toLocaleTimeString()}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.reload()}
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>

            <div className="text-right">
              <p className="text-sm font-medium text-slate-100">{username}</p>
              <p className="text-xs text-slate-400">Executive Access</p>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 bg-white border-r border-slate-700 min-h-screen overflow-hidden`}>
          <nav className="p-4 space-y-2">
            <Button
              variant={selectedTab === 'overview' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setSelectedTab('overview')}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Overview
            </Button>
            <Button
              variant={selectedTab === 'revenue' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setSelectedTab('revenue')}
            >
              <DollarSign className="w-4 h-4 mr-2" />
              Revenue
            </Button>
            <Button
              variant={selectedTab === 'customers' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setSelectedTab('customers')}
            >
              <Users className="w-4 h-4 mr-2" />
              Customers
            </Button>
            <Button
              variant={selectedTab === 'marketing' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setSelectedTab('marketing')}
            >
              <Target className="w-4 h-4 mr-2" />
              Marketing
            </Button>
            <Button
              variant={selectedTab === 'ai-agent' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setSelectedTab('ai-agent')}
            >
              <Brain className="w-4 h-4 mr-2" />
              AI Agent
              {recommendations.filter(r => r.status === 'pending').length > 0 && (
                <Badge className="ml-auto" variant="destructive">
                  {recommendations.filter(r => r.status === 'pending').length}
                </Badge>
              )}
            </Button>
            <Button
              variant={selectedTab === 'marketing-engines' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setSelectedTab('marketing-engines')}
            >
              <Server className="w-4 h-4 mr-2" />
              Marketing Engines
              </Button>
              <Button
                variant={selectedTab === 'email' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setSelectedTab('email')}
              >
                <Mail className="mr-2 h-4 w-4" />
                Email/SendGrid
              </Button>
              <Button
                variant={selectedTab === 'social' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setSelectedTab('social')}
              >
                <Share2 className="mr-2 h-4 w-4" />
                Social Media
              </Button>
              <Button
                variant={selectedTab === 'database' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setSelectedTab('database')}
              >
                <Database className="mr-2 h-4 w-4" />
                Database
              </Button>
              <Button
                variant={selectedTab === 'documents' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setSelectedTab('documents')}
              >
                <FileText className="mr-2 h-4 w-4" />
                Documents
              </Button>
              <Button
                variant={selectedTab === 'support' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setSelectedTab('support')}
              >
                <Headphones className="mr-2 h-4 w-4" />
                Support
              </Button>
              <Button
                variant={selectedTab === 'revenue-command' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setSelectedTab('revenue-command')}
              >
                <Target className="mr-2 h-4 w-4" />
                Revenue Command
              </Button>
              <Button
                variant={selectedTab === 'ai-pricing' ? 'default' : 'ghost'}
                className="w-full justify-start gap-2 text-sm"
                onClick={() => setSelectedTab('ai-pricing')}
              >
                <Brain className="w-4 h-4" />
                AI Pricing
              </Button>
              <Button
                variant={selectedTab === 'analytics' ? 'default' : 'ghost'}
                className="w-full justify-start gap-2 text-sm"
                onClick={() => setSelectedTab('analytics')}
              >
                <BarChart3 className="w-4 h-4" />
                GA4 Analytics
              </Button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          {/* Overview Tab */}
          {selectedTab === 'overview' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Business Overview</h2>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
              </div>
              
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Monthly Recurring Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(mv(ssotSnapshot?.revenue?.mrr, execMetrics?.revenue.mrr || 0))}</div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      {mv(ssotSnapshot?.revenue?.mrrGrowthPct, execMetrics?.revenue.growth || 0) >= 0 ? (
                        <><TrendingUp className="w-3 h-3 text-green-600" /><span className="text-green-600">{formatPercent(mv(ssotSnapshot?.revenue?.mrrGrowthPct, 0))}</span></>
                      ) : (
                        <><TrendingDown className="w-3 h-3 text-red-600" /><span className="text-red-600">{formatPercent(mv(ssotSnapshot?.revenue?.mrrGrowthPct, 0))}</span></>
                      )}
                      MoM growth
                    </p>
                    <MetricBadge metric={mvMetric(ssotSnapshot?.revenue?.mrr)} className="mt-1" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatNumber(mv(ssotSnapshot?.subscribers?.paid, execMetrics?.customers.active || 0))}</div>
                    <p className="text-xs text-muted-foreground">
                      {formatNumber(mv(ssotSnapshot?.subscribers?.total, execMetrics?.customers.total || 0))} total · {formatNumber(mv(ssotSnapshot?.subscribers?.free, 0))} free
                    </p>
                    <MetricBadge metric={mvMetric(ssotSnapshot?.subscribers?.paid)} className="mt-1" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Documents Processed</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatNumber(mv(ssotSnapshot?.usage?.documentsCreatedAllTime, execMetrics?.product.documentsProcessed || 0))}</div>
                    <p className="text-xs text-muted-foreground">
                      {formatNumber(mv(ssotSnapshot?.usage?.documentsCreated30d, 0))} in last 30d
                    </p>
                    <MetricBadge metric={mvMetric(ssotSnapshot?.usage?.documentsCreatedAllTime)} className="mt-1" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">System Health</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-2xl font-bold">Online</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Uptime: {healthMetrics?.uptime ? formatUptime(healthMetrics.uptime) : 'N/A'}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Revenue Trend (30d)</span>
                      <MetricBadge metric={mvMetric(ssotSnapshot?.revenue?.trend30d)} />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {revenueByMonth.length === 0 && (
                      <div className="flex items-center justify-center h-[300px] text-gray-400 text-sm">
                        No revenue data available yet · dataSource: {ssotSnapshot?.revenue?.trend30d && typeof ssotSnapshot.revenue.trend30d === 'object' && 'dataSource' in ssotSnapshot.revenue.trend30d ? (ssotSnapshot.revenue.trend30d as any).dataSource : 'unavailable'}
                      </div>
                    )}
                    {revenueByMonth.length > 0 && (
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={revenueByMonth}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} name="Revenue" />
                        <Area type="monotone" dataKey="target" stroke="#10b981" fill="#10b981" fillOpacity={0.1} name="Target" />
                      </AreaChart>
                    </ResponsiveContainer>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Customer Growth</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={customerGrowth}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="customers" fill="#3b82f6" name="New Customers" />
                        <Bar dataKey="churn" fill="#ef4444" name="Churned" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Revenue Tab */}
          {selectedTab === 'revenue' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Revenue Analytics</h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Calendar className="w-4 h-4 mr-2" />
                    Last 30 Days
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>

              {/* Revenue Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-indigo-600">{formatCurrency(mv(ssotSnapshot?.revenue?.totalRevenueLtd, 0))}</div>
                    <MetricBadge metric={mvMetric(ssotSnapshot?.revenue?.totalRevenueLtd)} className="mt-1" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Average Revenue Per User</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-600">{formatCurrency(mv(ssotSnapshot?.subscribers?.ltv, 0))}</div>
                    <MetricBadge metric={mvMetric(ssotSnapshot?.subscribers?.ltv)} className="mt-1" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Payment Success Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600">{mv(ssotSnapshot?.revenue?.failedPayments30d, null) !== null ? `${(100 - ((mv(ssotSnapshot?.revenue?.failedPayments30d, 0) / Math.max(mv(ssotSnapshot?.revenue?.activeSubscriptions, 1), 1)) * 100)).toFixed(1)}%` : 'N/A'}</div>
                    <MetricBadge metric={mvMetric(ssotSnapshot?.revenue?.failedPayments30d)} className="mt-1" />
                  </CardContent>
                </Card>
              </div>

              {/* Revenue Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Revenue by Tier</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <RechartsPie>
                        <Pie
                          data={(() => {
                            const byTier = ssotSnapshot?.revenue?.byTier;
                            if (byTier && typeof byTier === 'object' && 'value' in byTier && Array.isArray((byTier as any).value)) {
                              return (byTier as any).value.map((t: any) => ({ name: t.tier, value: t.mrr }));
                            }
                            return [{ name: 'No data', value: 0 }];
                          })()}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={(entry) => `${entry.name}: $${entry.value.toLocaleString()}`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {[0, 1, 2].map((index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RechartsPie>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Monthly Recurring Revenue</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <RechartsLine data={revenueByMonth}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={2} name="Actual MRR" />
                        <Line type="monotone" dataKey="target" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" name="Target" />
                      </RechartsLine>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Revenue Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4">Date</th>
                          <th className="text-left py-3 px-4">Customer</th>
                          <th className="text-left py-3 px-4">Plan</th>
                          <th className="text-right py-3 px-4">Amount</th>
                          <th className="text-center py-3 px-4">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b hover:bg-slate-900">
                          <td className="py-3 px-4">Nov 17, 2025</td>
                          <td className="py-3 px-4">john.smith@example.com</td>
                          <td className="py-3 px-4">Professional</td>
                          <td className="text-right py-3 px-4">$900.00</td>
                          <td className="text-center py-3 px-4">
                            <Badge className="bg-green-100 text-green-800">Succeeded</Badge>
                          </td>
                        </tr>
                        <tr className="border-b hover:bg-slate-900">
                          <td className="py-3 px-4">Nov 16, 2025</td>
                          <td className="py-3 px-4">sarah.johnson@acmecorp.com</td>
                          <td className="py-3 px-4">Professional</td>
                          <td className="text-right py-3 px-4">$900.00</td>
                          <td className="text-center py-3 px-4">
                            <Badge className="bg-green-100 text-green-800">Succeeded</Badge>
                          </td>
                        </tr>
                        <tr className="border-b hover:bg-slate-900">
                          <td className="py-3 px-4">Nov 15, 2025</td>
                          <td className="py-3 px-4">test@test.com</td>
                          <td className="py-3 px-4">Starter</td>
                          <td className="text-right py-3 px-4">$9.00</td>
                          <td className="text-center py-3 px-4">
                            <Badge className="bg-green-100 text-green-800">Succeeded</Badge>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Customers Tab */}
          {selectedTab === 'customers' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Customer Analytics</h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>

              {/* Customer Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">91</div>
                    <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                      <ArrowUp className="w-3 h-3" />
                      +11% this month
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Customer Lifetime Value</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">$2,847</div>
                    <p className="text-xs text-slate-400 mt-1">
                      Average per customer
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Churn Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-orange-600">2.2%</div>
                    <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                      <TrendingDown className="w-3 h-3" />
                      -0.8% improvement
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Trial Conversion</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600">47.8%</div>
                    <p className="text-xs text-slate-400 mt-1">
                      Trial to paid conversion
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Customer Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Customer Growth Trend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={customerGrowth}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Area type="monotone" dataKey="customers" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} name="New Customers" />
                        <Area type="monotone" dataKey="churn" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} name="Churned" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Customer Segmentation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <RechartsPie>
                        <Pie
                          data={[
                            { name: 'Active Paid', value: 85 },
                            { name: 'Trial', value: 23 },
                            { name: 'Inactive', value: 12 },
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={(entry) => `${entry.name}: ${entry.value}`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {[0, 1, 2].map((index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RechartsPie>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Conversion Funnel */}
              <Card>
                <CardHeader>
                  <CardTitle>Conversion Funnel</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {conversionFunnel.map((stage, index) => (
                      <div key={stage.stage}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{stage.stage}</span>
                          <span className="text-sm text-slate-400">
                            {formatNumber(stage.count)} ({stage.percentage}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-8">
                          <div
                            className="bg-gradient-to-r from-indigo-700 to-indigo-900 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                            style={{ width: `${stage.percentage}%` }}
                          >
                            {stage.percentage}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Marketing Tab */}
          {selectedTab === 'marketing' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Marketing Performance</h2>
                <div className="flex gap-2">
                  <Badge variant="outline" className="text-sm">
                    Google Analytics Connected
                  </Badge>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>

              {/* Marketing Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">35,800</div>
                    <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                      <ArrowUp className="w-3 h-3" />
                      +24% from last month
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-indigo-600">3.8%</div>
                    <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                      <ArrowUp className="w-3 h-3" />
                      +0.4% improvement
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Cost Per Acquisition</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-600">$127</div>
                    <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                      <TrendingDown className="w-3 h-3" />
                      -$18 from last month
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Marketing ROI</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600">4.2x</div>
                    <p className="text-xs text-slate-400 mt-1">
                      Return on investment
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Traffic Sources */}
              <Card>
                <CardHeader>
                  <CardTitle>Traffic Sources</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={trafficSources} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="source" type="category" width={120} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="visitors" fill="#8b5cf6" name="Visitors" />
                      <Bar dataKey="conversions" fill="#10b981" name="Conversions" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Campaign Performance */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Top Performing Content</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { title: 'E-Signatures for Remote Teams', views: 8500, conversions: 340 },
                        { title: 'DocuSign vs Signova Comparison', views: 6200, conversions: 280 },
                        { title: 'Digital Signature Best Practices', views: 5100, conversions: 195 },
                        { title: 'Enterprise Document Management', views: 3800, conversions: 152 },
                      ].map((content, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-slate-900 rounded-lg">
                          <div className="flex-1">
                            <p className="font-medium text-sm">{content.title}</p>
                            <p className="text-xs text-slate-400">
                              {formatNumber(content.views)} views • {content.conversions} conversions
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-indigo-600">
                              {((content.conversions / content.views) * 100).toFixed(1)}%
                            </p>
                            <p className="text-xs text-slate-400">CVR</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Social Media Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { platform: 'LinkedIn', followers: 12500, engagement: 4.2 },
                        { platform: 'Twitter', followers: 8300, engagement: 3.1 },
                        { platform: 'Facebook', followers: 6700, engagement: 2.8 },
                        { platform: 'Instagram', followers: 4200, engagement: 5.3 },
                      ].map((social, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-slate-900 rounded-lg">
                          <div>
                            <p className="font-medium text-sm">{social.platform}</p>
                            <p className="text-xs text-slate-400">
                              {formatNumber(social.followers)} followers
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-blue-600">{social.engagement}%</p>
                            <p className="text-xs text-slate-400">Engagement</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* AI Agent Tab */}
          {selectedTab === 'ai-agent' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">AI Recommendations</h2>
                <Badge variant="outline" className="text-sm">
                  {recommendations.filter(r => r.status === 'pending').length} Pending
                </Badge>
              </div>

              <div className="space-y-4">
                {recommendations.length === 0 ? (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <Brain className="w-12 h-12 text-gray-400 mb-4" />
                      <p className="text-slate-400">No recommendations yet. AI agent is analyzing your data...</p>
                    </CardContent>
                  </Card>
                ) : (
                  recommendations.map((rec) => {
                    const CategoryIcon = getCategoryIcon(rec.category);
                    
                    return (
                      <Card key={rec.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                              <div className="p-2 bg-indigo-100 rounded-lg">
                                <CategoryIcon className="w-5 h-5 text-indigo-600" />
                              </div>
                              <div>
                                <CardTitle className="text-lg">{rec.title}</CardTitle>
                                <p className="text-sm text-slate-400 mt-1">{rec.description}</p>
                              </div>
                            </div>
                            <Badge className={getPriorityColor(rec.priority)}>
                              {rec.priority}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex items-center gap-6">
                              <div>
                                <p className="text-sm text-slate-400">Projected Impact</p>
                                <p className="text-lg font-semibold text-green-600">
                                  {rec.impact.projected}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-slate-400">Confidence</p>
                                <p className="text-lg font-semibold">{rec.impact.confidence}%</p>
                              </div>
                              <div>
                                <p className="text-sm text-slate-400">Status</p>
                                <Badge variant="outline">{rec.status}</Badge>
                              </div>
                            </div>

                            {rec.executionPlan && rec.executionPlan.length > 0 && (
                              <div>
                                <p className="text-sm font-medium mb-2">Execution Plan:</p>
                                <ul className="space-y-1">
                                  {rec.executionPlan.map((step, idx) => (
                                    <li key={idx} className="text-sm text-slate-400 flex items-start gap-2">
                                      <span className="text-indigo-600 font-medium">{idx + 1}.</span>
                                      {step}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {rec.status === 'pending' && (
                              <div className="flex gap-2 pt-4">
                                <Button
                                  onClick={() => handleApproveRecommendation(rec.id)}
                                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                                >
                                  <ThumbsUp className="w-4 h-4" />
                                  Approve & Execute
                                </Button>
                                <Button
                                  onClick={() => handleRejectRecommendation(rec.id)}
                                  variant="outline"
                                  className="flex items-center gap-2"
                                >
                                  <ThumbsDown className="w-4 h-4" />
                                  Reject
                                </Button>
                              </div>
                            )}

                            {rec.status === 'executing' && (
                              <div className="flex items-center gap-2 text-blue-600">
                                <Play className="w-4 h-4 animate-pulse" />
                                <span className="text-sm font-medium">Executing...</span>
                              </div>
                            )}

                            {rec.status === 'completed' && (
                              <div className="flex items-center gap-2 text-green-600">
                                <CheckCircle className="w-4 h-4" />
                                <span className="text-sm font-medium">Completed</span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* Marketing Engines Tab */}
          {selectedTab === 'marketing-engines' && (
            <MarketingEnginesTab />
          )}
          {/* Email Tab */}
          {selectedTab === 'email' && (
            <EmailTab />
          )}
          {/* Social Tab */}
          {selectedTab === 'social' && (
            <SocialMediaTab />
          )}
          {/* Database Tab */}
          {selectedTab === 'database' && (
            <DatabaseTab />
          )}
          {/* Documents Tab */}
          {selectedTab === 'documents' && (
            <DocumentsTab />
          )}
          {/* Support Tab */}
          {selectedTab === 'support' && (
            <SupportTab />
          )}
          {/* Revenue Command Tab */}
          {selectedTab === 'revenue-command' && (
            <RevenueCommandTab />
          )}
        </main>
      </div>
    </div>
  );
}
