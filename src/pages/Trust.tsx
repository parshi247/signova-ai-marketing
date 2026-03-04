import { useEffect, useState } from "react";

interface DnsRecord {
  type: string;
  status: "pass" | "fail" | "pending";
  value: string;
}

interface ComplianceItem {
  standard: string;
  status: "compliant" | "in_progress" | "planned";
  description: string;
}

const COMPLIANCE_ITEMS: ComplianceItem[] = [
  { standard: "ESIGN Act (USA)", status: "compliant", description: "Electronic Signatures in Global and National Commerce Act — all signatures are legally binding in the United States." },
  { standard: "UETA", status: "compliant", description: "Uniform Electronic Transactions Act — adopted in 49 US states." },
  { standard: "eIDAS (EU)", status: "compliant", description: "Electronic Identification, Authentication and Trust Services — Simple Electronic Signature (SES) standard." },
  { standard: "GDPR", status: "compliant", description: "General Data Protection Regulation — DPA, right to erasure, and data portability implemented." },
  { standard: "PIPEDA (Canada)", status: "compliant", description: "Personal Information Protection and Electronic Documents Act." },
  { standard: "SOC 2 Type II", status: "in_progress", description: "Audit in progress. Expected certification: Q3 2026." },
  { standard: "ISO 27001", status: "planned", description: "Information Security Management System — planned for Q4 2026." },
];

const DNS_RECORDS: DnsRecord[] = [
  { type: "SPF", status: "pass", value: "v=spf1 include:spf.protection.outlook.com -all" },
  { type: "DKIM (selector1)", status: "pass", value: "selector1._domainkey.signova.ai → outlook.com" },
  { type: "DKIM (selector2)", status: "pass", value: "selector2._domainkey.signova.ai → outlook.com" },
  { type: "DMARC", status: "pass", value: "v=DMARC1; p=none; rua=mailto:dmarc@signova.ai" },
  { type: "MX", status: "pass", value: "signova-ai.mail.protection.outlook.com (priority 0)" },
];

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pass: "bg-green-50 text-green-700 border border-green-200",
    compliant: "bg-green-50 text-green-700 border border-green-200",
    fail: "bg-red-50 text-red-700 border border-red-200",
    in_progress: "bg-amber-50 text-amber-700 border border-amber-200",
    planned: "bg-gray-50 text-gray-600 border border-gray-200",
  };
  const labels: Record<string, string> = {
    pass: "Pass", compliant: "Compliant", fail: "Fail",
    in_progress: "In Progress", planned: "Planned",
  };
  return (
    <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded ${styles[status] || "bg-gray-50 text-gray-600 border border-gray-200"}`}>
      {labels[status] || status}
    </span>
  );
}

export default function Trust() {
  useEffect(() => { document.title = "Trust & Security — Signova"; }, []);

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="text-lg font-semibold tracking-tight text-gray-900">Signova</a>
          <nav className="flex items-center gap-6 text-sm text-gray-600">
            <a href="/security" className="hover:text-gray-900 transition-colors">Security</a>
            <a href="/terms" className="hover:text-gray-900 transition-colors">Terms</a>
            <a href="/privacy" className="hover:text-gray-900 transition-colors">Privacy</a>
          </nav>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 pt-12 pb-8">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">Trust &amp; Compliance</p>
        <h1 className="text-3xl font-semibold text-gray-900 mb-4">Built for legal enforceability. Operated with transparency.</h1>
        <p className="text-base text-gray-600 max-w-2xl leading-relaxed">
          Signova is designed to meet the legal and technical requirements for electronic signatures across major jurisdictions. This page documents our compliance posture, email infrastructure, and system audit events.
        </p>
        <p className="text-xs text-gray-400 mt-4">Last updated: {new Date().toISOString().split("T")[0]}</p>
      </div>

      <main className="max-w-4xl mx-auto px-6 pb-20">
        <section className="mb-12">
          <h2 className="text-lg font-semibold text-gray-900 mb-1 pb-2 border-b border-gray-200">Legal Compliance</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm border border-gray-200 rounded">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-4 py-3 font-medium text-gray-700 border-b border-gray-200">Standard</th>
                  <th className="px-4 py-3 font-medium text-gray-700 border-b border-gray-200">Status</th>
                  <th className="px-4 py-3 font-medium text-gray-700 border-b border-gray-200">Notes</th>
                </tr>
              </thead>
              <tbody>
                {COMPLIANCE_ITEMS.map((item, i) => (
                  <tr key={i} className="border-b border-gray-100 last:border-0">
                    <td className="px-4 py-3 font-medium text-gray-900">{item.standard}</td>
                    <td className="px-4 py-3"><StatusBadge status={item.status} /></td>
                    <td className="px-4 py-3 text-gray-600">{item.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-lg font-semibold text-gray-900 mb-1 pb-2 border-b border-gray-200">Email Infrastructure</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm border border-gray-200 rounded">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-4 py-3 font-medium text-gray-700 border-b border-gray-200">Record</th>
                  <th className="px-4 py-3 font-medium text-gray-700 border-b border-gray-200">Status</th>
                  <th className="px-4 py-3 font-medium text-gray-700 border-b border-gray-200">Value</th>
                </tr>
              </thead>
              <tbody>
                {DNS_RECORDS.map((record, i) => (
                  <tr key={i} className="border-b border-gray-100 last:border-0">
                    <td className="px-4 py-3 font-mono text-xs text-gray-900">{record.type}</td>
                    <td className="px-4 py-3"><StatusBadge status={record.status} /></td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-600 break-all">{record.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-3">Canonical sender: <span className="font-mono">no-reply@signova.ai</span> · Provider: Microsoft Exchange Online (M365)</p>
        </section>

        <section className="mb-12">
          <h2 className="text-lg font-semibold text-gray-900 mb-1 pb-2 border-b border-gray-200">Data Handling</h2>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: "Data Region", value: "US East (AWS us-east-1)" },
              { label: "Encryption at Rest", value: "AES-256 (AWS RDS)" },
              { label: "Encryption in Transit", value: "TLS 1.2 / 1.3" },
              { label: "Document Storage", value: "AWS S3 (private, signed URLs)" },
              { label: "Database", value: "TiDB Serverless (MySQL-compatible)" },
              { label: "Backup Frequency", value: "Daily automated snapshots" },
              { label: "Retention Period", value: "7 years (configurable)" },
              { label: "Right to Erasure", value: "Supported via account deletion" },
            ].map((item, i) => (
              <div key={i} className="border border-gray-200 rounded p-4">
                <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                <p className="text-sm font-medium text-gray-900">{item.value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-lg font-semibold text-gray-900 mb-1 pb-2 border-b border-gray-200">Security Contact</h2>
          <p className="mt-4 text-sm text-gray-600">
            To report a security vulnerability or request a data processing agreement (DPA), contact the Signova security team at{" "}
            <a href="mailto:security@signova.ai" className="text-gray-900 underline underline-offset-2">security@signova.ai</a>.
            We acknowledge all reports within 48 hours.
          </p>
        </section>
      </main>

      <footer className="border-t border-gray-200 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400">&copy; {new Date().getFullYear()} Signova Technologies Inc. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <a href="/privacy" className="hover:text-gray-600 transition-colors">Privacy Policy</a>
            <a href="/terms" className="hover:text-gray-600 transition-colors">Terms of Service</a>
            <a href="/contact" className="hover:text-gray-600 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
