import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import javascriptObfuscator from 'vite-plugin-javascript-obfuscator'

export default defineConfig(({ command, mode }) => ({
  plugins: [
    react(),
    // Only obfuscate during production build to avoid breaking dev/runtime env handling
    ...(command === 'build' && mode === 'production' && process.env.VITE_ENABLE_OBFUSCATION === 'true'
      ? [
          javascriptObfuscator(
            {
              compact: true,
              controlFlowFlattening: true,
              controlFlowFlatteningThreshold: 0.5,
              deadCodeInjection: false,
              stringArray: true,
              stringArrayRotate: true,
              stringArrayShuffle: true,
              stringArrayThreshold: 0.5,
              splitStrings: false,
              transformObjectKeys: true,
              numbersToExpressions: true,
              renameGlobals: false,
              simplify: true,
              disableConsoleOutput: true,
              // These options often cause runtime issues in browsers/extensions
              selfDefending: false,
              debugProtection: false,
            },
            ['node_modules/**', '**/*.css', '**/*.html']
          ),
        ]
      : []),
  ],
  build: {
    sourcemap: false,
    // Use esbuild for better compatibility with extensions and to avoid
    // rare runtime errors like "Cannot read properties of undefined (reading 'S')"
    // that can happen with over-aggressive mangle.
    minify: 'esbuild',
    // Keep output readable enough for stack traces and avoid property mangling
    // that could break third‑party integrations.
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          mui: ['@mui/material', '@mui/icons-material'],
          router: ['react-router-dom'],
          supabase: ['@supabase/supabase-js']
        }
      }
    },
    target: 'es2020',
    // Prevent inlining fonts/images as data: URIs to avoid CSP `font-src 'self'` blocks
    assetsInlineLimit: 0,
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1000
  },
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString())
  },
  server: {
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin'
    }
  },
  preview: {
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin'
    }
  }
}))


