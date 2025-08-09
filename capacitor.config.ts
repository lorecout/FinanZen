import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.finanzen.app',
  appName: 'FinanZen',
  server: {
    url: 'http://localhost:3000',
    cleartext: true,
  },
};

export default config;
