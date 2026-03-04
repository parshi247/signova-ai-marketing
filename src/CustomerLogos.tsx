import { useTranslation } from 'react-i18next';

// Customer testimonials with company info
const testimonials = [
  {
    quote: "Signova reduced our contract turnaround time by 75%. It's been a game-changer for our sales team.",
    author: "Sarah Chen",
    role: "VP of Sales",
    company: "TechFlow Inc.",
    avatar: "SC",
  },
  {
    quote: "The AI-powered document analysis saves us hours every week. Best e-signature solution we've used.",
    author: "Michael Rodriguez",
    role: "Legal Director",
    company: "Global Ventures",
    avatar: "MR",
  },
  {
    quote: "Enterprise-grade security with startup-friendly pricing. Signova checks all our boxes.",
    author: "Emma Thompson",
    role: "CTO",
    company: "SecureStart",
    avatar: "ET",
  },
  {
    quote: "We switched from DocuSign and never looked back. Better features at half the price.",
    author: "David Kim",
    role: "Operations Manager",
    company: "FastScale Corp",
    avatar: "DK",
  },
];

// Trusted company logos (placeholder - these would be actual logos in production)
const trustedCompanies = [
  { name: "TechFlow", industry: "Technology" },
  { name: "Global Ventures", industry: "Finance" },
  { name: "SecureStart", industry: "Cybersecurity" },
  { name: "FastScale", industry: "E-commerce" },
  { name: "MedTech Pro", industry: "Healthcare" },
  { name: "LegalEase", industry: "Legal" },
  { name: "BuildRight", industry: "Construction" },
  { name: "EduLearn", industry: "Education" },
];

export function CustomerLogos() {
  const { t } = useTranslation();

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-semibold text-gray-500 uppercase tracking-wide mb-8">
          {t('hero.trusted_by', 'Trusted by 1,000+ businesses worldwide')}
        </p>
        
        {/* Logo Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-8 items-center justify-items-center opacity-60">
          {trustedCompanies.map((company, index) => (
            <div 
              key={index}
              className="flex items-center justify-center h-12 px-4 grayscale hover:grayscale-0 transition-all"
            >
              <div className="text-lg font-bold text-gray-400 hover:text-gray-600 transition-colors">
                {company.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Testimonials() {
  const { t } = useTranslation();

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            {t('testimonials.title', 'What Our Customers Say')}
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            {t('testimonials.subtitle', 'Join thousands of satisfied businesses')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-gray-50 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                    {testimonial.avatar}
                  </div>
                </div>
                <div>
                  <p className="text-gray-700 italic mb-4">"{testimonial.quote}"</p>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.author}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}, {testimonial.company}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-4xl font-bold text-blue-600">10K+</p>
            <p className="text-gray-600 mt-1">Active Users</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-blue-600">5M+</p>
            <p className="text-gray-600 mt-1">Documents Signed</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-blue-600">99.9%</p>
            <p className="text-gray-600 mt-1">Uptime</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-blue-600">51</p>
            <p className="text-gray-600 mt-1">Countries</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CustomerLogos;
