import { Link } from "wouter";
import MarketingFooter from "@/components/MarketingFooter";

// Design: slate-900 header + clean white content + indigo accents — matches main site
export default function Terms() {
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
          <p className="text-indigo-400 text-sm font-semibold uppercase tracking-widest mb-3">Legal</p>
          <h1 className="text-4xl font-bold text-white mb-4">Terms of Service</h1>
          <p className="text-slate-400 text-base">Last Updated: February 28, 2026</p>
        </div>
      </div>

      {/* ── Content ── */}
      <main className="flex-1 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-slate max-w-none">

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-slate-600 leading-relaxed">
                By accessing and using Signova AI ("Service"), you accept and agree to be bound by the terms and
                provisions of this agreement. If you do not agree to these Terms of Service, please do not use our Service.
                These terms apply to all visitors, users, and others who access or use the Service.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Description of Service</h2>
              <p className="text-slate-600 leading-relaxed">
                Signova AI provides an electronic signature platform that enables users to create, send, sign, and
                manage digital documents. Our Service includes AI-powered document generation, signature detection,
                document workflow automation, audit trails, and secure document storage compliant with ESIGN and UETA.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">3. User Accounts</h2>
              <p className="text-slate-600 leading-relaxed mb-3">
                To use certain features of the Service, you must register for an account. You agree to:
              </p>
              <ul className="list-disc list-inside text-slate-600 space-y-2">
                <li>Provide accurate, current, and complete information during registration</li>
                <li>Maintain and promptly update your account information</li>
                <li>Maintain the security of your password and account</li>
                <li>Accept responsibility for all activities that occur under your account</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Subscription and Payment</h2>
              <p className="text-slate-600 leading-relaxed mb-3">
                Signova AI offers various subscription plans with different features and pricing. By subscribing to a paid plan, you agree to:
              </p>
              <ul className="list-disc list-inside text-slate-600 space-y-2">
                <li>Pay all fees associated with your chosen subscription plan</li>
                <li>Automatic renewal of your subscription unless cancelled before the renewal date</li>
                <li>Our refund policy as outlined in Section 8</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Acceptable Use</h2>
              <p className="text-slate-600 leading-relaxed mb-3">You agree not to use the Service to:</p>
              <ul className="list-disc list-inside text-slate-600 space-y-2">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe on the intellectual property rights of others</li>
                <li>Transmit any harmful, offensive, or illegal content</li>
                <li>Attempt to gain unauthorized access to any portion of the Service</li>
                <li>Interfere with or disrupt the integrity or performance of the Service</li>
                <li>Use the Service for fraudulent or deceptive purposes</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Electronic Signatures</h2>
              <p className="text-slate-600 leading-relaxed">
                Electronic signatures created through Signova AI are legally binding under the Electronic Signatures
                in Global and National Commerce Act (ESIGN) and the Uniform Electronic Transactions Act (UETA).
                By using our electronic signature features, you agree that your electronic signature is the legal
                equivalent of your handwritten signature.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Intellectual Property</h2>
              <p className="text-slate-600 leading-relaxed">
                The Service and its original content, features, and functionality are and will remain the exclusive
                property of Signova AI and its licensors. Our trademarks and trade dress may not be used in connection
                with any product or service without the prior written consent of Signova AI.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Refund Policy</h2>
              <p className="text-slate-600 leading-relaxed">
                Subscriptions may be cancelled at any time. Upon cancellation, you will continue to have access to the
                Service until the end of your current billing period. We do not provide refunds for partial months of
                service. If you believe you have been charged in error, please contact{" "}
                <a href="mailto:billing@signova.ai" className="text-indigo-600 hover:text-indigo-700 font-medium">billing@signova.ai</a>{" "}
                within 30 days of the charge.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Limitation of Liability</h2>
              <p className="text-slate-600 leading-relaxed">
                In no event shall Signova AI, its directors, employees, partners, agents, suppliers, or affiliates,
                be liable for any indirect, incidental, special, consequential, or punitive damages, including without
                limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your
                access to or use of (or inability to access or use) the Service.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">10. Changes to Terms</h2>
              <p className="text-slate-600 leading-relaxed">
                We reserve the right to modify or replace these Terms at any time. If a revision is material, we will
                provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change
                will be determined at our sole discretion.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">11. Contact Us</h2>
              <p className="text-slate-600 leading-relaxed">
                If you have any questions about these Terms, please contact us at{" "}
                <a href="mailto:legal@signova.ai" className="text-indigo-600 hover:text-indigo-700 font-medium">legal@signova.ai</a>.
              </p>
            </section>

          </div>
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
}
