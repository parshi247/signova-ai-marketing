import MarketingNav from "@/components/MarketingNav";
import MarketingFooter from "@/components/MarketingFooter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  HelpCircle,
  Book,
  MessageCircle,
  Mail,
  Video,
  FileText,
  Rocket,
  Users,
  Clock,
  ChevronRight,
  Search,
  Headphones,
} from "lucide-react";
import { useState } from "react";

export default function Help() {
  const [searchQuery, setSearchQuery] = useState("");

  const quickLinks = [
    {
      icon: Rocket,
      title: "Getting Started",
      description: "New to Signova? Start here to learn the basics.",
      link: "/docs",
    },
    {
      icon: FileText,
      title: "Send Your First Document",
      description: "Learn how to upload and send documents for signing.",
      link: "/docs#send-document",
    },
    {
      icon: Users,
      title: "Manage Your Team",
      description: "Add team members and set up permissions.",
      link: "/docs#team-management",
    },
    {
      icon: Video,
      title: "Video Tutorials",
      description: "Watch step-by-step guides for common tasks.",
      link: "/docs#tutorials",
    },
  ];

  const faqs = [
    {
      question: "How do I create my first document?",
      answer: "Click 'New Document' from your dashboard, upload a PDF or create from a template, add signature fields, and send to recipients. It's that simple!",
    },
    {
      question: "Are electronic signatures legally binding?",
      answer: "Yes! Signova's electronic signatures are legally binding in over 180 countries under laws like ESIGN, UETA, and eIDAS. Each signature includes a complete audit trail.",
    },
    {
      question: "How do I add multiple signers to a document?",
      answer: "When preparing your document, click 'Add Recipient' to include multiple signers. You can set the signing order (sequential or parallel) and assign specific fields to each signer.",
    },
    {
      question: "Can I customize the signing experience with my branding?",
      answer: "Yes! Pro and Enterprise plans include custom branding options. Add your logo, colors, and customize email templates to match your brand.",
    },
    {
      question: "How secure are my documents?",
      answer: "Very secure. We use 256-bit AES encryption, TLS 1.3 for data in transit, and store documents in SOC 2 certified data centers. We're also GDPR and HIPAA-ready.",
    },
    {
      question: "Can I integrate Signova with other tools?",
      answer: "Yes! We offer integrations with popular tools like Salesforce, HubSpot, Google Drive, Dropbox, and more. Enterprise plans include API access for custom integrations.",
    },
    {
      question: "What happens after a document is signed?",
      answer: "All parties receive a completed copy via email. The document is stored securely in your Signova account with a complete audit trail showing who signed and when.",
    },
    {
      question: "How do I cancel or change my subscription?",
      answer: "Go to Settings > Subscription in your dashboard. You can upgrade, downgrade, or cancel anytime. Changes take effect at the start of your next billing cycle.",
    },
  ];

  const supportChannels = [
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Chat with our support team in real-time",
      availability: "Mon-Fri, 9am-6pm EST",
      action: "Start Chat",
      primary: true,
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Send us a detailed message",
      availability: "Response within 24 hours",
      action: "Send Email",
      href: "mailto:support@signova.ai",
    },
    {
      icon: Headphones,
      title: "Phone Support",
      description: "Talk to a support specialist",
      availability: "Enterprise plans only",
      action: "Contact Sales",
      href: "/contact",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <MarketingNav />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4">
        <div className="container max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            How Can We Help?
          </h1>
          <p className="text-xl text-slate-600 mb-8">
            Find answers, learn how to use Signova, or get in touch with our support team.
          </p>
          
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search for help articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 text-lg border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-12 px-4">
        <div className="container max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Quick Links</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickLinks.map((item, index) => (
              <Link key={index} href={item.link}>
                <Card className="border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardContent className="p-6">
                    <item.icon className="w-10 h-10 text-blue-600 mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-600">{item.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 px-4 bg-slate-50">
        <div className="container max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <HelpCircle className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-600">
              Quick answers to common questions about Signova.
            </p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-slate-600">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/faq">
              <Button variant="outline" className="gap-2">
                View All FAQs
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Support Channels */}
      <section className="py-16 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Contact Support
            </h2>
            <p className="text-lg text-slate-600">
              Can't find what you're looking for? Our support team is here to help.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {supportChannels.map((channel, index) => (
              <Card key={index} className={`border-0 shadow-lg ${channel.primary ? 'ring-2 ring-blue-500' : ''}`}>
                <CardContent className="p-6 text-center">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 ${channel.primary ? 'bg-blue-600' : 'bg-slate-100'}`}>
                    <channel.icon className={`w-7 h-7 ${channel.primary ? 'text-white' : 'text-slate-600'}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">
                    {channel.title}
                  </h3>
                  <p className="text-slate-600 mb-2">{channel.description}</p>
                  <p className="text-sm text-slate-500 mb-4 flex items-center justify-center gap-1">
                    <Clock className="w-4 h-4" />
                    {channel.availability}
                  </p>
                  {channel.href ? (
                    <Link href={channel.href}>
                      <Button variant={channel.primary ? "default" : "outline"} className="w-full">
                        {channel.action}
                      </Button>
                    </Link>
                  ) : (
                    <Button 
                      variant={channel.primary ? "default" : "outline"} 
                      className="w-full"
                      onClick={() => {
                        // Placeholder for chat widget
                        alert("Live chat coming soon! Please email support@signova.ai");
                      }}
                    >
                      {channel.action}
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Documentation CTA */}
      <section className="py-16 px-4 bg-blue-600">
        <div className="container max-w-4xl mx-auto text-center text-white">
          <Book className="w-16 h-16 mx-auto mb-6 opacity-90" />
          <h2 className="text-3xl font-bold mb-4">
            Explore Our Documentation
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Detailed guides, API documentation, and best practices for getting 
            the most out of Signova.
          </p>
          <Link href="/docs">
            <Button size="lg" variant="secondary">
              View Documentation
            </Button>
          </Link>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
