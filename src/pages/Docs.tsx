import MarketingNav from "@/components/MarketingNav";
import MarketingFooter from "@/components/MarketingFooter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  Book,
  Rocket,
  FileSignature,
  Users,
  Settings,
  Code,
  Shield,
  Zap,
  ChevronRight,
  PlayCircle,
  FileText,
  Palette,
  Bell,
  BarChart3,
  Plug,
  HelpCircle,
} from "lucide-react";

export default function Docs() {
  const gettingStarted = [
    {
      icon: Rocket,
      title: "Quick Start Guide",
      description: "Get up and running with Signova in under 5 minutes.",
      time: "5 min read",
    },
    {
      icon: FileSignature,
      title: "Create Your First Document",
      description: "Learn how to upload, prepare, and send documents for signing.",
      time: "10 min read",
    },
    {
      icon: Users,
      title: "Invite Team Members",
      description: "Add your team and set up roles and permissions.",
      time: "5 min read",
    },
    {
      icon: Settings,
      title: "Configure Your Account",
      description: "Customize settings, notifications, and preferences.",
      time: "8 min read",
    },
  ];

  const categories = [
    {
      icon: FileText,
      title: "Documents",
      articles: [
        "Uploading documents",
        "Adding signature fields",
        "Using templates",
        "Bulk sending",
        "Document expiration",
      ],
    },
    {
      icon: FileSignature,
      title: "Signatures",
      articles: [
        "Signature types",
        "Drawing signatures",
        "Typed signatures",
        "Signature certificates",
        "Witness signatures",
      ],
    },
    {
      icon: Users,
      title: "Team Management",
      articles: [
        "Adding team members",
        "Roles and permissions",
        "Team templates",
        "Activity logs",
        "Shared folders",
      ],
    },
    {
      icon: Palette,
      title: "Branding",
      articles: [
        "Custom logo",
        "Brand colors",
        "Email templates",
        "Signing page customization",
        "Custom domains",
      ],
    },
    {
      icon: Bell,
      title: "Notifications",
      articles: [
        "Email notifications",
        "In-app alerts",
        "SMS reminders",
        "Webhook events",
        "Notification preferences",
      ],
    },
    {
      icon: BarChart3,
      title: "Analytics",
      articles: [
        "Dashboard overview",
        "Document metrics",
        "Team performance",
        "Custom reports",
        "Data export",
      ],
    },
    {
      icon: Plug,
      title: "Integrations",
      articles: [
        "Salesforce",
        "HubSpot",
        "Google Drive",
        "Dropbox",
        "Zapier",
      ],
    },
    {
      icon: Shield,
      title: "Security",
      articles: [
        "Two-factor authentication",
        "SSO setup",
        "Audit trails",
        "Data encryption",
        "Compliance",
      ],
    },
  ];

  const videoTutorials = [
    {
      title: "Getting Started with Signova",
      duration: "4:32",
      thumbnail: "/tutorial-getting-started.png",
    },
    {
      title: "Creating and Sending Documents",
      duration: "6:15",
      thumbnail: "/tutorial-documents.png",
    },
    {
      title: "Using Templates Effectively",
      duration: "5:48",
      thumbnail: "/tutorial-templates.png",
    },
    {
      title: "Team Collaboration Features",
      duration: "7:22",
      thumbnail: "/tutorial-team.png",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <MarketingNav />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Book className="w-4 h-4" />
              Documentation
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Learn How to Use Signova
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Comprehensive guides and documentation to help you get the most 
              out of Signova's document signing platform.
            </p>
          </div>
        </div>
      </section>

      {/* Getting Started */}
      <section className="py-12 px-4" id="getting-started">
        <div className="container max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Zap className="w-6 h-6 text-yellow-500" />
            Getting Started
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {gettingStarted.map((item, index) => (
              <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer group">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors">
                    <item.icon className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600 mb-3">{item.description}</p>
                  <span className="text-xs text-slate-400">{item.time}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Documentation Categories */}
      <section className="py-12 px-4 bg-slate-50" id="guides">
        <div className="container max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">
            Documentation by Category
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <category.icon className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-slate-900">{category.title}</h3>
                  </div>
                  <ul className="space-y-2">
                    {category.articles.map((article, articleIndex) => (
                      <li key={articleIndex}>
                        <a href="#" className="text-sm text-slate-600 hover:text-blue-600 flex items-center gap-1">
                          <ChevronRight className="w-3 h-3" />
                          {article}
                        </a>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Video Tutorials */}
      <section className="py-12 px-4" id="tutorials">
        <div className="container max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <PlayCircle className="w-6 h-6 text-red-500" />
              Video Tutorials
            </h2>
            <Button variant="outline" size="sm">
              View All Videos
            </Button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {videoTutorials.map((video, index) => (
              <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer overflow-hidden">
                <div className="aspect-video bg-slate-200 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                      <PlayCircle className="w-8 h-8 text-blue-600" />
                    </div>
                  </div>
                  <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {video.duration}
                  </span>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-medium text-slate-900">{video.title}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* API Documentation */}
      <section className="py-12 px-4 bg-slate-900" id="api">
        <div className="container max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <Code className="w-12 h-12 text-blue-400 mb-6" />
              <h2 className="text-3xl font-bold mb-4">API Documentation</h2>
              <p className="text-slate-300 mb-6">
                Build custom integrations with our comprehensive REST API. 
                Full documentation, SDKs, and code examples available.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-slate-300">
                  <ChevronRight className="w-4 h-4 text-blue-400" />
                  RESTful API with JSON responses
                </li>
                <li className="flex items-center gap-2 text-slate-300">
                  <ChevronRight className="w-4 h-4 text-blue-400" />
                  Webhook support for real-time events
                </li>
                <li className="flex items-center gap-2 text-slate-300">
                  <ChevronRight className="w-4 h-4 text-blue-400" />
                  SDKs for Node.js, Python, and more
                </li>
                <li className="flex items-center gap-2 text-slate-300">
                  <ChevronRight className="w-4 h-4 text-blue-400" />
                  Sandbox environment for testing
                </li>
              </ul>
              <Button className="bg-blue-600 hover:bg-blue-700">
                View API Docs
              </Button>
            </div>
            <div className="bg-slate-800 rounded-xl p-6 font-mono text-sm">
              <div className="text-slate-400 mb-2"># Create a new document</div>
              <div className="text-green-400">curl -X POST \</div>
              <div className="text-slate-300 pl-4">https://api.signova.ai/v1/documents \</div>
              <div className="text-slate-300 pl-4">-H "Authorization: Bearer YOUR_API_KEY" \</div>
              <div className="text-slate-300 pl-4">-H "Content-Type: application/json" \</div>
              <div className="text-slate-300 pl-4">-d '{'{"name": "Contract.pdf"}'}'</div>
              <div className="mt-4 text-slate-400"># Response</div>
              <div className="text-yellow-400">{"{"}</div>
              <div className="text-slate-300 pl-4">"id": "doc_abc123",</div>
              <div className="text-slate-300 pl-4">"status": "draft",</div>
              <div className="text-slate-300 pl-4">"created_at": "2026-01-11T..."</div>
              <div className="text-yellow-400">{"}"}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Help Section */}
      <section className="py-16 px-4">
        <div className="container max-w-4xl mx-auto text-center">
          <HelpCircle className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Need More Help?
          </h2>
          <p className="text-lg text-slate-600 mb-8">
            Can't find what you're looking for? Our support team is ready to assist.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/help">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Visit Help Center
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline">
                Contact Support
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
