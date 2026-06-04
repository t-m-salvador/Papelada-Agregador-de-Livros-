import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { UtilizadorService } from '../services/utilizador.service';

/**
 * EditarPerfilPage — Permite ao utilizador alterar o nome e email do perfil.
 * Usa Reactive Forms com validação e guarda com UtilizadorService.
 */
@Component({
  selector: 'app-editar-perfil',
  templateUrl: './editar-perfil.page.html',
  styleUrls: ['./editar-perfil.page.scss'],
  standalone: false,
})
export class EditarPerfilPage implements OnInit {

  /** Formulário reativo para edição do perfil */
  perfilForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private utilizadorService: UtilizadorService,
    private router: Router,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    const perfil = this.utilizadorService.getPerfil();

    // Inicializar formulário com valores atuais do perfil
    this.perfilForm = this.fb.group({
      nome:  [perfil.nome,  [Validators.required, Validators.minLength(2)]],
      email: [perfil.email, [Validators.required, Validators.email]]
    });
  }

  /**
   * Verifica se um campo é inválido e foi tocado.
   * @param campo - Nome do campo
   */
  campoInvalido(campo: string): boolean {
    const ctrl = this.perfilForm.get(campo);
    return !!(ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched));
  }

  /**
   * Guarda as alterações do perfil e regressa ao perfil.
   */
  async confirmar() {
    if (this.perfilForm.invalid) {
      this.perfilForm.markAllAsTouched();
      return;
    }

    const { nome, email } = this.perfilForm.value;
    this.utilizadorService.atualizarPerfil({ nome, email });

    const toast = await this.toastCtrl.create({
      message: 'Perfil atualizado com sucesso!',
      duration: 2000,
      color: 'success',
      position: 'bottom'
    });
    await toast.present();

    this.router.navigate(['/tabs/meu-perfil']);
  }
}
