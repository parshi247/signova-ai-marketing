import { Link } from "wouter";
import { Building2, Heart, Scale, Landmark, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const industries = [
  {
    id: "healthcare",
    title: "Healthcare",
    description: "E-signatures for patient consent forms, medical records, and healthcare agreements. Not HIPAA-certified — consult your compliance officer.",
    icon: Heart,
    features: ["Compliance-Ready", "Patient Consent Forms", "Medical Records", "Insurance Documents"],
    color: "text-red-500"
  },
  {
    id: "real-estate",
    title: "Real Estate",
    description: "Streamline property transactions with secure digital signatures for contracts, leases, and disclosures.",
    icon: Building2,
    features: ["Purchase Agreements", "Lease Contracts", "Property Disclosures", "Title Documents"],
    color: "text-blue-500"
  },
  {
    id: "legal",
    title: "Legal",
    description: "Court-admissible e-signatures with comprehensive audit trails for legal documents and contracts.",
    icon: Scale,
    features: ["Court Admissible", "Audit Trails", "Legal Contracts", "Notarization Ready"],
    color: "text-indigo-400"
  },
  {
    id: "financial",
    title: "Financial Services",
    description: "Secure, compliant e-signatures for banking, insurance, and investment documents.",
    icon: Landmark,
    features: ["SOC 2 Compliant", "Bank Documents", "Insurance Forms", "Investment Agreements"],
    color: "text-green-500"
  }
];

export default function Industries() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Industry Solutions
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Signova provides tailored e-signature solutions for every industry. 
            Our platform meets the unique compliance and workflow requirements of your sector.
          </p>
        </div>
      </section>

      {/* Industries Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {industries.map((industry) => (
              <Card key={industry.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg bg-gray-100 ${industry.color}`}>
                      <industry.icon className="w-8 h-8" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">{industry.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base mb-4">
                    {industry.description}
                  </CardDescription>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {industry.features.map((feature) => (
                      <span key={feature} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                        {feature}
                      </span>
                    ))}
                  </div>
                  <Link href={`/industries/${industry.id}`}>
                    <Button variant="outline" className="group">
                      Learn More
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Document Workflow?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses using Signova to streamline their document signing process.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/pricing">
              <Button size="lg" variant="secondary">View Pricing</Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
