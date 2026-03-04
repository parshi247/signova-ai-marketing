import { useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import MarketingNav from "@/components/MarketingNav";
import MarketingFooter from "@/components/MarketingFooter";
import { getSignupUrl } from "@/const";
import { SelfClosingFunnelBlock } from '@/components/SelfClosingFunnelBlock';
import {
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Clock,
  DollarSign,
  Shield,
  Zap,
  FileText,
  Users,
  BarChart3,
  Sparkles,
  Upload,
} from "lucide-react";

export interface IndustryConfig {
  slug: string;
  industry: string;
  heroHeadline: string;
  heroSubheadline: string;
  painPoint: string;
  roiMetric: string;
  roiDescription: string;
  useCases: Array<{ title: string; description: string; icon: any }>;
  competitorComparison: {
    competitor: string;
    competitorPrice: string;
    signovaPrice: string;
    savings: string;
  };
  benefits: string[];
  ctaHeadline: string;
}

export const industryConfigs: Record<string, IndustryConfig> = {
  // REAL ESTATE
  "real-estate-document-automation": {
    slug: "real-estate-document-automation",
    industry: "Real Estate",
    heroHeadline: "Real Estate Document Automation",
    heroSubheadline: "Generate lease agreements, disclosures, and offers in minutes — or upload your existing documents and send for signature. Close deals faster without the paperwork bottleneck.",
    painPoint: "Real estate agents waste 3–5 hours per transaction on paperwork. Signova cuts that to under 15 minutes.",
    roiMetric: "5 hrs → 15 min",
    roiDescription: "Average time saved per transaction",
    useCases: [
      { title: "Lease Agreement Generator", description: "Generate state-compliant residential and commercial lease agreements instantly. Auto-fill tenant details, terms, and clauses.", icon: FileText },
      { title: "Disclosure Automation", description: "Create seller disclosure forms, lead paint disclosures, and property condition reports with AI-guided questionnaires.", icon: Shield },
      { title: "Offer & Counter-Offer Workflow", description: "Draft purchase offers, counter-offers, and addenda in minutes. Send for e-signature directly from the platform.", icon: Zap },
    ],
    competitorComparison: { competitor: "DocuSign + Manual Templates", competitorPrice: "$45/mo + hours of prep", signovaPrice: "From $19/mo", savings: "Save 95%+" },
    benefits: ["State-compliant lease templates for all 50 states", "E-signature with audit trail", "Bulk send to multiple tenants", "Mobile-friendly signing", "Automated reminders"],
    ctaHeadline: "Close More Deals. Less Paperwork.",
  },
  "lease-agreement-generator": {
    slug: "lease-agreement-generator",
    industry: "Real Estate",
    heroHeadline: "AI Lease Agreement Generator",
    heroSubheadline: "Generate legally compliant lease agreements in under 5 minutes — or upload your existing lease and send for signature. Works for any state.",
    painPoint: "Landlords and property managers spend hours drafting leases. One missed clause can cost thousands in disputes.",
    roiMetric: "5 min",
    roiDescription: "Average time to generate a complete lease",
    useCases: [
      { title: "Residential Leases", description: "Month-to-month, fixed-term, and room rental agreements. State-specific clauses auto-populated.", icon: FileText },
      { title: "Commercial Leases", description: "NNN, gross, and modified gross lease structures. CAM charges, tenant improvements, and renewal options included.", icon: BarChart3 },
      { title: "Addenda & Amendments", description: "Pet addenda, parking agreements, lease renewal amendments — all generated and signed in one workflow.", icon: CheckCircle2 },
    ],
    competitorComparison: { competitor: "LegalZoom", competitorPrice: "$149+ per document", signovaPrice: "From $19/mo (unlimited)", savings: "Save 98%" },
    benefits: ["All 50 states covered", "Plain-English explanations of each clause", "E-signature built in", "Store and reuse tenant profiles", "Automated renewal reminders"],
    ctaHeadline: "Generate Your First Lease in 5 Minutes",
  },
  "real-estate-esignature": {
    slug: "real-estate-esignature",
    industry: "Real Estate",
    heroHeadline: "E-Signature for Real Estate",
    heroSubheadline: "Legally binding e-signatures for every real estate transaction. Upload your documents or generate new ones — faster closings, happier clients.",
    painPoint: "Chasing wet signatures delays closings by days. Signova's e-signature platform gets documents signed in minutes.",
    roiMetric: "3 days → 3 hours",
    roiDescription: "Average closing document turnaround",
    useCases: [
      { title: "Purchase Agreements", description: "Send offers and counter-offers for signature instantly. Track status in real-time.", icon: FileText },
      { title: "Listing Agreements", description: "Get listing agreements signed before the competition. Mobile-friendly for on-the-go clients.", icon: Zap },
      { title: "Closing Documents", description: "Manage the full closing package with bulk send, signing order, and audit trail.", icon: Shield },
    ],
    competitorComparison: { competitor: "DocuSign Real Estate", competitorPrice: "$45–$125/mo", signovaPrice: "From $19/mo", savings: "Save 60–85%" },
    benefits: ["ESIGN & UETA compliant", "Tamper-evident audit trail", "In-person signing mode", "Bulk send to all parties", "Integrates with MLS workflows"],
    ctaHeadline: "Start Closing Faster Today",
  },
  // HR
  "offer-letter-generator": {
    slug: "offer-letter-generator",
    industry: "HR & Recruiting",
    heroHeadline: "AI Offer Letter Generator",
    heroSubheadline: "Generate professional offer letters in 2 minutes with AI — or upload your existing template and send for signature. Reduce time-to-hire and impress top candidates.",
    painPoint: "HR teams spend 45+ minutes per offer letter. Slow offers lose top candidates to faster-moving competitors.",
    roiMetric: "45 min → 2 min",
    roiDescription: "Time to generate a complete offer letter",
    useCases: [
      { title: "Full-Time Offer Letters", description: "Salary, start date, benefits, equity — all auto-populated from your candidate data. Fully customizable.", icon: FileText },
      { title: "Contract & Part-Time Offers", description: "Hourly rate, contract duration, scope of work — generate contractor offer letters with IP assignment clauses.", icon: Users },
      { title: "Conditional Offers", description: "Background check contingencies, reference requirements, and at-will employment clauses auto-included.", icon: Shield },
    ],
    competitorComparison: { competitor: "Manual Word Templates + DocuSign", competitorPrice: "$45/mo + HR time", signovaPrice: "From $19/mo", savings: "Save 90%+ time" },
    benefits: ["State-specific at-will language", "E-signature built in", "Candidate portal for signing", "Offer tracking dashboard", "Bulk offers for high-volume hiring"],
    ctaHeadline: "Hire Faster. Lose Fewer Candidates.",
  },
  "employee-onboarding-documents": {
    slug: "employee-onboarding-documents",
    industry: "HR & Recruiting",
    heroHeadline: "Employee Onboarding Document Automation",
    heroSubheadline: "Automate your entire onboarding document stack — NDAs, I-9s, W-4s, handbooks — or upload your existing documents and collect signatures in one platform.",
    painPoint: "New hire paperwork takes HR teams 4–6 hours per employee. Signova automates the entire onboarding document workflow.",
    roiMetric: "4 hrs → 20 min",
    roiDescription: "Time saved per new hire onboarding",
    useCases: [
      { title: "Onboarding Document Packs", description: "Bundle NDA, offer letter, I-9, W-4, direct deposit, and handbook acknowledgment into one signing workflow.", icon: FileText },
      { title: "Remote Onboarding", description: "Send the full onboarding pack before day one. New hires complete everything on their phone.", icon: Zap },
      { title: "Compliance Tracking", description: "Track completion status for every document. Automatic reminders for unsigned items.", icon: Shield },
    ],
    competitorComparison: { competitor: "BambooHR + DocuSign", competitorPrice: "$8/employee/mo + $45/mo", signovaPrice: "From $19/mo flat", savings: "Save 70%+" },
    benefits: ["Pre-built onboarding templates", "I-9 and W-4 compliant forms", "Bulk send to entire cohort", "Completion tracking dashboard", "Secure document storage"],
    ctaHeadline: "Automate Your Onboarding Stack",
  },
  "employment-contract-esignature": {
    slug: "employment-contract-esignature",
    industry: "HR & Recruiting",
    heroHeadline: "Employment Contract E-Signature",
    heroSubheadline: "Legally binding e-signatures for employment contracts, NDAs, and HR documents. Upload your existing docs or generate new ones. ESIGN compliant.",
    painPoint: "Wet signatures on employment contracts delay start dates and create compliance gaps. Signova closes the loop digitally.",
    roiMetric: "100%",
    roiDescription: "ESIGN & UETA compliance",
    useCases: [
      { title: "Employment Agreements", description: "Full-time, part-time, and contractor agreements. Send, sign, and store in one workflow.", icon: FileText },
      { title: "NDAs & IP Agreements", description: "Confidentiality agreements, IP assignment, and non-compete clauses — signed before day one.", icon: Shield },
      { title: "Performance & Termination Docs", description: "PIPs, warnings, and separation agreements — all with legally binding e-signature and audit trail.", icon: BarChart3 },
    ],
    competitorComparison: { competitor: "DocuSign Business Pro", competitorPrice: "$65/mo", signovaPrice: "From $19/mo", savings: "Save 70%" },
    benefits: ["ESIGN & UETA compliant", "Tamper-evident audit trail", "Bulk send for large teams", "Mobile signing", "Secure document vault"],
    ctaHeadline: "Modernize Your HR Document Workflow",
  },
  // CONTRACTORS
  "construction-contract-template": {
    slug: "construction-contract-template",
    industry: "Contractors & Trades",
    heroHeadline: "Construction Contract Generator",
    heroSubheadline: "Generate professional construction contracts in minutes with AI — or upload your existing contracts and send for signature. Protect your business and get paid faster.",
    painPoint: "Contractors lose thousands to scope creep and payment disputes from vague contracts. Signova generates airtight contracts instantly.",
    roiMetric: "$12,000",
    roiDescription: "Average dispute cost avoided per contract",
    useCases: [
      { title: "General Contractor Agreements", description: "Scope of work, payment schedule, lien waiver, and dispute resolution — all auto-generated.", icon: FileText },
      { title: "Subcontractor Agreements", description: "Subcontractor scope, payment terms, insurance requirements, and liability clauses.", icon: Users },
      { title: "Residential Renovation Contracts", description: "Kitchen, bathroom, and whole-home renovation contracts with material allowances and change order provisions.", icon: Zap },
    ],
    competitorComparison: { competitor: "Attorney-drafted contracts", competitorPrice: "$500–$2,000 per contract", signovaPrice: "From $19/mo (unlimited)", savings: "Save 99%" },
    benefits: ["State-specific lien law compliance", "Payment schedule builder", "Change order provisions included", "E-signature built in", "Photo documentation attachment"],
    ctaHeadline: "Protect Your Business. Get Paid Faster.",
  },
  "contractor-estimate-generator": {
    slug: "contractor-estimate-generator",
    industry: "Contractors & Trades",
    heroHeadline: "Contractor Estimate Generator",
    heroSubheadline: "Generate professional project estimates in minutes with AI — or upload your existing estimate template and send for client approval. Win more bids.",
    painPoint: "Contractors spend 2–3 hours per estimate. Slow estimates lose bids. Unprofessional estimates lose trust.",
    roiMetric: "30%",
    roiDescription: "Average increase in bid win rate",
    useCases: [
      { title: "Itemized Project Estimates", description: "Labor, materials, equipment, and overhead — all broken out with professional formatting.", icon: BarChart3 },
      { title: "Estimate-to-Contract Conversion", description: "Convert approved estimates directly into binding contracts with one click.", icon: ArrowRight },
      { title: "Client Approval Workflow", description: "Send estimates for digital approval. Client signs off, you start work — no paper chasing.", icon: CheckCircle2 },
    ],
    competitorComparison: { competitor: "Jobber + DocuSign", competitorPrice: "$69/mo + $45/mo", signovaPrice: "From $19/mo", savings: "Save 83%" },
    benefits: ["Professional estimate templates", "Material cost database", "Digital client approval", "Estimate tracking dashboard", "Convert to contract instantly"],
    ctaHeadline: "Win More Bids. Spend Less Time Estimating.",
  },
  "change-order-form-generator": {
    slug: "change-order-form-generator",
    industry: "Contractors & Trades",
    heroHeadline: "Change Order Form Generator",
    heroSubheadline: "Document every scope change instantly with AI — or upload your existing change order form and get client approval before you spend a dollar.",
    painPoint: "Undocumented change orders are the #1 cause of contractor payment disputes. Signova creates a paper trail for every change.",
    roiMetric: "100%",
    roiDescription: "Change orders documented and signed",
    useCases: [
      { title: "Scope Change Documentation", description: "Describe the change, add cost and time impact, and send for client approval — in under 5 minutes.", icon: FileText },
      { title: "Client Approval Workflow", description: "Client receives change order via email, reviews on mobile, and signs digitally. Instant confirmation.", icon: CheckCircle2 },
      { title: "Change Order Log", description: "Track all approved and pending change orders per project. Never lose track of scope or budget.", icon: BarChart3 },
    ],
    competitorComparison: { competitor: "Manual forms + email chains", competitorPrice: "Hours of admin time", signovaPrice: "From $19/mo", savings: "Save 95% time" },
    benefits: ["Instant change order generation", "Digital client approval", "Automatic project log", "Linked to original contract", "Dispute-proof audit trail"],
    ctaHeadline: "Stop Losing Money on Undocumented Changes",
  },
  // ACCOUNTING
  "engagement-letter-generator": {
    slug: "engagement-letter-generator",
    industry: "Accounting & Tax",
    heroHeadline: "Engagement Letter Generator for Accountants",
    heroSubheadline: "Generate AICPA-compliant engagement letters in minutes with AI — or upload your existing letter and collect e-signatures. Protect your firm and set clear client expectations.",
    painPoint: "Accounting firms without signed engagement letters face malpractice exposure. Signova generates compliant letters in 3 minutes.",
    roiMetric: "3 min",
    roiDescription: "Time to generate a compliant engagement letter",
    useCases: [
      { title: "Tax Preparation Engagements", description: "Individual, business, and trust tax return engagement letters with scope limitations and fee schedules.", icon: FileText },
      { title: "Audit & Review Engagements", description: "SSARS and GAAS-compliant engagement letters for compilations, reviews, and audits.", icon: Shield },
      { title: "Advisory & Consulting Engagements", description: "Business advisory, CFO services, and consulting engagement letters with hourly or retainer billing terms.", icon: BarChart3 },
    ],
    competitorComparison: { competitor: "Attorney-drafted + DocuSign", competitorPrice: "$300+ per letter + $45/mo", signovaPrice: "From $19/mo (unlimited)", savings: "Save 99%" },
    benefits: ["AICPA-compliant templates", "Scope limitation language included", "Fee schedule builder", "E-signature built in", "Bulk send for tax season"],
    ctaHeadline: "Protect Your Firm. Impress Your Clients.",
  },
  "tax-client-intake-forms": {
    slug: "tax-client-intake-forms",
    industry: "Accounting & Tax",
    heroHeadline: "Tax Client Intake Form Automation",
    heroSubheadline: "Collect client information digitally before tax season. Generate intake forms with AI or upload your existing forms — no more paper forms or back-and-forth emails.",
    painPoint: "Tax preparers spend 30–60 minutes per client chasing missing information. Signova's intake forms collect everything upfront.",
    roiMetric: "60 min → 5 min",
    roiDescription: "Time saved per client intake",
    useCases: [
      { title: "Individual Tax Intake", description: "W-2, 1099, deductions, life changes — all collected digitally with smart conditional questions.", icon: FileText },
      { title: "Business Tax Intake", description: "Entity type, revenue, expenses, payroll, and prior year returns — structured intake for business clients.", icon: BarChart3 },
      { title: "Organizer + Engagement Letter Bundle", description: "Send intake form and engagement letter together. Client completes and signs in one session.", icon: CheckCircle2 },
    ],
    competitorComparison: { competitor: "Paper organizers + email", competitorPrice: "Hours of admin time", signovaPrice: "From $19/mo", savings: "Save 90%+ time" },
    benefits: ["Smart conditional questions", "Secure document upload", "Engagement letter bundled", "Client portal access", "Bulk send for all clients"],
    ctaHeadline: "Eliminate Tax Season Chaos",
  },
  "accounting-esignature-software": {
    slug: "accounting-esignature-software",
    industry: "Accounting & Tax",
    heroHeadline: "E-Signature Software for Accountants",
    heroSubheadline: "Legally binding e-signatures for engagement letters, tax returns, and client documents. Upload your existing docs or generate new ones. IRS-compliant.",
    painPoint: "Accounting firms using wet signatures lose 3–5 days per client waiting for signed returns and engagement letters.",
    roiMetric: "5 days → 2 hours",
    roiDescription: "Average document turnaround time",
    useCases: [
      { title: "Tax Return Signatures", description: "8879 e-file authorization and state equivalents — sent, signed, and stored in minutes.", icon: FileText },
      { title: "Engagement Letter Signatures", description: "Send engagement letters before work begins. Track who has and hasn't signed.", icon: Shield },
      { title: "Financial Statement Approvals", description: "Client approval signatures on compiled and reviewed financial statements with audit trail.", icon: BarChart3 },
    ],
    competitorComparison: { competitor: "DocuSign for Accountants", competitorPrice: "$45–$125/mo", signovaPrice: "From $19/mo", savings: "Save 60–85%" },
    benefits: ["IRS 8879 compliant", "ESIGN & UETA compliant", "Tamper-evident audit trail", "Bulk send for tax season", "Secure document vault"],
    ctaHeadline: "Modernize Your Firm's Document Workflow",
  },
  // MEDICAL
  "medical-consent-form-generator": {
    slug: "medical-consent-form-generator",
    industry: "Medical & Healthcare",
    heroHeadline: "Medical Consent Form Generator",
    heroSubheadline: "Generate HIPAA-ready patient consent forms in minutes with AI — or upload your existing forms and collect patient signatures digitally. Reduce liability and streamline intake.",
    painPoint: "Medical practices using paper consent forms face HIPAA compliance gaps and administrative burden. Signova digitizes the entire consent workflow.",
    roiMetric: "HIPAA",
    roiDescription: "Compliant consent documentation",
    useCases: [
      { title: "Informed Consent Forms", description: "Procedure-specific informed consent with risk disclosure, alternative treatments, and patient acknowledgment.", icon: FileText },
      { title: "HIPAA Authorization Forms", description: "PHI release authorizations, research consent, and marketing consent — all HIPAA-ready.", icon: Shield },
      { title: "Treatment Consent Bundles", description: "Bundle intake, consent, and financial agreement into one digital patient workflow.", icon: CheckCircle2 },
    ],
    competitorComparison: { competitor: "Paper forms + manual filing", competitorPrice: "Hours of admin + compliance risk", signovaPrice: "From $19/mo", savings: "Eliminate compliance risk" },
    benefits: ["HIPAA-ready templates", "Secure patient portal", "E-signature with audit trail", "Automatic record retention", "Multi-language support"],
    ctaHeadline: "Protect Your Practice. Improve Patient Experience.",
  },
  "patient-intake-form-automation": {
    slug: "patient-intake-form-automation",
    industry: "Medical & Healthcare",
    heroHeadline: "Patient Intake Form Automation",
    heroSubheadline: "Collect patient information digitally before appointments. Reduce wait times and eliminate paper forms.",
    painPoint: "Patients arriving 15 minutes early to fill out paper forms is a 2024 problem. Signova sends intake forms before the appointment.",
    roiMetric: "15 min",
    roiDescription: "Saved per patient visit",
    useCases: [
      { title: "Pre-Visit Digital Intake", description: "Send intake forms 24 hours before appointments. Patients complete on their phone. Data flows to your EHR.", icon: FileText },
      { title: "Medical History Collection", description: "Structured medical history, medication lists, allergies, and insurance information — all collected digitally.", icon: Shield },
      { title: "Financial Agreement & Consent Bundle", description: "Combine intake, financial agreement, and consent forms into one pre-visit workflow.", icon: CheckCircle2 },
    ],
    competitorComparison: { competitor: "Paper forms + manual entry", competitorPrice: "15+ min per patient + data entry", signovaPrice: "From $19/mo", savings: "Save 90%+ admin time" },
    benefits: ["HIPAA-ready data collection", "Mobile-friendly patient portal", "EHR integration ready", "Automatic reminders", "Secure document storage"],
    ctaHeadline: "Eliminate Paper Forms from Your Practice",
  },
  // INSURANCE
  "insurance-application-automation": {
    slug: "insurance-application-automation",
    industry: "Insurance",
    heroHeadline: "Insurance Application Automation",
    heroSubheadline: "Automate insurance applications, renewals, and client documents. Close more policies faster.",
    painPoint: "Insurance brokers lose 30% of applications to incomplete forms and slow follow-up. Signova automates the entire application workflow.",
    roiMetric: "30%",
    roiDescription: "Reduction in incomplete applications",
    useCases: [
      { title: "New Business Applications", description: "Life, P&C, health, and commercial applications — smart forms that guide clients through every required field.", icon: FileText },
      { title: "Renewal Workflows", description: "Automated renewal reminders, updated application forms, and e-signature — all in one workflow.", icon: Zap },
      { title: "Change of Information Forms", description: "Beneficiary changes, address updates, coverage modifications — processed digitally with audit trail.", icon: CheckCircle2 },
    ],
    competitorComparison: { competitor: "Paper applications + DocuSign", competitorPrice: "$45/mo + hours of admin", signovaPrice: "From $19/mo", savings: "Save 90%+ time" },
    benefits: ["State-compliant application forms", "E-signature with audit trail", "Automated renewal reminders", "Client portal", "Carrier submission ready"],
    ctaHeadline: "Close More Policies. Less Paperwork.",
  },
  "broker-agreement-generator": {
    slug: "broker-agreement-generator",
    industry: "Insurance",
    heroHeadline: "Insurance Broker Agreement Generator",
    heroSubheadline: "Generate producer agreements, MGA contracts, and broker-of-record letters in minutes.",
    painPoint: "Insurance broker agreements drafted by attorneys cost $500–$2,000 each. Signova generates compliant agreements for $19/month.",
    roiMetric: "99%",
    roiDescription: "Cost savings vs. attorney-drafted agreements",
    useCases: [
      { title: "Producer Agreements", description: "Commission schedules, binding authority, E&O requirements, and termination clauses — all auto-generated.", icon: FileText },
      { title: "Broker-of-Record Letters", description: "BOR letters for commercial lines — generated, sent, and signed in under 10 minutes.", icon: Shield },
      { title: "MGA & Wholesaler Agreements", description: "Managing general agent agreements with appointment terms, compensation, and compliance requirements.", icon: BarChart3 },
    ],
    competitorComparison: { competitor: "Attorney-drafted agreements", competitorPrice: "$500–$2,000 per agreement", signovaPrice: "From $19/mo (unlimited)", savings: "Save 99%" },
    benefits: ["State-compliant producer agreements", "E-signature built in", "Commission schedule builder", "Appointment tracking", "Secure document vault"],
    ctaHeadline: "Generate Broker Agreements in Minutes",
  },

  // Logistics
  'logistics-contract-management': {
    slug: 'logistics-contract-management',
    industry: 'Logistics',
    heroHeadline: 'Logistics Contract Management Platform',
    heroSubheadline: 'Generate carrier agreements, freight contracts, and vendor documents with AI — or upload your existing logistics contracts and send for signature instantly.',
    painPoint: 'Logistics companies lose hours managing paper contracts. Missed signatures delay shipments and create compliance risks.',
    roiMetric: '70%',
    roiDescription: 'Faster contract turnaround for logistics teams',
    useCases: [
      { title: 'Carrier Agreements', description: 'Generate carrier contracts with AI or upload existing agreements. Digital signatures accepted by all major carriers.', icon: FileText },
      { title: 'Freight Broker Contracts', description: 'Create broker-carrier agreements, load confirmations, and rate confirmations in minutes.', icon: BarChart3 },
      { title: 'Vendor & Supplier Contracts', description: 'Manage all logistics vendor relationships with automated workflows and audit trails.', icon: CheckCircle2 },
    ],
    competitorComparison: { competitor: 'DocuSign', competitorPrice: '$45–$125/mo', signovaPrice: 'From $19/mo', savings: 'Save 60–85%' },
    benefits: ['Unlimited documents from $19/mo', 'AI-assisted or upload your own', 'Legally binding e-signatures', 'Full audit trail', 'Works on mobile for drivers'],
    ctaHeadline: 'Streamline Your Logistics Contracts Today',
  },
  'logistics-bill-of-lading-signature': {
    slug: 'logistics-bill-of-lading-signature',
    industry: 'Logistics',
    heroHeadline: 'Bill of Lading E-Signature Platform',
    heroSubheadline: 'Sign bills of lading, delivery receipts, and shipping documents digitally. Upload existing BOLs or generate new ones with AI assistance.',
    painPoint: 'Paper-based BOLs slow down shipments and create compliance risks. Digital BOL signing eliminates delays.',
    roiMetric: '85%',
    roiDescription: 'Reduction in paper-based shipping documentation',
    useCases: [
      { title: 'Digital BOL Signing', description: 'Sign bills of lading electronically with legally binding e-signatures accepted by all carriers.', icon: FileText },
      { title: 'Delivery Receipts', description: 'Capture delivery confirmations and proof of delivery with digital signatures on any device.', icon: Zap },
      { title: 'Compliance Documentation', description: 'Maintain full audit trails and compliance records for all shipping documents automatically.', icon: Shield },
    ],
    competitorComparison: { competitor: 'Traditional BOL Processing', competitorPrice: '$15–30 per document', signovaPrice: 'From $19/mo (unlimited)', savings: 'Save 95%+' },
    benefits: ['Works on mobile for drivers', 'Instant delivery confirmation', 'ESIGN & UETA compliant', 'Bulk send to multiple parties', 'Automated compliance records'],
    ctaHeadline: 'Digitize Your BOL Process Today',
  },
  'logistics-vendor-agreements': {
    slug: 'logistics-vendor-agreements',
    industry: 'Logistics',
    heroHeadline: 'Logistics Vendor Agreement Platform',
    heroSubheadline: 'Generate and sign vendor agreements, supplier contracts, and partnership documents. AI-assisted creation or upload your own — your choice.',
    painPoint: 'Managing dozens of vendor agreements manually creates bottlenecks and compliance gaps in logistics operations.',
    roiMetric: '60%',
    roiDescription: 'Faster vendor onboarding for logistics companies',
    useCases: [
      { title: 'Supplier Contracts', description: 'Create and manage supplier agreements with automated renewal reminders and digital signatures.', icon: FileText },
      { title: 'Partnership Agreements', description: 'Generate logistics partnership agreements with AI assistance or use your existing templates.', icon: Users },
      { title: 'Service Level Agreements', description: 'Draft and sign SLAs with carriers and logistics partners quickly and securely.', icon: CheckCircle2 },
    ],
    competitorComparison: { competitor: 'PandaDoc', competitorPrice: '$49/mo per user', signovaPrice: 'From $19/mo (team)', savings: 'Save 60%+' },
    benefits: ['Unlimited vendor agreements', 'Automated renewal reminders', 'AI-assisted or upload your own', 'Multi-party signing workflows', 'Full compliance audit trail'],
    ctaHeadline: 'Streamline Vendor Agreements Today',
  },
  'logistics-driver-agreements': {
    slug: 'logistics-driver-agreements',
    industry: 'Logistics',
    heroHeadline: 'Driver Agreement & Onboarding Platform',
    heroSubheadline: 'Generate driver contracts, independent contractor agreements, and onboarding documents. Upload existing forms or create new ones with AI assistance.',
    painPoint: 'Onboarding new drivers with paper contracts delays operations and creates compliance risks for logistics companies.',
    roiMetric: '75%',
    roiDescription: 'Faster driver onboarding with digital document workflows',
    useCases: [
      { title: 'Driver Contracts', description: 'Generate employment and contractor agreements for drivers with jurisdiction-specific language.', icon: FileText },
      { title: 'Independent Contractor Agreements', description: 'Create ICA documents that protect your company and clearly define driver relationships.', icon: Shield },
      { title: 'Onboarding Packages', description: 'Bundle driver agreements, safety policies, and compliance documents into a single signing workflow.', icon: Users },
    ],
    competitorComparison: { competitor: 'HelloSign', competitorPrice: '$25/mo per user', signovaPrice: 'From $19/mo (unlimited users)', savings: 'Save 50%+' },
    benefits: ['State-specific driver language', 'Mobile-friendly for drivers', 'Bulk onboarding workflows', 'DOT compliance ready', 'Automated background check integration'],
    ctaHeadline: 'Streamline Driver Onboarding Today',
  },
  'ecommerce-vendor-contracts': {
    slug: 'ecommerce-vendor-contracts',
    industry: 'E-Commerce',
    heroHeadline: 'E-Commerce Vendor Contract Platform',
    heroSubheadline: 'Generate and sign vendor contracts, supplier agreements, and marketplace terms. AI-assisted creation or upload your existing contracts — your choice.',
    painPoint: 'E-commerce businesses waste hours on manual vendor contract management while scaling their supplier network.',
    roiMetric: '80%',
    roiDescription: 'Faster vendor onboarding for e-commerce businesses',
    useCases: [
      { title: 'Supplier Agreements', description: 'Create and sign supplier contracts with automated workflows and digital signatures.', icon: FileText },
      { title: 'Marketplace Vendor Terms', description: 'Generate vendor terms of service and marketplace agreements with AI assistance.', icon: BarChart3 },
      { title: 'Drop-Shipping Contracts', description: 'Formalize drop-shipping relationships with legally binding agreements signed digitally.', icon: CheckCircle2 },
    ],
    competitorComparison: { competitor: 'DocuSign', competitorPrice: '$45–$125/mo', signovaPrice: 'From $19/mo', savings: 'Save 60–85%' },
    benefits: ['Unlimited vendor contracts', 'AI-assisted or upload your own', 'Shopify & WooCommerce friendly', 'Multi-party signing', 'Automated renewal reminders'],
    ctaHeadline: 'Scale Your Vendor Operations Today',
  },
  'ecommerce-influencer-agreements': {
    slug: 'ecommerce-influencer-agreements',
    industry: 'E-Commerce',
    heroHeadline: 'Influencer Agreement Generator',
    heroSubheadline: 'Generate influencer contracts, brand partnership agreements, and UGC licensing documents in minutes. AI-assisted or upload your own templates.',
    painPoint: 'Brands lose money on influencer campaigns without proper contracts. Manual agreements take days to finalize.',
    roiMetric: '5 min',
    roiDescription: 'Average time to generate a complete influencer agreement',
    useCases: [
      { title: 'Influencer Contracts', description: 'Generate comprehensive influencer agreements covering deliverables, payment, exclusivity, and usage rights.', icon: FileText },
      { title: 'UGC Licensing Agreements', description: 'Secure usage rights for user-generated content with clear licensing terms and digital signatures.', icon: Shield },
      { title: 'Brand Partnership Agreements', description: 'Formalize long-term brand ambassador relationships with performance metrics and payment schedules.', icon: Users },
    ],
    competitorComparison: { competitor: 'Legal Template Services', competitorPrice: '$99–$299 per template', signovaPrice: 'From $19/mo (unlimited)', savings: 'Save 95%+' },
    benefits: ['FTC disclosure clauses included', 'Platform-specific terms (Instagram, TikTok, YouTube)', 'AI-assisted or upload your own', 'E-signature built in', 'Content calendar integration'],
    ctaHeadline: 'Protect Your Brand Partnerships Today',
  },
  'ecommerce-supplier-contracts': {
    slug: 'ecommerce-supplier-contracts',
    industry: 'E-Commerce',
    heroHeadline: 'E-Commerce Supplier Contract Automation',
    heroSubheadline: 'Automate supplier contracts, purchase orders, and manufacturing agreements. Generate with AI or upload your existing supplier documents.',
    painPoint: 'Managing supplier contracts manually creates delays, compliance gaps, and costly disputes for e-commerce businesses.',
    roiMetric: '65%',
    roiDescription: 'Reduction in supplier contract processing time',
    useCases: [
      { title: 'Purchase Orders', description: 'Generate and sign purchase orders with automated workflows and supplier acknowledgment tracking.', icon: FileText },
      { title: 'Manufacturing Agreements', description: 'Create manufacturing contracts with quality standards, delivery terms, and IP protection clauses.', icon: BarChart3 },
      { title: 'Supplier NDAs', description: 'Protect proprietary product information with supplier NDAs generated and signed in minutes.', icon: Shield },
    ],
    competitorComparison: { competitor: 'PandaDoc', competitorPrice: '$49/mo per user', signovaPrice: 'From $19/mo (team)', savings: 'Save 60%+' },
    benefits: ['Multi-currency support', 'International supplier terms', 'AI-assisted or upload your own', 'Automated PO workflows', 'Supplier portal for signing'],
    ctaHeadline: 'Streamline Your Supply Chain Today',
  },
  'ecommerce-order-terms': {
    slug: 'ecommerce-order-terms',
    industry: 'E-Commerce',
    heroHeadline: 'E-Commerce Terms & Conditions Generator',
    heroSubheadline: 'Generate terms of service, return policies, and order terms for your e-commerce store. AI-assisted or upload your existing policies.',
    painPoint: 'Generic terms of service expose e-commerce businesses to chargebacks, disputes, and legal liability.',
    roiMetric: '90%',
    roiDescription: 'Of e-commerce disputes resolved faster with clear terms',
    useCases: [
      { title: 'Terms of Service', description: 'Generate comprehensive e-commerce terms covering orders, shipping, returns, and dispute resolution.', icon: FileText },
      { title: 'Return & Refund Policies', description: 'Create clear, legally sound return policies that reduce chargebacks and customer disputes.', icon: CheckCircle2 },
      { title: 'Subscription Terms', description: 'Generate subscription billing terms with cancellation policies and auto-renewal disclosures.', icon: Zap },
    ],
    competitorComparison: { competitor: 'Legal Template Services', competitorPrice: '$199–$499 per policy', signovaPrice: 'From $19/mo (unlimited)', savings: 'Save 95%+' },
    benefits: ['Platform-specific (Shopify, WooCommerce, Amazon)', 'GDPR & CCPA compliant', 'AI-assisted or upload your own', 'Customer acknowledgment tracking', 'Automatic policy versioning'],
    ctaHeadline: 'Protect Your E-Commerce Business Today',
  },
  'finance-client-agreements': {
    slug: 'finance-client-agreements',
    industry: 'Finance',
    heroHeadline: 'Financial Services Client Agreement Platform',
    heroSubheadline: 'Generate client agreements, advisory contracts, and financial service documents with AI — or upload your existing agreements and collect signatures instantly.',
    painPoint: 'Financial advisors spend hours on client paperwork instead of managing portfolios. Manual agreements create compliance risks.',
    roiMetric: '3 hrs → 15 min',
    roiDescription: 'Time to onboard a new financial services client',
    useCases: [
      { title: 'Investment Advisory Agreements', description: 'Generate IAAs with fee schedules, risk disclosures, and fiduciary language. SEC/FINRA compliant.', icon: FileText },
      { title: 'Financial Planning Agreements', description: 'Create comprehensive financial planning engagement letters with scope of services and compensation terms.', icon: BarChart3 },
      { title: 'Client Onboarding Packages', description: 'Bundle all client onboarding documents — KYC, agreements, disclosures — into a single signing workflow.', icon: Users },
    ],
    competitorComparison: { competitor: 'DocuSign + Legal Templates', competitorPrice: '$125/mo + $299/template', signovaPrice: 'From $19/mo (unlimited)', savings: 'Save 95%+' },
    benefits: ['SEC/FINRA compliant language', 'Form ADV integration', 'AI-assisted or upload your own', 'Client portal for signing', 'Automated compliance recordkeeping'],
    ctaHeadline: 'Streamline Client Onboarding Today',
  },
  'finance-loan-documents': {
    slug: 'finance-loan-documents',
    industry: 'Finance',
    heroHeadline: 'Loan Document Generation & E-Signature Platform',
    heroSubheadline: 'Generate loan agreements, promissory notes, and lending documents with AI — or upload your existing loan documents and collect signatures digitally.',
    painPoint: 'Manual loan document processing delays funding and creates compliance risks for lenders and borrowers.',
    roiMetric: '5 days → 1 day',
    roiDescription: 'Average loan document processing time reduction',
    useCases: [
      { title: 'Promissory Notes', description: 'Generate legally binding promissory notes with payment schedules, interest terms, and default provisions.', icon: FileText },
      { title: 'Loan Agreements', description: 'Create comprehensive loan agreements with collateral terms, covenants, and signature workflows.', icon: Shield },
      { title: 'Personal Guarantee Documents', description: 'Generate personal guarantee agreements with clear liability terms and digital signature collection.', icon: CheckCircle2 },
    ],
    competitorComparison: { competitor: 'DocuSign', competitorPrice: '$45–$125/mo', signovaPrice: 'From $19/mo', savings: 'Save 60–85%' },
    benefits: ['State-specific lending laws', 'TILA/RESPA compliant', 'AI-assisted or upload your own', 'Borrower portal for signing', 'Automated payment schedule generation'],
    ctaHeadline: 'Accelerate Your Lending Process Today',
  },
  'finance-compliance-documents': {
    slug: 'finance-compliance-documents',
    industry: 'Finance',
    heroHeadline: 'Financial Compliance Document Automation',
    heroSubheadline: 'Automate compliance documents, regulatory filings, and audit documentation. AI-assisted generation or upload your existing compliance templates.',
    painPoint: 'Financial compliance teams spend 40% of their time on document management instead of actual compliance work.',
    roiMetric: '40%',
    roiDescription: 'Reduction in compliance document processing time',
    useCases: [
      { title: 'Compliance Policies', description: 'Generate AML, KYC, and BSA compliance policies with jurisdiction-specific requirements.', icon: Shield },
      { title: 'Audit Documentation', description: 'Create and manage audit trail documents with automated workflows and digital signatures.', icon: FileText },
      { title: 'Regulatory Disclosures', description: 'Generate required regulatory disclosures and obtain client acknowledgments digitally.', icon: CheckCircle2 },
    ],
    competitorComparison: { competitor: 'Compliance Management Software', competitorPrice: '$200–$500/mo', signovaPrice: 'From $19/mo', savings: 'Save 90%+' },
    benefits: ['SOC 2 compliant infrastructure', 'Tamper-evident audit trails', 'AI-assisted or upload your own', 'Automated compliance reminders', 'Regulatory update alerts'],
    ctaHeadline: 'Automate Your Compliance Documents Today',
  },
  'finance-investor-agreements': {
    slug: 'finance-investor-agreements',
    industry: 'Finance',
    heroHeadline: 'Investor Agreement & Cap Table Document Platform',
    heroSubheadline: 'Generate investor agreements, SAFEs, convertible notes, and equity documents with AI — or upload your existing investment documents.',
    painPoint: 'Startups and investment firms spend thousands on legal fees for investor documents that can be generated in minutes.',
    roiMetric: '$5,000+',
    roiDescription: 'Average legal fee savings per funding round',
    useCases: [
      { title: 'SAFE Agreements', description: 'Generate Y Combinator-style SAFE agreements with custom valuation caps and discount rates.', icon: FileText },
      { title: 'Convertible Notes', description: 'Create convertible note agreements with interest rates, maturity dates, and conversion terms.', icon: BarChart3 },
      { title: 'Investor NDAs', description: 'Generate investor NDAs and confidentiality agreements before sharing sensitive financial information.', icon: Shield },
    ],
    competitorComparison: { competitor: 'Startup Legal Services', competitorPrice: '$3,000–$10,000 per round', signovaPrice: 'From $19/mo (unlimited)', savings: 'Save 99%+' },
    benefits: ['SEC Regulation D compliant', 'Accredited investor verification', 'AI-assisted or upload your own', 'Investor portal for signing', 'Cap table integration'],
    ctaHeadline: 'Close Your Next Round Faster Today',
  },
  'legal-client-engagement': {
    slug: 'legal-client-engagement',
    industry: 'Legal',
    heroHeadline: 'Law Firm Client Engagement Letter Generator',
    heroSubheadline: 'Generate client engagement letters, retainer agreements, and legal service contracts in minutes — or upload your existing templates and collect signatures digitally.',
    painPoint: 'Law firms spend 2–4 hours per new client on engagement paperwork. Signova reduces this to under 10 minutes.',
    roiMetric: '2 hrs → 10 min',
    roiDescription: 'Time to onboard a new legal client',
    useCases: [
      { title: 'Engagement Letters', description: 'Generate comprehensive engagement letters with scope of representation, fees, and conflict waivers.', icon: FileText },
      { title: 'Retainer Agreements', description: 'Create retainer agreements with billing terms, trust account provisions, and termination clauses.', icon: BarChart3 },
      { title: 'Conflict Waiver Letters', description: 'Generate conflict of interest waiver letters with informed consent language for dual representation.', icon: Shield },
    ],
    competitorComparison: { competitor: 'Clio + DocuSign', competitorPrice: '$89–$149/mo per attorney', signovaPrice: 'From $19/mo (firm-wide)', savings: 'Save 80%+' },
    benefits: ['State bar compliant language', 'IOLTA trust account provisions', 'AI-assisted or upload your own', 'Client portal for signing', 'Matter management integration'],
    ctaHeadline: 'Streamline Client Intake Today',
  },
  'legal-retainer-agreements': {
    slug: 'legal-retainer-agreements',
    industry: 'Legal',
    heroHeadline: 'Legal Retainer Agreement Generator',
    heroSubheadline: 'Generate retainer agreements, fee agreements, and billing arrangements for law firms. AI-assisted or upload your existing retainer templates.',
    painPoint: 'Inconsistent retainer agreements create billing disputes and malpractice risks for law firms.',
    roiMetric: '95%',
    roiDescription: 'Reduction in billing disputes with clear retainer agreements',
    useCases: [
      { title: 'Flat Fee Retainers', description: 'Generate flat fee agreements with clear scope of work, payment terms, and refund policies.', icon: FileText },
      { title: 'Hourly Retainers', description: 'Create hourly retainer agreements with billing rates, invoice schedules, and trust account provisions.', icon: BarChart3 },
      { title: 'Contingency Fee Agreements', description: 'Generate contingency fee agreements with percentage terms, expense provisions, and settlement approval clauses.', icon: CheckCircle2 },
    ],
    competitorComparison: { competitor: 'Legal Template Services', competitorPrice: '$99–$299 per template', signovaPrice: 'From $19/mo (unlimited)', savings: 'Save 95%+' },
    benefits: ['All fee structures supported', 'State bar rule compliance', 'AI-assisted or upload your own', 'Client e-signature built in', 'Automated billing reminders'],
    ctaHeadline: 'Eliminate Billing Disputes Today',
  },
  'legal-document-signing': {
    slug: 'legal-document-signing',
    industry: 'Legal',
    heroHeadline: 'Legal Document E-Signature Platform',
    heroSubheadline: 'Legally binding e-signatures for law firms and legal departments. Upload any legal document and collect signatures with full audit trail.',
    painPoint: 'Law firms using paper signatures or expensive DocuSign plans are losing competitive advantage and overpaying.',
    roiMetric: '85%',
    roiDescription: 'Cost reduction vs. DocuSign for law firms',
    useCases: [
      { title: 'Court Filing Signatures', description: 'Collect attorney and client signatures on court filings with tamper-evident audit trails.', icon: FileText },
      { title: 'Settlement Agreements', description: 'Execute settlement agreements with multi-party signing workflows and certified delivery.', icon: Shield },
      { title: 'Corporate Resolutions', description: 'Collect board member signatures on corporate resolutions, minutes, and governance documents.', icon: Users },
    ],
    competitorComparison: { competitor: 'DocuSign Business Pro', competitorPrice: '$65/mo per user', signovaPrice: 'From $19/mo (firm-wide)', savings: 'Save 70%+' },
    benefits: ['ESIGN & UETA compliant', 'Court-admissible audit trail', 'Attorney-client privilege protection', 'Bulk signing for large matters', 'Paralegal workflow management'],
    ctaHeadline: 'Switch to Signova Today',
  },
  'legal-contract-automation': {
    slug: 'legal-contract-automation',
    industry: 'Legal',
    heroHeadline: 'Legal Contract Automation for Law Firms',
    heroSubheadline: 'Automate contract drafting, review, and execution for law firms. AI-assisted generation or upload your existing contract templates — your choice.',
    painPoint: 'Contract drafting consumes 30–40% of associate attorney time. Automation frees attorneys for higher-value work.',
    roiMetric: '40%',
    roiDescription: 'Of associate time freed from routine contract drafting',
    useCases: [
      { title: 'Contract Drafting', description: 'Generate first drafts of NDAs, service agreements, and commercial contracts with AI assistance.', icon: FileText },
      { title: 'Contract Review Workflows', description: 'Route contracts through review and approval workflows with automated deadline tracking.', icon: BarChart3 },
      { title: 'Contract Execution', description: 'Execute finalized contracts with multi-party e-signatures and automated filing.', icon: CheckCircle2 },
    ],
    competitorComparison: { competitor: 'Contract Lifecycle Management Software', competitorPrice: '$200–$500/mo', signovaPrice: 'From $19/mo', savings: 'Save 90%+' },
    benefits: ['AI-assisted first drafts', 'Upload your own templates', 'Multi-party signing workflows', 'Contract version control', 'Automated renewal alerts'],
    ctaHeadline: 'Automate Your Contract Workflow Today',
  },
};

interface IndustryLandingPageProps {
  config: IndustryConfig;
}

export function IndustryLandingPage({ config }: IndustryLandingPageProps) {
  // SEO: Set page title and meta tags for each industry landing page
  useEffect(() => {
    const title = `${config.heroHeadline} | Signova AI`;
    const description = config.heroSubheadline;
    const url = `https://signova.ai/${config.slug}`;

    // Set page title
    document.title = title;

    // Helper to set or create a meta tag
    const setMeta = (selector: string, attr: string, value: string) => {
      let el = document.querySelector(selector) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        const parts = selector.match(/\[([^=]+)="([^"]+)"\]/);
        if (parts) el.setAttribute(parts[1], parts[2]);
        document.head.appendChild(el);
      }
      el.setAttribute(attr, value);
    };

    setMeta('meta[name="description"]', 'content', description);
    setMeta('meta[property="og:title"]', 'content', title);
    setMeta('meta[property="og:description"]', 'content', description);
    setMeta('meta[property="og:url"]', 'content', url);
    setMeta('meta[property="og:type"]', 'content', 'website');
    setMeta('meta[name="twitter:title"]', 'content', title);
    setMeta('meta[name="twitter:description"]', 'content', description);
    setMeta('meta[name="twitter:card"]', 'content', 'summary_large_image');

    // Canonical link
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);

    // Restore on unmount
    return () => {
      document.title = 'Signova AI — AI Document Generation & E-Signature Platform';
    };
  }, [config.slug, config.heroHeadline, config.heroSubheadline]);

  return (
    <div className="min-h-screen flex flex-col">
      <MarketingNav />
      <main className="flex-1">
        {/* Hero */}
        <section className="py-20 md:py-28 bg-gradient-to-b from-background to-muted/30">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <FileText className="h-4 w-4" />
                {config.industry}
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                {config.heroHeadline}
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                {config.heroSubheadline}
              </p>
              <p className="text-sm text-muted-foreground max-w-xl mx-auto -mt-2">
                Generate with AI — or upload your existing document and send for signature in seconds. AI is optional.
              </p>
              {/* ROI Metric */}
              <div className="inline-flex items-center gap-4 px-6 py-4 rounded-2xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
                <TrendingUp className="h-8 w-8 text-green-600 flex-shrink-0" />
                <div className="text-left">
                  <div className="text-3xl font-bold text-green-700 dark:text-green-400">{config.roiMetric}</div>
                  <div className="text-sm text-green-600 dark:text-green-500">{config.roiDescription}</div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                <Button
                  onClick={() => window.location.href = getSignupUrl() + '?path=generate'}
                  size="lg"
                  className="text-lg px-8 bg-gradient-to-r from-indigo-700 to-indigo-900 hover:from-indigo-700 hover:to-blue-700"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate with AI
                </Button>
                <Button
                  onClick={() => window.location.href = getSignupUrl() + '?path=upload'}
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 bg-background"
                >
                  <Upload className="mr-2 h-5 w-5" />
                  Upload &amp; Send
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">Enterprise-ready from day one • Cancel anytime</p>
            </div>
          </div>
        </section>

        {/* Pain Point Banner */}
        <section className="py-8 bg-amber-50 dark:bg-amber-950/20 border-y border-amber-200 dark:border-amber-800">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-lg font-medium text-amber-800 dark:text-amber-300">
                <Clock className="inline h-5 w-5 mr-2 mb-0.5" />
                {config.painPoint}
              </p>
            </div>
          </div>
        </section>

        {/* 3 Use Cases */}
        <section className="py-20">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How Signova Helps {config.industry} Professionals</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Three workflows that save hours every week</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {config.useCases.map((uc, i) => (
                <Card key={i} className="border-2 hover:border-primary/40 transition-colors">
                  <CardContent className="pt-6">
                    <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-indigo-700 to-indigo-900 flex items-center justify-center mb-4">
                      <uc.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{uc.title}</h3>
                    <p className="text-muted-foreground">{uc.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Competitor Comparison Snippet */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
                Same Legal Enforceability. Fraction of the Cost.
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-2 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20">
                  <CardContent className="pt-6">
                    <div className="text-center space-y-2">
                      <div className="text-sm font-medium text-red-600 uppercase tracking-wide">Old Way</div>
                      <div className="text-xl font-bold text-gray-900 dark:text-gray-100">{config.competitorComparison.competitor}</div>
                      <div className="text-3xl font-bold text-red-600">{config.competitorComparison.competitorPrice}</div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-2 border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-950/20">
                  <CardContent className="pt-6">
                    <div className="text-center space-y-2">
                      <div className="text-sm font-medium text-green-600 uppercase tracking-wide">Signova AI</div>
                      <div className="text-xl font-bold text-gray-900 dark:text-gray-100">Document Platform + E-Signature</div>
                      <div className="text-3xl font-bold text-green-600">{config.competitorComparison.signovaPrice}</div>
                      <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-sm font-semibold">
                        <TrendingUp className="h-4 w-4" />
                        {config.competitorComparison.savings}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits List */}
        <section className="py-20">
          <div className="container">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Everything You Need</h2>
              <ul className="space-y-4">
                {config.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-lg">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 bg-gradient-to-r from-indigo-700 to-indigo-900 text-white">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h2 className="text-3xl md:text-5xl font-bold">{config.ctaHeadline}</h2>
              <p className="text-xl opacity-90">Join thousands of {config.industry} professionals using Signova AI</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  onClick={() => window.location.href = getSignupUrl()}
                  size="lg"
                  variant="secondary"
                  className="text-lg px-8"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Link href="/pricing">
                  <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent border-white text-white hover:bg-white hover:text-indigo-400">
                    View Pricing
                  </Button>
                </Link>
              </div>
              <p className="text-sm opacity-75">Enterprise-ready from day one • Cancel anytime • 30-day money-back guarantee</p>
            </div>
          </div>
        </section>
      </main>
      <MarketingFooter />
    </div>
  );
}

export default IndustryLandingPage;
