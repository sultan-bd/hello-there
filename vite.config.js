import { defineConfig } from 'vite';
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  root: '.',
  server: {
    host: "::",
    port: 8080,
    open: '/index.html'
  },
  plugins: [
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: 'index.html',
        login: 'login.html',
        customerDebt: 'customer-debt.html',
        officeExpenses: 'office-expenses.html',
        rakan: 'rakan.html',
        forgotPassword: 'forgot-password.html',
        otp: 'otp.html',
        checkEmail: 'check-email.html'
      }
    }
  }
}));
