declare global { interface Window { gtag?: (...args: any[]) => void; } }
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Lock, CheckCircle2, ArrowRight, Eye, EyeOff, ArrowLeft, User, Building2, Mail, FileText, PenTool, Globe } from "lucide-react";
import { useLocation, Link } from "wouter";

const planLabels: Record<string, string> = {
  starter: 'Starter — $19/month',
  professional: 'Professional — $49/month',
  enterprise: 'Enterprise — $149/month',
};

const platformPoints = [
  {
    icon: FileText,
    title: 'AI Document Generation',
    desc: 'Generate contracts, NDAs, and agreements in seconds. Jurisdiction-aware templates for US, Canada, UK, and EU.',
  },
  {
    icon: PenTool,
    title: 'Legally Binding eSignatures',
    desc: 'ESIGN Act and UETA compliant. Full audit trail with IP logging, timestamps, and tamper-evident seals.',
  },
  {
    icon: Globe,
    title: 'Multi-Jurisdiction Support',
    desc: 'Documents tailored for multiple legal jurisdictions. GDPR-compliant data handling for EU users.',
  },
  {
    icon: Shield,
    title: 'Enterprise-Grade Security',
    desc: '256-bit AES encryption at rest and in transit. SOC 2 Type II audit in progress.',
  },
];

export default function Register() {
  const [, navigate] = useLocation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedPlan] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('plan') || 'free';
  });

  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.user?.id) {
          const tier = data.user.subscriptionTier;
          if (!tier || tier === 'free') {
            navigate('/pricing');
          } else if (data.user.onboardingCompleted) {
            navigate('/dashboard');
          } else {
            try { GA4Tracker.getInstance().trackConversion('signup'); if (window.gtag) { window.gtag('event', 'sign_up', { method: 'email' }); } } catch(e) {}
        navigate('/onboarding');
          }
        }
      })
      .catch(() => {});
  }, [navigate]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) { setError('Please enter your full name.'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          name: name.trim(),
          company: company.trim() || null,
          subscriptionTier: selectedPlan,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Registration failed. Please try again.');
      // If registering for a paid plan, redirect to checkout
      if (selectedPlan && selectedPlan !== 'free') {
        navigate('/checkout?plan=' + selectedPlan);
      } else {
        navigate('/onboarding');
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* LEFT PANEL — Platform Overview */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-[#0f1117] px-14 py-12">
        {/* Logo */}
        <div>
          <Link href="/">
            <img src="/signova-logo-white.png" alt="Signova AI" className="h-9 w-auto" />
          </Link>
        </div>

        {/* Main copy */}
        <div className="flex-1 flex flex-col justify-center py-12">
          <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-4">
            Document Intelligence Platform
          </p>
          <h1 className="text-4xl font-light text-white leading-tight mb-6">
            AI-powered documents.<br />
            <span className="font-semibold">Legally binding signatures.</span>
          </h1>
          <p className="text-gray-400 text-base leading-relaxed mb-12 max-w-sm">
            Generate, send, and sign professional documents — with a complete audit trail and multi-jurisdiction compliance built in.
          </p>

          {/* Platform points */}
          <div className="space-y-7">
            {platformPoints.map((point) => (
              <div key={point.title} className="flex items-start gap-4">
                <div className="flex-shrink-0 w-9 h-9 rounded border border-gray-700 flex items-center justify-center">
                  <point.icon className="h-4 w-4 text-gray-400" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium mb-0.5">{point.title}</p>
                  <p className="text-gray-500 text-xs leading-relaxed">{point.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom compliance bar */}
        <div className="flex items-center gap-8 pt-8 border-t border-gray-800">
          <div>
            <p className="text-white text-sm font-semibold">ESIGN Act</p>
            <p className="text-gray-500 text-xs">Compliant</p>
          </div>
          <div className="w-px h-8 bg-gray-800" />
          <div>
            <p className="text-white text-sm font-semibold">UETA</p>
            <p className="text-gray-500 text-xs">Compliant</p>
          </div>
          <div className="w-px h-8 bg-gray-800" />
          <div>
            <p className="text-white text-sm font-semibold">GDPR</p>
            <p className="text-gray-500 text-xs">Ready</p>
          </div>
          <div className="w-px h-8 bg-gray-800" />
          <div>
            <p className="text-white text-sm font-semibold">256-bit</p>
            <p className="text-gray-500 text-xs">AES Encryption</p>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL — Registration Form */}
      <div className="flex-1 lg:w-1/2 flex flex-col min-h-screen bg-white dark:bg-gray-950">
        {/* Mobile header */}
        <div className="lg:hidden bg-[#0f1117] px-6 py-4 flex items-center justify-between">
          <Link href="/">
            <img src="/signova-logo-white.png" alt="Signova AI" className="h-9 w-auto" />
          </Link>
          <Link href="/" className="text-gray-400 hover:text-white text-sm flex items-center gap-1">
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
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                Create your account
              </h2>
              <p className="text-sm text-muted-foreground">
                Start your journey with Signova.ai
              </p>
              {selectedPlan !== 'free' && (
                <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded border border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300">
                  <CheckCircle2 className="h-3.5 w-3.5 text-gray-500" />
                  Plan selected: {planLabels[selectedPlan] || selectedPlan}
                </div>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="mb-6 p-4 rounded border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-sm">
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
            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 text-slate-400 font-medium">Or register with email</span>
              </div>
            </div>
            {/* Form */}
            <form onSubmit={handleRegister} className="space-y-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Jane Smith"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 h-11"
                    required
                    disabled={isLoading}
                    autoComplete="name"
                  />
                </div>
              </div>
              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="jane@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-11"
                    required
                    disabled={isLoading}
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Company (optional) */}
              <div className="space-y-1.5">
                <Label htmlFor="company" className="text-sm font-medium">
                  Company <span className="text-muted-foreground font-normal">(optional)</span>
                </Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="company"
                    type="text"
                    placeholder="Acme Corp"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="pl-10 h-11"
                    disabled={isLoading}
                    autoComplete="organization"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Minimum 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-11"
                    required
                    disabled={isLoading}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Repeat your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 pr-10 h-11"
                    required
                    disabled={isLoading}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Terms */}
              <p className="text-xs text-muted-foreground">
                By creating an account, you agree to our{' '}
                <Link href="/terms" className="text-gray-700 dark:text-gray-300 underline underline-offset-2 hover:text-gray-900">Terms of Service</Link>
                {' '}and{' '}
                <Link href="/privacy" className="text-gray-700 dark:text-gray-300 underline underline-offset-2 hover:text-gray-900">Privacy Policy</Link>.
              </p>

              {/* Submit */}
              <Button
                type="submit"
                className="w-full h-11 bg-[#1a1a2e] hover:bg-[#16213e] text-white font-medium text-sm tracking-wide"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Create Account <ArrowRight className="h-4 w-4" />
                  </span>
                )}
              </Button>
            </form>

            {/* Compliance badges */}
            <div className="mt-5 flex items-center justify-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Lock className="h-3 w-3" /> 256-bit SSL
              </span>
              <span className="text-gray-300 dark:text-gray-600">|</span>
              <span className="flex items-center gap-1.5">
                <Shield className="h-3 w-3" /> ESIGN compliant
              </span>
              <span className="text-gray-300 dark:text-gray-600">|</span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3 w-3" /> GDPR ready
              </span>
            </div>

            {/* Sign in link */}
            <p className="mt-5 text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="text-gray-900 dark:text-gray-100 font-medium underline underline-offset-2 hover:no-underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
