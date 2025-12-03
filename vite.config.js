import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    root: 'frontend',
    publicDir: '../public', // if you have a public folder in root
    build: {
        outDir: '../dist',
        emptyOutDir: true,
    },
    server: {
        open: true // automatically open browser
    }
});
