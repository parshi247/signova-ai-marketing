import MarketingNav from "@/components/MarketingNav";
import MarketingFooter from "@/components/MarketingFooter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  Shield,
  Lock,
  FileCheck,
  Globe,
  Server,
  Eye,
  CheckCircle2,
  Award,
  Building2,
  Scale,
} from "lucide-react";

export default function Compliance() {
  const certifications = [
    {
      icon: Shield,
      title: "SOC 2 Type II",
      description: "Our systems and processes are audited annually to ensure the highest standards of security, availability, and confidentiality.",
      status: "Certified",
    },
    {
      icon: Globe,
      title: "GDPR Compliant",
      description: "Full compliance with the European Union's General Data Protection Regulation for data privacy and protection.",
      status: "Compliant",
    },
    {
      icon: Lock,
      title: "ISO 27001",
      description: "International standard for information security management systems (ISMS) certification.",
      status: "Certified",
    },
    {
      icon: FileCheck,
      title: "HIPAA Ready",
      description: "Healthcare organizations can use Signova for general document workflows. Signova AI is not HIPAA-certified. Do not use for protected health information without consulting your compliance officer. BAA agreements available upon request for enterprise customers.",
      status: "Available",
    },
  ];

  const legalFrameworks = [
    {
      region: "United States",
      laws: ["ESIGN Act (2000)", "UETA (1999)", "State-specific regulations"],
      icon: Building2,
    },
    {
      region: "European Union",
      laws: ["eIDAS Regulation", "GDPR", "National implementations"],
      icon: Globe,
    },
    {
      region: "United Kingdom",
      laws: ["Electronic Communications Act 2000", "UK GDPR", "eIDAS (retained)"],
      icon: Scale,
    },
    {
      region: "International",
      laws: ["UNCITRAL Model Law", "180+ country recognition", "Cross-border validity"],
      icon: Award,
    },
  ];

  const securityFeatures = [
    "256-bit AES encryption at rest",
    "TLS 1.3 encryption in transit",
    "Multi-factor authentication",
    "Role-based access control",
    "Audit trails and logging",
    "Secure data centers (AWS)",
    "Regular penetration testing",
    "24/7 security monitoring",
    "Automatic backups",
    "Disaster recovery",
    "Data residency options",
    "SSO integration (SAML/OIDC)",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <MarketingNav />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="container max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Shield className="w-4 h-4" />
            Enterprise-Grade Security
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Security & Compliance
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
            Signova is built with security at its core. We maintain the highest 
            standards of compliance to protect your documents and data.
          </p>
        </div>
      </section>

      {/* Certifications Grid */}
      <section className="py-16 px-4">
        <div className="container max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
            Certifications & Compliance
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {certifications.map((cert, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <cert.icon className="w-7 h-7 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-semibold text-slate-900">
                          {cert.title}
                        </h3>
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                          {cert.status}
                        </span>
                      </div>
                      <p className="text-slate-600">{cert.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Legal Validity Section */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Legal Validity Worldwide
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Electronic signatures created with Signova are legally binding in 
              over 180 countries under various e-signature laws.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {legalFrameworks.map((framework, index) => (
              <Card key={index} className="border-0 shadow-md">
                <CardContent className="p-6">
                  <framework.icon className="w-10 h-10 text-blue-600 mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">
                    {framework.region}
                  </h3>
                  <ul className="space-y-2">
                    {framework.laws.map((law, lawIndex) => (
                      <li key={lawIndex} className="flex items-start gap-2 text-sm text-slate-600">
                        <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        {law}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Security Features */}
      <section className="py-16 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">
                Enterprise Security Features
              </h2>
              <p className="text-lg text-slate-600 mb-8">
                We implement multiple layers of security to ensure your documents 
                and data are protected at every step.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {securityFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-slate-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 text-white">
              <Server className="w-12 h-12 mb-6 text-blue-400" />
              <h3 className="text-2xl font-bold mb-4">Infrastructure Security</h3>
              <p className="text-slate-300 mb-6">
                Signova runs on AWS infrastructure with data centers that maintain 
                SOC 1, SOC 2, and ISO 27001 certifications. Your data is protected 
                by the same security measures used by the world's largest enterprises.
              </p>
              <div className="flex items-center gap-3">
                <Eye className="w-6 h-6 text-blue-400" />
                <span className="text-sm text-slate-300">24/7 Security Operations Center</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Data Privacy Section */}
      <section className="py-16 px-4 bg-blue-600">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center text-white">
            <Lock className="w-16 h-16 mx-auto mb-6 opacity-90" />
            <h2 className="text-3xl font-bold mb-4">Your Data, Your Control</h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
              We never sell your data. You maintain full ownership and control 
              over your documents. Export or delete your data anytime.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/privacy">
                <Button size="lg" variant="secondary">
                  Privacy Policy
                </Button>
              </Link>
              <Link href="/terms">
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                  Terms of Service
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4">
        <div className="container max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Have Compliance Questions?
          </h2>
          <p className="text-lg text-slate-600 mb-8">
            Our security team is available to answer your questions and provide 
            documentation for your compliance requirements.
          </p>
          <Link href="/contact">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Contact Security Team
            </Button>
          </Link>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
