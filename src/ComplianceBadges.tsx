import { useTranslation } from 'react-i18next';

interface ComplianceBadge {
  name: string;
  description: string;
  icon: string;
  regions: string[];
}

const complianceBadges: ComplianceBadge[] = [
  {
    name: 'SOC 2 Ready',
    description: 'Certified for security, availability, and confidentiality',
    icon: '🛡️',
    regions: ['Global'],
  },
  {
    name: 'GDPR',
    description: 'Compliant with EU data protection regulations',
    icon: '🇪🇺',
    regions: ['EU', 'EEA'],
  },
  {
    name: 'HIPAA',
    description: 'Healthcare data protection compliant',
    icon: '🏥',
    regions: ['US'],
  },
  {
    name: 'eIDAS',
    description: 'EU electronic identification and trust services',
    icon: '✍️',
    regions: ['EU'],
  },
  {
    name: 'ISO 27001',
    description: 'Information security management certified',
    icon: '📋',
    regions: ['Global'],
  },
  {
    name: 'CCPA',
    description: 'California Consumer Privacy Act compliant',
    icon: '🔒',
    regions: ['US', 'California'],
  },
];

const securityFeatures = [
  {
    title: '256-bit Encryption',
    description: 'Bank-grade AES-256 encryption for all documents',
    icon: '🔐',
  },
  {
    title: 'Multi-Factor Auth',
    description: 'Secure access with 2FA and SSO support',
    icon: '📱',
  },
  {
    title: 'Audit Trail',
    description: 'Complete activity logging with timestamps',
    icon: '📝',
  },
  {
    title: 'Data Residency',
    description: 'Choose where your data is stored',
    icon: '🌍',
  },
];

export function ComplianceBadges({ compact = false }: { compact?: boolean }) {
  const { t } = useTranslation();

  if (compact) {
    return (
      <div className="flex flex-wrap items-center justify-center gap-4 py-4">
        {complianceBadges.slice(0, 5).map((badge, index) => (
          <div
            key={index}
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full text-sm text-gray-700"
            title={badge.description}
          >
            <span>{badge.icon}</span>
            <span className="font-medium">{badge.name}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Enterprise-Grade Security & Compliance
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Your documents are protected by industry-leading security standards and compliance certifications.
          </p>
        </div>

        {/* Compliance Badges Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          {complianceBadges.map((badge, index) => (
            <div
              key={index}
              className="flex flex-col items-center p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all"
            >
              <span className="text-3xl mb-2">{badge.icon}</span>
              <h3 className="font-semibold text-gray-900 text-center">{badge.name}</h3>
              <p className="text-xs text-gray-500 text-center mt-1">{badge.description}</p>
            </div>
          ))}
        </div>

        {/* Security Features */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {securityFeatures.map((feature, index) => (
            <div key={index} className="text-center">
              <span className="text-4xl">{feature.icon}</span>
              <h3 className="font-semibold text-gray-900 mt-2">{feature.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Trust Statement */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            Signova is trusted by Fortune 500 companies, law firms, healthcare providers, and government agencies worldwide.
          </p>
        </div>
      </div>
    </section>
  );
}

export function FooterComplianceBadges() {
  return (
    <div className="border-t border-gray-200 pt-6 mt-6">
      <p className="text-xs text-gray-500 text-center mb-3">Security & Compliance</p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {complianceBadges.map((badge, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-xs text-gray-600"
            title={badge.description}
          >
            <span>{badge.icon}</span>
            {badge.name}
          </span>
        ))}
      </div>
    </div>
  );
}

export default ComplianceBadges;
