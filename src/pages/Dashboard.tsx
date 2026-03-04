import ReferralPanel from '@/components/ReferralPanel';
import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  FileText, Upload, Clock, CheckCircle2, AlertCircle, Edit, Eye, 
  TrendingUp, Zap, Crown, ArrowUpRight, Bell, Search, Filter,
  BarChart3, Users, FileSignature, Sparkles, Calendar
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { getTierLimits, getTierDisplayName, getTierColor } from "@shared/tiers";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function Dashboard() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  const { data: documents, isLoading } = trpc.documents.list.useQuery();
  const { data: usageStats } = trpc.getUsageStats.useQuery();

  const userTier = user?.subscriptionTier || 'free';
  const tierLimits = getTierLimits(userTier);
  const tierName = getTierDisplayName(userTier);
  const tierColor = getTierColor(userTier);

  // Calculate usage this month
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const documentsThisMonth = documents?.filter(d => {
    const docDate = new Date(d.createdAt);
    return docDate.getMonth() === currentMonth && docDate.getFullYear() === currentYear;
  }).length || 0;

  const stats = {
    total: documents?.length || 0,
    pending: documents?.filter(d => d.status === 'pending').length || 0,
    completed: documents?.filter(d => d.status === 'completed').length || 0,
    draft: documents?.filter(d => d.status === 'draft').length || 0,
  };

  const usagePercentage = tierLimits.documentsPerMonth === -1 
    ? 0 
    : (documentsThisMonth / tierLimits.documentsPerMonth) * 100;

  const isNearLimit = usagePercentage >= 80;
  const isAtLimit = usagePercentage >= 100;

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      draft: 'bg-gray-100 text-gray-800',
      pending: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return badges[status as keyof typeof badges] || badges.draft;
  };

  const quickActions = [
    { 
      icon: Upload, 
      label: 'Upload Document', 
      description: 'Send a new document for signature',
      onClick: () => navigate('/upload'),
      color: 'bg-indigo-700 hover:bg-indigo-800'
    },
    { 
      icon: FileSignature, 
      label: 'Use Template', 
      description: 'Start from a saved template',
      onClick: () => {},
      color: 'bg-blue-600 hover:bg-blue-700',
      disabled: !tierLimits.templatesLimit
    },
    { 
      icon: Users, 
      label: 'Bulk Send', 
      description: 'Send to multiple recipients',
      onClick: () => {},
      color: 'bg-green-600 hover:bg-green-700',
      disabled: !tierLimits.bulkSend
    },
    { 
      icon: Sparkles, 
      label: 'AI Generator', 
      description: 'Create documents with AI',
      onClick: () => navigate('/generate'),
      color: 'bg-amber-600 hover:bg-amber-700',
      disabled: false
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header with Search */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {user?.name || "User"}!</h1>
            <p className="text-muted-foreground mt-1">
              Here's what's happening with your documents today.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button 
              className="bg-indigo-700 hover:bg-indigo-800 gap-2"
              onClick={() => navigate('/upload')}
            >
              <Upload className="h-4 w-4" />
              Upload Document
            </Button>
          </div>
        </div>

        {/* Tier Badge & Upgrade Prompt */}
        {userTier !== 'enterprise' && (
          <Card className="p-4 bg-gradient-to-r from-slate-50 to-indigo-50 border-indigo-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`px-3 py-1 rounded-full font-semibold ${tierColor}`}>
                  {tierName} Plan
                </div>
                <div className="text-sm text-gray-600">
                  {tierLimits.documentsPerMonth === -1 
                    ? 'Unlimited documents' 
                    : `${documentsThisMonth} / ${tierLimits.documentsPerMonth} documents this month`}
                </div>
                {isNearLimit && !isAtLimit && (
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Near Limit
                  </Badge>
                )}
                {isAtLimit && (
                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Limit Reached
                  </Badge>
                )}
              </div>
              <Button 
                className="bg-gradient-to-r from-indigo-700 to-indigo-900 hover:from-indigo-700 hover:to-blue-700 gap-2"
                onClick={() => navigate('/pricing')}
              >
                <Crown className="h-4 w-4" />
                Upgrade Plan
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        )}

        {/* Usage Progress */}
        {tierLimits.documentsPerMonth !== -1 && (
          <Card className="p-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Monthly Document Usage</span>
                <span className="text-muted-foreground">
                  {documentsThisMonth} / {tierLimits.documentsPerMonth}
                </span>
              </div>
              <Progress value={usagePercentage} className="h-2" />
            </div>
          </Card>
        )}

        {/* AI Documents Usage */}
        {tierLimits.aiDocumentsPerMonth !== 0 && (
          <Card className="p-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-indigo-600" />
                  AI Documents This Month
                </span>
                <span className="text-muted-foreground">
                  {usageStats?.aiDocs.usedThisMonth || 0} / {tierLimits.aiDocumentsPerMonth === -1 ? '∞' : tierLimits.aiDocumentsPerMonth}
                </span>
              </div>
              {tierLimits.aiDocumentsPerMonth !== -1 && (
                <Progress 
                  value={((usageStats?.aiDocs.usedThisMonth || 0) / tierLimits.aiDocumentsPerMonth) * 100} 
                  className="h-2" 
                />
              )}
              {(usageStats?.aiDocs.purchasedCredits || 0) > 0 && (
                <div className="text-xs text-green-600 flex items-center gap-1">
                  <Zap className="h-3 w-3" />
                  {usageStats?.aiDocs.purchasedCredits} purchased credits available
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Documents</p>
                <p className="text-3xl font-bold mt-1">{stats.total}</p>
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +12% this month
                </p>
              </div>
              <div className="p-3 bg-indigo-100 rounded-lg">
                <FileText className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-3xl font-bold mt-1">{stats.pending}</p>
                <p className="text-xs text-muted-foreground mt-1">Awaiting signatures</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-3xl font-bold mt-1">{stats.completed}</p>
                <p className="text-xs text-green-600 mt-1">All signed</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Draft</p>
                <p className="text-3xl font-bold mt-1">{stats.draft}</p>
                <p className="text-xs text-muted-foreground mt-1">Not sent yet</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <AlertCircle className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Zap className="h-5 w-5 text-indigo-600" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, idx) => (
              <Card 
                key={idx}
                className={`p-6 cursor-pointer transition-all hover:shadow-lg ${
                  action.disabled ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={action.disabled ? undefined : action.onClick}
              >
                <div className="space-y-3">
                  <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center`}>
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold flex items-center gap-2">
                      {action.label}
                      {action.disabled && (
                        <Crown className="h-4 w-4 text-amber-500" />
                      )}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {action.description}
                    </p>
                  </div>
                  {action.disabled && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate('/pricing');
                      }}
                    >
                      Upgrade to Unlock
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Documents */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-indigo-600" />
              Recent Documents
            </h3>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search documents..." 
                  className="pl-9 w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/upload')}
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload New
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto" />
            </div>
          ) : documents && documents.length > 0 ? (
            <div className="space-y-3">
              {documents
                .filter(doc => {
                  const matchesSearch = searchQuery === "" || 
                    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    doc.originalFilename.toLowerCase().includes(searchQuery.toLowerCase());
                  const matchesStatus = statusFilter === "all" || doc.status === statusFilter;
                  return matchesSearch && matchesStatus;
                })
                .slice(0, 10).map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="p-2 bg-indigo-100 rounded-lg group-hover:bg-indigo-200 transition-colors">
                      <FileText className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{doc.title}</h4>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(doc.createdAt)}
                        </span>
                        <span>•</span>
                        <span>{formatFileSize(doc.fileSizeBytes)}</span>
                        <span>•</span>
                        <span>{doc.originalFilename}</span>
                      </div>
                    </div>
                    <div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(doc.status)}`}>
                        {doc.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    {doc.status === 'draft' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/document/${doc.id}`)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(doc.fileUrl, '_blank')}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="font-semibold text-lg mb-2">No documents yet</h3>
              <p className="text-muted-foreground mb-4">Upload your first document to get started</p>
              <Button 
                className="bg-indigo-700 hover:bg-indigo-800"
                onClick={() => navigate('/upload')}
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload Document
              </Button>
            </div>
          )}
        </Card>
      </div>
        {/* Refer & Earn */}
        <div className="mt-8">
          <ReferralPanel userId={user?.id} userEmail={user?.email} />
        </div>

    </DashboardLayout>
  );
}
