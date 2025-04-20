import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    dts({
      tsconfigPath: './tsconfig.build.json',
      rollupTypes: true, // Ensures all types are rolled into a single file
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
