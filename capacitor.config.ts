import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.cutoff.app',
  appName: 'CutOff',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    url: 'https://cut-off-deploy.vercel.app/',
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: false,
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'banner', 'list'],
    },
  },
};

export default config;
