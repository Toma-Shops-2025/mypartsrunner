import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const DownloadProjectButton = () => {
  const downloadProject = () => {
    // Create a comprehensive project structure as a downloadable file
    const projectStructure = {
      'package.json': {
        "name": "tomashops-famousai",
        "private": true,
        "version": "0.0.0",
        "type": "module",
        "scripts": {
          "dev": "vite",
          "build": "tsc && vite build",
          "preview": "vite preview",
          "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0"
        },
        "dependencies": {
          "@radix-ui/react-accordion": "^1.1.2",
          "@radix-ui/react-alert-dialog": "^1.0.5",
          "@radix-ui/react-aspect-ratio": "^1.0.3",
          "@radix-ui/react-avatar": "^1.0.4",
          "@radix-ui/react-checkbox": "^1.0.4",
          "@radix-ui/react-collapsible": "^1.0.3",
          "@radix-ui/react-context-menu": "^2.1.5",
          "@radix-ui/react-dialog": "^1.0.5",
          "@radix-ui/react-dropdown-menu": "^2.0.6",
          "@radix-ui/react-hover-card": "^1.0.7",
          "@radix-ui/react-label": "^2.0.2",
          "@radix-ui/react-menubar": "^1.0.4",
          "@radix-ui/react-navigation-menu": "^1.1.4",
          "@radix-ui/react-popover": "^1.0.7",
          "@radix-ui/react-progress": "^1.0.3",
          "@radix-ui/react-radio-group": "^1.1.3",
          "@radix-ui/react-scroll-area": "^1.0.5",
          "@radix-ui/react-select": "^2.0.0",
          "@radix-ui/react-separator": "^1.0.3",
          "@radix-ui/react-sheet": "^1.0.4",
          "@radix-ui/react-slider": "^1.1.2",
          "@radix-ui/react-slot": "^1.0.2",
          "@radix-ui/react-switch": "^1.0.3",
          "@radix-ui/react-tabs": "^1.0.4",
          "@radix-ui/react-toast": "^1.1.5",
          "@radix-ui/react-toggle": "^1.0.3",
          "@radix-ui/react-toggle-group": "^1.0.4",
          "@radix-ui/react-tooltip": "^1.0.7",
          "@supabase/supabase-js": "^2.39.3",
          "@tanstack/react-query": "^4.36.1",
          "class-variance-authority": "^0.7.0",
          "clsx": "^2.0.0",
          "date-fns": "^2.30.0",
          "embla-carousel-react": "^8.0.0",
          "lucide-react": "^0.263.1",
          "react": "^18.2.0",
          "react-day-picker": "^8.9.1",
          "react-dom": "^18.2.0",
          "react-hook-form": "^7.45.4",
          "react-resizable-panels": "^0.0.55",
          "react-router-dom": "^6.8.1",
          "recharts": "^2.8.0",
          "sonner": "^1.0.3",
          "tailwind-merge": "^1.14.0",
          "tailwindcss-animate": "^1.0.7",
          "vaul": "^0.7.0"
        },
        "devDependencies": {
          "@types/node": "^20.5.2",
          "@types/react": "^18.2.15",
          "@types/react-dom": "^18.2.7",
          "@typescript-eslint/eslint-plugin": "^6.0.0",
          "@typescript-eslint/parser": "^6.0.0",
          "@vitejs/plugin-react": "^4.0.3",
          "autoprefixer": "^10.4.15",
          "eslint": "^8.45.0",
          "eslint-plugin-react-hooks": "^4.6.0",
          "eslint-plugin-react-refresh": "^0.4.3",
          "postcss": "^8.4.27",
          "tailwindcss": "^3.3.3",
          "typescript": "^5.0.2",
          "vite": "^4.4.5"
        }
      },
      'README.md': `# TomaShops FamousAI\n\nA modern e-commerce platform with TikTok-style video feeds.\n\n## Quick Start\n\n1. Install dependencies: \`npm install\`\n2. Start development: \`npm run dev\`\n3. Build for production: \`npm run build\`\n\n## Deployment\n\n- Netlify: Drag and drop the \`dist\` folder\n- Vercel: Connect your GitHub repository\n- GitHub Pages: Push to main branch (auto-deploy configured)\n\nFor complete documentation, see the included guides.`
    };

    const content = JSON.stringify(projectStructure, null, 2);
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'tomashops-project-structure.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: 'Project Downloaded',
      description: 'Project structure has been downloaded to your device.',
    });
  };

  return (
    <Button onClick={downloadProject} className="w-full">
      <Download className="h-4 w-4 mr-2" />
      Download Project Structure
    </Button>
  );
};

export default DownloadProjectButton;