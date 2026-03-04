import { Link } from "wouter";
import MarketingFooter from "@/components/MarketingFooter";

// Design: slate-900 header + clean white content + indigo accents — matches main site
export default function Security() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* ── Header ── */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/">
              <a className="flex items-center gap-3">
                <img src="/signova-logo-white.png" alt="Signova AI" className="h-8 w-auto" />
              </a>
            </Link>
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/"><a className="text-slate-300 hover:text-white text-sm font-medium transition-colors">Home</a></Link>
              <Link href="/pricing"><a className="text-slate-300 hover:text-white text-sm font-medium transition-colors">Pricing</a></Link>
              <Link href="/about"><a className="text-slate-300 hover:text-white text-sm font-medium transition-colors">About</a></Link>
              <Link href="/contact"><a className="text-slate-300 hover:text-white text-sm font-medium transition-colors">Contact</a></Link>
              <Link href="/register"><a className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors">Get Started</a></Link>
            </nav>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <div className="bg-slate-900 text-white py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-indigo-400 text-sm font-semibold uppercase tracking-widest mb-3">Trust & Compliance</p>
          <h1 className="text-4xl font-bold text-white mb-4">Security at Signova AI</h1>
          <p className="text-slate-400 text-base">Enterprise-grade protection for every document</p>
        </div>
      </div>

      {/* ── Trust badges ── */}
      <div className="bg-indigo-600 py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-8 text-white text-sm font-semibold">
            <span>256-bit AES Encryption</span>
            <span className="text-indigo-300">|</span>
            <span>TLS 1.3 in Transit</span>
            <span className="text-indigo-300">|</span>
            <span>ESIGN &amp; UETA Compliant</span>
            <span className="text-indigo-300">|</span>
            <span>SOC 2 Type II Aligned</span>
            <span className="text-indigo-300">|</span>
            <span>Full Audit Trail</span>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <main className="flex-1 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-slate max-w-none">

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Encryption</h2>
              <p className="text-slate-600 leading-relaxed">
                All documents stored on Signova AI are encrypted at rest using 256-bit AES encryption. Data in transit
                is protected with TLS 1.3, the latest and most secure transport layer protocol. Encryption keys are
                managed using AWS Key Management Service (KMS) with automatic rotation.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Infrastructure Security</h2>
              <p className="text-slate-600 leading-relaxed mb-3">
                Our infrastructure is hosted on Amazon Web Services (AWS) in SOC 2 Type II certified data centers:
              </p>
              <ul className="list-disc list-inside text-slate-600 space-y-2">
                <li>Multi-region redundancy with automatic failover</li>
                <li>Web Application Firewall (WAF) protecting against OWASP Top 10</li>
                <li>DDoS protection via AWS Shield</li>
                <li>VPC isolation with private subnets for sensitive workloads</li>
                <li>Regular penetration testing by third-party security firms</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Access Controls</h2>
              <ul className="list-disc list-inside text-slate-600 space-y-2">
                <li>Role-based access control (RBAC) for all user permissions</li>
                <li>Multi-factor authentication (MFA) support</li>
                <li>Single Sign-On (SSO) via Google, Microsoft, and LinkedIn</li>
                <li>Session management with automatic timeout</li>
                <li>IP allowlisting for enterprise accounts</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Audit Trail</h2>
              <p className="text-slate-600 leading-relaxed">
                Every action on every document is recorded in a tamper-evident audit trail, including: document creation,
                views, edits, signature requests, signature completions, and access attempts. Audit logs are cryptographically
                signed and stored separately from document data to ensure integrity.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Legal Compliance</h2>
              <ul className="list-disc list-inside text-slate-600 space-y-2">
                <li><strong>ESIGN Act:</strong> Electronic Signatures in Global and National Commerce Act (USA)</li>
                <li><strong>UETA:</strong> Uniform Electronic Transactions Act (USA)</li>
                <li><strong>eIDAS:</strong> Electronic Identification, Authentication and Trust Services (EU)</li>
                <li><strong>PIPEDA:</strong> Personal Information Protection and Electronic Documents Act (Canada)</li>
                <li><strong>GDPR:</strong> General Data Protection Regulation (EU)</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Responsible Disclosure</h2>
              <p className="text-slate-600 leading-relaxed">
                If you discover a security vulnerability, please report it responsibly to{" "}
                <a href="mailto:security@signova.ai" className="text-indigo-600 hover:text-indigo-700 font-medium">security@signova.ai</a>.
                We will acknowledge receipt within 24 hours and provide a resolution timeline within 72 hours.
              </p>
            </section>

          </div>
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
}
