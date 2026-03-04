export const APP_LOGO = "/logo.svg";
export const APP_TITLE = "Signova AI";

export const getLoginUrl = () => {
  return "/login";
};

export const buildTemplateSignupPath = (templateId: string) => {
  return `/register?path=generate\&template=${encodeURIComponent(templateId)}`;
};

export const buildPlanSignupPath = (planKey: string, price?: string) => {
  const priceParam = price ? `\&price=${encodeURIComponent(price)}` : "";
  return `/register?plan=${encodeURIComponent(planKey)}${priceParam}`;
};

export const getSignupUrl = (plan?: string, price?: string) => {
  if (plan) {
    const planId = plan.toLowerCase();
    const priceParam = price || getPlanPrice(planId);
    return `/checkout?plan=${encodeURIComponent(planId)}&price=${encodeURIComponent(priceParam)}&type=subscription`;
  }
  return "/register";
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
