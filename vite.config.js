import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    root: 'frontend',
    envDir: '..',
    publicDir: '../public',
    build: {
        outDir: '../dist',
        emptyOutDir: true,
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'frontend/index.html'),
                character: resolve(__dirname, 'frontend/character.html'),

                app: resolve(__dirname, 'frontend/app.html'),

                countrySelection: resolve(__dirname, 'frontend/country-selection.html'),
            }
        }
    },
    server: {
        open: true,
        port: 5173
    }
});
