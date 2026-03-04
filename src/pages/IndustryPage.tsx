import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, ArrowLeft, Building2, Heart, Scale, Landmark } from "lucide-react";
import { SelfClosingFunnelBlock } from '@/components/SelfClosingFunnelBlock';

const industryData: Record<string, {
  title: string;
  subtitle: string;
  description: string;
  icon: any;
  color: string;
  bgColor: string;
  features: { title: string; description: string }[];
  benefits: string[];
  compliance: string[];
  useCases: string[];
}> = {
  healthcare: {
    title: "Healthcare E-Signatures",
    subtitle: "Healthcare Document Signing",
    description: "Signova provides healthcare organizations with secure e-signature solutions for patient intake, consent forms, and medical documentation. NOTE: Signova AI is not HIPAA-certified. Do not use for protected health information without consulting your compliance officer.",
    icon: Heart,
    color: "text-red-500",
    bgColor: "bg-red-50",
    features: [
      { title: "Compliance-Ready", description: "Supports audit trails and access controls. Not HIPAA-certified — consult your compliance officer before use with PHI." },
      { title: "Patient Consent Forms", description: "Digital consent forms with secure patient authentication" },
      { title: "Medical Records", description: "Secure signing of medical records and treatment plans" },
      { title: "Insurance Documents", description: "Streamlined insurance authorization and claims processing" }
    ],
    benefits: [
      "Reduce patient wait times by 60%",
      "Eliminate paper storage costs",
      "Improve document accuracy",
      "Enhance patient experience",
      "Maintain audit trails for compliance"
    ],
    compliance: ["ESIGN Act", "UETA", "SOC 2 In Progress", "Audit Trails"],
    useCases: ["Patient Intake Forms", "Informed Consent", "HIPAA Authorizations", "Telehealth Agreements", "Insurance Claims"]
  },
  "real-estate": {
    title: "Real Estate E-Signatures",
    subtitle: "Streamline Property Transactions",
    description: "Close deals faster with Signova's real estate e-signature solution. From purchase agreements to lease contracts, our platform handles all your property documentation needs with legally binding digital signatures.",
    icon: Building2,
    color: "text-blue-500",
    bgColor: "bg-blue-50",
    features: [
      { title: "Purchase Agreements", description: "Legally binding digital signatures for property purchases" },
      { title: "Lease Contracts", description: "Streamlined rental and lease agreement signing" },
      { title: "Property Disclosures", description: "Secure handling of disclosure documents" },
      { title: "Title Documents", description: "Digital signing for title and escrow documents" }
    ],
    benefits: [
      "Close deals 80% faster",
      "Sign from anywhere, anytime",
      "Reduce errors and omissions",
      "Track document status in real-time",
      "Integrate with MLS systems"
    ],
    compliance: ["ESIGN Act", "UETA", "State Real Estate Laws", "RESPA"],
    useCases: ["Purchase Contracts", "Listing Agreements", "Rental Applications", "Property Disclosures", "Closing Documents"]
  },
  legal: {
    title: "Legal E-Signatures",
    subtitle: "Court-Admissible Digital Signatures",
    description: "Signova provides law firms and legal departments with court-admissible e-signatures backed by comprehensive audit trails. Maintain the integrity of your legal documents while improving efficiency.",
    icon: Scale,
    color: "text-indigo-400",
    bgColor: "bg-indigo-700",
    features: [
      { title: "Court Admissible", description: "Signatures that hold up in court with full legal validity" },
      { title: "Comprehensive Audit Trails", description: "Detailed logs of every action for legal proceedings" },
      { title: "Legal Contracts", description: "Secure signing for all types of legal agreements" },
      { title: "Notarization Ready", description: "Integration with remote online notarization services" }
    ],
    benefits: [
      "Reduce document turnaround by 90%",
      "Maintain chain of custody",
      "Improve client satisfaction",
      "Reduce administrative overhead",
      "Ensure document authenticity"
    ],
    compliance: ["ESIGN Act", "UETA", "ABA Guidelines", "State Bar Requirements"],
    useCases: ["Client Retainer Agreements", "Settlement Documents", "Court Filings", "Power of Attorney", "Affidavits"]
  },
  financial: {
    title: "Financial Services E-Signatures",
    subtitle: "Secure, Compliant Banking Solutions",
    description: "Signova helps financial institutions meet strict regulatory requirements while providing a seamless digital signing experience. From account openings to loan documents, we've got you covered.",
    icon: Landmark,
    color: "text-green-500",
    bgColor: "bg-green-50",
    features: [
      { title: "SOC 2 Compliant", description: "Enterprise-grade security meeting SOC 2 Type II standards" },
      { title: "Bank Documents", description: "Secure signing for account openings and banking agreements" },
      { title: "Insurance Forms", description: "Streamlined policy applications and claims" },
      { title: "Investment Agreements", description: "Compliant signing for investment and advisory documents" }
    ],
    benefits: [
      "Reduce account opening time by 70%",
      "Improve customer onboarding",
      "Maintain regulatory compliance",
      "Reduce operational costs",
      "Enhance fraud prevention"
    ],
    compliance: ["SOC 2 Type II", "FINRA", "SEC", "GDPR", "PCI DSS"],
    useCases: ["Account Applications", "Loan Documents", "Insurance Policies", "Investment Agreements", "Compliance Forms"]
  }
};

export default function IndustryPage() {
  const { industry } = useParams<{ industry: string }>();
  const data = industryData[industry || ""];

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Industry not found</h1>
          <Link href="/industries">
            <Button>View All Industries</Button>
          </Link>
        </div>
      </div>
    );
  }

  const Icon = data.icon;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className={`py-20 px-4 ${data.bgColor}`}>
        <div className="container mx-auto">
          <Link href="/industries">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="mr-2 w-4 h-4" /> All Industries
            </Button>
          </Link>
          <div className="flex items-center gap-4 mb-6">
            <div className={`p-4 rounded-xl bg-white shadow-sm ${data.color}`}>
              <Icon className="w-12 h-12" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">{data.title}</h1>
              <p className="text-xl text-gray-600 mt-2">{data.subtitle}</p>
            </div>
          </div>
          <p className="text-lg text-gray-700 max-w-3xl">{data.description}</p>
          <div className="flex gap-4 mt-8">
            <Link href="/pricing">
              <Button size="lg">Start Free</Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline">Contact Sales</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {data.features.map((feature, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Benefits</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {data.benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle className={`w-6 h-6 ${data.color} flex-shrink-0 mt-0.5`} />
                <span className="text-gray-700">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Compliance & Certifications</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {data.compliance.map((cert, index) => (
              <span key={index} className="px-6 py-3 bg-gray-100 rounded-full font-medium text-gray-700">
                {cert}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Common Use Cases</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {data.useCases.map((useCase, index) => (
              <span key={index} className="px-4 py-2 bg-white border rounded-lg text-gray-700">
                {useCase}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of {data.title.split(" ")[0].toLowerCase()} professionals using Signova.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/pricing">
              <Button size="lg" variant="secondary">View Pricing</Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Watch 2-Minute Walkthrough
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
