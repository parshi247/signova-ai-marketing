import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, TrendingUp, Download, Coins, FileText, Calendar,
  Users, Zap, ArrowUpRight, Filter
} from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function Analytics() {
  const { user } = useAuth();
  
  const { data: analytics, isLoading } = trpc.analytics.getOverview.useQuery();
  const { data: topTemplates } = trpc.analytics.getTopTemplates.useQuery({ limit: 10 });
  const { data: recentUsage } = trpc.analytics.getRecentUsage.useQuery({ limit: 20 });

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
        </div>
      </DashboardLayout>
    );
  }

  const stats = analytics || {
    totalGenerated: 0,
    totalDownloaded: 0,
    creditsSpent: 0,
    creditsRemaining: user?.credits || 0,
    thisMonth: 0,
    lastMonth: 0,
  };

  const growthRate = stats.lastMonth > 0 
    ? ((stats.thisMonth - stats.lastMonth) / stats.lastMonth * 100).toFixed(1)
    : 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <BarChart3 className="h-8 w-8 text-indigo-600" />
              Analytics Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Track your template usage, downloads, and credit consumption
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export Data
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Generated</CardDescription>
              <CardTitle className="text-3xl">{stats.totalGenerated}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-1 text-sm text-green-600">
                <TrendingUp className="h-4 w-4" />
                <span>+{growthRate}% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Downloads</CardDescription>
              <CardTitle className="text-3xl">{stats.totalDownloaded}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Download className="h-4 w-4" />
                <span>{((stats.totalDownloaded / (stats.totalGenerated || 1)) * 100).toFixed(0)}% download rate</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Credits Spent</CardDescription>
              <CardTitle className="text-3xl">{stats.creditsSpent}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Coins className="h-4 w-4" />
                <span>Avg {(stats.creditsSpent / (stats.totalGenerated || 1)).toFixed(1)} per document</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Credits Remaining</CardDescription>
              <CardTitle className="text-3xl">{stats.creditsRemaining}</CardTitle>
            </CardHeader>
            <CardContent>
              <Button size="sm" variant="outline" className="w-full gap-2">
                <Coins className="h-4 w-4" />
                Buy More Credits
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Top Templates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-500" />
              Most Popular Templates
            </CardTitle>
            <CardDescription>Your most frequently generated documents</CardDescription>
          </CardHeader>
          <CardContent>
            {topTemplates && topTemplates.length > 0 ? (
              <div className="space-y-3">
                {topTemplates.map((template: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-900 transition-colors">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-semibold text-sm">
                        #{idx + 1}
                      </div>
                      <div>
                        <div className="font-medium">{template.documentTypeName}</div>
                        <div className="text-sm text-muted-foreground">{template.industry}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-semibold">{template.count} times</div>
                        <div className="text-sm text-muted-foreground">{template.totalCredits} credits</div>
                      </div>
                      <Badge variant="secondary">{template.jurisdiction || 'Any'}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No templates generated yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              Recent Activity
            </CardTitle>
            <CardDescription>Your latest template generations</CardDescription>
          </CardHeader>
          <CardContent>
            {recentUsage && recentUsage.length > 0 ? (
              <div className="space-y-2">
                {recentUsage.map((usage: any) => (
                  <div key={usage.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-900 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">{usage.documentTypeName}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(usage.generatedAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{usage.industry}</Badge>
                      {usage.downloaded ? (
                        <Badge className="bg-green-100 text-green-800">
                          <Download className="h-3 w-3 mr-1" />
                          Downloaded
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Not downloaded</Badge>
                      )}
                      <span className="text-sm font-medium">{usage.creditsCost} credits</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No recent activity</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
