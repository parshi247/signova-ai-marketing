import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { UsageProgressBar } from "../components/UsageNudge";
import { useAuth } from "../hooks/useAuth";
import { trpc } from "../lib/trpc";

export default function DashboardLayout() {
  const location = useLocation();
  const [, setLocation] = useLocation();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { data: credits } = trpc.generate.getCredits.useQuery();

  const menuItems = [
    { path: "/dashboard", label: "Dashboard", icon: "📊" },
    { path: "/documents", label: "Documents", icon: "📄" },
    { path: "/ai-generator", label: "AI Generator", icon: "🤖" },
    { path: "/templates", label: "Templates", icon: "📋" },
    { path: "/upload", label: "Upload", icon: "⬆️" },
    { path: "/credits", label: "Credits", icon: "💳" },
    { path: "/subscription", label: "Subscription", icon: "👑" },
    { path: "/settings", label: "Settings", icon: "⚙️" },
  ];

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Top Navigation Bar */}
      <nav className="bg-slate-900 border-b border-slate-800 border-slate-800 fixed w-full z-30 top-0">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/dashboard" className="flex items-center">
                <span className="text-2xl font-bold text-indigo-600">
                  ✍️ Signova AI
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Credits Badge */}
              <div className="flex flex-col gap-1 min-w-[140px]">
                <Link
                  to="/credits"
                  className="flex items-center justify-between px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition"
                >
                  <span className="text-xs font-medium">{credits?.credits || 0} Credits</span>
                  <span className="text-xs text-indigo-400 ml-2">+Add</span>
                </Link>
                {credits && credits.totalCredits > 0 && (
                  <div className="px-1">
                    <UsageProgressBar
                      creditsUsed={(credits.totalCredits || 0) - (credits.credits || 0)}
                      creditsTotal={credits.totalCredits || 100}
                    />
                  </div>
                )}
              </div>

              {/* User Menu */}
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  
              {/* Infrastructure Strip — Phase 2 Enterprise Upgrade */}
              <div className="hidden lg:flex items-center gap-3 text-xs font-mono text-slate-500">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block"></span>
                  256-bit AES
                </span>
                <span className="text-slate-700">•</span>
                <span>Audit Trail Enabled</span>
                <span className="text-slate-700">•</span>
                <span>99.9% Uptime</span>
              </div>
              <div className="text-sm font-medium text-slate-100">
                    {user?.name || "User"}
                  </div>
                  <div className="text-xs text-slate-400">{user?.email}</div>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 rounded-lg transition"
                >
                  Logout
                </button>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-md text-slate-500 hover:text-slate-400 hover:bg-slate-800"
              >
                <span className="sr-only">Open menu</span>
                {mobileMenuOpen ? "✕" : "☰"}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-800 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    location.pathname === item.path
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  {item.icon} {item.label}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:bg-slate-800"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Sidebar + Content */}
      <div className="flex pt-16">
        {/* Sidebar - Desktop */}
        <aside className="hidden md:flex md:flex-shrink-0">
          <div className="flex flex-col w-64 bg-white border-r border-slate-800 h-[calc(100vh-4rem)] fixed">
            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition ${
                    location.pathname === item.path
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  <span className="mr-3 text-xl">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Sidebar Footer */}
            <div className="p-4 border-t border-slate-800">
              <Link
                to="/credits"
                className="block w-full px-4 py-3 bg-gradient-to-r from-indigo-700 to-indigo-900 text-white text-center rounded-lg hover:from-indigo-700 hover:to-blue-700 transition"
              >
                Buy More Credits
              </Link>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 md:ml-64">
          <div className="py-6 px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
