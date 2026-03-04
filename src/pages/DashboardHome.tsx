import React from "react";
import { Link } from "wouter";
import { trpc } from "../lib/trpc";
import { useAuth } from "../hooks/useAuth";
import UsageNudge, { UsageProgressBar } from "../components/UsageNudge";

export default function DashboardHome() {
  const { user } = useAuth();
  const { data: stats } = trpc.documents.getStats.useQuery();
  const { data: credits } = trpc.generate.getCredits.useQuery();
  const { data: usageStats } = trpc.getUsageStats.useQuery();
  const { data: recentDocs } = trpc.documents.list.useQuery({
    page: 1,
    pageSize: 5,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const getStatusColor = (status: string) => {
    const colors = {
      draft: "bg-gray-100 text-slate-200",
      pending: "bg-yellow-100 text-yellow-800",
      completed: "bg-green-100 text-green-800",
      declined: "bg-red-100 text-red-800",
    };
    return colors[status as keyof typeof colors] || colors.draft;
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 text-slate-100">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.name || "User"}! 👋
        </h1>
        <p className="text-slate-400">
          Here's what's happening with your documents today.
        </p>
      </div>

      {/* Intelligent Upgrade Nudge — Section III of Master Execution Directive */}
      <UsageNudge
        credits={credits}
        usageStats={usageStats}
        planName={user?.subscriptionTier || "current plan"}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Documents */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
          <div className="flex items-center justify-between mb-4">
            <div className="text-slate-500 text-xs font-mono uppercase tracking-wider">DOCS</div>
            <span className="text-sm text-slate-400">Total</span>
          </div>
          <div className="text-3xl font-bold text-slate-100">
            {stats?.total || 0}
          </div>
          <div className="text-sm text-slate-400 mt-1">Documents</div>
        </div>

        {/* Pending Signatures */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
          <div className="flex items-center justify-between mb-4">
            <div className="text-slate-500 text-xs font-mono uppercase tracking-wider">PENDING</div>
            <span className="text-sm text-slate-400">Pending</span>
          </div>
          <div className="text-3xl font-bold text-yellow-600">
            {stats?.pending || 0}
          </div>
          <div className="text-sm text-slate-400 mt-1">Awaiting Signature</div>
        </div>

        {/* Completed */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
          <div className="flex items-center justify-between mb-4">
            <div className="text-slate-500 text-xs font-mono uppercase tracking-wider">SIGNED</div>
            <span className="text-sm text-slate-400">Completed</span>
          </div>
          <div className="text-3xl font-bold text-green-600">
            {stats?.completed || 0}
          </div>
          <div className="text-sm text-slate-400 mt-1">Signed Documents</div>
        </div>

        {/* Credits */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
          <div className="flex items-center justify-between mb-4">
            <div className="text-slate-500 text-xs font-mono uppercase tracking-wider">CREDITS</div>
            <span className="text-sm text-slate-400">Balance</span>
          </div>
          <div className="text-3xl font-bold text-indigo-600">
            {credits?.credits || 0}
          </div>
          <div className="text-sm text-slate-400 mt-1">
            <Link
              to="/credits"
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Buy More →
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/upload"
            className="flex items-center p-4 border-2 border-slate-700 rounded-lg hover:border-indigo-600 hover:bg-indigo-50 transition"
          >
            <div className="text-3xl mr-4">⬆️</div>
            <div>
              <div className="font-medium text-slate-100">Upload Document</div>
              <div className="text-sm text-slate-400">
                Upload and send for signature
              </div>
            </div>
          </Link>

          <Link
            to="/ai-generator"
            className="flex items-center p-4 border-2 border-slate-700 rounded-lg hover:border-indigo-600 hover:bg-indigo-50 transition"
          >
            <div className="text-3xl mr-4">🤖</div>
            <div>
              <div className="font-medium text-slate-100">Generate with AI</div>
              <div className="text-sm text-slate-400">
                Create any document instantly
              </div>
            </div>
          </Link>

          <Link
            to="/templates"
            className="flex items-center p-4 border-2 border-slate-700 rounded-lg hover:border-indigo-600 hover:bg-indigo-50 transition"
          >
            <div className="text-3xl mr-4">📋</div>
            <div>
              <div className="font-medium text-slate-100">Use Template</div>
              <div className="text-sm text-slate-400">
                Start from a template
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Documents */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Recent Documents</h2>
          <Link
            to="/documents"
            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
          >
            View All →
          </Link>
        </div>

        {recentDocs && recentDocs.documents.length > 0 ? (
          <div className="space-y-3">
            {recentDocs.documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-4 border border-slate-700 rounded-lg hover:bg-slate-700 transition"
              >
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">📄</div>
                  <div>
                    <div className="font-medium text-slate-100">{doc.title}</div>
                    <div className="text-sm text-slate-400">
                      {new Date(doc.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      doc.status
                    )}`}
                  >
                    {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                  </span>
                  <Link
                    to={`/documents/${doc.id}`}
                    className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                  >
                    View →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📄</div>
            <h3 className="text-lg font-medium text-slate-100 mb-2">
              No documents yet
            </h3>
            <p className="text-slate-400 mb-6">
              Get started by uploading a document or generating one with AI
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                to="/upload"
                className="px-6 py-2 bg-indigo-700 text-white rounded-lg hover:bg-indigo-800"
              >
                Upload Document
              </Link>
              <Link
                to="/ai-generator"
                className="px-6 py-2 bg-white border-2 border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50"
              >
                Generate with AI
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Tips & Resources */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-bold text-blue-900 mb-2">
          💡 Pro Tip: Speed Up Your Workflow
        </h3>
        <p className="text-blue-800 mb-4">
          Save frequently used documents as templates to reuse them instantly.
          This can save you hours of work!
        </p>
        <Link
          to="/templates"
          className="text-blue-600 hover:text-blue-700 font-medium text-sm"
        >
          Learn More About Templates →
        </Link>
      </div>
    </div>
  );
}
