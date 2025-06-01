import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Download, FileArchive, Smartphone, CheckCircle, MapPin } from "lucide-react";
import AndroidDownloadLocationGuide from './AndroidDownloadLocationGuide';

const DownloadProjectFiles = () => {
  const downloadAsZip = () => {
    // Create a simple text file with project structure
    const projectStructure = `TomaShops Project Structure

Required Files:
- package.json
- index.html
- vite.config.ts
- tailwind.config.ts
- tsconfig.json
- src/
  - main.tsx
  - App.tsx
  - index.css
  - components/
  - pages/
  - lib/
  - contexts/
- public/

Save all these files to:
/storage/emulated/0/Download/TomaShops-Project/

Then upload to GitHub at:
https://github.com/toma-shops/TomaShops-FamousAI`;

    const blob = new Blob([projectStructure], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'TomaShops-Project-Structure.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Alert>
        <Smartphone className="h-4 w-4" />
        <AlertDescription>
          Download your project files directly to your Android Downloads folder for easy GitHub upload.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Download Project Files
          </CardTitle>
          <CardDescription>
            Get your complete TomaShops project ready for GitHub
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={downloadAsZip}
            className="w-full"
            size="lg"
          >
            <FileArchive className="mr-2 h-4 w-4" />
            Download Project Structure Guide
          </Button>
          
          <div className="text-sm text-gray-600">
            This will download a guide showing you exactly what files you need and where to put them.
          </div>
          
          <Alert>
            <MapPin className="h-4 w-4" />
            <AlertDescription>
              <strong>Downloaded files will be saved to:</strong><br/>
              <code className="bg-gray-100 px-2 py-1 rounded mt-1 inline-block">
                /storage/emulated/0/Download/
              </code>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <AndroidDownloadLocationGuide />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Next Steps
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</div>
            <div>
              <p className="font-medium">Find Your Downloaded Files</p>
              <p className="text-sm text-gray-600">Check Downloads folder: /storage/emulated/0/Download/</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</div>
            <div>
              <p className="font-medium">Organize Project Files</p>
              <p className="text-sm text-gray-600">Put all files in Downloads/TomaShops-Project/</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</div>
            <div>
              <p className="font-medium">Upload to GitHub</p>
              <p className="text-sm text-gray-600">Go to github.com/toma-shops/TomaShops-FamousAI</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DownloadProjectFiles;