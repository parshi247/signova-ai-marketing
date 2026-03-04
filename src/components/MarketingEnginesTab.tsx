import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Activity, DollarSign, TrendingUp, Server, Zap, Twitter,
  RefreshCw, ExternalLink, CheckCircle, XCircle, Clock
} from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface MarketingEnginesData {
  revenue: {
    total: number;
    mrr: number;
    activeSubscriptions: number;
  };
  engines: {
    total: number;
    running: number;
    stopped: number;
    list: Array<{
      id: number;
      name: string;
      status: string;
      uptime: number;
      restarts: number;
      memory: number;
      cpu: number;
    }>;
  };
  content: {
    postsPerDay: number;
    postsPerWeek: number;
    postsPerMonth: number;
    platforms: number;
    countries: number;
  };
  twitterAlerts: Array<{
    id: string;
    text: string;
    url: string;
    created: string;
    likes: number;
    retweets: number;
  }>;
  lastUpdated: string;
}

export default function MarketingEnginesTab() {
  const [data, setData] = useState<MarketingEnginesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/marketing-engines');
      if (!response.ok) throw new Error('Failed to fetch data');
      const result = await response.json();
      setData(result);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" />
          <p>Loading marketing engines data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center text-red-500">
          <XCircle className="w-8 h-8 mx-auto mb-2" />
          <p>Error: {error}</p>
          <Button onClick={fetchData} className="mt-4">Retry</Button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const formatUptime = (ms: number) => {
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return `${days}d ${hours}h`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Marketing Engines Dashboard</h2>
          <p className="text-sm text-gray-500">
            Last updated: {new Date(data.lastUpdated).toLocaleString()}
          </p>
        </div>
        <Button onClick={fetchData} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${data.revenue.total.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              MRR: ${data.revenue.mrr.toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Engines</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.engines.running}/{data.engines.total}</div>
            <p className="text-xs text-muted-foreground">
              {data.engines.stopped} stopped
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Content Output</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.content.postsPerDay}</div>
            <p className="text-xs text-muted-foreground">
              posts per day
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Twitter Alerts</CardTitle>
            <Twitter className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.twitterAlerts.length}</div>
            <p className="text-xs text-muted-foreground">
              high-intent prospects
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Twitter Intent Alerts */}
      {data.twitterAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>🎯 High-Intent Twitter Prospects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.twitterAlerts.map((alert) => (
                <div key={alert.id} className="border rounded-lg p-3 hover:bg-gray-50">
                  <p className="text-sm mb-2">{alert.text}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex gap-4">
                      <span>❤️ {alert.likes}</span>
                      <span>🔄 {alert.retweets}</span>
                      <span>{new Date(alert.created).toLocaleDateString()}</span>
                    </div>
                    <a 
                      href={alert.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline flex items-center gap-1"
                    >
                      View Tweet <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Engines List */}
      <Card>
        <CardHeader>
          <CardTitle>Marketing Engines Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {data.engines.list.map((engine) => (
              <div key={engine.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {engine.status === 'online' ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                  <div>
                    <p className="font-medium">{engine.name}</p>
                    <p className="text-xs text-gray-500">
                      Uptime: {formatUptime(engine.uptime)} | Restarts: {engine.restarts}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-gray-600">{engine.memory} MB</span>
                  <span className="text-gray-600">{engine.cpu}% CPU</span>
                  <Badge variant={engine.status === 'online' ? 'default' : 'destructive'}>
                    {engine.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Content Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Content Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-3xl font-bold">{data.content.postsPerDay}</p>
              <p className="text-sm text-gray-500">Posts/Day</p>
            </div>
            <div>
              <p className="text-3xl font-bold">{data.content.platforms}</p>
              <p className="text-sm text-gray-500">Platforms</p>
            </div>
            <div>
              <p className="text-3xl font-bold">{data.content.countries}</p>
              <p className="text-sm text-gray-500">Countries</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
