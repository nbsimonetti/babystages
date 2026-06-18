import type { CapacitorConfig } from '@capacitor/cli';

// Capacitor wraps the built web app (client/dist) in native iOS & Android shells
// so the verified React codebase ships to both stores. Run `npm run mobile:build`
// to build the web assets and sync them into the native projects.
const config: CapacitorConfig = {
  appId: 'app.babystages',
  appName: 'BabyStages',
  webDir: 'dist',
  // The app calls the hosted API directly (set VITE_API_BASE at build time);
  // androidScheme https avoids mixed-content/cookie issues.
  server: { androidScheme: 'https' },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1200,
      backgroundColor: '#df5e4b',
      showSpinner: false,
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
  },
};

export default config;
