import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { APP_LOGO, APP_TITLE } from "@/const";
import { Mail, Phone, MapPin, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import MarketingNav from "@/components/MarketingNav";
import MarketingFooter from "@/components/MarketingFooter";

type FormState = "idle" | "submitting" | "success" | "error";

interface FormData {
  name: string;
  email: string;
  company: string;
  topic: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {};
  if (!data.name.trim()) errors.name = "Name is required.";
  if (!data.email.trim()) errors.email = "Email is required.";
  else if (!validateEmail(data.email)) errors.email = "Please enter a valid email address.";
  if (!data.message.trim()) errors.message = "Message is required.";
  else if (data.message.trim().length < 10) errors.message = "Please provide a bit more detail (at least 10 characters).";
  return errors;
}

export default function Contact() {
  const searchParams = new URLSearchParams(window.location.search);
  const topicParam = searchParams.get("topic") || "";

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    company: "",
    topic: topicParam === "enterprise" ? "Enterprise inquiry" : "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [formState, setFormState] = useState<FormState>("idle");

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      const newErrors = validate({ ...formData, [field]: value });
      setErrors((prev) => ({ ...prev, [field]: newErrors[field as keyof FormErrors] }));
    }
  };

  const handleBlur = (field: keyof FormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const newErrors = validate(formData);
    setErrors((prev) => ({ ...prev, [field]: newErrors[field as keyof FormErrors] }));
  };

  const isValid = Object.keys(validate(formData)).length === 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Mark all fields as touched
    setTouched({ name: true, email: true, message: true });
    const validationErrors = validate(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setFormState("submitting");
    try {
      const resp = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          company: formData.company.trim(),
          topic: formData.topic.trim(),
          message: formData.message.trim(),
        }),
      });
      if (resp.ok) {
        setFormState("success");
        setFormData({ name: "", email: "", company: "", topic: "", message: "" });
        setTouched({});
        setErrors({});
      } else {
        setFormState("error");
      }
    } catch {
      setFormState("error");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <MarketingNav />

      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Signova</h1>
          <p className="text-lg text-blue-200 max-w-2xl mx-auto">
            Questions about pricing, enterprise plans, or integrations? We typically respond within 1 business hour.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="flex-1 py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">

            {/* Contact Form */}
            <Card className="p-8 shadow-sm">
              {formState === "success" ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Message sent!</h2>
                  <p className="text-slate-600 mb-6">
                    Our team will get back to you within 1 business hour at the email you provided.
                  </p>
                  <Button variant="outline" onClick={() => setFormState("idle")}>
                    Send another message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Get in Touch</h2>

                  {/* Name */}
                  <div className="space-y-1">
                    <Label htmlFor="name">
                      Full name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Jane Smith"
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      onBlur={() => handleBlur("name")}
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? "name-error" : undefined}
                      className={errors.name ? "border-red-400 focus-visible:ring-red-400" : ""}
                    />
                    {errors.name && (
                      <p id="name-error" className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <Label htmlFor="email">
                      Work email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="jane@yourfirm.com"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      onBlur={() => handleBlur("email")}
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? "email-error" : undefined}
                      className={errors.email ? "border-red-400 focus-visible:ring-red-400" : ""}
                    />
                    {errors.email && (
                      <p id="email-error" className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Company */}
                  <div className="space-y-1">
                    <Label htmlFor="company">Company / Firm name</Label>
                    <Input
                      id="company"
                      type="text"
                      placeholder="Smith & Associates LLP"
                      value={formData.company}
                      onChange={(e) => handleChange("company", e.target.value)}
                    />
                  </div>

                  {/* Topic */}
                  <div className="space-y-1">
                    <Label htmlFor="topic">Topic</Label>
                    <Input
                      id="topic"
                      type="text"
                      placeholder="e.g. Enterprise pricing, API integration, billing"
                      value={formData.topic}
                      onChange={(e) => handleChange("topic", e.target.value)}
                    />
                  </div>

                  {/* Message */}
                  <div className="space-y-1">
                    <Label htmlFor="message">
                      Message <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us how we can help you…"
                      rows={5}
                      value={formData.message}
                      onChange={(e) => handleChange("message", e.target.value)}
                      onBlur={() => handleBlur("message")}
                      aria-invalid={!!errors.message}
                      aria-describedby={errors.message ? "message-error" : undefined}
                      className={errors.message ? "border-red-400 focus-visible:ring-red-400" : ""}
                    />
                    {errors.message && (
                      <p id="message-error" className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.message}
                      </p>
                    )}
                  </div>

                  {formState === "error" && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      Something went wrong. Please try again or email us at{" "}
                      <a href="mailto:support@signova.ai" className="underline">support@signova.ai</a>.
                    </p>
                  )}

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={formState === "submitting" || !isValid}
                  >
                    {formState === "submitting" ? "Sending…" : "Send message"}
                  </Button>
                </form>
              )}
            </Card>

            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Other ways to reach us</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium text-slate-900">Email</p>
                      <a href="mailto:support@signova.ai" className="text-blue-600 hover:underline text-sm">
                        support@signova.ai
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium text-slate-900">Response time</p>
                      <p className="text-slate-600 text-sm">Within 1 business hour, Mon–Fri 9am–6pm ET</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium text-slate-900">Headquarters</p>
                      <p className="text-slate-600 text-sm">Toronto, Ontario, Canada</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                <h3 className="font-semibold text-slate-900 mb-2">Enterprise inquiry?</h3>
                <p className="text-slate-600 text-sm mb-4">
                  Looking for custom pricing, volume discounts, SSO, or a dedicated account manager?
                  Our enterprise team will respond within 2 hours.
                </p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setFormData((prev) => ({ ...prev, topic: "Enterprise inquiry" }));
                    document.getElementById("topic")?.focus();
                  }}
                >
                  Start enterprise conversation
                </Button>
              </div>

              <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
                <h3 className="font-semibold text-slate-900 mb-2">Need immediate help?</h3>
                <p className="text-slate-600 text-sm mb-4">
                  Check our documentation and FAQ for instant answers to common questions.
                </p>
                <div className="flex gap-3">
                  <Link href="/docs">
                    <Button variant="outline" size="sm">Documentation</Button>
                  </Link>
                  <Link href="/faq">
                    <Button variant="outline" size="sm">FAQ</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
