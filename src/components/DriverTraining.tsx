import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  GraduationCap, 
  BookOpen, 
  Video, 
  CheckCircle, 
  Clock, 
  Award,
  Play,
  Lock,
  Star,
  AlertTriangle,
  Shield,
  Car,
  MapPin,
  DollarSign
} from 'lucide-react';

interface TrainingModule {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'reading' | 'quiz' | 'practical';
  duration: number; // minutes
  isCompleted: boolean;
  isRequired: boolean;
  isLocked: boolean;
  score?: number;
  maxScore?: number;
  prerequisites: string[];
  category: 'safety' | 'delivery' | 'customer_service' | 'vehicle' | 'app_usage';
}

interface DriverTrainingProps {
  driver: any; // Replace with proper Driver type
  onCompleteModule: (moduleId: string, score?: number) => Promise<void>;
}

export const DriverTraining: React.FC<DriverTrainingProps> = ({ 
  driver, 
  onCompleteModule 
}) => {
  const [trainingModules, setTrainingModules] = useState<TrainingModule[]>([
    {
      id: '1',
      title: 'Welcome to MyPartsRunner',
      description: 'Introduction to the platform, your role, and how to get started',
      type: 'video',
      duration: 5,
      isCompleted: false,
      isRequired: true,
      isLocked: false,
      prerequisites: [],
      category: 'app_usage'
    },
    {
      id: '2',
      title: 'Safety First: Driver Safety Guidelines',
      description: 'Essential safety practices, emergency procedures, and incident reporting',
      type: 'video',
      duration: 12,
      isCompleted: false,
      isRequired: true,
      isLocked: false,
      prerequisites: ['1'],
      category: 'safety'
    },
    {
      id: '3',
      title: 'Vehicle Safety & Maintenance',
      description: 'Vehicle inspection checklist, maintenance requirements, and safety protocols',
      type: 'reading',
      duration: 8,
      isCompleted: false,
      isRequired: true,
      isLocked: false,
      prerequisites: ['2'],
      category: 'vehicle'
    },
    {
      id: '4',
      title: 'Delivery Best Practices',
      description: 'Efficient delivery routes, customer interaction, and package handling',
      type: 'video',
      duration: 15,
      isCompleted: false,
      isRequired: true,
      isLocked: false,
      prerequisites: ['3'],
      category: 'delivery'
    },
    {
      id: '5',
      title: 'Customer Service Excellence',
      description: 'Professional communication, problem resolution, and customer satisfaction',
      type: 'reading',
      duration: 10,
      isCompleted: false,
      isRequired: true,
      isLocked: false,
      prerequisites: ['4'],
      category: 'customer_service'
    },
    {
      id: '6',
      title: 'App Navigation & Features',
      description: 'How to use the driver app, accept deliveries, and track earnings',
      type: 'video',
      duration: 8,
      isCompleted: false,
      isRequired: true,
      isLocked: false,
      prerequisites: ['5'],
      category: 'app_usage'
    },
    {
      id: '7',
      title: 'Advanced Delivery Strategies',
      description: 'Multi-delivery optimization, peak hours, and earnings maximization',
      type: 'video',
      duration: 12,
      isCompleted: false,
      isRequired: false,
      isLocked: true,
      prerequisites: ['6'],
      category: 'delivery'
    },
    {
      id: '8',
      title: 'Emergency Response Training',
      description: 'Handling accidents, medical emergencies, and crisis situations',
      type: 'video',
      duration: 18,
      isCompleted: false,
      isRequired: false,
      isLocked: true,
      prerequisites: ['6'],
      category: 'safety'
    }
  ]);

  const [selectedModule, setSelectedModule] = useState<TrainingModule | null>(null);
  const [isWatchingVideo, setIsWatchingVideo] = useState(false);

  const completedModules = trainingModules.filter(m => m.isCompleted);
  const requiredModules = trainingModules.filter(m => m.isRequired);
  const completedRequired = requiredModules.filter(m => m.isCompleted);
  const overallProgress = (completedRequired.length / requiredModules.length) * 100;

  const canAccessModule = (module: TrainingModule) => {
    if (module.isLocked) return false;
    if (module.prerequisites.length === 0) return true;
    return module.prerequisites.every(prereq => 
      trainingModules.find(m => m.id === prereq)?.isCompleted
    );
  };

  const handleStartModule = (module: TrainingModule) => {
    if (module.type === 'video') {
      setIsWatchingVideo(true);
      setSelectedModule(module);
    } else {
      setSelectedModule(module);
    }
  };

  const handleCompleteModule = async (moduleId: string, score?: number) => {
    try {
      await onCompleteModule(moduleId, score);
      
      setTrainingModules(prev => 
        prev.map(m => 
          m.id === moduleId 
            ? { ...m, isCompleted: true, score, maxScore: score }
            : m
        )
      );
      
      setIsWatchingVideo(false);
      setSelectedModule(null);
      
      // Unlock dependent modules
      setTrainingModules(prev => 
        prev.map(m => ({
          ...m,
          isLocked: !canAccessModule(m)
        }))
      );
      
    } catch (error) {
      console.error('Failed to complete module:', error);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'safety': return <Shield className="h-4 w-4" />;
      case 'delivery': return <MapPin className="h-4 w-4" />;
      case 'customer_service': return <Star className="h-4 w-4" />;
      case 'vehicle': return <Car className="h-4 w-4" />;
      case 'app_usage': return <BookOpen className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'safety': return 'bg-red-100 text-red-800';
      case 'delivery': return 'bg-blue-100 text-blue-800';
      case 'customer_service': return 'bg-green-100 text-green-800';
      case 'vehicle': return 'bg-purple-100 text-purple-800';
      case 'app_usage': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />;
      case 'reading': return <BookOpen className="h-4 w-4" />;
      case 'quiz': return <CheckCircle className="h-4 w-4" />;
      case 'practical': return <Car className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Training Progress Overview */}
      <Card className="border-2 border-blue-100">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-blue-600" />
            Training Progress
          </CardTitle>
          <CardDescription>
            Complete required training modules to start accepting deliveries
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-gray-600">
                {completedRequired.length} of {requiredModules.length} required modules
              </span>
            </div>
            
            <Progress value={overallProgress} className="h-3" />
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {Math.round(overallProgress)}%
                </div>
                <div className="text-xs text-gray-600">Complete</div>
              </div>
              
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {completedModules.length}
                </div>
                <div className="text-xs text-gray-600">Modules Done</div>
              </div>
              
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {trainingModules.length - completedModules.length}
                </div>
                <div className="text-xs text-gray-600">Remaining</div>
              </div>
            </div>
            
            {overallProgress === 100 && (
              <div className="bg-green-50 p-3 rounded-lg text-center">
                <Award className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="font-semibold text-green-700">Training Complete! 🎉</p>
                <p className="text-sm text-green-600">
                  You're now certified to accept deliveries
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Training Modules */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Training Modules</CardTitle>
          <CardDescription>
            Complete modules in order to unlock advanced training
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {trainingModules.map((module) => (
              <div 
                key={module.id} 
                className={`p-4 border rounded-lg ${
                  module.isCompleted 
                    ? 'bg-green-50 border-green-200' 
                    : canAccessModule(module)
                    ? 'bg-white border-gray-200'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {module.isCompleted ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : module.isLocked ? (
                        <Lock className="h-5 w-5 text-gray-400" />
                      ) : (
                        getTypeIcon(module.type)
                      )}
                      
                      <h4 className="font-semibold">{module.title}</h4>
                      
                      {module.isRequired && (
                        <Badge variant="outline" className="text-red-600">
                          Required
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">
                      {module.description}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {module.duration} min
                      </span>
                      
                      <Badge className={getCategoryColor(module.category)}>
                        {getCategoryIcon(module.category)}
                        <span className="ml-1 capitalize">
                          {module.category.replace('_', ' ')}
                        </span>
                      </Badge>
                      
                      {module.isCompleted && module.score && (
                        <span className="text-green-600 font-medium">
                          Score: {module.score}%
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="ml-4">
                    {module.isCompleted ? (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Completed
                      </Badge>
                    ) : canAccessModule(module) ? (
                      <Button
                        size="sm"
                        onClick={() => handleStartModule(module)}
                      >
                        {module.type === 'video' ? (
                          <>
                            <Play className="h-3 w-3 mr-1" />
                            Start
                          </>
                        ) : (
                          'Begin'
                        )}
                      </Button>
                    ) : (
                      <Badge variant="outline" className="text-gray-500">
                        <Lock className="h-3 w-3 mr-1" />
                        Locked
                      </Badge>
                    )}
                  </div>
                </div>
                
                {!canAccessModule(module) && module.prerequisites.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                      Prerequisites: {module.prerequisites.map(prereq => {
                        const prereqModule = trainingModules.find(m => m.id === prereq);
                        return prereqModule?.title || prereq;
                      }).join(', ')}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Video Player Modal */}
      {isWatchingVideo && selectedModule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{selectedModule.title}</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsWatchingVideo(false)}
              >
                Close
              </Button>
            </div>
            
            <div className="bg-gray-100 rounded-lg p-8 text-center mb-4">
              <Video className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                Video player would be embedded here
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Duration: {selectedModule.duration} minutes
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button
                onClick={() => handleCompleteModule(selectedModule.id, 100)}
                className="flex-1"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark as Complete
              </Button>
              
              <Button
                variant="outline"
                onClick={() => setIsWatchingVideo(false)}
                className="flex-1"
              >
                Watch Later
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Training Benefits */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Training Benefits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium">Safety First</h4>
                <p className="text-sm text-gray-600">
                  Learn essential safety practices to protect yourself and others
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <DollarSign className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium">Higher Earnings</h4>
                <p className="text-sm text-gray-600">
                  Certified drivers get priority access to premium deliveries
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Star className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium">Better Ratings</h4>
                <p className="text-sm text-gray-600">
                  Professional training leads to higher customer satisfaction
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Award className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium">Career Growth</h4>
                <p className="text-sm text-gray-600">
                  Unlock advanced features and specialized delivery options
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 