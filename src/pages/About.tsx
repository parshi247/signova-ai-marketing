import MarketingNav from "@/components/MarketingNav";
import MarketingFooter from "@/components/MarketingFooter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  Target,
  Heart,
  Lightbulb,
  Shield,
  Users,
  Globe,
  Award,
  Zap,
} from "lucide-react";

export default function About() {
  const values = [
    {
      icon: Shield,
      title: "Security First",
      description: "We prioritize the security and privacy of your documents above all else. Every signature is protected with bank-level encryption.",
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "We leverage cutting-edge AI technology to make document signing smarter, faster, and more intuitive than ever before.",
    },
    {
      icon: Heart,
      title: "Customer Focus",
      description: "Your success is our success. We're committed to providing exceptional support and continuously improving based on your feedback.",
    },
    {
      icon: Zap,
      title: "Simplicity",
      description: "Complex problems deserve simple solutions. We design our platform to be powerful yet easy to use for everyone.",
    },
  ];

  const stats = [
    { value: "10M+", label: "Documents Signed" },
    { value: "50K+", label: "Happy Customers" },
    { value: "99.9%", label: "Uptime" },
    { value: "150+", label: "Countries Served" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <MarketingNav />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="container max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Transforming How the World Signs Documents
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
            Signova was founded with a simple mission: make document signing secure, 
            effortless, and accessible to everyone. We're building the future of 
            digital agreements with AI-powered technology.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-blue-600">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Target className="w-4 h-4" />
                Our Mission
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                Empowering Businesses to Move Faster
              </h2>
              <p className="text-lg text-slate-600 mb-6">
                In today's fast-paced world, waiting days for signatures is unacceptable. 
                We built Signova to eliminate the friction in document workflows, helping 
                businesses close deals faster, onboard employees quicker, and operate more 
                efficiently.
              </p>
              <p className="text-lg text-slate-600">
                Our modern document platform doesn't just digitize signatures—it transforms 
                the entire document experience. From automatic field detection to intelligent 
                routing, we're making document management smarter at every step.
              </p>
            </div>
            <div className="bg-indigo-600 rounded-2xl p-8 text-white">
              <Globe className="w-12 h-12 mb-6" />
              <h3 className="text-2xl font-bold mb-4">Global Reach</h3>
              <p className="text-blue-100 mb-6">
                Signova serves customers in over 150 countries, supporting multiple 
                languages and compliance with international e-signature laws including 
                ESIGN, UETA, and eIDAS.
              </p>
              <div className="flex items-center gap-4">
                <Award className="w-8 h-8" />
                <span className="text-sm">Legally binding in 180+ countries</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              These principles guide everything we do, from product development 
              to customer support.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                    <value.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">
                    {value.title}
                  </h3>
                  <p className="text-slate-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4">
        <div className="container max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Users className="w-4 h-4" />
            Our Team
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
            Built by Experts, For Everyone
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto mb-12">
            Our team combines decades of experience in security, AI, and enterprise 
            software. We're passionate about building tools that make work easier 
            and more secure for businesses of all sizes.
          </p>
          <div className="bg-indigo-700 rounded-2xl p-8 md:p-12 text-white">
            <h3 className="text-2xl font-bold mb-4">Join Our Journey</h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              We're always looking for talented individuals who share our passion 
              for innovation and customer success. Check back soon for open positions.
            </p>
            <Link href="/contact">
              <Button variant="secondary" size="lg">
                Get in Touch
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-slate-900">
        <div className="container max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Document Workflow?
          </h2>
          <p className="text-lg text-slate-300 mb-8">
            Join thousands of businesses that trust Signova for their document signing needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/pricing">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                View Pricing
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
