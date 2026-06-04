import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';

/**
 * AppComponent — Componente raiz da aplicação Papelada.
 * Inicializa o Capacitor e bloqueia a orientação em portrait.
 */
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {

  constructor(private platform: Platform) {
    this.inicializar();
  }

  /**
   * Inicializa a app após o Capacitor estar pronto.
   * Bloqueia a orientação em portrait (req. Capacitor).
   */
  async inicializar() {
    await this.platform.ready();

    // Bloquear orientação em portrait usando Capacitor ScreenOrientation
    // Importação dinâmica para evitar erro em browser
    try {
      const { ScreenOrientation } = await import('@capacitor/screen-orientation');
      await ScreenOrientation.lock({ orientation: 'portrait' });
    } catch (e) {
      // Em browser não faz nada; apenas funciona em dispositivo físico
      console.log('ScreenOrientation não disponível no browser:', e);
    }
  }
}

