import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Your frontend port
    host: true, // Allow external connections
    open: true, // Open browser on dev start
    allowedHosts: ['3d68192528b3.ngrok-free.app', 'localhost'], // Allow ngrok and localhost
  },
  base: '/',
  define: {
    'process.env': {}, // Required for Telegram WebApp
  },
});