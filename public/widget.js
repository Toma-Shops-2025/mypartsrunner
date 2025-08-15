/**
 * MyPartsRunner Delivery Widget
 * Universal widget that can be embedded on any merchant website
 * Automatically detects products and provides instant delivery options
 */

(function() {
  'use strict';

  // Default configuration
  const defaultConfig = {
    storeId: null,
    buttonText: 'DELIVER WITH MYPARTSRUNNER',
    buttonColor: '#2563eb',
    position: 'bottom-right',
    showEstimatedTime: true,
    showPricing: true,
    autoDetectProducts: true,
    apiEndpoint: 'https://mypartsrunner.com/api',
    widgetEndpoint: 'https://mypartsrunner.com/widget'
  };

  // Merge user config with defaults
  const config = Object.assign({}, defaultConfig, window.MyPartsRunnerConfig || {});

  // Widget state
  let widget = null;
  let isVisible = false;
  let detectedProducts = [];
  let deliveryEstimate = null;

  /**
   * Initialize the widget
   */
  function init() {
    if (!config.storeId) {
      console.error('MyPartsRunner Widget: storeId is required');
      return;
    }

    createWidget();
    if (config.autoDetectProducts) {
      detectProducts();
    }
    setupEventListeners();
    
    console.log('MyPartsRunner Widget initialized for store:', config.storeId);
  }

  /**
   * Create the widget UI
   */
  function createWidget() {
    // Create widget container
    widget = document.createElement('div');
    widget.id = 'mypartsrunner-widget';
    widget.style.cssText = `
      position: fixed;
      z-index: 999999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      ${getPositionStyles()}
    `;

    // Create the main button
    const button = document.createElement('button');
    button.id = 'mypartsrunner-button';
    button.innerHTML = `
      <span class="icon">🚚</span>
      <span class="text">${config.buttonText}</span>
      ${config.showEstimatedTime ? '<span class="time">Fast Delivery</span>' : ''}
    `;
    button.style.cssText = `
      background: ${config.buttonColor};
      color: white;
      border: none;
      border-radius: 8px;
      padding: 12px 16px;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      min-width: 200px;
    `;

    // Add hover effects
    button.addEventListener('mouseenter', () => {
      button.style.transform = 'translateY(-2px)';
      button.style.boxShadow = '0 6px 16px rgba(0,0,0,0.3)';
    });

    button.addEventListener('mouseleave', () => {
      button.style.transform = 'translateY(0)';
      button.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
    });

    // Add click handler
    button.addEventListener('click', openDeliveryModal);

    widget.appendChild(button);
    document.body.appendChild(widget);

    // Create delivery info popup
    if (config.showEstimatedTime || config.showPricing) {
      createInfoPopup();
    }
  }

  /**
   * Get position styles based on config
   */
  function getPositionStyles() {
    const positions = {
      'bottom-right': 'bottom: 20px; right: 20px;',
      'bottom-left': 'bottom: 20px; left: 20px;',
      'top-right': 'top: 20px; right: 20px;',
      'top-left': 'top: 20px; left: 20px;'
    };
    return positions[config.position] || positions['bottom-right'];
  }

  /**
   * Create info popup for delivery estimates
   */
  function createInfoPopup() {
    const popup = document.createElement('div');
    popup.id = 'mypartsrunner-popup';
    popup.style.cssText = `
      position: absolute;
      background: white;
      border: 1px solid #e5e5e5;
      border-radius: 8px;
      padding: 16px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.1);
      min-width: 280px;
      display: none;
      ${config.position.includes('bottom') ? 'bottom: 100%; margin-bottom: 8px;' : 'top: 100%; margin-top: 8px;'}
      ${config.position.includes('right') ? 'right: 0;' : 'left: 0;'}
    `;

    popup.innerHTML = `
      <div style="display: flex; align-items: center; margin-bottom: 12px;">
        <div style="width: 40px; height: 40px; background: ${config.buttonColor}; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 12px;">
          <span style="color: white; font-size: 20px;">🚚</span>
        </div>
        <div>
          <div style="font-weight: 600; color: #1f2937;">Fast Delivery Available</div>
          <div style="font-size: 12px; color: #6b7280;">Powered by MyPartsRunner</div>
        </div>
      </div>
      <div id="delivery-info">
        ${config.showEstimatedTime ? '<div style="margin-bottom: 8px; font-size: 14px; color: #374151;"><strong>⚡ Estimated:</strong> 1-2 hours</div>' : ''}
        ${config.showPricing ? '<div style="margin-bottom: 8px; font-size: 14px; color: #374151;"><strong>💰 Delivery:</strong> $4.99</div>' : ''}
        <div style="font-size: 12px; color: #6b7280;">Available for detected products</div>
      </div>
      <div style="border-top: 1px solid #e5e5e5; margin-top: 12px; padding-top: 12px;">
        <button id="close-popup" style="background: none; border: none; color: #6b7280; font-size: 12px; cursor: pointer; float: right;">Close</button>
        <div style="clear: both;"></div>
      </div>
    `;

    widget.appendChild(popup);

    // Show popup on button hover
    const button = widget.querySelector('#mypartsrunner-button');
    let hoverTimeout;

    button.addEventListener('mouseenter', () => {
      clearTimeout(hoverTimeout);
      hoverTimeout = setTimeout(() => {
        popup.style.display = 'block';
      }, 500);
    });

    widget.addEventListener('mouseleave', () => {
      clearTimeout(hoverTimeout);
      popup.style.display = 'none';
    });

    // Close popup button
    popup.querySelector('#close-popup').addEventListener('click', () => {
      popup.style.display = 'none';
    });
  }

  /**
   * Detect products on the current page
   */
  function detectProducts() {
    detectedProducts = [];

    // Common product detection patterns
    const productSelectors = [
      '[data-product-id]',
      '[data-product-sku]',
      '.product',
      '.product-item',
      '.product-card',
      '[itemtype*="Product"]',
      '.woocommerce-product',
      '.shopify-product',
      '.magento-product'
    ];

    // Look for product elements
    productSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        const product = extractProductInfo(element);
        if (product) {
          detectedProducts.push(product);
        }
      });
    });

    // Try to detect from page content
    if (detectedProducts.length === 0) {
      detectFromPageContent();
    }

    console.log('MyPartsRunner: Detected', detectedProducts.length, 'products');
    
    // Update widget based on detected products
    updateWidgetForProducts();
  }

  /**
   * Extract product information from element
   */
  function extractProductInfo(element) {
    const product = {};

    // Try to get product ID
    product.id = element.getAttribute('data-product-id') || 
                 element.getAttribute('data-sku') || 
                 element.getAttribute('data-product-sku');

    // Try to get product name
    const nameElement = element.querySelector('h1, h2, h3, .product-title, .product-name, [itemprop="name"]') || element;
    product.name = nameElement.textContent?.trim();

    // Try to get price
    const priceElement = element.querySelector('.price, .product-price, [itemprop="price"]');
    if (priceElement) {
      const priceText = priceElement.textContent?.trim();
      const priceMatch = priceText?.match(/[\d,]+\.?\d*/);
      if (priceMatch) {
        product.price = parseFloat(priceMatch[0].replace(',', ''));
      }
    }

    // Try to get image
    const imgElement = element.querySelector('img');
    if (imgElement) {
      product.image = imgElement.src;
    }

    // Only return if we have at least name or ID
    return (product.name || product.id) ? product : null;
  }

  /**
   * Detect products from page content
   */
  function detectFromPageContent() {
    // Look for auto parts keywords in the page title and content
    const autoPartsKeywords = [
      'brake', 'oil', 'filter', 'battery', 'tire', 'engine', 'transmission',
      'alternator', 'starter', 'radiator', 'muffler', 'headlight', 'taillight',
      'suspension', 'shock', 'strut', 'bearing', 'gasket', 'belt', 'hose'
    ];

    const pageText = document.body.textContent?.toLowerCase() || '';
    const pageTitle = document.title?.toLowerCase() || '';

    let foundKeywords = [];
    autoPartsKeywords.forEach(keyword => {
      if (pageText.includes(keyword) || pageTitle.includes(keyword)) {
        foundKeywords.push(keyword);
      }
    });

    if (foundKeywords.length > 0) {
      // Create a generic product based on page content
      detectedProducts.push({
        id: 'page-product',
        name: document.title || 'Auto Part',
        category: 'auto-parts',
        keywords: foundKeywords
      });
    }
  }

  /**
   * Update widget appearance based on detected products
   */
  function updateWidgetForProducts() {
    const button = widget.querySelector('#mypartsrunner-button');
    
    if (detectedProducts.length > 0) {
      // Show count if multiple products
      if (detectedProducts.length > 1) {
        const badge = document.createElement('span');
        badge.style.cssText = `
          position: absolute;
          top: -8px;
          right: -8px;
          background: #ef4444;
          color: white;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          font-size: 11px;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
        `;
        badge.textContent = detectedProducts.length;
        button.style.position = 'relative';
        button.appendChild(badge);
      }

      // Update delivery estimate
      updateDeliveryEstimate();
    }
  }

  /**
   * Update delivery estimate
   */
  function updateDeliveryEstimate() {
    // Mock delivery calculation
    deliveryEstimate = {
      time: '1-2 hours',
      price: 4.99,
      available: true
    };

    // Update popup content if it exists
    const popup = widget.querySelector('#mypartsrunner-popup');
    if (popup) {
      const infoDiv = popup.querySelector('#delivery-info');
      infoDiv.innerHTML = `
        ${config.showEstimatedTime ? `<div style="margin-bottom: 8px; font-size: 14px; color: #374151;"><strong>⚡ Estimated:</strong> ${deliveryEstimate.time}</div>` : ''}
        ${config.showPricing ? `<div style="margin-bottom: 8px; font-size: 14px; color: #374151;"><strong>💰 Delivery:</strong> $${deliveryEstimate.price}</div>` : ''}
        <div style="font-size: 12px; color: #6b7280;">${detectedProducts.length} product(s) detected</div>
      `;
    }
  }

  /**
   * Open delivery modal
   */
  function openDeliveryModal() {
    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.id = 'mypartsrunner-modal-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      z-index: 1000000;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;

    // Create modal content
    const modal = document.createElement('div');
    modal.style.cssText = `
      background: white;
      border-radius: 16px;
      padding: 32px;
      max-width: 500px;
      width: 90%;
      max-height: 80vh;
      overflow-y: auto;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    `;

    modal.innerHTML = `
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="width: 60px; height: 60px; background: ${config.buttonColor}; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
          <span style="color: white; font-size: 24px;">🚚</span>
        </div>
        <h2 style="margin: 0; font-size: 24px; font-weight: 700; color: #1f2937;">Fast Delivery Available!</h2>
        <p style="margin: 8px 0 0 0; color: #6b7280;">Get your parts delivered in ${deliveryEstimate?.time || '1-2 hours'}</p>
      </div>

      <div id="detected-products" style="margin-bottom: 24px;">
        <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px; color: #374151;">Products for Delivery:</h3>
        ${generateProductsList()}
      </div>

      <div style="background: #f9fafb; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span>Delivery Fee:</span>
          <span style="font-weight: 600;">$${deliveryEstimate?.price || '4.99'}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span>Estimated Time:</span>
          <span style="font-weight: 600;">${deliveryEstimate?.time || '1-2 hours'}</span>
        </div>
        <div style="font-size: 12px; color: #6b7280; margin-top: 8px;">
          * Final pricing determined at checkout
        </div>
      </div>

      <div style="display: flex; gap: 12px;">
        <button id="proceed-delivery" style="
          flex: 1;
          background: ${config.buttonColor};
          color: white;
          border: none;
          border-radius: 8px;
          padding: 12px 24px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        ">
          Order Delivery
        </button>
        <button id="close-modal" style="
          background: #f3f4f6;
          color: #374151;
          border: none;
          border-radius: 8px;
          padding: 12px 24px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        ">
          Cancel
        </button>
      </div>

      <div style="text-align: center; margin-top: 16px;">
        <p style="font-size: 12px; color: #6b7280; margin: 0;">
          Powered by <strong>MyPartsRunner</strong> • Fast & Reliable Delivery
        </p>
      </div>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Event listeners
    overlay.querySelector('#close-modal').addEventListener('click', () => {
      document.body.removeChild(overlay);
    });

    overlay.querySelector('#proceed-delivery').addEventListener('click', () => {
      proceedToDelivery();
      document.body.removeChild(overlay);
    });

    // Close on overlay click
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        document.body.removeChild(overlay);
      }
    });

    // Track modal open
    trackEvent('widget_modal_opened', {
      storeId: config.storeId,
      productsDetected: detectedProducts.length,
      page: window.location.href
    });
  }

  /**
   * Generate products list HTML
   */
  function generateProductsList() {
    if (detectedProducts.length === 0) {
      return '<div style="text-align: center; color: #6b7280; padding: 20px;">No products detected on this page</div>';
    }

    return detectedProducts.slice(0, 5).map(product => `
      <div style="display: flex; align-items: center; padding: 8px; border: 1px solid #e5e7eb; border-radius: 6px; margin-bottom: 8px;">
        ${product.image ? `<img src="${product.image}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px; margin-right: 12px;" alt="${product.name}">` : '<div style="width: 40px; height: 40px; background: #f3f4f6; border-radius: 4px; margin-right: 12px; display: flex; align-items: center; justify-content: center;"><span style="font-size: 16px;">📦</span></div>'}
        <div style="flex: 1;">
          <div style="font-weight: 500; color: #374151;">${product.name || 'Auto Part'}</div>
          ${product.price ? `<div style="font-size: 14px; color: #6b7280;">$${product.price}</div>` : ''}
        </div>
        <div style="color: #059669; font-size: 12px; font-weight: 600;">✓ Available</div>
      </div>
    `).join('') + (detectedProducts.length > 5 ? `<div style="text-align: center; color: #6b7280; font-size: 12px;">+${detectedProducts.length - 5} more products</div>` : '');
  }

  /**
   * Proceed to delivery checkout
   */
  function proceedToDelivery() {
    const deliveryUrl = `${config.widgetEndpoint}/checkout?store=${config.storeId}&products=${encodeURIComponent(JSON.stringify(detectedProducts))}&return=${encodeURIComponent(window.location.href)}`;
    
    // Open in new window/tab
    window.open(deliveryUrl, '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');

    // Track conversion
    trackEvent('widget_conversion', {
      storeId: config.storeId,
      productsDetected: detectedProducts.length,
      page: window.location.href,
      totalValue: detectedProducts.reduce((sum, p) => sum + (p.price || 0), 0)
    });
  }

  /**
   * Track analytics events
   */
  function trackEvent(eventName, data) {
    try {
      fetch(`${config.apiEndpoint}/analytics/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event: eventName,
          data: data,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          referrer: document.referrer
        })
      }).catch(() => {
        // Fail silently for analytics
      });
    } catch (error) {
      // Fail silently for analytics
    }
  }

  /**
   * Setup event listeners for dynamic content
   */
  function setupEventListeners() {
    // Re-detect products when page content changes
    if (config.autoDetectProducts) {
      const observer = new MutationObserver(() => {
        detectProducts();
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    }

    // Track page views
    trackEvent('widget_loaded', {
      storeId: config.storeId,
      page: window.location.href,
      userAgent: navigator.userAgent
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose API for manual control
  window.MyPartsRunnerWidget = {
    detectProducts: detectProducts,
    showModal: openDeliveryModal,
    hide: () => {
      if (widget) widget.style.display = 'none';
    },
    show: () => {
      if (widget) widget.style.display = 'block';
    },
    updateConfig: (newConfig) => {
      Object.assign(config, newConfig);
      if (widget) {
        document.body.removeChild(widget);
        createWidget();
      }
    }
  };

})(); 