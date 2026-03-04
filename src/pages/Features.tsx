import MarketingNav from "@/components/MarketingNav";
import MarketingFooter from "@/components/MarketingFooter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { getSignupUrl } from "@/const";
import { getLoginUrl } from "@/const";
import {
  FileSignature,
  Sparkles,
  Zap,
  Shield,
  Users,
  Bell,
  Palette,
  Code,
  BarChart3,
  FileText,
  Clock,
  Smartphone,
} from "lucide-react";

export default function Features() {
  const mainFeatures = [
    {
      icon: Sparkles,
      title: "AI-Powered Document Analysis",
      description:
        "Our AI automatically detects signature fields, form fields, and suggests optimal placement for maximum efficiency.",
      benefits: [
        "Automatic field detection",
        "Smart signature placement",
        "Document type recognition",
        "Intelligent form filling",
      ],
      image: "/ai-document-analysis.png",
    },
    {
      icon: FileSignature,
      title: "Multiple Signature Types",
      description:
        "Support for drawn signatures, typed signatures, uploaded images, and digital certificates.",
      benefits: [
        "Draw with mouse or touch",
        "Type your name",
        "Upload signature image",
        "Digital certificate support",
      ],
      image: "/signature-types.png",
    },
    {
      icon: Users,
      title: "Multi-Party Signing",
      description:
        "Send documents to unlimited signers with customizable signing order and role-based permissions.",
      benefits: [
        "Unlimited signers",
        "Sequential or parallel signing",
        "Role-based access control",
        "Signer authentication",
      ],
      image: "/multi-party-signing.png",
    },
    {
      icon: Bell,
      title: "Real-Time Notifications",
      description:
        "Stay informed with instant notifications when documents are viewed, signed, or declined.",
      benefits: [
        "Email notifications",
        "In-app alerts",
        "SMS reminders (Pro+)",
        "Webhook integrations",
      ],
      image: "/notifications.png",
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description:
        "Track document status, signing completion rates, and team performance with detailed analytics.",
      benefits: [
        "Document status tracking",
        "Completion rate metrics",
        "Team performance insights",
        "Custom reports",
      ],
      image: "/analytics-dashboard.png",
    },
    {
      icon: Palette,
      title: "Custom Branding",
      description:
        "White-label your signing experience with custom logos, colors, and email templates.",
      benefits: [
        "Custom logo & colors",
        "Branded email templates",
        "Custom domain (Enterprise)",
        "Personalized signing pages",
      ],
      image: "/custom-branding.png",
    },
  ];

  const additionalFeatures = [
    {
      icon: Code,
      title: "API & Integrations",
      description: "Integrate with your existing tools via REST API or pre-built connectors",
    },
    {
      icon: FileText,
      title: "Document Templates",
      description: "Create reusable templates for contracts, NDAs, and more",
    },
    {
      icon: Clock,
      title: "Audit Trail",
      description: "Complete audit trail with timestamps and IP addresses",
    },
    {
      icon: Smartphone,
      title: "Mobile Optimized",
      description: "Sign documents on any device with responsive design",
    },
    {
      icon: Shield,
      title: "Advanced Security",
      description: "256-bit encryption, 2FA, and SOC 2 Ready",
    },
    {
      icon: Zap,
      title: "Bulk Send",
      description: "Send the same document to multiple recipients at once",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <MarketingNav />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-background to-muted/30">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold">
                Powerful Features for Modern Businesses
              </h1>
              <p className="text-xl text-muted-foreground">
                Everything you need to streamline your document signing workflow
                with AI-assisted intelligence and enterprise-grade security.
              </p>
            </div>
          </div>
        </section>

        {/* Main Features */}
        <section className="py-20">
          <div className="container">
            <div className="space-y-20">
              {mainFeatures.map((feature, index) => (
                <div
                  key={index}
                  className={`grid md:grid-cols-2 gap-12 items-center ${
                    index % 2 === 1 ? "md:flex-row-reverse" : ""
                  }`}
                >
                  <div className={index % 2 === 1 ? "md:order-2" : ""}>
                    <div className="h-16 w-16 rounded-2xl bg-indigo-700 flex items-center justify-center mb-6">
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold mb-4">{feature.title}</h2>
                    <p className="text-lg text-muted-foreground mb-6">
                      {feature.description}
                    </p>
                    <ul className="space-y-3">
                      {feature.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-center gap-3">
                          <div className="h-2 w-2 rounded-full bg-primary" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className={index % 2 === 1 ? "md:order-1" : ""}>
                    <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
                      <img 
                        src={feature.image} 
                        alt={feature.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Additional Features Grid */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                And Much More
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Discover all the features that make Signova AI the complete
                e-signature solution
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {additionalFeatures.map((feature, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Dual CTA Section — Executive */}
        <section className="py-20 bg-slate-900 text-white">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center space-y-8">
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Ready to Transform Your Signing Process?
              </h2>
              <p className="text-xl text-slate-300">
                Join thousands of businesses using Signova AI to sign documents faster and more securely.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-white text-slate-900 hover:bg-slate-100 font-semibold px-8"
                  onClick={() => window.location.href = getSignupUrl() + '?path=generate'}
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate with AI
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-slate-500 text-white hover:bg-slate-800 px-8"
                  onClick={() => window.location.href = getSignupUrl() + '?path=upload'}
                >
                  <FileText className="mr-2 h-5 w-5" />
                  Upload &amp; Send
                </Button>
              </div>
              <p className="text-sm text-slate-400">Enterprise-ready from day one · Cancel anytime</p>
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
