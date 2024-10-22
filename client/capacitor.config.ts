import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.timemanager.app',
  appName: 'TimeManagerMobile',
  webDir: 'dist',
  server: {
    cleartext: true
  }
}

export default config
