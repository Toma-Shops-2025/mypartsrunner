import { analytics } from './analytics';

interface PerformanceMetrics {
  timeToFirstByte?: number;
  firstContentfulPaint?: number;
  largestContentfulPaint?: number;
  firstInputDelay?: number;
  cumulativeLayoutShift?: number;
  timeToInteractive?: number;
  totalBlockingTime?: number;
  navigationTiming?: PerformanceNavigationTiming;
  resourceTiming?: PerformanceResourceTiming[];
  memoryUsage?: any;
}

interface LayoutShiftEntry extends PerformanceEntry {
  hadRecentInput: boolean;
  value: number;
}

class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private initialized: boolean = false;
  private observer: PerformanceObserver | null = null;

  private constructor() {}

  public static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  public init() {
    if (this.initialized || typeof window === 'undefined') return;

    // Initialize Core Web Vitals monitoring
    this.initCoreWebVitals();

    // Initialize Resource Timing monitoring
    this.initResourceTiming();

    // Initialize Memory monitoring
    this.initMemoryMonitoring();

    // Initialize Error monitoring
    this.initErrorMonitoring();

    // Initialize Network monitoring
    this.initNetworkMonitoring();

    this.initialized = true;
  }

  private initCoreWebVitals() {
    // First Contentful Paint (FCP)
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      if (entries.length > 0) {
        const fcp = entries[0];
        this.reportMetric('firstContentfulPaint', fcp.startTime);
      }
    }).observe({ entryTypes: ['paint'] });

    // Largest Contentful Paint (LCP)
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.reportMetric('largestContentfulPaint', lastEntry.startTime);
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // First Input Delay (FID)
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry) => {
        if (entry instanceof PerformanceEventTiming) {
          this.reportMetric('firstInputDelay', entry.processingStart - entry.startTime);
        }
      });
    }).observe({ entryTypes: ['first-input'] });

    // Cumulative Layout Shift (CLS)
    let clsValue = 0;
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry) => {
        const layoutShift = entry as LayoutShiftEntry;
        if (!layoutShift.hadRecentInput) {
          clsValue += layoutShift.value;
          this.reportMetric('cumulativeLayoutShift', clsValue);
        }
      });
    }).observe({ entryTypes: ['layout-shift'] });
  }

  private initResourceTiming() {
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry) => {
        if (entry.entryType === 'resource') {
          this.reportResourceTiming(entry as PerformanceResourceTiming);
        }
      });
    }).observe({ entryTypes: ['resource'] });
  }

  private initMemoryMonitoring() {
    if ((performance as any).memory) {
      setInterval(() => {
        this.reportMemoryUsage((performance as any).memory);
      }, 10000); // Every 10 seconds
    }
  }

  private initErrorMonitoring() {
    window.addEventListener('error', (event) => {
      this.reportError('runtime_error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.reportError('unhandled_promise', {
        reason: event.reason,
      });
    });
  }

  private initNetworkMonitoring() {
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const startTime = window.performance.now();
      try {
        const response = await originalFetch(...args);
        this.reportNetworkRequest({
          url: args[0].toString(),
          duration: window.performance.now() - startTime,
          status: response.status,
          success: response.ok,
        });
        return response;
      } catch (error) {
        this.reportNetworkRequest({
          url: args[0].toString(),
          duration: window.performance.now() - startTime,
          error: error.toString(),
          success: false,
        });
        throw error;
      }
    };
  }

  private reportMetric(name: string, value: number) {
    analytics.trackEvent('page_view', {
      metric_name: name,
      value,
      timestamp: Date.now(),
    });

    if (import.meta.env.DEV) {
      console.log(`[Performance] ${name}:`, value);
    }
  }

  private reportResourceTiming(entry: PerformanceResourceTiming) {
    analytics.trackEvent('page_view', {
      name: entry.name,
      entry_type: entry.entryType,
      start_time: entry.startTime,
      duration: entry.duration,
      transfer_size: entry.transferSize,
      encoded_body_size: entry.encodedBodySize,
      decoded_body_size: entry.decodedBodySize,
    });
  }

  private reportMemoryUsage(memory: any) {
    analytics.trackEvent('page_view', {
      used_js_heap_size: memory.usedJSHeapSize,
      total_js_heap_size: memory.totalJSHeapSize,
      js_heap_size_limit: memory.jsHeapSizeLimit,
    });
  }

  private reportError(type: string, details: object) {
    analytics.trackEvent('error', {
      error_type: type,
      ...details,
      timestamp: Date.now(),
    });
  }

  private reportNetworkRequest(details: {
    url: string;
    duration: number;
    status?: number;
    error?: string;
    success: boolean;
  }) {
    analytics.trackEvent('page_view', {
      ...details,
      timestamp: Date.now(),
    });
  }
}

export const performance = PerformanceMonitor.getInstance(); 