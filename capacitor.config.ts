import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'proteya_notes',
  webDir: 'dist/proteya_notes/browser',
  server: {
    androidScheme: 'http'
  }
};

export default config;
