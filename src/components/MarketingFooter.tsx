import { Link } from "wouter";
import { APP_LOGO } from "@/const";
import { FooterComplianceBadges } from "@/ComplianceBadges";

export default function MarketingFooter() {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Product",
      links: [
        { name: "Features", path: "/features" },
        { name: "Security", path: "/security" },
        { name: "Templates", path: "/templates" },
        { name: "Pricing", path: "/pricing" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About Us (Coming Soon)", path: "#" },
        { name: "Careers (Coming Soon)", path: "#" },
        { name: "Blog", path: "/blog" },
        { name: "Contact", path: "/contact" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", path: "/privacy" },
        { name: "Terms of Service", path: "/terms" },
        { name: "Compliance (Coming Soon)", path: "#" },
      ],
    },
    {
      title: "Support",
      links: [
        { name: "Help Center (Coming Soon)", path: "#" },
        { name: "Documentation (Coming Soon)", path: "#" },
        { name: "Sign API (Coming Soon)", path: "#" },
        { name: "Contact Support", path: "/contact" },
      ],
    },
  ];

  return (
    <footer className="border-t bg-muted/30">
      <div className="container py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-8">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/">
              <a className="flex items-center gap-2 mb-4">
                <img src="/signova-logo-hires.png" alt="Signova AI" className="h-8 w-auto object-contain" />
                <span className="text-lg font-bold">Signova AI</span>
              </a>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              Secure, AI-powered e-signature platform for modern businesses.
            </p>
            {/* Language Selector in Footer */}
            <div className="mt-4">

            </div>
          </div>

          {/* Links Columns */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.path}>
                    <Link href={link.path}>
                      <a className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        {link.name}
                      </a>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Compliance Badges */}
        <FooterComplianceBadges />

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© {currentYear} Signova AI. All rights reserved.</p>
          <p className="mt-2 text-xs">
            Trusted by businesses in 180+ countries worldwide
          </p>
        </div>
      </div>
    </footer>
  );
}
