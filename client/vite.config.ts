import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// `base` is the public path the app is served from. For GitHub Pages project
// sites that's the repo name (e.g. "/babystages/"); set VITE_BASE at build time.
// Defaults to "/" for local dev and hosted-at-root deploys.
const base = process.env.VITE_BASE || '/';

// During dev the frontend runs on :5188 and proxies /api to the Express backend
// on :4000, so there are no CORS or URL-base headaches. In the split production
// deploy the frontend is static (GitHub Pages) and talks cross-origin to the
// hosted API via VITE_API_BASE — see docs/SPLIT_DEPLOY.md.
export default defineConfig({
  base,
  plugins: [react()],
  server: {
    port: 5188,
    strictPort: true,
    proxy: {
      '/api': 'http://localhost:4000',
    },
  },
});
