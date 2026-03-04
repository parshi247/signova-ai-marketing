import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import MarketingNav from "@/components/MarketingNav";
import MarketingFooter from "@/components/MarketingFooter";
import { Upload, FileText, Users, CheckCircle, ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function HowItWorks() {
  const steps = [
    {
      icon: Upload,
      title: "Upload Your Document",
      description: "Simply drag and drop your PDF, Word, or other document files. Smart analysis instantly processes the document structure.",
      color: "bg-indigo-700 text-indigo-400"
    },
    {
      icon: FileText,
      title: "Add Signature Fields",
      description: "Smart field detection automatically identifies where signatures are needed. You can also manually place signature fields, text fields, checkboxes, and more.",
      color: "bg-blue-100 text-blue-600"
    },
    {
      icon: Users,
      title: "Invite Signers",
      description: "Add recipients by email. Set signing order if needed. Each signer receives a secure link to sign the document.",
      color: "bg-green-100 text-green-600"
    },
    {
      icon: CheckCircle,
      title: "Sign & Complete",
      description: "Signers receive email notifications, review the document, and sign electronically. You get real-time updates and the final signed document.",
      color: "bg-orange-100 text-orange-600"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <MarketingNav />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-700 via-blue-50 to-indigo-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              How Signova Works
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Get documents signed in 4 simple steps. No technical knowledge required.
            </p>
          </div>
        </div>
      </div>

      {/* Steps Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="space-y-12">
              {steps.map((step, index) => (
                <Card key={index} className="p-8 hover:shadow-xl transition-shadow border-2">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      <div className={`w-16 h-16 rounded-xl ${step.color} flex items-center justify-center`}>
                        <step.icon className="h-8 w-8" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-3xl font-bold text-gray-300">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <h3 className="text-2xl font-bold text-gray-900">
                          {step.title}
                        </h3>
                      </div>
                      <p className="text-gray-600 text-lg leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Signova?
            </h2>
            <p className="text-xl text-gray-600">
              Powerful features that make document signing fast, secure, and effortless
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="p-6 text-center">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold mb-2">Lightning Fast</h3>
              <p className="text-gray-600">Sign documents in seconds, not hours</p>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-bold mb-2">Bank-Level Security</h3>
              <p className="text-gray-600">256-bit encryption and SOC 2 certified</p>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-4xl mb-4">🌍</div>
              <h3 className="text-xl font-bold mb-2">Legally Binding</h3>
              <p className="text-gray-600">Compliant in 180+ countries worldwide</p>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-indigo-700 to-indigo-900">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Start free today. Enterprise-ready from day one.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link href="/pricing">
                <Button size="lg" className="bg-white text-indigo-400 hover:bg-gray-100 text-lg px-8">
                  Start Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 text-lg px-8">
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <MarketingFooter />
    </div>
  );
}
