import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { APP_LOGO, APP_TITLE } from "@/const";
import { Shield, Lock, Eye, EyeOff, ArrowLeft, Mail, CheckCircle2, FileSignature, Clock, Star } from "lucide-react";
import { useLocation, Link } from "wouter";

const recentActivity = [
  { icon: FileSignature, text: 'NDA signed by 2 parties', time: '2 min ago' },
  { icon: CheckCircle2, text: 'Employment contract generated', time: '8 min ago' },
  { icon: Star, text: 'New user joined from Toronto', time: '15 min ago' },
  { icon: FileSignature, text: 'Lease agreement completed', time: '22 min ago' },
];

export default function Login() {
  const [, navigate] = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.user?.id) {
          const tier = data.user.subscriptionTier;
          if (!tier || tier === 'free') {
            navigate('/dashboard');
          } else if (data.user.onboardingCompleted) {
            navigate('/dashboard');
          } else {
            navigate('/onboarding');
          }
        }
      })
      .catch(() => {});
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Invalid email or password.');
      const tier2 = data.user?.subscriptionTier;
          if (!tier2 || tier2 === 'free') {
            navigate('/dashboard');
          } else if (data.user?.onboardingCompleted) {
            navigate('/dashboard');
          } else {
            navigate('/onboarding');
          }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* LEFT PANEL — Brand & Activity Feed */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex-col justify-between p-12 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-20 left-10 w-80 h-80 rounded-full bg-indigo-300 blur-3xl" />
        </div>

        <div className="relative z-10">
          {/* Logo */}
          <Link href="/">
            <img src="/signova-logo-white.png" alt="Signova AI" className="h-20 w-auto mb-12" />
          </Link>

          {/* Headline */}
          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Welcome back to<br />
            <span className="text-indigo-300">Signova AI</span>
          </h1>
          <p className="text-slate-300 text-lg mb-12">
            Your AI-assisted document platform. Generate, sign, and manage agreements — all in one place.
          </p>

          {/* Live activity feed */}
          <div className="space-y-1">
            <p className="text-white/60 text-xs uppercase tracking-wider font-semibold mb-4">Recent Activity</p>
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-center gap-3 py-3 border-b border-white/10 last:border-0">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <item.icon className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{item.text}</p>
                </div>
                <div className="flex items-center gap-1 text-indigo-300 text-xs flex-shrink-0">
                  <Clock className="h-3 w-3" />
                  {item.time}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom compliance badges */}
        <div className="relative z-10 flex items-center gap-6 pt-8 border-t border-white/20">
          <div className="text-center">
            <p className="text-2xl font-bold text-white">256-bit</p>
            <p className="text-indigo-300 text-xs">AES Encryption</p>
          </div>
          <div className="w-px h-10 bg-white/20" />
          <div className="text-center">
            <p className="text-2xl font-bold text-white">ESIGN</p>
            <p className="text-indigo-300 text-xs">Compliant</p>
          </div>
          <div className="w-px h-10 bg-white/20" />
          <div className="text-center">
            <p className="text-2xl font-bold text-white">UETA</p>
            <p className="text-indigo-300 text-xs">Certified</p>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL — Login Form */}
      <div className="flex-1 lg:w-1/2 flex flex-col min-h-screen bg-white dark:bg-gray-950">
        {/* Mobile header */}
        <div className="lg:hidden bg-slate-900 px-6 py-4 flex items-center justify-between">
          <Link href="/">
            <img src="/signova-logo-white.png" alt="Signova AI" className="h-10 w-auto" />
          </Link>
          <Link href="/" className="text-white/80 hover:text-white text-sm flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" /> Home
          </Link>
        </div>

        {/* Back button (desktop) */}
        <div className="hidden lg:flex px-12 pt-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground text-sm flex items-center gap-1 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
        </div>

        {/* Form container */}
        <div className="flex-1 flex items-center justify-center px-6 py-8 lg:px-12">
          <div className="w-full max-w-md">
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Sign in</h2>
              <p className="text-muted-foreground mt-2">
                Enter your credentials to access your account.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
                {error}
              </div>
            )}


            {/* Social Login Buttons */}
            <div className="space-y-3 mb-6">
              <a
                href="/auth/google"
                className="flex items-center justify-center gap-3 w-full h-11 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors text-sm font-medium text-slate-700 shadow-sm"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </a>
              <a
                href="/auth/linkedin"
                className="flex items-center justify-center gap-3 w-full h-11 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors text-sm font-medium text-slate-700 shadow-sm"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#0A66C2">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                Continue with LinkedIn
              </a>
              <a
                href="/auth/microsoft"
                className="flex items-center justify-center gap-3 w-full h-11 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors text-sm font-medium text-slate-700 shadow-sm"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#F25022" d="M1 1h10v10H1z"/>
                  <path fill="#00A4EF" d="M13 1h10v10H13z"/>
                  <path fill="#7FBA00" d="M1 13h10v10H1z"/>
                  <path fill="#FFB900" d="M13 13h10v10H13z"/>
                </svg>
                Continue with Microsoft
              </a>
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 text-slate-400 font-medium">or sign in with email</span>
              </div>
            </div>
            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="email" type="email" placeholder="you@company.com" value={email}
                    onChange={(e) => setEmail(e.target.value)} className="pl-10 h-11" required disabled={isLoading} autoComplete="email" />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                  <Link href="/forgot-password" className="text-xs text-indigo-600 hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="password" type={showPassword ? "text" : "password"} placeholder="Your password"
                    value={password} onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-11" required disabled={isLoading} autoComplete="current-password" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <Button type="submit" className="w-full h-12 bg-indigo-700 hover:bg-indigo-800 text-white font-semibold text-base" disabled={isLoading}>
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Signing in...
                  </span>
                ) : 'Sign In'}
              </Button>
            </form>

            {/* Register link */}
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link href="/register" className="text-indigo-600 hover:underline font-medium">Create one free</Link>
            </p>

            {/* Security note */}
            <div className="mt-8 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Shield className="h-3.5 w-3.5" />
              <span>256-bit AES encryption · ESIGN &amp; UETA compliant</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
