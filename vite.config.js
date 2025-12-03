import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    root: 'frontend',
    publicDir: '../public', // if you have a public folder in root
    build: {
        outDir: '../dist',
        emptyOutDir: true,
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'frontend/index.html'),
                game: resolve(__dirname, 'frontend/game.html')
            }
        }
    },
    server: {
        open: true // automatically open browser
    }
});
