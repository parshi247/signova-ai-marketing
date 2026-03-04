import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Clock, CheckCircle, Star, Bot, TrendingUp, Users } from 'lucide-react';
import { trpc } from '@/lib/trpc';

export default function SupportTab() {
  const { data: metrics, isLoading: metricsLoading } = trpc.support.getMetrics.useQuery();
  const { data: tickets, isLoading: ticketsLoading } = trpc.support.getAllTickets.useQuery({ limit: 5 });

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${Math.round(minutes)}m`;
    return `${(minutes / 60).toFixed(1)}h`;
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high': return <Badge variant="destructive">High</Badge>;
      case 'medium': return <Badge variant="secondary">Medium</Badge>;
      default: return <Badge variant="outline">Low</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open': return <Badge className="bg-yellow-500">Open</Badge>;
      case 'in_progress': return <Badge className="bg-blue-500">In Progress</Badge>;
      case 'resolved': return <Badge className="bg-green-500">Resolved</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (metricsLoading) {
    return <div className="flex items-center justify-center h-64">Loading support metrics...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">AI Support Dashboard</h2>
          <p className="text-muted-foreground">Real-time AI support metrics and ticket management</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.openTickets || 0}</div>
            <p className="text-xs text-muted-foreground">{metrics?.highPriorityTickets || 0} high priority</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatTime(metrics?.avgResponseTime || 0)}</div>
            <p className="text-xs text-green-600">AI-powered responses</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.resolutionRate?.toFixed(1) || 0}%</div>
            <p className="text-xs text-muted-foreground">First contact resolution</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CSAT Score</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.csatScore?.toFixed(1) || 0}/5</div>
            <p className="text-xs text-muted-foreground">Based on {metrics?.totalReviews || 0} reviews</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tier 1 - Basic AI</CardTitle>
            <Bot className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.tier1Percentage?.toFixed(0) || 70}%</div>
            <p className="text-xs text-muted-foreground">{metrics?.tier1Count || 0} tickets handled</p>
          </CardContent>
        </Card>
        <Card className="border-indigo-200 bg-indigo-50/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tier 2 - Advanced AI</CardTitle>
            <TrendingUp className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.tier2Percentage?.toFixed(0) || 25}%</div>
            <p className="text-xs text-muted-foreground">{metrics?.tier2Count || 0} escalated</p>
          </CardContent>
        </Card>
        <Card className="border-orange-200 bg-orange-50/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tier 3 - Expert AI</CardTitle>
            <Users className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.tier3Percentage?.toFixed(0) || 5}%</div>
            <p className="text-xs text-muted-foreground">{metrics?.tier3Count || 0} complex cases</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {ticketsLoading ? (
                <p className="text-muted-foreground">Loading tickets...</p>
              ) : tickets && tickets.length > 0 ? (
                tickets.map((ticket: any) => (
                  <div key={ticket.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">#{ticket.id} - {ticket.subject}</p>
                      <p className="text-sm text-muted-foreground">
                        {ticket.userEmail} - {new Date(ticket.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {getStatusBadge(ticket.status)}
                      {getPriorityBadge(ticket.priority)}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No tickets found</p>
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Ticket Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {metrics?.categoryBreakdown?.map((cat: any) => (
                <div key={cat.category} className="flex items-center justify-between">
                  <span className="capitalize">{cat.category.replace('_', ' ')}</span>
                  <span className="font-medium">{cat.percentage.toFixed(0)}%</span>
                </div>
              )) || (
                <>
                  <div className="flex items-center justify-between">
                    <span>Technical</span>
                    <span className="font-medium">40%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Billing</span>
                    <span className="font-medium">25%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>General</span>
                    <span className="font-medium">35%</span>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
