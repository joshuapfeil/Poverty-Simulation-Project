/*
  Vite configuration for the React client. Adds the React plugin and
  configures the development server proxy so client requests to
  `/families` and `/people` are forwarded to the backend at port 3000.
*/

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Proxy /api and other backend endpoints to your Express server on port 3000
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      },

      '/families': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      }
      ,
      
      '/people': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
