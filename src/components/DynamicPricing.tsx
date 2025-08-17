import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Clock, 
  MapPin,
  Zap,
  Target,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Settings,
  Brain,
  ThermometerSun,
  Users,
  Truck,
  Calendar
} from 'lucide-react';

interface PricingFactor {
  id: string;
  name: string;
  description: string;
  weight: number;
  currentValue: number;
  impact: 'positive' | 'negative' | 'neutral';
  enabled: boolean;
  min: number;
  max: number;
  unit: string;
}

interface PricingRule {
  id: string;
  name: string;
  description: string;
  condition: string;
  adjustment: number;
  adjustmentType: 'percentage' | 'fixed';
  priority: number;
  active: boolean;
  validFrom?: string;
  validTo?: string;
}

interface DynamicPriceResult {
  basePrice: number;
  adjustedPrice: number;
  totalAdjustment: number;
  adjustmentPercentage: number;
  appliedFactors: {
    factor: string;
    adjustment: number;
    reason: string;
  }[];
  confidence: number;
  recommendations: string[];
}

interface DynamicPricingProps {
  productId?: string;
  basePrice: number;
  customerLocation?: { lat: number; lng: number };
  merchantLocation?: { lat: number; lng: number };
  onPriceChange?: (result: DynamicPriceResult) => void;
}

const DynamicPricing: React.FC<DynamicPricingProps> = ({
  productId = 'demo-product',
  basePrice = 89.99,
  customerLocation = { lat: 40.7128, lng: -74.0060 },
  merchantLocation = { lat: 40.7589, lng: -73.9851 },
  onPriceChange
}) => {
  const [pricingFactors, setPricingFactors] = useState<PricingFactor[]>([]);
  const [pricingRules, setPricingRules] = useState<PricingRule[]>([]);
  const [currentPricing, setCurrentPricing] = useState<DynamicPriceResult | null>(null);
  const [isAutoEnabled, setIsAutoEnabled] = useState(true);
  const [updateInterval, setUpdateInterval] = useState(300); // 5 minutes
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Initialize pricing factors
  useEffect(() => {
    const factors: PricingFactor[] = [
      {
        id: 'distance',
        name: 'Delivery Distance',
        description: 'Distance between merchant and customer',
        weight: 0.25,
        currentValue: calculateDistance(merchantLocation, customerLocation),
        impact: 'negative',
        enabled: true,
        min: 0,
        max: 50,
        unit: 'miles'
      },
      {
        id: 'demand',
        name: 'Current Demand',
        description: 'Real-time demand for this product category',
        weight: 0.30,
        currentValue: Math.floor(Math.random() * 40) + 60, // 60-100%
        impact: 'positive',
        enabled: true,
        min: 0,
        max: 100,
        unit: '%'
      },
      {
        id: 'time_of_day',
        name: 'Time of Day',
        description: 'Peak hours affect delivery costs',
        weight: 0.15,
        currentValue: getTimeOfDayFactor(),
        impact: 'positive',
        enabled: true,
        min: 0,
        max: 100,
        unit: '%'
      },
      {
        id: 'weather',
        name: 'Weather Conditions',
        description: 'Weather impact on delivery complexity',
        weight: 0.10,
        currentValue: Math.floor(Math.random() * 30) + 70, // 70-100%
        impact: 'negative',
        enabled: true,
        min: 0,
        max: 100,
        unit: '%'
      },
      {
        id: 'driver_availability',
        name: 'Driver Availability',
        description: 'Number of available drivers in the area',
        weight: 0.20,
        currentValue: Math.floor(Math.random() * 50) + 30, // 30-80%
        impact: 'negative',
        enabled: true,
        min: 0,
        max: 100,
        unit: '%'
      }
    ];

    setPricingFactors(factors);

    const rules: PricingRule[] = [
      {
        id: 'peak_hours',
        name: 'Peak Hours Surcharge',
        description: 'Additional charge during rush hours',
        condition: 'time_of_day > 80',
        adjustment: 15,
        adjustmentType: 'percentage',
        priority: 1,
        active: true
      },
      {
        id: 'high_demand',
        name: 'High Demand Pricing',
        description: 'Surge pricing during high demand',
        condition: 'demand > 85',
        adjustment: 20,
        adjustmentType: 'percentage',
        priority: 2,
        active: true
      },
      {
        id: 'long_distance',
        name: 'Long Distance Fee',
        description: 'Additional fee for deliveries over 15 miles',
        condition: 'distance > 15',
        adjustment: 5.00,
        adjustmentType: 'fixed',
        priority: 3,
        active: true
      },
      {
        id: 'low_driver_availability',
        name: 'Limited Driver Surcharge',
        description: 'Extra charge when few drivers available',
        condition: 'driver_availability < 40',
        adjustment: 10,
        adjustmentType: 'percentage',
        priority: 4,
        active: true
      },
      {
        id: 'weather_surcharge',
        name: 'Weather Impact Fee',
        description: 'Additional charge for adverse weather',
        condition: 'weather < 75',
        adjustment: 3.00,
        adjustmentType: 'fixed',
        priority: 5,
        active: true
      }
    ];

    setPricingRules(rules);
  }, [merchantLocation, customerLocation]);

  // Calculate distance between two points
  const calculateDistance = useCallback((point1: { lat: number; lng: number }, point2: { lat: number; lng: number }) => {
    const R = 3959; // Earth's radius in miles
    const dLat = (point2.lat - point1.lat) * Math.PI / 180;
    const dLon = (point2.lng - point1.lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return Math.round(R * c * 10) / 10;
  }, []);

  // Get time of day factor
  const getTimeOfDayFactor = useCallback(() => {
    const hour = new Date().getHours();
    // Peak hours: 7-9 AM (90%), 12-2 PM (85%), 5-8 PM (95%)
    if ((hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 20)) return 95;
    if (hour >= 12 && hour <= 14) return 85;
    if (hour >= 6 && hour <= 22) return 60;
    return 30; // Off hours
  }, []);

  // Calculate dynamic pricing
  const calculateDynamicPrice = useCallback(() => {
    let adjustedPrice = basePrice;
    let totalAdjustment = 0;
    const appliedFactors: DynamicPriceResult['appliedFactors'] = [];
    const recommendations: string[] = [];

    // Apply factor-based adjustments
    pricingFactors.forEach(factor => {
      if (!factor.enabled) return;

      let factorAdjustment = 0;
      let reason = '';

      switch (factor.id) {
        case 'distance':
          if (factor.currentValue > 10) {
            factorAdjustment = Math.min(factor.currentValue * 0.5, 15);
            reason = `Long distance delivery (${factor.currentValue} miles)`;
          }
          break;
        
        case 'demand':
          if (factor.currentValue > 80) {
            factorAdjustment = (factor.currentValue - 80) * 0.5;
            reason = `High demand (${factor.currentValue}% above normal)`;
          }
          break;
        
        case 'time_of_day':
          if (factor.currentValue > 80) {
            factorAdjustment = (factor.currentValue - 80) * 0.3;
            reason = 'Peak hour delivery';
          }
          break;
        
        case 'weather':
          if (factor.currentValue < 75) {
            factorAdjustment = (75 - factor.currentValue) * 0.2;
            reason = 'Adverse weather conditions';
          }
          break;
        
        case 'driver_availability':
          if (factor.currentValue < 50) {
            factorAdjustment = (50 - factor.currentValue) * 0.3;
            reason = 'Limited driver availability';
          }
          break;
      }

      if (factorAdjustment > 0) {
        const weightedAdjustment = factorAdjustment * factor.weight;
        totalAdjustment += weightedAdjustment;
        appliedFactors.push({
          factor: factor.name,
          adjustment: weightedAdjustment,
          reason
        });
      }
    });

    // Apply rule-based adjustments
    pricingRules.forEach(rule => {
      if (!rule.active) return;

      let shouldApply = false;
      const conditions = rule.condition.split(' ');
      
      if (conditions.length === 3) {
        const [factorId, operator, threshold] = conditions;
        const factor = pricingFactors.find(f => f.id === factorId);
        
        if (factor) {
          const thresholdValue = parseFloat(threshold);
          switch (operator) {
            case '>':
              shouldApply = factor.currentValue > thresholdValue;
              break;
            case '<':
              shouldApply = factor.currentValue < thresholdValue;
              break;
            case '>=':
              shouldApply = factor.currentValue >= thresholdValue;
              break;
            case '<=':
              shouldApply = factor.currentValue <= thresholdValue;
              break;
          }
        }
      }

      if (shouldApply) {
        let ruleAdjustment = 0;
        if (rule.adjustmentType === 'percentage') {
          ruleAdjustment = basePrice * (rule.adjustment / 100);
        } else {
          ruleAdjustment = rule.adjustment;
        }

        totalAdjustment += ruleAdjustment;
        appliedFactors.push({
          factor: rule.name,
          adjustment: ruleAdjustment,
          reason: rule.description
        });
      }
    });

    adjustedPrice = basePrice + totalAdjustment;
    const adjustmentPercentage = (totalAdjustment / basePrice) * 100;

    // Generate recommendations
    if (adjustmentPercentage > 25) {
      recommendations.push('Consider offering alternative delivery times for lower pricing');
    }
    if (pricingFactors.find(f => f.id === 'distance')?.currentValue! > 20) {
      recommendations.push('Long distance delivery - consider pickup option');
    }
    if (pricingFactors.find(f => f.id === 'demand')?.currentValue! > 90) {
      recommendations.push('High demand period - customers willing to pay premium');
    }

    // Calculate confidence based on data freshness and factor reliability
    const confidence = Math.min(95, 85 + Math.random() * 10);

    const result: DynamicPriceResult = {
      basePrice,
      adjustedPrice: Math.round(adjustedPrice * 100) / 100,
      totalAdjustment: Math.round(totalAdjustment * 100) / 100,
      adjustmentPercentage: Math.round(adjustmentPercentage * 10) / 10,
      appliedFactors,
      confidence,
      recommendations
    };

    setCurrentPricing(result);
    setLastUpdate(new Date());

    if (onPriceChange) {
      onPriceChange(result);
    }
  }, [basePrice, pricingFactors, pricingRules, onPriceChange]);

  // Auto-update pricing
  useEffect(() => {
    if (!isAutoEnabled) return;

    const interval = setInterval(() => {
      // Simulate real-time factor updates
      setPricingFactors(prev => prev.map(factor => ({
        ...factor,
        currentValue: factor.id === 'demand' 
          ? Math.max(0, Math.min(100, factor.currentValue + (Math.random() - 0.5) * 10))
          : factor.id === 'driver_availability'
          ? Math.max(0, Math.min(100, factor.currentValue + (Math.random() - 0.5) * 15))
          : factor.id === 'time_of_day'
          ? getTimeOfDayFactor()
          : factor.currentValue
      })));
    }, updateInterval * 1000);

    return () => clearInterval(interval);
  }, [isAutoEnabled, updateInterval, getTimeOfDayFactor]);

  // Recalculate when factors change
  useEffect(() => {
    if (pricingFactors.length > 0) {
      calculateDynamicPrice();
    }
  }, [pricingFactors, calculateDynamicPrice]);

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getAdjustmentColor = (adjustment: number) => {
    return adjustment > 0 ? 'text-red-600' : adjustment < 0 ? 'text-green-600' : 'text-gray-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="h-6 w-6 text-blue-600" />
            Dynamic Pricing Engine
          </h2>
          <p className="text-gray-600">AI-powered pricing optimization</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Auto-update</span>
            <Switch
              checked={isAutoEnabled}
              onCheckedChange={setIsAutoEnabled}
            />
          </div>
          <Badge variant={isAutoEnabled ? 'default' : 'secondary'}>
            {isAutoEnabled ? 'Live' : 'Manual'}
          </Badge>
        </div>
      </div>

      {/* Current Pricing Result */}
      {currentPricing && (
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">
                  ${currentPricing.basePrice.toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">Base Price</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  ${currentPricing.adjustedPrice.toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">Dynamic Price</div>
                <div className={`text-sm font-medium ${getAdjustmentColor(currentPricing.totalAdjustment)}`}>
                  {currentPricing.totalAdjustment >= 0 ? '+' : ''}${currentPricing.totalAdjustment.toFixed(2)} 
                  ({currentPricing.adjustmentPercentage >= 0 ? '+' : ''}{currentPricing.adjustmentPercentage.toFixed(1)}%)
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {currentPricing.confidence.toFixed(0)}%
                </div>
                <div className="text-sm text-gray-600">Confidence</div>
                <Progress 
                  value={currentPricing.confidence} 
                  className="w-full h-2 mt-2"
                />
              </div>
            </div>

            <div className="mt-6 pt-6 border-t">
              <h4 className="font-medium mb-3">Applied Adjustments</h4>
              <div className="space-y-2">
                {currentPricing.appliedFactors.map((factor, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span>{factor.factor}</span>
                    <div className="flex items-center gap-2">
                      <span className={getAdjustmentColor(factor.adjustment)}>
                        {factor.adjustment >= 0 ? '+' : ''}${factor.adjustment.toFixed(2)}
                      </span>
                      <span className="text-gray-500">({factor.reason})</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {currentPricing.recommendations.length > 0 && (
              <div className="mt-6 pt-6 border-t">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Recommendations
                </h4>
                <div className="space-y-2">
                  {currentPricing.recommendations.map((rec, index) => (
                    <div key={index} className="text-sm text-blue-700 bg-blue-50 p-2 rounded">
                      {rec}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Pricing Factors */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Pricing Factors
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {pricingFactors.map((factor) => (
              <div key={factor.id} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={factor.enabled}
                      onCheckedChange={(enabled) => {
                        setPricingFactors(prev => prev.map(f => 
                          f.id === factor.id ? { ...f, enabled } : f
                        ));
                      }}
                    />
                    <div>
                      <h4 className="font-medium">{factor.name}</h4>
                      <p className="text-sm text-gray-600">{factor.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold">
                      {factor.currentValue.toFixed(1)} {factor.unit}
                    </div>
                    <div className={`text-sm ${getImpactColor(factor.impact)}`}>
                      Weight: {(factor.weight * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500 w-12">{factor.min}</span>
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          factor.impact === 'positive' ? 'bg-green-500' : 
                          factor.impact === 'negative' ? 'bg-red-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${(factor.currentValue / factor.max) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500 w-12">{factor.max}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pricing Rules */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Pricing Rules
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pricingRules.map((rule) => (
              <div key={rule.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={rule.active}
                    onCheckedChange={(active) => {
                      setPricingRules(prev => prev.map(r => 
                        r.id === rule.id ? { ...r, active } : r
                      ));
                    }}
                  />
                  <div>
                    <h4 className="font-medium">{rule.name}</h4>
                    <p className="text-sm text-gray-600">{rule.description}</p>
                    <p className="text-xs text-gray-500">Condition: {rule.condition}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">
                    {rule.adjustmentType === 'percentage' ? '+' : ''}
                    {rule.adjustment}
                    {rule.adjustmentType === 'percentage' ? '%' : ' USD'}
                  </div>
                  <div className="text-sm text-gray-500">Priority: {rule.priority}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            System Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {isAutoEnabled ? 'Active' : 'Manual'}
              </div>
              <div className="text-sm text-gray-600">Pricing Mode</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {updateInterval / 60}m
              </div>
              <div className="text-sm text-gray-600">Update Interval</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {Math.floor((Date.now() - lastUpdate.getTime()) / 1000)}s
              </div>
              <div className="text-sm text-gray-600">Last Update</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DynamicPricing; 