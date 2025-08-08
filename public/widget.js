/**
 * MyPartsRunner Delivery Widget
 * Embed this script on your website to add delivery functionality
 */

(function() {
  'use strict';

  // Widget configuration
  let config = {
    storeId: null,
    theme: 'light',
    position: 'bottom-right',
    apiUrl: 'https://mypartsrunner.com/api',
    widgetId: 'mypartsrunner-widget'
  };

  // Widget state
  let widgetState = {
    isOpen: false,
    currentOrder: null,
    customerInfo: null
  };

  // Create widget styles
  function createStyles() {
    const styleId = 'mypartsrunner-widget-styles';
    if (document.getElementById(styleId)) return;

    const styles = `
      .mypartsrunner-widget {
        position: fixed;
        z-index: 9999;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 14px;
        line-height: 1.4;
      }

      .mypartsrunner-widget.bottom-right {
        bottom: 20px;
        right: 20px;
      }

      .mypartsrunner-widget.bottom-left {
        bottom: 20px;
        left: 20px;
      }

      .mypartsrunner-widget.top-right {
        top: 20px;
        right: 20px;
      }

      .mypartsrunner-widget.top-left {
        top: 20px;
        left: 20px;
      }

      .mypartsrunner-delivery-btn {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 8px;
        padding: 12px 24px;
        font-weight: 600;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .mypartsrunner-delivery-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
      }

      .mypartsrunner-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 10000;
        display: none;
        align-items: center;
        justify-content: center;
      }

      .mypartsrunner-modal.open {
        display: flex;
      }

      .mypartsrunner-modal-content {
        background: white;
        border-radius: 12px;
        padding: 24px;
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
      }

      .mypartsrunner-modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        padding-bottom: 16px;
        border-bottom: 1px solid #e5e7eb;
      }

      .mypartsrunner-modal-title {
        font-size: 20px;
        font-weight: 700;
        color: #1f2937;
      }

      .mypartsrunner-modal-close {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #6b7280;
        padding: 4px;
      }

      .mypartsrunner-form-group {
        margin-bottom: 16px;
      }

      .mypartsrunner-label {
        display: block;
        margin-bottom: 4px;
        font-weight: 500;
        color: #374151;
      }

      .mypartsrunner-input {
        width: 100%;
        padding: 8px 12px;
        border: 1px solid #d1d5db;
        border-radius: 6px;
        font-size: 14px;
      }

      .mypartsrunner-input:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
      }

      .mypartsrunner-btn {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 6px;
        padding: 12px 24px;
        font-weight: 600;
        cursor: pointer;
        width: 100%;
        margin-top: 16px;
      }

      .mypartsrunner-btn:hover {
        opacity: 0.9;
      }

      .mypartsrunner-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .mypartsrunner-success {
        text-align: center;
        padding: 24px;
      }

      .mypartsrunner-success-icon {
        font-size: 48px;
        color: #10b981;
        margin-bottom: 16px;
      }

      .mypartsrunner-error {
        color: #dc2626;
        font-size: 14px;
        margin-top: 4px;
      }

      .mypartsrunner-loading {
        text-align: center;
        padding: 24px;
      }

      .mypartsrunner-spinner {
        border: 2px solid #f3f4f6;
        border-top: 2px solid #667eea;
        border-radius: 50%;
        width: 24px;
        height: 24px;
        animation: spin 1s linear infinite;
        margin: 0 auto 16px;
      }

      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;

    const styleElement = document.createElement('style');
    styleElement.id = styleId;
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);
  }

  // Create delivery button
  function createDeliveryButton() {
    const button = document.createElement('button');
    button.className = 'mypartsrunner-delivery-btn';
    button.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M3 3h18v18H3zM9 9h6v6H9z"/>
        <path d="M9 3v18M15 3v18"/>
      </svg>
      GET IT DELIVERED
    `;
    button.addEventListener('click', openModal);
    return button;
  }

  // Create modal
  function createModal() {
    const modal = document.createElement('div');
    modal.className = 'mypartsrunner-modal';
    modal.innerHTML = `
      <div class="mypartsrunner-modal-content">
        <div class="mypartsrunner-modal-header">
          <h2 class="mypartsrunner-modal-title">Get It Delivered</h2>
          <button class="mypartsrunner-modal-close" onclick="window.MyPartsRunner.closeModal()">&times;</button>
        </div>
        <div id="mypartsrunner-form">
          <div class="mypartsrunner-form-group">
            <label class="mypartsrunner-label">Full Name</label>
            <input type="text" class="mypartsrunner-input" id="customer-name" required>
          </div>
          <div class="mypartsrunner-form-group">
            <label class="mypartsrunner-label">Email</label>
            <input type="email" class="mypartsrunner-input" id="customer-email" required>
          </div>
          <div class="mypartsrunner-form-group">
            <label class="mypartsrunner-label">Phone</label>
            <input type="tel" class="mypartsrunner-input" id="customer-phone" required>
          </div>
          <div class="mypartsrunner-form-group">
            <label class="mypartsrunner-label">Delivery Address</label>
            <input type="text" class="mypartsrunner-input" id="delivery-address" required>
          </div>
          <div class="mypartsrunner-form-group">
            <label class="mypartsrunner-label">City</label>
            <input type="text" class="mypartsrunner-input" id="delivery-city" required>
          </div>
          <div class="mypartsrunner-form-group">
            <label class="mypartsrunner-label">State</label>
            <input type="text" class="mypartsrunner-input" id="delivery-state" required>
          </div>
          <div class="mypartsrunner-form-group">
            <label class="mypartsrunner-label">ZIP Code</label>
            <input type="text" class="mypartsrunner-input" id="delivery-zip" required>
          </div>
          <div class="mypartsrunner-form-group">
            <label class="mypartsrunner-label">Delivery Notes (Optional)</label>
            <textarea class="mypartsrunner-input" id="delivery-notes" rows="3"></textarea>
          </div>
          <button class="mypartsrunner-btn" onclick="window.MyPartsRunner.submitOrder()">
            Request Delivery
          </button>
        </div>
      </div>
    `;
    return modal;
  }

  // Open modal
  function openModal() {
    const modal = document.querySelector('.mypartsrunner-modal');
    if (modal) {
      modal.classList.add('open');
      widgetState.isOpen = true;
    }
  }

  // Close modal
  function closeModal() {
    const modal = document.querySelector('.mypartsrunner-modal');
    if (modal) {
      modal.classList.remove('open');
      widgetState.isOpen = false;
    }
  }

  // Submit order
  async function submitOrder() {
    const form = document.getElementById('mypartsrunner-form');
    const submitBtn = form.querySelector('.mypartsrunner-btn');
    
    // Get form data
    const orderData = {
      storeId: config.storeId,
      externalOrderId: 'ORDER_' + Date.now(),
      customerName: document.getElementById('customer-name').value,
      customerEmail: document.getElementById('customer-email').value,
      customerPhone: document.getElementById('customer-phone').value,
      deliveryAddress: document.getElementById('delivery-address').value,
      deliveryCity: document.getElementById('delivery-city').value,
      deliveryState: document.getElementById('delivery-state').value,
      deliveryZipCode: document.getElementById('delivery-zip').value,
      deliveryNotes: document.getElementById('delivery-notes').value,
      items: getCurrentPageItems(),
      subtotal: calculateSubtotal(),
      tax: 0,
      deliveryFee: 5.99,
      total: calculateSubtotal() + 5.99
    };

    // Validate form
    if (!validateForm(orderData)) {
      return;
    }

    // Show loading
    submitBtn.disabled = true;
    submitBtn.textContent = 'Processing...';
    form.innerHTML = `
      <div class="mypartsrunner-loading">
        <div class="mypartsrunner-spinner"></div>
        <p>Processing your delivery request...</p>
      </div>
    `;

    try {
      // Send order to MyPartsRunner
      const response = await fetch(`${config.apiUrl}/external-orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        const result = await response.json();
        showSuccess(result);
      } else {
        throw new Error('Failed to create order');
      }
    } catch (error) {
      showError('Failed to process delivery request. Please try again.');
    }
  }

  // Validate form
  function validateForm(data) {
    const required = ['customerName', 'customerEmail', 'customerPhone', 'deliveryAddress', 'deliveryCity', 'deliveryState', 'deliveryZipCode'];
    
    for (const field of required) {
      if (!data[field]) {
        showError(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }

    if (!isValidEmail(data.customerEmail)) {
      showError('Please enter a valid email address');
      return false;
    }

    return true;
  }

  // Get current page items (placeholder - would need to be customized per site)
  function getCurrentPageItems() {
    // This is a placeholder - in a real implementation, you'd need to
    // detect the current page's products and extract their information
    return [
      {
        name: 'Product from this page',
        quantity: 1,
        price: 0.00
      }
    ];
  }

  // Calculate subtotal
  function calculateSubtotal() {
    const items = getCurrentPageItems();
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  // Show success message
  function showSuccess(result) {
    const modal = document.querySelector('.mypartsrunner-modal-content');
    modal.innerHTML = `
      <div class="mypartsrunner-success">
        <div class="mypartsrunner-success-icon">✓</div>
        <h3>Delivery Request Submitted!</h3>
        <p>Your delivery request has been received. We'll contact you shortly to confirm your order.</p>
        <p><strong>Order ID:</strong> ${result.orderId}</p>
        <button class="mypartsrunner-btn" onclick="window.MyPartsRunner.closeModal()">Close</button>
      </div>
    `;
  }

  // Show error message
  function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'mypartsrunner-error';
    errorDiv.textContent = message;
    
    const form = document.getElementById('mypartsrunner-form');
    form.appendChild(errorDiv);
    
    setTimeout(() => {
      errorDiv.remove();
    }, 5000);
  }

  // Utility functions
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Initialize widget
  function init(options = {}) {
    // Merge options with defaults
    config = { ...config, ...options };
    
    // Create styles
    createStyles();
    
    // Create and append delivery button
    const button = createDeliveryButton();
    const widgetContainer = document.getElementById(config.widgetId);
    
    if (widgetContainer) {
      widgetContainer.className = `mypartsrunner-widget ${config.position}`;
      widgetContainer.appendChild(button);
    }
    
    // Create and append modal
    const modal = createModal();
    document.body.appendChild(modal);
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }

  // Public API
  window.MyPartsRunner = {
    init,
    openModal,
    closeModal,
    submitOrder
  };

})(); 