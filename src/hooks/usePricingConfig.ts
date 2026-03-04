/**
 * usePricingConfig — SSOT pricing configuration hook
 * 
 * Fetches the single authoritative pricing config from the server.
 * All frontend components that need to know about:
 *   - Whether Free plan exists
 *   - What CTA text to show
 *   - Whether to show "no credit card required"
 *   - Which tiers to render
 * 
 * ...MUST use this hook. No hardcoding.
 */

import { useState, useEffect } from 'react';

export interface PricingTier {
  id: number;
  tier_name: string;
  tier_key: string;
  display_name: string;
  monthly_price: string | number;
  annual_price: string | number;
  stripe_monthly_price_id: string;
  stripe_annual_price_id: string;
  active: boolean;
  show_on_pricing_page: boolean;
  sort_order: number;
  features?: string;
}

export interface PricingFlags {
  freePlanEnabled: boolean;
  trialEnabled: boolean;
  creditCardRequired: boolean;
  trialDays: number;
  primaryCtaText: string;
  trialCtaText: string;
  defaultCtaText: string;
}

export interface PricingConfig {
  flags: PricingFlags;
  tiers: PricingTier[];
}

interface UsePricingConfigResult {
  config: PricingConfig | null;
  flags: PricingFlags | null;
  tiers: PricingTier[];
  loading: boolean;
  error: string | null;
  // Convenience helpers
  freePlanEnabled: boolean;
  trialEnabled: boolean;
  creditCardRequired: boolean;
  primaryCtaText: string;
  showNoCreditCardCopy: boolean;
  showFreeForeverCopy: boolean;
}

// Module-level cache to avoid re-fetching on every component mount
let cachedConfig: PricingConfig | null = null;
let cacheTimestamp = 0;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export function usePricingConfig(): UsePricingConfigResult {
  const [config, setConfig] = useState<PricingConfig | null>(cachedConfig);
  const [loading, setLoading] = useState(!cachedConfig);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const now = Date.now();
    if (cachedConfig && (now - cacheTimestamp) < CACHE_TTL_MS) {
      setConfig(cachedConfig);
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch('/api/pricing/config')
      .then(r => {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(data => {
        const cfg: PricingConfig = {
          flags: data.flags,
          tiers: data.tiers || [],
        };
        cachedConfig = cfg;
        cacheTimestamp = Date.now();
        setConfig(cfg);
        setLoading(false);
      })
      .catch(err => {
        console.error('[usePricingConfig] Failed to load pricing config:', err);
        setError('Unable to load pricing configuration');
        setLoading(false);
      });
  }, []);

  const flags = config?.flags ?? null;
  const freePlanEnabled = flags?.freePlanEnabled ?? false;
  const trialEnabled = flags?.trialEnabled ?? true;
  const creditCardRequired = flags?.creditCardRequired ?? true;
  // Override: Never show trial language in CTAs
  const rawCtaText = flags?.primaryCtaText ?? 'Get Started Free';
  const primaryCtaText = (rawCtaText.toLowerCase().includes('trial') || rawCtaText.toLowerCase().includes('14-day'))
    ? 'Get Started Free'
    : rawCtaText;

  return {
    config,
    flags,
    tiers: config?.tiers ?? [],
    loading,
    error,
    freePlanEnabled,
    trialEnabled,
    creditCardRequired,
    primaryCtaText,
    // "No credit card required" copy should only show if CC is NOT required
    showNoCreditCardCopy: !creditCardRequired,
    // "Free forever" copy should only show if free plan is enabled
    showFreeForeverCopy: freePlanEnabled,
  };
}
