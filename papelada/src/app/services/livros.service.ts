import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Storage } from '@ionic/storage-angular';

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
  minhaAvaliacao?: number;
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
 * Carrega dados base do ficheiro JSON (req. 10) e persiste
 * livros adicionados pelo utilizador no Ionic Storage (req. 9).
 */
@Injectable({
  providedIn: 'root'
})
export class LivrosService {

  /** URL do ficheiro JSON com os dados base dos livros */
  private jsonUrl = 'assets/data/livros.json';

  /** Chave no Ionic Storage para livros adicionados pelo utilizador */
  private readonly STORAGE_KEY_LIVROS = 'papelada_livros_extra';

  /** Chave no Ionic Storage para avaliações do utilizador */
  private readonly STORAGE_KEY_AVALIACOES = 'papelada_avaliacoes';

  /** BehaviorSubject para lista reativa de livros */
  private livrosSubject = new BehaviorSubject<Livro[]>([]);

  /** Observable público para subscrever a lista de livros */
  livros$ = this.livrosSubject.asObservable();

  constructor(
    private http: HttpClient,
    private storage: Storage
  ) {
    this.inicializar();
  }

  /**
   * Inicializa o Storage e carrega os livros (JSON + Storage).
   */
  async inicializar() {
    await this.storage.create();
    await this.carregarLivros();
  }

  /**
   * Carrega livros do JSON e combina com livros guardados no Storage.
   */
  async carregarLivros() {
    // 1. Carregar livros base do ficheiro JSON (req. 10)
    this.http.get<Livro[]>(this.jsonUrl).subscribe(async (livrosJson: Livro[]) => {

      // 2. Carregar livros extra adicionados pelo utilizador (Ionic Storage)
      const livrosExtra: Livro[] = (await this.storage.get(this.STORAGE_KEY_LIVROS)) || [];

      // 3. Carregar avaliações guardadas pelo utilizador
      const avaliacoes: { [id: number]: number } = (await this.storage.get(this.STORAGE_KEY_AVALIACOES)) || {};

      // 4. Aplicar avaliações guardadas aos livros
      const livrosComAvaliacoes = livrosJson.map((l: Livro) => ({
        ...l,
        minhaAvaliacao: avaliacoes[l.id] || 0
      }));

      // 5. Combinar livros JSON com livros do utilizador
      this.livrosSubject.next([...livrosComAvaliacoes, ...livrosExtra]);
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
    return this.livrosSubject.getValue().find((l: Livro) => l.id === id);
  }

  /**
   * Pesquisa livros por título ou autor.
   * @param termo - Texto a pesquisar
   */
  pesquisar(termo: string): Livro[] {
    const t = termo.toLowerCase().trim();
    if (!t) return this.getTodosLivros();
    return this.getTodosLivros().filter((l: Livro) =>
      l.titulo.toLowerCase().includes(t) ||
      l.autores.toLowerCase().includes(t)
    );
  }

  /**
   * Filtra livros por género.
   * @param genero - Género a filtrar
   */
  filtrarPorGenero(genero: string): Livro[] {
    if (!genero) return this.getTodosLivros();
    return this.getTodosLivros().filter((l: Livro) => l.genero === genero);
  }

  /**
   * Retorna géneros únicos disponíveis.
   */
  getGeneros(): string[] {
    const generos = this.getTodosLivros().map((l: Livro) => l.genero);
    return [...new Set(generos)];
  }

  /**
   * Adiciona um novo livro e guarda no Ionic Storage.
   * @param livro - Livro a adicionar (sem ID)
   */
  async adicionarLivro(livro: Omit<Livro, 'id'>): Promise<Livro> {
    const livros = this.getTodosLivros();
    const novoId = livros.length > 0 ? Math.max(...livros.map((l: Livro) => l.id)) + 1 : 100;
    const novoLivro: Livro = { ...livro, id: novoId };

    // Guardar apenas os livros adicionados pelo utilizador no Storage
    const livrosExtra: Livro[] = (await this.storage.get(this.STORAGE_KEY_LIVROS)) || [];
    livrosExtra.push(novoLivro);
    await this.storage.set(this.STORAGE_KEY_LIVROS, livrosExtra);

    this.livrosSubject.next([...livros, novoLivro]);
    return novoLivro;
  }

  /**
   * Adiciona uma opinião a um livro e atualiza o Storage.
   * @param livroId - ID do livro
   * @param texto - Texto da opinião
   * @param utilizador - Nome do utilizador
   */
  async adicionarOpiniao(livroId: number, texto: string, utilizador: string) {
    const livros = this.getTodosLivros();
    const idx = livros.findIndex((l: Livro) => l.id === livroId);
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

    // Persistir opiniões de livros extra no Storage
    await this.persistirLivrosExtra(novaLista);
  }

  /**
   * Avalia um livro e persiste a avaliação no Ionic Storage.
   * @param livroId - ID do livro
   * @param estrelas - Número de estrelas (1-5)
   */
  async avaliarLivro(livroId: number, estrelas: number) {
    const livros = this.getTodosLivros();
    const idx = livros.findIndex((l: Livro) => l.id === livroId);
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

    // Guardar avaliação no Storage
    const avaliacoes: { [id: number]: number } = (await this.storage.get(this.STORAGE_KEY_AVALIACOES)) || {};
    avaliacoes[livroId] = estrelas;
    await this.storage.set(this.STORAGE_KEY_AVALIACOES, avaliacoes);
  }

  /**
   * Sugere um livro similar criando uma ligação entre dois livros.
   * @param livroId - ID do livro de origem
   * @param similarId - ID do livro similar
   */
  async sugerirLivroSimilar(livroId: number, similarId: number) {
    const livros = this.getTodosLivros();
    const idx = livros.findIndex((l: Livro) => l.id === livroId);
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
      await this.persistirLivrosExtra(novaLista);
    }
  }

  /**
   * Retorna os livros similares a um dado livro.
   * @param livro - Livro de referência
   */
  getLivrosSimilares(livro: Livro): Livro[] {
    return livro.livrosSimilares
      .map((id: number) => this.getLivroPorId(id))
      .filter((l): l is Livro => l !== undefined);
  }

  /**
   * Persiste no Storage apenas os livros com ID >= 100 (adicionados pelo utilizador).
   * @param livros - Lista completa de livros
   */
  private async persistirLivrosExtra(livros: Livro[]) {
    const livrosExtra = livros.filter((l: Livro) => l.id >= 100);
    await this.storage.set(this.STORAGE_KEY_LIVROS, livrosExtra);
  }
}
