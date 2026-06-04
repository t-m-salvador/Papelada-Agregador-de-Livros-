import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { LivrosService } from '../services/livros.service';

/**
 * AdicionarLivroPage — Permite catalogar e publicar um novo livro. (Tarefa 2)
 * Usa Capacitor Camera para tirar fotografia da capa,
 * Reactive Forms para validação, e LivrosService para guardar.
 */
@Component({
  selector: 'app-adicionar-livro',
  templateUrl: './adicionar-livro.page.html',
  styleUrls: ['./adicionar-livro.page.scss'],
  standalone: false,
})
export class AdicionarLivroPage implements OnInit {

  /** Formulário reativo com validação */
  livroForm!: FormGroup;

  /** Preview da capa fotografada (base64 ou URL) */
  capaPreview: string = '';

  /** Controla a exibição do ecrã de confirmação */
  livroAdicionado: boolean = false;

  /** Lista de géneros disponíveis para o dropdown */
  generos: string[] = [
    'Ficção Científica',
    'Romance',
    'Aventura',
    'Poesia Clássica',
    'Drama',
    'Terror',
    'Biografia',
    'História',
    'Crónica',
    'Outro'
  ];

  constructor(
    private fb: FormBuilder,
    private livrosService: LivrosService
  ) {}

  ngOnInit() {
    // Inicializar o formulário reativo com validações
    this.livroForm = this.fb.group({
      titulo:  ['', [Validators.required, Validators.minLength(2)]],
      autores: ['', [Validators.required]],
      genero:  ['', [Validators.required]],
      tag:     ['']
    });
  }

  /**
   * Usa o Capacitor Camera para tirar fotografia ou selecionar da galeria.
   * Guarda a imagem como base64 para preview.
   */
  async tirarFotografia() {
    try {
      const imagem = await Camera.getPhoto({
        quality: 80,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,   // retorna base64 Data URL
        source: CameraSource.Prompt             // pergunta: câmara ou galeria
      });
      if (imagem.dataUrl) {
        this.capaPreview = imagem.dataUrl;
      }
    } catch (erro) {
      // Utilizador cancelou ou permissão negada — não fazer nada
      console.warn('Câmara cancelada ou erro:', erro);
    }
  }

  /**
   * Verifica se um campo do formulário é inválido e foi tocado.
   * @param campo - Nome do campo do formulário
   */
  campoInvalido(campo: string): boolean {
    const ctrl = this.livroForm.get(campo);
    return !!(ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched));
  }

  /**
   * Adiciona o livro ao catálogo e mostra o ecrã de confirmação.
   * Só executa se o formulário for válido.
   */
  adicionarLivro() {
    if (this.livroForm.invalid) {
      // Marcar todos os campos como tocados para mostrar erros
      this.livroForm.markAllAsTouched();
      return;
    }

    const { titulo, autores, genero, tag } = this.livroForm.value;

    // Adicionar o livro através do service
    this.livrosService.adicionarLivro({
      titulo,
      autores,
      genero,
      tags: tag ? [tag] : [],
      capa: this.capaPreview || 'assets/icon/favicon.png',
      descricao: '',
      avaliacao: 0,
      numAvaliacoes: 0,
      opinioes: [],
      livrosSimilares: []
    });

    // Mostrar ecrã de confirmação
    this.livroAdicionado = true;

    // Após 2.5 segundos, repor o formulário
    setTimeout(() => {
      this.livroAdicionado = false;
      this.livroForm.reset();
      this.capaPreview = '';
    }, 2500);
  }
}
