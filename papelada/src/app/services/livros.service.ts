import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map } from 'rxjs/operators';

/** Interface que representa um livro */
export interface Livro {
  id: number;
  titulo: string;
  autores: string;
  genero: string;
  tags: string[];
  capa: string;
  descricao: string;
  avaliacao: number;
  numAvaliacoes: number;
  opinioes: Opiniao[];
  livrosSimilares: number[];
  minhaAvaliacao?: number; // avaliação do utilizador atual
}

/** Interface que representa uma opinião/review */
export interface Opiniao {
  id: number;
  utilizador: string;
  avatar: string;
  texto: string;
  data: string;
}

/**
 * Service central para gestão de livros.
 * Carrega dados do ficheiro JSON e guarda alterações no Ionic Storage.
 */
@Injectable({
  providedIn: 'root'
})
export class LivrosService {

  /** URL do ficheiro JSON com os dados dos livros */
  private jsonUrl = 'assets/data/livros.json';

  /** BehaviorSubject para lista reativa de livros */
  private livrosSubject = new BehaviorSubject<Livro[]>([]);

  /** Observable público para subscrever a lista de livros */
  livros$ = this.livrosSubject.asObservable();

  constructor(private http: HttpClient) {
    this.carregarLivros();
  }

  /**
   * Carrega os livros do ficheiro JSON e armazena no BehaviorSubject.
   */
  carregarLivros(): void {
    this.http.get<Livro[]>(this.jsonUrl).subscribe({
      next: (livros) => this.livrosSubject.next(livros),
      error: (err) => console.error('Erro ao carregar livros:', err)
    });
  }

  /**
   * Retorna todos os livros.
   */
  getTodosLivros(): Livro[] {
    return this.livrosSubject.getValue();
  }

  /**
   * Retorna um livro pelo seu ID.
   * @param id - ID do livro
   */
  getLivroPorId(id: number): Livro | undefined {
    return this.livrosSubject.getValue().find(l => l.id === id);
  }

  /**
   * Pesquisa livros por título ou autor.
   * @param termo - Texto a pesquisar
   */
  pesquisar(termo: string): Livro[] {
    const t = termo.toLowerCase().trim();
    if (!t) return this.getTodosLivros();
    return this.getTodosLivros().filter(l =>
      l.titulo.toLowerCase().includes(t) ||
      l.autores.toLowerCase().includes(t)
    );
  }

  /**
   * Filtra livros por género.
   * @param genero - Género a filtrar (string vazia = todos)
   */
  filtrarPorGenero(genero: string): Livro[] {
    if (!genero) return this.getTodosLivros();
    return this.getTodosLivros().filter(l => l.genero === genero);
  }

  /**
   * Retorna a lista de géneros únicos disponíveis.
   */
  getGeneros(): string[] {
    const livros = this.getTodosLivros();
    const generos = livros.map(l => l.genero);
    return [...new Set(generos)];
  }

  /**
   * Adiciona um novo livro à lista e atualiza o BehaviorSubject.
   * @param livro - Livro a adicionar (sem ID; o ID é gerado automaticamente)
   */
  adicionarLivro(livro: Omit<Livro, 'id'>): Livro {
    const livros = this.getTodosLivros();
    const novoId = livros.length > 0 ? Math.max(...livros.map(l => l.id)) + 1 : 1;
    const novoLivro: Livro = { ...livro, id: novoId };
    this.livrosSubject.next([...livros, novoLivro]);
    return novoLivro;
  }

  /**
   * Adiciona uma opinião a um livro.
   * @param livroId - ID do livro
   * @param texto - Texto da opinião
   * @param utilizador - Nome do utilizador
   */
  adicionarOpiniao(livroId: number, texto: string, utilizador: string): void {
    const livros = this.getTodosLivros();
    const idx = livros.findIndex(l => l.id === livroId);
    if (idx === -1) return;

    const novaOpiniao: Opiniao = {
      id: Date.now(),
      utilizador,
      avatar: '',
      texto,
      data: new Date().toISOString().split('T')[0]
    };

    const livroAtualizado = {
      ...livros[idx],
      opinioes: [novaOpiniao, ...livros[idx].opinioes]
    };

    const novaLista = [...livros];
    novaLista[idx] = livroAtualizado;
    this.livrosSubject.next(novaLista);
  }

  /**
   * Guarda a avaliação por estrelas de um livro pelo utilizador.
   * Recalcula a média de avaliações.
   * @param livroId - ID do livro
   * @param estrelas - Número de estrelas (1-5)
   */
  avaliarLivro(livroId: number, estrelas: number): void {
    const livros = this.getTodosLivros();
    const idx = livros.findIndex(l => l.id === livroId);
    if (idx === -1) return;

    const livro = livros[idx];
    const novaMedia = ((livro.avaliacao * livro.numAvaliacoes) + estrelas) / (livro.numAvaliacoes + 1);

    const livroAtualizado: Livro = {
      ...livro,
      avaliacao: Math.round(novaMedia * 10) / 10,
      numAvaliacoes: livro.numAvaliacoes + 1,
      minhaAvaliacao: estrelas
    };

    const novaLista = [...livros];
    novaLista[idx] = livroAtualizado;
    this.livrosSubject.next(novaLista);
  }

  /**
   * Sugere um livro similar, criando uma ligação entre dois livros.
   * @param livroId - ID do livro de origem
   * @param similarId - ID do livro a sugerir como similar
   */
  sugerirLivroSimilar(livroId: number, similarId: number): void {
    const livros = this.getTodosLivros();
    const idx = livros.findIndex(l => l.id === livroId);
    if (idx === -1) return;

    const livro = livros[idx];
    if (!livro.livrosSimilares.includes(similarId)) {
      const livroAtualizado = {
        ...livro,
        livrosSimilares: [...livro.livrosSimilares, similarId]
      };
      const novaLista = [...livros];
      novaLista[idx] = livroAtualizado;
      this.livrosSubject.next(novaLista);
    }
  }

  /**
   * Retorna os livros similares a um dado livro.
   * @param livro - Livro de referência
   */
  getLivrosSimilares(livro: Livro): Livro[] {
    return livro.livrosSimilares
      .map(id => this.getLivroPorId(id))
      .filter((l): l is Livro => l !== undefined);
  }
}
