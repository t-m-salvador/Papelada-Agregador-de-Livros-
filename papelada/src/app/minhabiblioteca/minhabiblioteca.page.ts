import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LivrosService, Livro } from '../services/livros.service';

/**
 * MinhabibliotecaPage — Lista todos os livros com filtros por género e ordenação.
 */
@Component({
  selector: 'app-minhabiblioteca',
  templateUrl: './minhabiblioteca.page.html',
  styleUrls: ['./minhabiblioteca.page.scss'],
  standalone: false,
})
export class MinhabibliotecaPage implements OnInit {

  /** Lista de livros após filtro e ordenação */
  livrosFiltrados: Livro[] = [];

  /** Lista de géneros disponíveis */
  generos: string[] = [];

  /** Género atualmente selecionado no segmento */
  generoSelecionado: string = '';

  /** Ordenação atual */
  ordenacao: string = 'titulo-asc';

  /** Vista em grelha (true) ou lista (false) */
  vistaGrelha: boolean = true;

  /** Filtro ativo (para mostrar no título) */
  filtroAtivo: string = '';

  private todosLivros: Livro[] = [];

  constructor(
    private livrosService: LivrosService,
    private router: Router
  ) {}

  ngOnInit() {
    // Subscrever lista reativa
    this.livrosService.livros$.subscribe(livros => {
      this.todosLivros = livros;
      this.generos = this.livrosService.getGeneros();
      this.aplicarFiltroOrdenacao();
    });
  }

  /**
   * Filtra livros pelo género selecionado no ion-segment.
   */
  filtrarPorGenero() {
    this.filtroAtivo = this.generoSelecionado;
    this.aplicarFiltroOrdenacao();
  }

  /**
   * Ordena os livros filtrados conforme a opção selecionada.
   */
  ordenarLivros() {
    this.aplicarFiltroOrdenacao();
  }

  /**
   * Aplica o filtro de género e a ordenação sobre a lista completa.
   */
  private aplicarFiltroOrdenacao() {
    let lista = this.generoSelecionado
      ? this.todosLivros.filter(l => l.genero === this.generoSelecionado)
      : [...this.todosLivros];

    switch (this.ordenacao) {
      case 'titulo-asc':
        lista.sort((a, b) => a.titulo.localeCompare(b.titulo));
        break;
      case 'titulo-desc':
        lista.sort((a, b) => b.titulo.localeCompare(a.titulo));
        break;
      case 'avaliacao-desc':
        lista.sort((a, b) => b.avaliacao - a.avaliacao);
        break;
    }

    this.livrosFiltrados = lista;
  }

  /**
   * Limpa o filtro de género.
   */
  limparFiltro() {
    this.generoSelecionado = '';
    this.filtroAtivo = '';
    this.aplicarFiltroOrdenacao();
  }

  /**
   * Alterna entre vista em grelha e em lista.
   */
  toggleVista() {
    this.vistaGrelha = !this.vistaGrelha;
  }

  /**
   * Navega para o detalhe do livro selecionado.
   * @param id - ID do livro
   */
  abrirLivro(id: number) {
    this.router.navigate(['/detalhe-livro', id]);
  }
}
