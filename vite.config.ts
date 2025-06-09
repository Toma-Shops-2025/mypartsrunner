import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react(), tsconfigPaths()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    define: {
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(env.VITE_SUPABASE_URL),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(env.VITE_SUPABASE_ANON_KEY),
      'import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY': JSON.stringify(env.VITE_STRIPE_PUBLISHABLE_KEY),
      'import.meta.env.VITE_STRIPE_SECRET_KEY': JSON.stringify(env.VITE_STRIPE_SECRET_KEY),
      'import.meta.env.VITE_OPENAI_API_KEY': JSON.stringify(env.VITE_OPENAI_API_KEY),
      '__SUPABASE_URL__': JSON.stringify(env.VITE_SUPABASE_URL),
      '__SUPABASE_ANON_KEY__': JSON.stringify(env.VITE_SUPABASE_ANON_KEY),
    },
    envPrefix: 'VITE_',
    build: {
      outDir: 'dist',
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            'ui-vendor': ['@radix-ui/react-dropdown-menu', '@radix-ui/react-slot', '@radix-ui/react-tabs'],
            'map-vendor': ['mapbox-gl'],
            'stripe-vendor': ['@stripe/stripe-js', '@stripe/react-stripe-js'],
          },
        },
      },
      chunkSizeWarningLimit: 1000,
    },
    server: {
      port: 3000,
      host: true,
    },
  }
})