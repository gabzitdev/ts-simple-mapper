import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    dts({
      tsconfigPath: './tsconfig.build.json',
      include: ['src/**/*.ts'], // Ensure all TypeScript files in src are included
    }),
  ],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'Typescript simple mapper',
      fileName: 'ts-simple-mapper',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {},
      },
    },
  },
});
