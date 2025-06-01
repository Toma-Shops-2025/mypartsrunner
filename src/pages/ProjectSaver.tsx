import { AppLayout } from '@/components/AppLayout';
import ProjectSaver from '@/components/ProjectSaver';

const ProjectSaverPage = () => {
  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Save Project Files</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Download all your project files in a structured format ready for deployment on your PC.
            This includes configuration files, source code, and all necessary assets.
          </p>
        </div>
        <ProjectSaver />
      </div>
    </AppLayout>
  );
};

export default ProjectSaverPage;