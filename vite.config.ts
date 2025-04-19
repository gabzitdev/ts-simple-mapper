import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [dts({ tsconfigPath: './tsconfig.build.json' })],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'Typescript data sanitizer',
      fileName: 'ts-simple-mapper',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {}
      }
    }
  }
});
