import { Link } from "wouter";
import MarketingFooter from "@/components/MarketingFooter";

// Design: slate-900 header + clean white content + indigo accents — matches main site
export default function Privacy() {
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
          <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
          <p className="text-slate-400 text-base">Last Updated: February 28, 2026</p>
        </div>
      </div>

      {/* ── Content ── */}
      <main className="flex-1 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-slate max-w-none">

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Introduction</h2>
              <p className="text-slate-600 leading-relaxed">
                Signova AI ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how
                we collect, use, disclose, and safeguard your information when you use our electronic signature platform
                and services. Please read this policy carefully. If you disagree with its terms, please discontinue use of our Service.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Information We Collect</h2>
              <h3 className="text-lg font-semibold text-slate-800 mb-3">2.1 Information You Provide</h3>
              <ul className="list-disc list-inside text-slate-600 space-y-2 mb-4">
                <li><strong>Account Information:</strong> Name, email address, phone number, company name</li>
                <li><strong>Payment Information:</strong> Credit card details, billing address (processed securely through Stripe)</li>
                <li><strong>Documents:</strong> Files you upload, create, or sign using our Service</li>
                <li><strong>Communications:</strong> Messages you send to our support team</li>
              </ul>
              <h3 className="text-lg font-semibold text-slate-800 mb-3">2.2 Automatically Collected Information</h3>
              <ul className="list-disc list-inside text-slate-600 space-y-2">
                <li><strong>Usage Data:</strong> Pages visited, features used, time spent on the Service</li>
                <li><strong>Device Information:</strong> IP address, browser type, operating system</li>
                <li><strong>Cookies:</strong> Session cookies, preference cookies, analytics cookies</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">3. How We Use Your Information</h2>
              <p className="text-slate-600 leading-relaxed mb-3">We use the information we collect to:</p>
              <ul className="list-disc list-inside text-slate-600 space-y-2">
                <li>Provide, maintain, and improve our Service</li>
                <li>Process your transactions and send related information</li>
                <li>Send technical notices, updates, and support messages</li>
                <li>Respond to your comments and questions</li>
                <li>Monitor and analyze usage patterns and trends</li>
                <li>Detect and prevent fraudulent transactions and other illegal activities</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Information Sharing</h2>
              <p className="text-slate-600 leading-relaxed mb-3">
                We do not sell, trade, or rent your personal information to third parties. We may share your information with:
              </p>
              <ul className="list-disc list-inside text-slate-600 space-y-2">
                <li><strong>Service Providers:</strong> Third-party vendors who assist in operating our platform (e.g., Stripe for payments, AWS for hosting)</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                <li><strong>Consent:</strong> With your explicit consent for any other purpose</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Data Security</h2>
              <p className="text-slate-600 leading-relaxed">
                We implement industry-standard security measures to protect your information, including 256-bit AES encryption
                for data at rest, TLS 1.3 for data in transit, regular security audits, and access controls. While we strive
                to protect your information, no method of transmission over the Internet is 100% secure.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Your Rights</h2>
              <p className="text-slate-600 leading-relaxed mb-3">You have the right to:</p>
              <ul className="list-disc list-inside text-slate-600 space-y-2">
                <li>Access and receive a copy of your personal data</li>
                <li>Rectify inaccurate personal data</li>
                <li>Request deletion of your personal data</li>
                <li>Object to processing of your personal data</li>
                <li>Data portability</li>
                <li>Withdraw consent at any time</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Cookies</h2>
              <p className="text-slate-600 leading-relaxed">
                We use cookies and similar tracking technologies to track activity on our Service and hold certain information.
                You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you
                do not accept cookies, some portions of our Service may not function properly.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Children's Privacy</h2>
              <p className="text-slate-600 leading-relaxed">
                Our Service is not directed to individuals under the age of 18. We do not knowingly collect personal information
                from children under 18. If we become aware that a child under 18 has provided us with personal information,
                we take steps to remove such information.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Changes to This Policy</h2>
              <p className="text-slate-600 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new
                Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy
                Policy periodically for any changes.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">10. Contact Us</h2>
              <p className="text-slate-600 leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us at{" "}
                <a href="mailto:privacy@signova.ai" className="text-indigo-600 hover:text-indigo-700 font-medium">privacy@signova.ai</a>.
              </p>
            </section>

          </div>
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
}
