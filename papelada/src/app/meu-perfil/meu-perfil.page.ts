import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { UtilizadorService, Utilizador } from '../services/utilizador.service';

/**
 * MeuPerfilPage — Mostra o perfil do utilizador e opções de gestão de conta.
 */
@Component({
  selector: 'app-meu-perfil',
  templateUrl: './meu-perfil.page.html',
  styleUrls: ['./meu-perfil.page.scss'],
  standalone: false,
})
export class MeuPerfilPage implements OnInit {

  /** Dados do utilizador atual */
  utilizador: Utilizador | null = null;

  constructor(
    private utilizadorService: UtilizadorService,
    private router: Router,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    // Subscrever o perfil reativo
    this.utilizadorService.utilizador$.subscribe(u => {
      this.utilizador = u;
    });
  }

  /**
   * Navega para a página de edição de informações do perfil.
   */
  editarInformacoes() {
    this.router.navigate(['/editar-perfil']);
  }

  /**
   * Mostra um alerta para alterar a palavra-passe.
   */
  async alterarAutenticacao() {
    const alert = await this.alertCtrl.create({
      header: 'Alterar Autenticação',
      inputs: [
        {
          name: 'email',
          type: 'email',
          placeholder: 'Novo Email',
          value: this.utilizador?.email
        },
        {
          name: 'password',
          type: 'password',
          placeholder: 'Nova Palavra-passe'
        }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Confirmar',
          handler: async (dados: any) => {
            if (dados.email) {
              await this.utilizadorService.atualizarPerfil({ email: dados.email });
            }
          }
        }
      ]
    });
    await alert.present();
  }

  /**
   * Pede confirmação antes de apagar a conta.
   */
  async confirmarApagar() {
    const alert = await this.alertCtrl.create({
      header: 'Apagar Conta',
      message: 'Tens a certeza que queres apagar a tua conta? Esta ação é irreversível.',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Apagar',
          role: 'destructive',
          handler: async () => {
            await this.utilizadorService.apagarConta();
            this.router.navigate(['/tabs/home']);
          }
        }
      ]
    });
    await alert.present();
  }
}
