import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import javascriptObfuscator from 'vite-plugin-javascript-obfuscator'

export default defineConfig(({ command }) => ({
  plugins: [
    react(),
    // Only obfuscate during production build to avoid breaking dev/runtime env handling
    ...(command === 'build'
      ? [
          javascriptObfuscator(
            {
              compact: true,
              controlFlowFlattening: true,
              controlFlowFlatteningThreshold: 0.75,
              deadCodeInjection: true,
              deadCodeInjectionThreshold: 0.4,
              stringArray: true,
              stringArrayRotate: true,
              stringArrayShuffle: true,
              stringArrayThreshold: 0.75,
              splitStrings: true,
              splitStringsChunkLength: 5,
              transformObjectKeys: true,
              numbersToExpressions: true,
              renameGlobals: false,
              simplify: true,
              disableConsoleOutput: true,
              selfDefending: false,
            },
            ['node_modules/**', '**/*.css', '**/*.html']
          ),
        ]
      : []),
  ],
  build: {
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        ecma: 2020,
        module: true,
        passes: 2,
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.info', 'console.debug', 'console.warn'],
      },
      mangle: { safari10: true },
      format: { comments: false },
    },
  },
}))


