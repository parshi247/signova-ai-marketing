import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { APP_LOGO, getLoginUrl, getSignupUrl } from "@/const";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function MarketingNav() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Features", path: "/features" },
    { name: "Security", path: "/enterprise" },
    { name: "Templates", path: "/templates" },
    { name: "Pricing", path: "/pricing" },
    { name: "Contact", path: "/contact" },
  ];

  const isActive = (path: string) => {
    if (path === "/") return location === "/";
    return location.startsWith(path);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-[#0f172a] shadow-md">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <a className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img src="/signova-logo-white.png" alt="Signova AI" className="h-8 w-auto object-contain" />
            
          </a>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link key={item.path} href={item.path}>
              <a
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive(item.path)
                    ? "text-white font-semibold"
                    : "text-slate-300"
                }`}
              >
                {item.name}
              </a>
            </Link>
          ))}
        </div>

        {/* Desktop CTA Buttons */}
        <div className="hidden md:flex items-center gap-4">

          <a href="/register">
            <Button variant="ghost" className="text-white hover:text-white hover:bg-white/10">Login</Button>
          </a>
          <a href="/register">
            <Button>Get Started</Button>
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
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
        <div className="md:hidden border-t">
          <div className="container py-4 space-y-4">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <a
                  className={`block py-2 text-sm font-medium transition-colors hover:text-primary ${
                    isActive(item.path)
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </a>
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-4 border-t">
              <div className="py-2">

              </div>
              <a href="/register">
                <Button variant="ghost" className="w-full">
                  Login
                </Button>
              </a>
              <a href="/register">
                <Button className="w-full">Get Started</Button>
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
