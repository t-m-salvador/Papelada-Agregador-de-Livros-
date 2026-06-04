import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.papelada.app',
  appName: 'Papelada',
  webDir: 'www',
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000, // Tempo que o splash fica visível (3 segundos)
      launchAutoHide: true,     // Esconde automaticamente após o tempo acima
      backgroundColor: "#ffffff", // Cor de fundo se a imagem não esticar tudo
      androidScaleType: "CENTER_CROP"
    }
  }
};

export default config;