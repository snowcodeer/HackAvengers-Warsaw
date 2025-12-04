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
                lingua: resolve(__dirname, 'frontend/lingua.html'),
                linguaWorld: resolve(__dirname, 'frontend/lingua-world.html'),
                game: resolve(__dirname, 'frontend/game.html'),
                countrySelection: resolve(__dirname, 'frontend/country-selection.html'),
            }
        }
    },
    server: {
        open: true,
        port: 5173
    }
});
