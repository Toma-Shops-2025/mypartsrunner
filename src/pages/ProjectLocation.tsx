import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import AndroidProjectFinder from '../components/AndroidProjectFinder';
import GitHubUploadHelper from '../components/GitHubUploadHelper';
import AndroidFilePathGuide from '../components/AndroidFilePathGuide';
import QuickStartGuide from '../components/QuickStartGuide';
import { Smartphone, Github, HelpCircle, Zap } from 'lucide-react';

const ProjectLocation: React.FC = () => {
  const [activeTab, setActiveTab] = useState('quick');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Find & Upload Your Android Project
          </h1>
          <p className="text-lg text-gray-600">
            Get your TomaShops project from Android to GitHub in minutes
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="quick" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Quick Start
            </TabsTrigger>
            <TabsTrigger value="find" className="flex items-center gap-2">
              <Smartphone className="w-4 h-4" />
              Find Files
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Github className="w-4 h-4" />
              Upload
            </TabsTrigger>
            <TabsTrigger value="help" className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4" />
              File Paths
            </TabsTrigger>
          </TabsList>

          <TabsContent value="quick" className="mt-6">
            <QuickStartGuide />
          </TabsContent>

          <TabsContent value="find" className="mt-6">
            <AndroidProjectFinder />
          </TabsContent>

          <TabsContent value="upload" className="mt-6">
            <GitHubUploadHelper />
          </TabsContent>

          <TabsContent value="help" className="mt-6">
            <AndroidFilePathGuide />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProjectLocation;