class MyPartsRunnerWidget {
  constructor(config) {
    this.merchantId = config.merchantId;
    this.theme = config.theme || 'light';
    this.position = config.position || 'checkout';
    this.apiUrl = 'https://api.mypartsrunner.com/v1';
  }

  async init() {
    // Create widget container
    const container = document.createElement('div');
    container.id = 'mypartsrunner-widget';
    container.style.cssText = `
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;
      background: ${this.theme === 'light' ? '#ffffff' : '#1a1a1a'};
      color: ${this.theme === 'light' ? '#1a1a1a' : '#ffffff'};
      border: 1px solid ${this.theme === 'light' ? '#e5e7eb' : '#374151'};
      border-radius: 8px;
      padding: 16px;
      margin: 16px 0;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    `;

    // Add delivery option
    container.innerHTML = `
      <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
        <input type="radio" id="mypartsrunner-delivery" name="delivery-method" value="mypartsrunner">
        <div>
          <label for="mypartsrunner-delivery" style="font-weight: 600; display: block; margin-bottom: 4px;">
            Same-Day Delivery with MyPartsRunner
          </label>
          <span style="color: ${this.theme === 'light' ? '#6b7280' : '#9ca3af'}; font-size: 14px;">
            Fast, reliable delivery right to your location
          </span>
        </div>
      </div>
      <div id="mypartsrunner-details" style="display: none; padding: 12px; background: ${this.theme === 'light' ? '#f9fafb' : '#27272a'}; border-radius: 6px;">
        <div style="margin-bottom: 8px;">
          <div style="font-weight: 500; margin-bottom: 4px;">Estimated Delivery Time</div>
          <div id="mypartsrunner-eta" style="color: ${this.theme === 'light' ? '#059669' : '#34d399'}; font-size: 14px;">
            Calculating...
          </div>
        </div>
        <div>
          <div style="font-weight: 500; margin-bottom: 4px;">Delivery Fee</div>
          <div id="mypartsrunner-price" style="color: ${this.theme === 'light' ? '#059669' : '#34d399'}; font-size: 14px;">
            Calculating...
          </div>
        </div>
      </div>
    `;

    // Add event listeners
    const radio = container.querySelector('#mypartsrunner-delivery');
    const details = container.querySelector('#mypartsrunner-details');
    radio.addEventListener('change', (e) => {
      if (e.target.checked) {
        details.style.display = 'block';
        this.calculateDelivery();
      } else {
        details.style.display = 'none';
      }
    });

    // Insert widget into page
    const targetElement = document.querySelector(
      this.position === 'checkout' ? '#checkout-delivery-options, .checkout-delivery-options' : this.position
    );
    if (targetElement) {
      targetElement.appendChild(container);
    }
  }

  async calculateDelivery() {
    try {
      // Get store location from merchant config
      const storeLocation = await this.getStoreLocation();
      
      // Get customer location from checkout form
      const customerLocation = this.getCustomerLocation();

      // Calculate delivery estimate
      const estimate = await this.getDeliveryEstimate(storeLocation, customerLocation);

      // Update widget with estimate
      document.getElementById('mypartsrunner-eta').textContent = 
        `${estimate.duration} minutes`;
      document.getElementById('mypartsrunner-price').textContent = 
        `$${estimate.price.toFixed(2)}`;

    } catch (error) {
      console.error('Error calculating delivery:', error);
      document.getElementById('mypartsrunner-eta').textContent = 
        'Could not calculate delivery time';
      document.getElementById('mypartsrunner-price').textContent = 
        'Could not calculate price';
    }
  }

  async getStoreLocation() {
    const response = await fetch(`${this.apiUrl}/merchants/${this.merchantId}/location`);
    return response.json();
  }

  getCustomerLocation() {
    // This would need to be customized based on the merchant's checkout form structure
    const address = document.querySelector('[name="shipping_address"]')?.value;
    const city = document.querySelector('[name="shipping_city"]')?.value;
    const state = document.querySelector('[name="shipping_state"]')?.value;
    const zip = document.querySelector('[name="shipping_zip"]')?.value;

    return {
      address,
      city,
      state,
      zip
    };
  }

  async getDeliveryEstimate(pickup, dropoff) {
    const response = await fetch(`${this.apiUrl}/delivery/estimate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        merchantId: this.merchantId,
        pickup,
        dropoff
      })
    });

    return response.json();
  }
}

// Initialize widget when script loads
(function() {
  const script = document.currentScript;
  const config = {
    merchantId: script.getAttribute('data-merchant-id'),
    theme: script.getAttribute('data-theme'),
    position: script.getAttribute('data-position')
  };

  const widget = new MyPartsRunnerWidget(config);
  widget.init().catch(console.error);
})(); 