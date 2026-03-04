export const APP_LOGO = "/logo.svg";
export const APP_TITLE = "Signova AI";

// Portal base URL — all auth/checkout flows live here
const PORTAL_BASE = "https://portal.signova.ai";

export const getLoginUrl = () => {
  return `${PORTAL_BASE}/login`;
};

export const getRegisterUrl = () => {
  return `${PORTAL_BASE}/register`;
};

export const buildTemplateSignupPath = (templateId: string) => {
  return `${PORTAL_BASE}/register?path=generate&template=${encodeURIComponent(templateId)}`;
};

export const buildPlanSignupPath = (planKey: string, price?: string) => {
  const priceParam = price ? `&price=${encodeURIComponent(price)}` : "";
  return `${PORTAL_BASE}/register?plan=${encodeURIComponent(planKey)}${priceParam}`;
};

export const getSignupUrl = (plan?: string, price?: string) => {
  if (plan) {
    const planId = plan.toLowerCase();
    const priceParam = price || getPlanPrice(planId);
    return `${PORTAL_BASE}/register?plan=${encodeURIComponent(planId)}&price=${encodeURIComponent(priceParam)}`;
  }
  return `${PORTAL_BASE}/register`;
};

// Helper function to get default prices
function getPlanPrice(planId: string): string {
  const prices: Record<string, string> = {
    'free': '$0',
    'starter': '$19',
    'professional': '$49',
    'growth': '$99',
    'business': '$99',
    'scale': '$249',
    'enterprise': 'Custom',
  };
  return prices[planId] || '$0';
}
