import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// This tells Vite to use the React plugin to process your code
export default defineConfig({
  plugins: [react()],
})
