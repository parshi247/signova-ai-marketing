import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Navigation from "@/components/Navigation";
import { 
  ChevronDown, 
  Search, 
  Shield, 
  FileText, 
  CreditCard, 
  Zap,
  HelpCircle,
  ArrowRight
} from "lucide-react";
import { useLocation } from "wouter";
import { APP_TITLE } from "@/const";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  // Getting Started
  {
    category: "Getting Started",
    question: "How do I create my first document?",
    answer: "You have two options: 1) Upload an existing PDF document, or 2) Use our AI Document Generator to create a new document from scratch. The AI Generator asks you simple questions and creates a legally-compliant document tailored to your needs in minutes."
  },
  {
    category: "Getting Started",
    question: "Do I need to create an account?",
    answer: "Yes, you need an account to send documents for signature and track their status. However, recipients don't need an account to sign documents - they can sign directly through a secure link sent to their email."
  },
  {
    category: "Getting Started",
    question: "Is there a free plan?",
    answer: "Signova offers five paid tiers: Starter ($19/mo), Professional ($49/mo), Growth ($99/mo), Scale ($249/mo), and Enterprise (custom). All plans include a 30-day money-back guarantee. No free plan is currently available."
  },

  // AI Document Generator
  {
    category: "AI Document Generator",
    question: "What types of documents can the AI create?",
    answer: "Our AI can generate NDAs, employment contracts, lease agreements, sales contracts, service agreements, partnership agreements, loan agreements, consulting agreements, contractor agreements, purchase orders, invoices, and release waivers. Each document is customized based on your specific needs and jurisdiction."
  },
  {
    category: "AI Document Generator",
    question: "Are AI-generated documents legally binding?",
    answer: "Yes! Our AI generates documents based on established legal templates and jurisdiction-specific requirements. However, for complex situations, we recommend having an attorney review the document. The AI ensures proper structure and common clauses, but cannot replace legal advice for unique circumstances."
  },
  {
    category: "AI Document Generator",
    question: "Which jurisdictions are supported?",
    answer: "We support US Federal law, California, New York, Texas, Florida, Canada (Federal and Ontario), United Kingdom, EU (GDPR-compliant), and Australia. We're constantly adding more jurisdictions based on user demand."
  },
  {
    category: "AI Document Generator",
    question: "How long does it take to generate a document?",
    answer: "Most documents are generated in under 30 seconds after you complete the questionnaire. The questionnaire itself takes 2-10 minutes depending on document complexity. For example, an NDA takes about 2-3 minutes, while an employment contract takes 5-7 minutes."
  },

  // Signatures & Signing
  {
    category: "Signatures & Signing",
    question: "How do I send a document for signature?",
    answer: "After uploading or generating a document, click 'Add Signature Fields' to place signature boxes where needed. Then enter the recipient's name and email, and click 'Send for Signature'. They'll receive an email with a secure link to sign the document."
  },
  {
    category: "Signatures & Signing",
    question: "Can I sign documents on mobile devices?",
    answer: "Absolutely! Our platform is fully optimized for mobile devices. Recipients can sign documents on smartphones and tablets using touch to draw their signature, type it, or upload an image."
  },
  {
    category: "Signatures & Signing",
    question: "Are electronic signatures legally valid?",
    answer: "Yes! Electronic signatures are legally binding in most countries under laws like the US ESIGN Act (2000), EU eIDAS Regulation, and UETA. Our platform provides audit trails, timestamps, and IP tracking to ensure compliance and enforceability."
  },
  {
    category: "Signatures & Signing",
    question: "Can multiple people sign the same document?",
    answer: "Yes! You can add multiple signers to any document. Each signer receives their own secure link and can sign in any order (or you can set a specific signing order). You'll be notified as each person signs."
  },
  {
    category: "Signatures & Signing",
    question: "What happens if someone doesn't sign?",
    answer: "You can send reminders directly from your dashboard. If a document isn't signed within a certain timeframe, you can also void it and send a new one. On paid plans, you can set automatic reminder schedules."
  },

  // Security & Privacy
  {
    category: "Security & Privacy",
    question: "How secure is my data?",
    answer: "We use bank-level encryption (AES-256) for all documents at rest and TLS 1.3 for data in transit. All documents are stored in secure, SOC 2 compliant data centers. We never share your data with third parties and you maintain full ownership of your documents."
  },
  {
    category: "Security & Privacy",
    question: "Who can access my documents?",
    answer: "Only you and the people you explicitly share documents with can access them. Each recipient gets a unique, secure access token that expires after use. We maintain detailed audit logs showing who accessed, viewed, and signed each document."
  },
  {
    category: "Security & Privacy",
    question: "Are you GDPR compliant?",
    answer: "Yes, we are fully GDPR compliant. We provide data processing agreements (DPAs), allow users to export or delete their data, and follow all EU privacy regulations. We also support CCPA (California) and other privacy laws."
  },
  {
    category: "Security & Privacy",
    question: "Do you store my signature?",
    answer: "Your signature is encrypted and stored securely in your account for reuse. You can delete it anytime from your profile settings. Signatures are never shared between users or used for any purpose other than signing your own documents."
  },

  // Pricing & Billing
  {
    category: "Pricing & Billing",
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, Mastercard, American Express, Discover) through our secure Stripe integration. Enterprise plans can also pay via invoice/wire transfer."
  },
  {
    category: "Pricing & Billing",
    question: "Can I cancel anytime?",
    answer: "Yes! You can cancel your subscription anytime from your dashboard. You'll retain access until the end of your billing period, and no future charges will be made. You can also downgrade to a lower-tier plan instead of canceling completely."
  },
  {
    category: "Pricing & Billing",
    question: "What happens if I exceed my plan limits?",
    answer: "On the Starter plan, you will be prompted to upgrade when you approach your monthly limits. On paid plans, you can continue using the service - we'll never block access. If you consistently exceed limits, we'll suggest upgrading to a plan that better fits your usage."
  },
  {
    category: "Pricing & Billing",
    question: "Do you offer refunds?",
    answer: "We offer a 30-day money-back guarantee on all paid plans. If you're not satisfied for any reason within the first 30 days, contact support@signova.ai for a full refund. After 30 days, we can prorate refunds on a case-by-case basis."
  },
  {
    category: "Pricing & Billing",
    question: "Is there a discount for annual billing?",
    answer: "Yes! Annual plans save you 20% compared to monthly billing. For example, Professional is $144/year (vs $180 monthly) and Business is $432/year (vs $540 monthly). Enterprise plans have custom annual pricing."
  },

  // Features & Functionality
  {
    category: "Features & Functionality",
    question: "Can I create document templates?",
    answer: "Yes! On Professional plans and above, you can save frequently-used documents as templates. This is perfect for contracts you send regularly - just fill in the recipient details and send. Templates can include pre-placed signature fields."
  },
  {
    category: "Features & Functionality",
    question: "Do you support bulk sending?",
    answer: "Yes! Business and Enterprise plans include bulk sending. You can send the same document to multiple recipients at once, or send different documents to a list of recipients. Perfect for onboarding, agreements, or mass communications."
  },
  {
    category: "Features & Functionality",
    question: "Can I track document status?",
    answer: "Absolutely! Your dashboard shows real-time status for all documents: Draft, Sent, Viewed, Signed, or Completed. You'll receive email notifications for each status change, and can view detailed audit trails showing exactly when each action occurred."
  },
  {
    category: "Features & Functionality",
    question: "Can I add fields besides signatures?",
    answer: "Yes! You can add signature fields, initial fields, text fields, date fields, and checkboxes. This allows you to collect additional information beyond just signatures - perfect for forms, agreements with blanks to fill, or consent checkboxes."
  },

  // Comparison & Alternatives
  {
    category: "Comparison",
    question: "How is Signova different from DocuSign?",
    answer: "Signova offers AI-powered document generation (DocuSign doesn't), more affordable pricing (our Professional plan is $19/month vs DocuSign's $49/month), and a modern, intuitive interface. We also include unlimited documents on Business plans, while DocuSign charges per envelope."
  },
  {
    category: "Comparison",
    question: "Why choose Signova over HelloSign?",
    answer: "Signova's AI Document Generator is our biggest differentiator - you can create legal documents from scratch without templates. We also offer more competitive pricing (Starter at $19/mo) with more features, better mobile experience, and jurisdiction-specific legal compliance."
  },
  {
    category: "Comparison",
    question: "Do you integrate with other tools?",
    answer: "We're building integrations with popular tools like Google Drive, Dropbox, Salesforce, and Zapier. Enterprise plans include API access for custom integrations. Contact us if you need a specific integration - we prioritize based on customer demand."
  },
];

const categories = Array.from(new Set(faqs.map(f => f.category)));

export default function FAQ() {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categoryIcons: Record<string, any> = {
    "Getting Started": Zap,
    "AI Document Generator": FileText,
    "Signatures & Signing": Shield,
    "Security & Privacy": Shield,
    "Pricing & Billing": CreditCard,
    "Features & Functionality": Zap,
    "Comparison": HelpCircle,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-700 to-white">
      {/* Header */}
      <Navigation />

      {/* Hero Section */}
      <section className="py-16 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Everything you need to know about {APP_TITLE}. Can't find what you're looking for? 
            <button 
              onClick={() => navigate('/contact')}
              className="text-indigo-400 hover:underline ml-1"
            >
              Contact our support team
            </button>
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search for answers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 text-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 border-y bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-3 justify-center">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => setSelectedCategory(null)}
              className="gap-2"
            >
              All Questions
            </Button>
            {categories.map((category) => {
              const Icon = categoryIcons[category] || HelpCircle;
              return (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className="gap-2"
                >
                  <Icon className="h-4 w-4" />
                  {category}
                </Button>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ List */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {filteredFAQs.length === 0 ? (
            <Card className="p-12 text-center">
              <HelpCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No results found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search or browse all categories
              </p>
              <Button onClick={() => { setSearchQuery(''); setSelectedCategory(null); }}>
                Clear Filters
              </Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredFAQs.map((faq, index) => (
                <Card key={index} className="overflow-hidden">
                  <button
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs font-medium text-indigo-400 bg-indigo-700 px-2 py-1 rounded">
                          {faq.category}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold">{faq.question}</h3>
                    </div>
                    <ChevronDown 
                      className={`h-5 w-5 text-muted-foreground transition-transform ${
                        openIndex === index ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {openIndex === index && (
                    <div className="px-6 pb-6 text-muted-foreground">
                      {faq.answer}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-indigo-700 to-indigo-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Still have questions?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Our support team is here to help you succeed
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => navigate('/contact')}
              className="gap-2"
            >
              Contact Support
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/dashboard')}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 gap-2"
            >
              Try {APP_TITLE} Free
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
