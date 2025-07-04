
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.vyapaarsetu.app',
  appName: 'VyapaarSetu',
  webDir: 'dist',
  server: {
    url: 'https://f3f3a056-38d7-49a0-af4f-1a619521d968.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#1B3A57',
      androidScaleType: 'CENTER_CROP',
      splashFullScreen: true,
      splashImmersive: true,
    },
    Camera: {
      permissions: ['camera', 'photos']
    },
    Microphone: {
      permissions: ['microphone']
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#1B3A57'
    }
  },
};

export default config;
