import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LivrosService, Livro, Opiniao } from '../services/livros.service';

/** Interface auxiliar para opiniões com referência ao livro */
interface OpiniaoComLivro extends Opiniao {
  livroId: number;
  livroTitulo: string;
}

/**
 * HomePage — Página principal da app Papelada.
 * Mostra barra de pesquisa, livros em alta e opiniões recentes.
 */
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {

  /** Termo atual de pesquisa */
  termoPesquisa: string = '';

  /** Resultados da pesquisa */
  resultadosPesquisa: Livro[] = [];

  /** Livros em destaque para a secção "Em Alta" */
  livrosEmAlta: Livro[] = [];

  /** Opiniões recentes de todos os livros */
  opinioesPaginadas: OpiniaoComLivro[] = [];

  /** Controla visibilidade do modal de opinião completa */
  mostrarModalOpiniao: boolean = false;

  /** Opinião selecionada para ver no modal */
  opiniaoSelecionada: OpiniaoComLivro | null = null;

  constructor(
    private livrosService: LivrosService,
    private router: Router
  ) {}

  ngOnInit() {
    this.livrosService.livros$.subscribe((livros: Livro[]) => {
      // Top 5 por avaliação para "Em Alta"
      this.livrosEmAlta = [...livros]
        .sort((a: Livro, b: Livro) => b.avaliacao - a.avaliacao)
        .slice(0, 5);

      // Recolher opiniões de todos os livros sem flatMap (compatibilidade ES5)
      const todasOpinioes: OpiniaoComLivro[] = [];
      livros.forEach((livro: Livro) => {
        livro.opinioes.forEach((op: Opiniao) => {
          todasOpinioes.push({
            ...op,
            livroId: livro.id,
            livroTitulo: livro.titulo
          });
        });
      });

      this.opinioesPaginadas = todasOpinioes
        .sort((a: OpiniaoComLivro, b: OpiniaoComLivro) =>
          new Date(b.data).getTime() - new Date(a.data).getTime()
        )
        .slice(0, 10);
    });
  }

  /**
   * Executa pesquisa ao digitar na searchbar.
   * @param event - Evento de input da searchbar
   */
  pesquisar(event: any) {
    const termo = event.target?.value || '';
    this.termoPesquisa = termo;
    this.resultadosPesquisa = this.livrosService.pesquisar(termo);
  }

  /**
   * Navega para a página de detalhe do livro.
   * @param id - ID do livro
   */
  abrirLivro(id: number) {
    this.router.navigate(['/detalhe-livro', id]);
  }

  /**
   * Navega para a biblioteca.
   */
  verTodos() {
    this.router.navigate(['/tabs/minhabiblioteca']);
  }

  /**
   * Abre o modal com a opinião completa.
   * @param opiniao - Opinião a exibir
   */
  abrirOpiniao(opiniao: OpiniaoComLivro) {
    this.opiniaoSelecionada = opiniao;
    this.mostrarModalOpiniao = true;
  }
}
