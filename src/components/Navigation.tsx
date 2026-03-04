import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { 
  Menu, 
  X, 
  ChevronDown,
  Shield,
  Sparkles,
  Lock,
  Plug,
  Users,
  Building2,
  Briefcase,
  Scale,
  Home as HomeIcon,
  HelpCircle,
  GitCompare,
  BookOpen,
  FileText,
  Award
} from "lucide-react";
import { useLocation } from "wouter";

interface NavItem {
  label: string;
  href?: string;
  icon?: any;
  items?: { label: string; href: string; icon: any; description: string }[];
}

const navigation: NavItem[] = [
  {
    label: "Product",
    items: [
      { 
        label: "Features", 
        href: "/#features", 
        icon: Sparkles,
        description: "Explore all platform capabilities"
      },
      { 
        label: "AI Document Generator", 
        href: "/generate", 
        icon: Sparkles,
        description: "Create legal documents with AI"
      },
      { 
        label: "Security & Compliance", 
        href: "/#security", 
        icon: Lock,
        description: "Bank-level encryption & SOC 2"
      },
      { 
        label: "Integrations", 
        href: "/#integrations", 
        icon: Plug,
        description: "Connect with your favorite tools"
      },
    ],
  },
  {
    label: "Solutions",
    items: [
      { 
        label: "For Individuals", 
        href: "/#individuals", 
        icon: Users,
        description: "Personal documents & signatures"
      },
      { 
        label: "For Small Business", 
        href: "/#small-business", 
        icon: Briefcase,
        description: "Streamline your contracts"
      },
      { 
        label: "For Enterprise", 
        href: "/#enterprise", 
        icon: Building2,
        description: "Advanced features & support"
      },
      { 
        label: "Legal & Compliance", 
        href: "/#legal", 
        icon: Scale,
        description: "For law firms & legal teams"
      },
      { 
        label: "Real Estate", 
        href: "/#real-estate", 
        icon: HomeIcon,
        description: "Leases, agreements & more"
      },
    ],
  },
  {
    label: "Pricing",
    href: "/pricing",
  },
  {
    label: "Resources",
    items: [
      { 
        label: "FAQ", 
        href: "/faq", 
        icon: HelpCircle,
        description: "Get answers to common questions"
      },
      { 
        label: "Compare", 
        href: "/comparison", 
        icon: GitCompare,
        description: "See how we stack up"
      },
      { 
        label: "Blog & Guides", 
        href: "/blog", 
        icon: BookOpen,
        description: "Legal insights & best practices"
      },
      { 
        label: "Templates", 
        href: "/generate", 
        icon: FileText,
        description: "Ready-to-use document templates"
      },
      { 
        label: "Case Studies", 
        href: "/blog", 
        icon: Award,
        description: "Success stories from customers"
      },
    ],
  },
  {
    label: "Contact",
    href: "/contact",
  },
];

export default function Navigation() {
  const [, navigate] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const handleNavClick = (href: string) => {
    if (href.startsWith('/#')) {
      navigate('/');
      setTimeout(() => {
        const element = document.querySelector(href.substring(1));
        element?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      navigate(href);
    }
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  };

  return (
    <nav className="overflow-x-hidden bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <img src="/signova-logo-white.png" alt="Signova AI" className="h-8 w-auto object-contain" />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navigation.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => item.items && setActiveDropdown(item.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                {item.href ? (
                  <Button
                    variant="ghost"
                    onClick={() => handleNavClick(item.href!)}
                    className="text-gray-700 hover:text-indigo-600 font-medium"
                  >
                    {item.label}
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    className="text-gray-700 hover:text-indigo-600 font-medium gap-1"
                  >
                    {item.label}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                )}

                {/* Dropdown Menu */}
                {item.items && activeDropdown === item.label && (
                  <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 py-2">
                    {item.items.map((subItem) => {
                      const Icon = subItem.icon;
                      return (
                        <button
                          key={subItem.label}
                          onClick={() => handleNavClick(subItem.href)}
                          className="w-full px-4 py-3 hover:bg-gray-50 flex items-start gap-3 text-left transition-colors"
                        >
                          <div className="h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Icon className="h-5 w-5 text-indigo-600" />
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900 mb-1">
                              {subItem.label}
                            </div>
                            <div className="text-sm text-gray-600">
                              {subItem.description}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={() => window.location.assign(getLoginUrl())}
              className="text-gray-700 hover:text-indigo-600 font-medium"
            >
              Sign In
            </Button>
            <Button
              onClick={() => navigate('/dashboard')}
              className="bg-gradient-to-r from-indigo-700 to-indigo-900 hover:from-indigo-700 hover:to-blue-700 text-white font-medium"
            >
              Get Started Free
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4 max-h-[calc(100vh-4rem)] overflow-y-auto">
            {navigation.map((item) => (
              <div key={item.label} className="mb-2">
                {item.href ? (
                  <button
                    onClick={() => handleNavClick(item.href!)}
                    className="w-full px-4 py-3 text-left font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
                  >
                    {item.label}
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => setActiveDropdown(
                        activeDropdown === item.label ? null : item.label
                      )}
                      className="w-full px-4 py-3 text-left font-medium text-gray-700 hover:bg-gray-50 rounded-lg flex items-center justify-between"
                    >
                      {item.label}
                      <ChevronDown 
                        className={`h-4 w-4 transition-transform ${
                          activeDropdown === item.label ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {activeDropdown === item.label && item.items && (
                      <div className="ml-4 mt-2 space-y-1">
                        {item.items.map((subItem) => {
                          const Icon = subItem.icon;
                          return (
                            <button
                              key={subItem.label}
                              onClick={() => handleNavClick(subItem.href)}
                              className="w-full px-4 py-3 text-left hover:bg-gray-50 rounded-lg flex items-start gap-3"
                            >
                              <div className="h-8 w-8 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Icon className="h-4 w-4 text-indigo-600" />
                              </div>
                              <div className="flex-1">
                                <div className="font-medium text-gray-900 text-sm">
                                  {subItem.label}
                                </div>
                                <div className="text-xs text-gray-600 mt-0.5">
                                  {subItem.description}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}

            {/* Mobile CTAs */}
            <div className="mt-6 px-4 space-y-3 border-t border-gray-200 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  window.location.assign('https://portal.signova.ai/login');
                  setMobileMenuOpen(false);
                }}
                className="w-full"
              >
                Sign In
              </Button>
              <Button
                onClick={() => {
                  navigate('/dashboard');
                  setMobileMenuOpen(false);
                }}
                className="w-full bg-gradient-to-r from-indigo-700 to-indigo-900 hover:from-indigo-700 hover:to-blue-700 text-white"
              >
                Get Started Free
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
