/**
 * Enhanced GA4 Tracking Utility
 * Provides separate tracking for public website vs user dashboard portal
 */

// Extend window object to include gtag
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

export interface UserTrackingData {
  userId?: string;
  email?: string;
  subscriptionTier?: 'free' | 'starter' | 'professional' | 'enterprise';
  isLoggedIn: boolean;
}

export class GA4Tracker {
  private static instance: GA4Tracker;
  private userdata: UserTrackingData = { isLoggedIn: false };

  private constructor() {
    // Initialize tracking
    this.setupPageTracking();
  }

  public static getInstance(): GA4Tracker {
    if (!GA4Tracker.instance) {
      GA4Tracker.instance = new GA4Tracker();
    }
    return GA4Tracker.instance;
  }

  /**
   * Set user data for tracking
   */
  public setUser(userData: UserTrackingData) {
    this.userdata = userData;

    if (window.gtag && userData.isLoggedIn) {
      // Set user ID for cross-session tracking
      window.gtag('config', 'G-9TWH5FG0CG', {
        user_id: userData.userId,
        user_properties: {
          subscription_tier: userData.subscriptionTier || 'free',
          user_type: 'logged_in_user'
        }
      });
    } else if (window.gtag) {
      // Mark as visitor (not logged in)
      window.gtag('config', 'G-9TWH5FG0CG', {
        user_properties: {
          user_type: 'visitor'
        }
      });
    }
  }

  /**
   * Clear user data on logout
   */
  public clearUser() {
    this.userdata = { isLoggedIn: false };
    if (window.gtag) {
      window.gtag('config', 'G-9TWH5FG0CG', {
        user_properties: {
          user_type: 'visitor'
        }
      });
    }
  }

  /**
   * Track page views with context
   */
  public trackPageView(pagePath: string, pageTitle?: string) {
    if (!window.gtag) return;

    const isPublicPage = this.isPublicPage(pagePath);
    const isDashboardPage = this.isDashboardPage(pagePath);

    window.gtag('event', 'page_view', {
      page_path: pagePath,
      page_title: pageTitle || document.title,
      page_type: isPublicPage ? 'public' : isDashboardPage ? 'dashboard' : 'other',
      user_status: this.userdata.isLoggedIn ? 'logged_in' : 'visitor',
      subscription_tier: this.userdata.subscriptionTier || 'none'
    });
  }

  /**
   * Track custom events
   */
  public trackEvent(eventName: string, eventParams?: Record<string, any>) {
    if (!window.gtag) return;

    window.gtag('event', eventName, {
      ...eventParams,
      user_status: this.userdata.isLoggedIn ? 'logged_in' : 'visitor',
      subscription_tier: this.userdata.subscriptionTier || 'none'
    });
  }

  /**
   * Track document-related events
   */
  public trackDocumentEvent(action: 'created' | 'signed' | 'uploaded' | 'viewed', documentId?: string) {
    this.trackEvent(`document_${action}`, {
      document_id: documentId,
      event_category: 'document',
      event_label: action
    });
  }

  /**
   * Track template usage
   */
  public trackTemplateUsed(templateName: string, templateId?: string) {
    this.trackEvent('template_used', {
      template_name: templateName,
      template_id: templateId,
      event_category: 'template',
      event_label: templateName
    });
  }

  /**
   * Track AI generation
   */
  public trackAIGeneration(documentType: string, success: boolean) {
    this.trackEvent('ai_generation', {
      document_type: documentType,
      success: success,
      event_category: 'ai',
      event_label: documentType
    });
  }

  /**
   * Track subscription events
   */
  public trackSubscriptionEvent(action: 'upgraded' | 'downgraded' | 'cancelled', tier: string) {
    this.trackEvent(`subscription_${action}`, {
      subscription_tier: tier,
      event_category: 'subscription',
      event_label: action
    });
  }

  /**
   * Track conversion events
   */
  public trackConversion(conversionType: 'signup' | 'first_document' | 'subscription_purchase', value?: number) {
    this.trackEvent('conversion', {
      conversion_type: conversionType,
      value: value,
      currency: 'USD',
      event_category: 'conversion',
      event_label: conversionType
    });
  }

  /**
   * Setup automatic page view tracking for SPA
   */
  private setupPageTracking() {
    // Track initial page load
    this.trackPageView(window.location.pathname);

    // Track route changes in React Router
    let lastPath = window.location.pathname;
    setInterval(() => {
      const currentPath = window.location.pathname;
      if (currentPath !== lastPath) {
        lastPath = currentPath;
        this.trackPageView(currentPath);
      }
    }, 500);
  }

  /**
   * Check if page is a public marketing page
   */
  private isPublicPage(path: string): boolean {
    const publicPaths = [
      '/',
      '/pricing',
      '/features',
      '/comparison',
      '/how-it-works',
      '/faq',
      '/contact',
      '/blog',
      '/security',
      '/terms',
      '/privacy',
      '/login'
    ];
    return publicPaths.some(p => path === p || path.startsWith(p + '/'));
  }

  /**
   * Check if page is a user dashboard page
   */
  private isDashboardPage(path: string): boolean {
    const dashboardPaths = [
      '/dashboard',
      '/documents',
      '/templates',
      '/settings',
      '/profile',
      '/subscription',
      '/generate',
      '/sign',
      '/upload',
      '/editor'
    ];
    return dashboardPaths.some(p => path.startsWith(p));
  }


  /**
   * Track savings calculator usage
   */
  public trackCalculatorUsed(competitorName: string, envelopes: number, annualSavings: number) {
    this.trackEvent('calculator_used', {
      competitor_name: competitorName,
      envelopes_per_month: envelopes,
      annual_savings_usd: Math.round(annualSavings),
      event_category: 'conversion',
      event_label: competitorName
    });
  }

  /**
   * Track plan recommendation shown
   */
  public trackPlanRecommended(plan: string, price: string, answers: Record<string, string>) {
    this.trackEvent('plan_recommended', {
      recommended_plan: plan,
      plan_price: price,
      docs_per_month: answers.docs || 'unknown',
      team_size: answers.team || 'unknown',
      needs_ai: answers.ai || 'unknown',
      event_category: 'conversion',
      event_label: plan
    });
  }
}
// Export singleton instance
export const ga4Tracker = GA4Tracker.getInstance();
