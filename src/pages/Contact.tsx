import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { APP_LOGO, APP_TITLE } from "@/const";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const createTicket = trpc.support.createTicket.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      await createTicket.mutateAsync({
        email: formData.email,
        name: formData.name,
        subject: `Contact form: ${formData.company || 'General inquiry'}`,
        message: formData.message,
        category: "general",
        channel: "web_form",
      });
      
      toast.success("Message sent! Our AI support team will respond within 1 hour.");
      setFormData({ name: "", email: "", company: "", message: "" });
    } catch (error) {
      toast.error("Failed to send message. Please try again or email us directly.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between py-2">
            <img src="/signova-logo-hires.png" alt="Signova AI" className="h-10 w-auto" />
            
            <Button 
              variant="ghost"
              onClick={() => window.location.href = "/"}
            >
              ← Back to Home
            </Button>
        </div>
      </nav>

      {/* Hero */}
      <div className="bg-gradient-to-br from-indigo-700 via-blue-50 to-indigo-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Contact Signova
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We're here to help your business thrive with secure e-signatures. 
            Our AI-powered support team responds within 1 hour.
          </p>
        </div>
      </div>

      {/* Contact Form & Info */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
              <p className="text-gray-600 mb-6">
                Fill out the form below and our AI-powered support team will respond to your inquiry 
                within 1 hour during business hours.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name *</label>
                  <Input 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email *</label>
                  <Input 
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="john@company.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Company</label>
                  <Input 
                    value={formData.company}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                    placeholder="Acme Inc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Message *</label>
                  <Textarea 
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder="Tell us how we can help..."
                    rows={6}
                  />
                </div>

                <Button 
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-indigo-700 hover:bg-indigo-700"
                >
                  {submitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </Card>

            {/* Contact Info */}
            <div className="space-y-6">
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-indigo-700 p-3 rounded-lg">
                    <Mail className="h-6 w-6 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Email Us</h3>
                    <p className="text-gray-600 mb-2">
                      Our support team is here to help
                    </p>
                    <a href="mailto:support@signova.ai" className="text-indigo-400 hover:underline">
                      support@signova.ai
                    </a>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-yellow-100 p-3 rounded-lg">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Business Hours</h3>
                    <p className="text-gray-600">
                      Monday - Friday: 9:00 AM - 6:00 PM EST<br />
                      Saturday - Sunday: Closed<br />
                      <span className="text-sm text-gray-500">
                        Emergency support available 24/7 for Enterprise customers
                      </span>
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Common Questions</h2>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card className="p-6">
              <h3 className="font-bold mb-2">What's your response time?</h3>
              <p className="text-gray-600 text-sm">
                We respond to all inquiries within 1 hour during business hours. Enterprise customers 
                get 24/7 priority support with 15-minute response times.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-bold mb-2">How do I get started?</h3>
              <p className="text-gray-600 text-sm">
                Sign up free — no credit card required. You can generate a document with AI or upload your own and send for signature in under 2 minutes.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-bold mb-2">Can I get help with integration?</h3>
              <p className="text-gray-600 text-sm">
                Absolutely. Our technical team provides full integration support, including API 
                documentation, code samples, and dedicated engineering assistance.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-bold mb-2">Do you offer training?</h3>
              <p className="text-gray-600 text-sm">
                Yes! We provide comprehensive training for your team, including live webinars, 
                video tutorials, and personalized onboarding sessions.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
