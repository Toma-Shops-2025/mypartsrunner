type EventType =
  | 'page_view'
  | 'search'
  | 'filter'
  | 'view_item'
  | 'add_to_favorites'
  | 'share_item'
  | 'contact_seller'
  | 'create_listing'
  | 'complete_listing'
  | 'view_video'
  | 'toggle_map_view'
  | 'error';

interface EventProperties {
  [key: string]: any;
}

class Analytics {
  private static instance: Analytics;
  private initialized: boolean = false;

  private constructor() {}

  public static getInstance(): Analytics {
    if (!Analytics.instance) {
      Analytics.instance = new Analytics();
    }
    return Analytics.instance;
  }

  public init() {
    if (this.initialized) return;

    // Initialize analytics services
    this.setupGoogleAnalytics();
    this.setupMixpanel();
    this.setupErrorTracking();

    this.initialized = true;
  }

  private setupGoogleAnalytics() {
    const gaId = import.meta.env.VITE_GA_MEASUREMENT_ID;
    if (!gaId) return;

    // Load Google Analytics script
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    script.async = true;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      window.dataLayer.push(args);
    }
    gtag('js', new Date());
    gtag('config', gaId);
  }

  private setupMixpanel() {
    const mixpanelToken = import.meta.env.VITE_MIXPANEL_TOKEN;
    if (!mixpanelToken) return;

    // Load Mixpanel script
    const script = document.createElement('script');
    script.src = 'https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js';
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.mixpanel.init(mixpanelToken, {
        debug: import.meta.env.DEV,
        track_pageview: true,
        persistence: 'localStorage'
      });
    };
  }

  private setupErrorTracking() {
    window.addEventListener('error', (event) => {
      this.trackEvent('error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error?.toString()
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.trackEvent('error', {
        type: 'unhandled_promise_rejection',
        reason: event.reason?.toString()
      });
    });
  }

  public trackEvent(eventType: EventType, properties: EventProperties = {}) {
    if (!this.initialized) {
      console.warn('Analytics not initialized');
      return;
    }

    // Add common properties
    const commonProps = {
      timestamp: new Date().toISOString(),
      url: window.location.href,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      ...properties
    };

    // Track in Google Analytics
    if (window.gtag) {
      window.gtag('event', eventType, commonProps);
    }

    // Track in Mixpanel
    if (window.mixpanel) {
      window.mixpanel.track(eventType, commonProps);
    }

    // Log to console in development
    if (import.meta.env.DEV) {
      console.log('[Analytics]', eventType, commonProps);
    }
  }

  public trackPageView(properties: EventProperties = {}) {
    this.trackEvent('page_view', {
      path: window.location.pathname,
      title: document.title,
      ...properties
    });
  }

  public trackSearch(query: string, results: number, filters?: object) {
    this.trackEvent('search', {
      query,
      results_count: results,
      filters
    });
  }

  public trackItemView(itemId: string, itemType: string, properties: EventProperties = {}) {
    this.trackEvent('view_item', {
      item_id: itemId,
      item_type: itemType,
      ...properties
    });
  }

  public trackError(error: Error, context: object = {}) {
    this.trackEvent('error', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      ...context
    });
  }
}

// Add type definitions for window object
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
    mixpanel: {
      init: (token: string, config?: object) => void;
      track: (event: string, properties?: object) => void;
    };
  }
}

export const analytics = Analytics.getInstance(); 