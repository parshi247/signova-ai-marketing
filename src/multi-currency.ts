// Multi-currency support for Signova - targeting 51 Stripe-supported countries

export interface CurrencyConfig {
  code: string;
  symbol: string;
  name: string;
  locale: string;
  stripePriceIds?: {
    starter_monthly?: string;
    starter_yearly?: string;
    professional_monthly?: string;
    professional_yearly?: string;
    enterprise_monthly?: string;
    enterprise_yearly?: string;
  };
}

// Currency configurations for major markets with LIVE Stripe Price IDs
export const currencies: Record<string, CurrencyConfig> = {
  USD: { 
    code: 'USD', symbol: '$', name: 'US Dollar', locale: 'en-US',
    stripePriceIds: {
      starter_monthly: 'price_1Sb8yeBMcX9zVrDCGx3QmfPS',
      starter_yearly: 'price_1Sb8yfBMcX9zVrDCt15FLzlB',
      professional_monthly: 'price_1SFwYmBMcX9zVrDC5Gd7mOkZ',
      professional_yearly: 'price_1Sb8yfBMcX9zVrDChP080h5O',
      enterprise_monthly: 'price_1SFwZ1BMcX9zVrDCcTSt58eO',
    }
  },
  EUR: { 
    code: 'EUR', symbol: '€', name: 'Euro', locale: 'de-DE',
    stripePriceIds: {
      starter_monthly: 'price_1SkyOeBMcX9zVrDCwcha0WLP',
      professional_monthly: 'price_1SkyOyBMcX9zVrDCtOLLpFkJ',
      enterprise_monthly: 'price_1SkyPIBMcX9zVrDCXwc01tru',
    }
  },
  GBP: { 
    code: 'GBP', symbol: '£', name: 'British Pound', locale: 'en-GB',
    stripePriceIds: {
      starter_monthly: 'price_1SkyOgBMcX9zVrDCBt09Em5I',
      professional_monthly: 'price_1SkyP0BMcX9zVrDCAxaY4huc',
      enterprise_monthly: 'price_1SkyPLBMcX9zVrDCu7oBhenW',
    }
  },
  CAD: { 
    code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', locale: 'en-CA',
    stripePriceIds: {
      starter_monthly: 'price_1SkyOjBMcX9zVrDCLwt1fXWW',
      professional_monthly: 'price_1SkyP3BMcX9zVrDCfnXMVKR5',
      enterprise_monthly: 'price_1SkyPOBMcX9zVrDCFe2kbSEx',
    }
  },
  AUD: { 
    code: 'AUD', symbol: 'A$', name: 'Australian Dollar', locale: 'en-AU',
    stripePriceIds: {
      starter_monthly: 'price_1SkyOmBMcX9zVrDCwlK1YDCF',
      professional_monthly: 'price_1SkyP6BMcX9zVrDCHgoK2iYq',
      enterprise_monthly: 'price_1SkyPQBMcX9zVrDC7zRkr80g',
    }
  },
  JPY: { 
    code: 'JPY', symbol: '¥', name: 'Japanese Yen', locale: 'ja-JP',
    stripePriceIds: {
      starter_monthly: 'price_1SkyOoBMcX9zVrDCUc9DcJar',
      professional_monthly: 'price_1SkyP9BMcX9zVrDCce81H6jl',
      enterprise_monthly: 'price_1SkyPTBMcX9zVrDCCCj9MAP3',
    }
  },
  CHF: { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc', locale: 'de-CH' },
  SEK: { code: 'SEK', symbol: 'kr', name: 'Swedish Krona', locale: 'sv-SE' },
  NOK: { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone', locale: 'nb-NO' },
  DKK: { code: 'DKK', symbol: 'kr', name: 'Danish Krone', locale: 'da-DK' },
  NZD: { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar', locale: 'en-NZ' },
  SGD: { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', locale: 'en-SG' },
  HKD: { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar', locale: 'zh-HK' },
  MXN: { code: 'MXN', symbol: 'MX$', name: 'Mexican Peso', locale: 'es-MX' },
  BRL: { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', locale: 'pt-BR' },
  INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee', locale: 'en-IN' },
  PLN: { code: 'PLN', symbol: 'zł', name: 'Polish Zloty', locale: 'pl-PL' },
  CZK: { code: 'CZK', symbol: 'Kč', name: 'Czech Koruna', locale: 'cs-CZ' },
  HUF: { code: 'HUF', symbol: 'Ft', name: 'Hungarian Forint', locale: 'hu-HU' },
  RON: { code: 'RON', symbol: 'lei', name: 'Romanian Leu', locale: 'ro-RO' },
  BGN: { code: 'BGN', symbol: 'лв', name: 'Bulgarian Lev', locale: 'bg-BG' },
  AED: { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', locale: 'ar-AE' },
  SAR: { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal', locale: 'ar-SA' },
  ZAR: { code: 'ZAR', symbol: 'R', name: 'South African Rand', locale: 'en-ZA' },
  THB: { code: 'THB', symbol: '฿', name: 'Thai Baht', locale: 'th-TH' },
  MYR: { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit', locale: 'ms-MY' },
  PHP: { code: 'PHP', symbol: '₱', name: 'Philippine Peso', locale: 'en-PH' },
  IDR: { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah', locale: 'id-ID' },
  KRW: { code: 'KRW', symbol: '₩', name: 'South Korean Won', locale: 'ko-KR' },
  TWD: { code: 'TWD', symbol: 'NT$', name: 'Taiwan Dollar', locale: 'zh-TW' },
};

// Country to currency mapping
export const countryToCurrency: Record<string, string> = {
  US: 'USD', CA: 'CAD', MX: 'MXN',
  GB: 'GBP', IE: 'EUR', DE: 'EUR', FR: 'EUR', ES: 'EUR', IT: 'EUR', NL: 'EUR', BE: 'EUR', AT: 'EUR', PT: 'EUR', FI: 'EUR', GR: 'EUR', LU: 'EUR', MT: 'EUR', CY: 'EUR', SK: 'EUR', SI: 'EUR', EE: 'EUR', LV: 'EUR', LT: 'EUR',
  CH: 'CHF', SE: 'SEK', NO: 'NOK', DK: 'DKK', PL: 'PLN', CZ: 'CZK', HU: 'HUF', RO: 'RON', BG: 'BGN',
  AU: 'AUD', NZ: 'NZD', SG: 'SGD', HK: 'HKD', JP: 'JPY', KR: 'KRW', TW: 'TWD', TH: 'THB', MY: 'MYR', PH: 'PHP', ID: 'IDR', IN: 'INR',
  BR: 'BRL', AE: 'AED', SA: 'SAR', ZA: 'ZAR',
};

// Detect user's country from various sources
export async function detectUserCountry(): Promise<string> {
  try {
    // Try IP-based geolocation
    const response = await fetch('https://ipapi.co/json/', { 
      signal: AbortSignal.timeout(3000) 
    });
    const data = await response.json();
    return data.country_code || 'US';
  } catch {
    // Fallback to browser language
    const lang = navigator.language || 'en-US';
    const country = lang.split('-')[1]?.toUpperCase();
    return country && countryToCurrency[country] ? country : 'US';
  }
}

// Get currency for a country
export function getCurrencyForCountry(countryCode: string): CurrencyConfig {
  const currencyCode = countryToCurrency[countryCode] || 'USD';
  return currencies[currencyCode] || currencies.USD;
}

// Format price in local currency
export function formatPrice(amount: number, currencyCode: string): string {
  const currency = currencies[currencyCode] || currencies.USD;
  return new Intl.NumberFormat(currency.locale, {
    style: 'currency',
    currency: currency.code,
    minimumFractionDigits: currency.code === 'JPY' || currency.code === 'KRW' ? 0 : 2,
    maximumFractionDigits: currency.code === 'JPY' || currency.code === 'KRW' ? 0 : 2,
  }).format(amount);
}

// Convert USD price to local currency (approximate rates)
const exchangeRates: Record<string, number> = {
  USD: 1, EUR: 0.92, GBP: 0.79, CAD: 1.36, AUD: 1.53, JPY: 149, CHF: 0.88,
  SEK: 10.5, NOK: 10.8, DKK: 6.9, NZD: 1.64, SGD: 1.34, HKD: 7.82, MXN: 17.2,
  BRL: 4.97, INR: 83.1, PLN: 4.0, CZK: 23.1, HUF: 358, RON: 4.6, BGN: 1.8,
  AED: 3.67, SAR: 3.75, ZAR: 18.8, THB: 35.5, MYR: 4.7, PHP: 55.8, IDR: 15700,
  KRW: 1320, TWD: 31.5,
};

export function convertFromUSD(usdAmount: number, targetCurrency: string): number {
  const rate = exchangeRates[targetCurrency] || 1;
  return Math.round(usdAmount * rate * 100) / 100;
}

// Pricing tiers in USD (base prices)
export const basePricing = {
  starter: { monthly: 9, yearly: 86 },
  professional: { monthly: 35, yearly: 336 },
  enterprise: { monthly: 75, yearly: 720 },
};

// Fixed prices for currencies with native Stripe support
export const nativePricing: Record<string, Record<string, Record<string, number>>> = {
  EUR: {
    starter: { monthly: 8 },
    professional: { monthly: 32 },
    enterprise: { monthly: 69 },
  },
  GBP: {
    starter: { monthly: 7 },
    professional: { monthly: 28 },
    enterprise: { monthly: 59 },
  },
  CAD: {
    starter: { monthly: 12 },
    professional: { monthly: 48 },
    enterprise: { monthly: 102 },
  },
  AUD: {
    starter: { monthly: 14 },
    professional: { monthly: 54 },
    enterprise: { monthly: 115 },
  },
  JPY: {
    starter: { monthly: 1300 },
    professional: { monthly: 5200 },
    enterprise: { monthly: 11200 },
  },
};

// Get Stripe price ID for a plan and currency
export function getStripePriceId(plan: string, billingPeriod: string, currencyCode: string): string | null {
  const currency = currencies[currencyCode];
  if (!currency?.stripePriceIds) {
    // Fallback to USD
    const usdCurrency = currencies.USD;
    const key = `${plan}_${billingPeriod}` as keyof typeof usdCurrency.stripePriceIds;
    return usdCurrency.stripePriceIds?.[key] || null;
  }
  
  const key = `${plan}_${billingPeriod}` as keyof typeof currency.stripePriceIds;
  return currency.stripePriceIds[key] || currencies.USD.stripePriceIds?.[key] || null;
}

// Get localized pricing
export function getLocalizedPricing(currencyCode: string) {
  const currency = currencies[currencyCode] || currencies.USD;
  const native = nativePricing[currencyCode];
  
  if (native) {
    // Use native pricing for supported currencies
    return {
      starter: {
        monthly: formatPrice(native.starter.monthly, currencyCode),
        yearly: formatPrice(native.starter.monthly * 10, currencyCode), // 2 months free
        monthlyRaw: native.starter.monthly,
      },
      professional: {
        monthly: formatPrice(native.professional.monthly, currencyCode),
        yearly: formatPrice(native.professional.monthly * 10, currencyCode),
        monthlyRaw: native.professional.monthly,
      },
      enterprise: {
        monthly: formatPrice(native.enterprise.monthly, currencyCode),
        yearly: formatPrice(native.enterprise.monthly * 10, currencyCode),
        monthlyRaw: native.enterprise.monthly,
      },
      currency,
      hasNativePricing: true,
    };
  }
  
  // Convert from USD for other currencies
  return {
    starter: {
      monthly: formatPrice(convertFromUSD(basePricing.starter.monthly, currencyCode), currencyCode),
      yearly: formatPrice(convertFromUSD(basePricing.starter.yearly, currencyCode), currencyCode),
      monthlyRaw: convertFromUSD(basePricing.starter.monthly, currencyCode),
    },
    professional: {
      monthly: formatPrice(convertFromUSD(basePricing.professional.monthly, currencyCode), currencyCode),
      yearly: formatPrice(convertFromUSD(basePricing.professional.yearly, currencyCode), currencyCode),
      monthlyRaw: convertFromUSD(basePricing.professional.monthly, currencyCode),
    },
    enterprise: {
      monthly: formatPrice(convertFromUSD(basePricing.enterprise.monthly, currencyCode), currencyCode),
      yearly: formatPrice(convertFromUSD(basePricing.enterprise.yearly, currencyCode), currencyCode),
      monthlyRaw: convertFromUSD(basePricing.enterprise.monthly, currencyCode),
    },
    currency,
    hasNativePricing: false,
  };
}

// React hook for currency detection
import { useState, useEffect } from 'react';

export function useCurrency() {
  const [currency, setCurrency] = useState<CurrencyConfig>(currencies.USD);
  const [country, setCountry] = useState<string>('US');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    detectUserCountry().then((detectedCountry) => {
      setCountry(detectedCountry);
      setCurrency(getCurrencyForCountry(detectedCountry));
      setLoading(false);
    });
  }, []);

  const changeCurrency = (currencyCode: string) => {
    if (currencies[currencyCode]) {
      setCurrency(currencies[currencyCode]);
    }
  };

  return {
    currency,
    country,
    loading,
    changeCurrency,
    pricing: getLocalizedPricing(currency.code),
    formatPrice: (amount: number) => formatPrice(amount, currency.code),
    getStripePriceId: (plan: string, billingPeriod: string) => getStripePriceId(plan, billingPeriod, currency.code),
  };
}

// Supported currencies for UI selection (currencies with native Stripe prices)
export const SUPPORTED_CURRENCIES = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY'];

export default useCurrency;
