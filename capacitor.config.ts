import type { CapacitorConfig } from "@capacitor/cli";
import { KeyboardResize, KeyboardStyle } from "@capacitor/keyboard";

const config: CapacitorConfig = {
  appId: "com.domutala.digibank",
  appName: "Digibank",
  webDir: ".output/public",
  server: {
    androidScheme: "https",
  },
  plugins: {
    Keyboard: {
      resize: KeyboardResize.Body,
      // style: KeyboardStyle.Dark,
      resizeOnFullScreen: true,
    },
  },
};

export default config;
