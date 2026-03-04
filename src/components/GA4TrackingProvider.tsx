/**
 * GA4 Tracking Provider
 * Automatically tracks user activity and sets up enhanced analytics
 */

import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/_core/hooks/useAuth';
import { ga4Tracker } from '@/lib/ga4-tracking';

export function GA4TrackingProvider({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { user, isAuthenticated } = useAuth();

  // Update user tracking data when authentication state changes
  useEffect(() => {
    if (isAuthenticated && user) {
      ga4Tracker.setUser({
        userId: user.id?.toString(),
        email: user.email,
        subscriptionTier: user.subscription_tier || 'free',
        isLoggedIn: true
      });
    } else {
      ga4Tracker.clearUser();
    }
  }, [isAuthenticated, user]);

  // Track page views on route changes
  useEffect(() => {
    ga4Tracker.trackPageView(location);
  }, [location]);

  return <>{children}</>;
}
