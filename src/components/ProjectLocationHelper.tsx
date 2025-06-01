import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { CheckCircle, Github, Folder, HelpCircle } from 'lucide-react';

const ProjectLocationHelper: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [foundLocation, setFoundLocation] = useState<string | null>(null);

  const steps = [
    {
      title: "Let's Find Your Project!",
      description: "We'll help you locate where your TomaShops project is stored.",
      icon: <HelpCircle className="w-6 h-6" />
    },
    {
      title: "Check Your File Manager",
      description: "Open your phone's file manager app and look for a folder named 'TomaShops' or similar.",
      icon: <Folder className="w-6 h-6" />
    },
    {
      title: "Check GitHub (if you have an account)",
      description: "If you have a GitHub account, your project might be there.",
      icon: <Github className="w-6 h-6" />
    }
  ];

  const handleStepComplete = (location: string) => {
    setFoundLocation(location);
    setCurrentStep(steps.length);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5" />
            Find Your TomaShops Project
          </CardTitle>
          <CardDescription>
            Let's locate where your project files are stored so you can deploy them online.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {foundLocation ? (
            <Alert>
              <CheckCircle className="w-4 h-4" />
              <AlertDescription>
                Great! You found your project at: {foundLocation}
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`border rounded-lg p-4 ${
                    index === currentStep ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-full ${
                      index === currentStep ? 'bg-blue-500 text-white' : 'bg-gray-100'
                    }`}>
                      {step.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{step.title}</h3>
                      <p className="text-gray-600 mt-1">{step.description}</p>
                      
                      {index === currentStep && (
                        <div className="mt-4 space-y-2">
                          {index === 1 && (
                            <div className="space-y-2">
                              <Button 
                                onClick={() => handleStepComplete('Phone Storage')}
                                className="w-full"
                              >
                                Found it in my phone storage!
                              </Button>
                              <Button 
                                variant="outline"
                                onClick={() => setCurrentStep(2)}
                                className="w-full"
                              >
                                Not there, check GitHub
                              </Button>
                            </div>
                          )}
                          
                          {index === 2 && (
                            <div className="space-y-2">
                              <Button 
                                onClick={() => handleStepComplete('GitHub Repository')}
                                className="w-full"
                              >
                                Found it on GitHub!
                              </Button>
                              <Button 
                                variant="outline"
                                onClick={() => setCurrentStep(0)}
                                className="w-full"
                              >
                                Not on GitHub either
                              </Button>
                            </div>
                          )}
                          
                          {index === 0 && (
                            <Button 
                              onClick={() => setCurrentStep(1)}
                              className="w-full"
                            >
                              Let's start looking!
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {foundLocation && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">Next Steps:</h3>
              <div className="text-green-700 space-y-1">
                {foundLocation === 'GitHub Repository' ? (
                  <>
                    <p>• Download the GitHub app from Play Store</p>
                    <p>• Log in and find your TomaShops repository</p>
                    <p>• Follow the deployment guide in your repository</p>
                  </>
                ) : (
                  <>
                    <p>• Create a ZIP file of your project folder</p>
                    <p>• Go to netlify.com and sign up</p>
                    <p>• Drag and drop your ZIP file to deploy</p>
                  </>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectLocationHelper;