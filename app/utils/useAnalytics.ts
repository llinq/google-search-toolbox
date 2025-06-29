import { useEffect } from 'react';
import { useLocation } from '@remix-run/react';
import { trackPageView, trackEvent, trackCustomEvent } from './analytics';

export const useAnalytics = () => {
  const location = useLocation();

  // Track page views automatically
  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location]);

  return {
    trackEvent,
    trackCustomEvent,
    trackPageView: () => trackPageView(location.pathname + location.search),
  };
}; 