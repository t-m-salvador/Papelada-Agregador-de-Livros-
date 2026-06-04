import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { LivrosService, Livro, Opiniao } from '../services/livros.service';
import { UtilizadorService } from '../services/utilizador.service';

/**
 * DetalheLivroPage — Página de detalhe de um livro.
 * Permite: avaliar por estrelas (Tarefa 1), escrever opinião e
 * sugerir livro similar e partilhar no Twitter/X (Tarefa 3).
 *
 * Recebe o ID do livro como parâmetro de rota: /detalhe-livro/:id
 */
@Component({
  selector: 'app-detalhe-livro',
  templateUrl: './detalhe-livro.page.html',
  styleUrls: ['./detalhe-livro.page.scss'],
  standalone: false,
})
export class DetalheLivroPage implements OnInit {

  /** Livro atualmente a ser visualizado */
  livro: Livro | undefined;

  /** Lista de livros similares ao livro atual */
  livrosSimilares: Livro[] = [];

  /** Estrela selecionada pelo utilizador nesta sessão */
  estrelaSelecionada: number = 0;

  /** Mostra confirmação após avaliação */
  avaliacaoConfirmada: boolean = false;

  /** Controla visibilidade do modal de opinião */
  mostrarModalOpiniao: boolean = false;

  /** Controla visibilidade do bottom sheet de sugestão */
  mostrarModalSimilar: boolean = false;

  /** Texto escrito no modal de opinião */
  textoOpiniao: string = '';

  /** Nome do utilizador atual */
  nomeUtilizador: string = '';

  /** Termo de pesquisa no bottom sheet */
  termoPesquisaSimilar: string = '';

  /** Resultados de pesquisa de livros similares */
  resultadosSimilar: Livro[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private livrosService: LivrosService,
    private utilizadorService: UtilizadorService,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    // Obter o ID do livro a partir dos parâmetros de rota (ActivatedRoute)
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      this.carregarLivro(id);
    });

    // Obter nome do utilizador atual
    this.nomeUtilizador = this.utilizadorService.getPerfil().nome;
  }

  /**
   * Carrega os dados do livro e os seus livros similares.
   * @param id - ID do livro a carregar
   */
  carregarLivro(id: number) {
    this.livrosService.livros$.subscribe(livros => {
      this.livro = livros.find(l => l.id === id);
      if (this.livro) {
        this.livrosSimilares = this.livrosService.getLivrosSimilares(this.livro);
        this.estrelaSelecionada = this.livro.minhaAvaliacao || 0;
      }
    });
  }

  /**
   * Devolve o ícone correto para cada estrela (preenchida ou vazia).
   * @param index - Posição da estrela (1-5)
   */
  getIconeEstrela(index: number): string {
    const avaliacao = this.estrelaSelecionada || this.livro?.minhaAvaliacao || 0;
    return index <= avaliacao ? 'star' : 'star-outline';
  }

  /**
   * Avalia o livro com o número de estrelas indicado.
   * Mostra animação de confirmação por 2 segundos.
   * @param estrelas - Número de estrelas (1-5)
   */
  avaliar(estrelas: number) {
    if (!this.livro) return;
    this.estrelaSelecionada = estrelas;
    this.livrosService.avaliarLivro(this.livro.id, estrelas);
    this.avaliacaoConfirmada = true;
    setTimeout(() => this.avaliacaoConfirmada = false, 2000);
  }

  /**
   * Abre o modal para escrever uma opinião.
   */
  escreverOpiniao() {
    this.textoOpiniao = '';
    this.mostrarModalOpiniao = true;
  }

  /**
   * Submete a opinião escrita e fecha o modal.
   */
  async submeterOpiniao() {
    if (!this.livro || !this.textoOpiniao.trim()) {
      this.mostrarToast('Escreve a tua opinião antes de submeter.', 'warning');
      return;
    }
    this.livrosService.adicionarOpiniao(
      this.livro.id,
      this.textoOpiniao.trim(),
      this.nomeUtilizador
    );
    this.mostrarModalOpiniao = false;
    this.textoOpiniao = '';
    this.mostrarToast('Opinião publicada com sucesso!', 'success');
  }

  /**
   * Abre o bottom sheet para sugerir livro similar.
   * Preenche a lista com todos os livros exceto o atual.
   */
  abrirSugerirSimilar() {
    this.termoPesquisaSimilar = '';
    this.resultadosSimilar = this.livrosService.getTodosLivros()
      .filter(l => l.id !== this.livro?.id);
    this.mostrarModalSimilar = true;
  }

  /**
   * Pesquisa livros no bottom sheet de sugestão similar.
   * @param event - Evento de input da searchbar
   */
  pesquisarSimilar(event: any) {
    const termo = event.target?.value || '';
    this.resultadosSimilar = this.livrosService.pesquisar(termo)
      .filter(l => l.id !== this.livro?.id);
  }

  /**
   * Confirma a sugestão de livro similar e fecha o bottom sheet.
   * @param similarId - ID do livro sugerido como similar
   */
  async confirmarSimilar(similarId: number) {
    if (!this.livro) return;
    this.livrosService.sugerirLivroSimilar(this.livro.id, similarId);
    this.mostrarModalSimilar = false;
    const similar = this.livrosService.getLivroPorId(similarId);
    this.mostrarToast(`"${similar?.titulo}" adicionado como livro similar!`, 'success');
  }

  /**
   * Abre o tweet pré-preenchido para partilhar no Twitter/X.
   */
  partilhar() {
    if (!this.livro) return;
    const texto = encodeURIComponent(
      `Leitura obrigatória! Vejam a minha opinião e recomendações no Papelada`
    );
    const url = encodeURIComponent(`https://papelada.app/livro/${this.livro.id}`);
    const twitterUrl = `https://twitter.com/intent/tweet?text=${texto}&url=${url}`;
    window.open(twitterUrl, '_blank');
  }

  /**
   * Navega para o detalhe de outro livro.
   * @param id - ID do livro destino
   */
  abrirLivro(id: number) {
    this.router.navigate(['/detalhe-livro', id]);
  }

  /**
   * Navega para a página de detalhe da opinião (lista completa).
   */
  verTodasOpinioes() {
    // Mostra o modal de escrita de opinião
    this.escreverOpiniao();
  }

  /**
   * Abre o detalhe de uma opinião específica.
   * @param opiniao - Opinião a abrir
   */
  abrirOpiniao(opiniao: Opiniao) {
    // Já mostrado inline; pode expandir para modal futuramente
  }

  /**
   * Mostra um toast de feedback ao utilizador.
   * @param mensagem - Texto do toast
   * @param cor - Cor do toast (success, warning, danger)
   */
  private async mostrarToast(mensagem: string, cor: string = 'primary') {
    const toast = await this.toastCtrl.create({
      message: mensagem,
      duration: 2000,
      color: cor,
      position: 'bottom'
    });
    await toast.present();
  }
}
