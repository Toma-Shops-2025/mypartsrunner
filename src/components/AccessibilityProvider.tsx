import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Accessibility, 
  Eye, 
  EyeOff, 
  Volume2, 
  VolumeX, 
  MousePointer, 
  Keyboard,
  Type,
  Contrast,
  X,
  Settings,
  RotateCcw
} from 'lucide-react';

interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
  audioDescriptions: boolean;
  focusVisible: boolean;
  colorBlindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
  fontSize: number; // percentage
  lineHeight: number; // multiplier
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSetting: <K extends keyof AccessibilitySettings>(key: K, value: AccessibilitySettings[K]) => void;
  resetSettings: () => void;
  announceToScreenReader: (message: string) => void;
  isAccessibilityMenuOpen: boolean;
  toggleAccessibilityMenu: () => void;
}

const defaultSettings: AccessibilitySettings = {
  highContrast: false,
  largeText: false,
  reducedMotion: false,
  screenReader: false,
  keyboardNavigation: true,
  audioDescriptions: false,
  focusVisible: true,
  colorBlindMode: 'none',
  fontSize: 100,
  lineHeight: 1.5
};

const AccessibilityContext = createContext<AccessibilityContextType | null>(null);

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
};

interface AccessibilityProviderProps {
  children: React.ReactNode;
}

export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);
  const [isAccessibilityMenuOpen, setIsAccessibilityMenuOpen] = useState(false);

  // Load settings from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('mypartsrunner_accessibility');
      if (saved) {
        const savedSettings = JSON.parse(saved);
        setSettings({ ...defaultSettings, ...savedSettings });
      }
    } catch (error) {
      console.error('Failed to load accessibility settings:', error);
    }
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('mypartsrunner_accessibility', JSON.stringify(settings));
    applySettings(settings);
  }, [settings]);

  // Apply accessibility settings to the document
  const applySettings = useCallback((settings: AccessibilitySettings) => {
    const root = document.documentElement;
    
    // High contrast mode
    root.classList.toggle('high-contrast', settings.highContrast);
    
    // Large text
    root.classList.toggle('large-text', settings.largeText);
    
    // Reduced motion
    root.classList.toggle('reduced-motion', settings.reducedMotion);
    
    // Focus visible
    root.classList.toggle('focus-visible', settings.focusVisible);
    
    // Font size
    root.style.setProperty('--accessibility-font-size', `${settings.fontSize}%`);
    
    // Line height
    root.style.setProperty('--accessibility-line-height', settings.lineHeight.toString());
    
    // Color blind mode
    root.className = root.className.replace(/colorblind-\w+/g, '');
    if (settings.colorBlindMode !== 'none') {
      root.classList.add(`colorblind-${settings.colorBlindMode}`);
    }

    // Keyboard navigation
    if (settings.keyboardNavigation) {
      enableKeyboardNavigation();
    }

    // Screen reader announcements
    if (settings.screenReader) {
      enableScreenReaderSupport();
    }
  }, []);

  // Enable keyboard navigation
  const enableKeyboardNavigation = useCallback(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Skip links with Alt + S
      if (event.altKey && event.key === 's') {
        event.preventDefault();
        const skipLink = document.querySelector('[data-skip-link]') as HTMLElement;
        if (skipLink) {
          skipLink.focus();
          skipLink.click();
        }
      }

      // Accessibility menu with Alt + A
      if (event.altKey && event.key === 'a') {
        event.preventDefault();
        setIsAccessibilityMenuOpen(prev => !prev);
      }

      // Escape to close modals/menus
      if (event.key === 'Escape') {
        setIsAccessibilityMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Enable screen reader support
  const enableScreenReaderSupport = useCallback(() => {
    // Add aria-live region for announcements
    let liveRegion = document.getElementById('accessibility-announcements');
    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.id = 'accessibility-announcements';
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.className = 'sr-only';
      document.body.appendChild(liveRegion);
    }
  }, []);

  // Update a single setting
  const updateSetting = useCallback(<K extends keyof AccessibilitySettings>(
    key: K, 
    value: AccessibilitySettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  // Reset all settings
  const resetSettings = useCallback(() => {
    setSettings(defaultSettings);
  }, []);

  // Announce message to screen reader
  const announceToScreenReader = useCallback((message: string) => {
    const liveRegion = document.getElementById('accessibility-announcements');
    if (liveRegion) {
      liveRegion.textContent = message;
    }
  }, []);

  // Toggle accessibility menu
  const toggleAccessibilityMenu = useCallback(() => {
    setIsAccessibilityMenuOpen(prev => !prev);
  }, []);

  return (
    <AccessibilityContext.Provider
      value={{
        settings,
        updateSetting,
        resetSettings,
        announceToScreenReader,
        isAccessibilityMenuOpen,
        toggleAccessibilityMenu
      }}
    >
      {children}
      <AccessibilityMenu />
      <SkipLinks />
    </AccessibilityContext.Provider>
  );
};

// Skip links component
const SkipLinks: React.FC = () => {
  return (
    <div className="skip-links">
      <a 
        href="#main-content" 
        data-skip-link
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-blue-600 focus:text-white focus:px-4 focus:py-2 focus:rounded"
      >
        Skip to main content
      </a>
      <a 
        href="#navigation" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-32 focus:z-50 focus:bg-blue-600 focus:text-white focus:px-4 focus:py-2 focus:rounded"
      >
        Skip to navigation
      </a>
    </div>
  );
};

// Accessibility menu component
const AccessibilityMenu: React.FC = () => {
  const { 
    settings, 
    updateSetting, 
    resetSettings, 
    isAccessibilityMenuOpen, 
    toggleAccessibilityMenu,
    announceToScreenReader
  } = useAccessibility();

  if (!isAccessibilityMenuOpen) {
    return (
      <Button
        onClick={toggleAccessibilityMenu}
        className="fixed bottom-4 right-4 z-50 rounded-full w-14 h-14 bg-blue-600 hover:bg-blue-700 shadow-lg"
        aria-label="Open accessibility options"
        title="Accessibility Options (Alt + A)"
      >
        <Accessibility className="h-6 w-6 text-white" />
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Accessibility className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-bold">Accessibility Options</h2>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={toggleAccessibilityMenu}
              aria-label="Close accessibility menu"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="space-y-6">
            {/* Visual Settings */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Visual
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-medium">High Contrast</label>
                    <p className="text-sm text-gray-600">Increase contrast for better visibility</p>
                  </div>
                  <Button
                    variant={settings.highContrast ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      updateSetting('highContrast', !settings.highContrast);
                      announceToScreenReader(`High contrast ${!settings.highContrast ? 'enabled' : 'disabled'}`);
                    }}
                  >
                    <Contrast className="h-4 w-4 mr-2" />
                    {settings.highContrast ? 'On' : 'Off'}
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-medium">Large Text</label>
                    <p className="text-sm text-gray-600">Increase text size for better readability</p>
                  </div>
                  <Button
                    variant={settings.largeText ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      updateSetting('largeText', !settings.largeText);
                      announceToScreenReader(`Large text ${!settings.largeText ? 'enabled' : 'disabled'}`);
                    }}
                  >
                    <Type className="h-4 w-4 mr-2" />
                    {settings.largeText ? 'On' : 'Off'}
                  </Button>
                </div>

                <div>
                  <label className="font-medium block mb-2">Font Size: {settings.fontSize}%</label>
                  <input
                    type="range"
                    min="75"
                    max="200"
                    step="25"
                    value={settings.fontSize}
                    onChange={(e) => updateSetting('fontSize', parseInt(e.target.value))}
                    className="w-full"
                    aria-label="Font size slider"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>75%</span>
                    <span>100%</span>
                    <span>125%</span>
                    <span>150%</span>
                    <span>200%</span>
                  </div>
                </div>

                <div>
                  <label className="font-medium block mb-2">Color Blind Support</label>
                  <select
                    value={settings.colorBlindMode}
                    onChange={(e) => updateSetting('colorBlindMode', e.target.value as AccessibilitySettings['colorBlindMode'])}
                    className="w-full p-2 border rounded"
                    aria-label="Color blind mode selection"
                  >
                    <option value="none">None</option>
                    <option value="protanopia">Protanopia (Red-blind)</option>
                    <option value="deuteranopia">Deuteranopia (Green-blind)</option>
                    <option value="tritanopia">Tritanopia (Blue-blind)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Motion Settings */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <MousePointer className="h-5 w-5" />
                Motion & Animation
              </h3>
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium">Reduced Motion</label>
                  <p className="text-sm text-gray-600">Minimize animations and transitions</p>
                </div>
                <Button
                  variant={settings.reducedMotion ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    updateSetting('reducedMotion', !settings.reducedMotion);
                    announceToScreenReader(`Reduced motion ${!settings.reducedMotion ? 'enabled' : 'disabled'}`);
                  }}
                >
                  {settings.reducedMotion ? 'On' : 'Off'}
                </Button>
              </div>
            </div>

            {/* Interaction Settings */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Keyboard className="h-5 w-5" />
                Interaction
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-medium">Keyboard Navigation</label>
                    <p className="text-sm text-gray-600">Navigate using keyboard shortcuts</p>
                  </div>
                  <Button
                    variant={settings.keyboardNavigation ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateSetting('keyboardNavigation', !settings.keyboardNavigation)}
                  >
                    <Keyboard className="h-4 w-4 mr-2" />
                    {settings.keyboardNavigation ? 'On' : 'Off'}
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-medium">Focus Indicators</label>
                    <p className="text-sm text-gray-600">Show visible focus outlines</p>
                  </div>
                  <Button
                    variant={settings.focusVisible ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateSetting('focusVisible', !settings.focusVisible)}
                  >
                    {settings.focusVisible ? 'On' : 'Off'}
                  </Button>
                </div>
              </div>
            </div>

            {/* Screen Reader Settings */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Volume2 className="h-5 w-5" />
                Screen Reader
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-medium">Screen Reader Support</label>
                    <p className="text-sm text-gray-600">Enhanced support for screen readers</p>
                  </div>
                  <Button
                    variant={settings.screenReader ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateSetting('screenReader', !settings.screenReader)}
                  >
                    {settings.screenReader ? <Volume2 className="h-4 w-4 mr-2" /> : <VolumeX className="h-4 w-4 mr-2" />}
                    {settings.screenReader ? 'On' : 'Off'}
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-medium">Audio Descriptions</label>
                    <p className="text-sm text-gray-600">Audio descriptions for visual content</p>
                  </div>
                  <Button
                    variant={settings.audioDescriptions ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateSetting('audioDescriptions', !settings.audioDescriptions)}
                  >
                    {settings.audioDescriptions ? 'On' : 'Off'}
                  </Button>
                </div>
              </div>
            </div>

            {/* Keyboard Shortcuts Info */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Keyboard Shortcuts</h4>
              <div className="text-sm text-blue-700 space-y-1">
                <div><kbd className="bg-blue-200 px-2 py-1 rounded">Alt + A</kbd> - Toggle accessibility menu</div>
                <div><kbd className="bg-blue-200 px-2 py-1 rounded">Alt + S</kbd> - Skip to main content</div>
                <div><kbd className="bg-blue-200 px-2 py-1 rounded">Esc</kbd> - Close menus and modals</div>
                <div><kbd className="bg-blue-200 px-2 py-1 rounded">Tab</kbd> - Navigate between elements</div>
              </div>
            </div>

            {/* Reset Button */}
            <div className="pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  resetSettings();
                  announceToScreenReader('Accessibility settings reset to defaults');
                }}
                className="w-full"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset to Defaults
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccessibilityProvider; 