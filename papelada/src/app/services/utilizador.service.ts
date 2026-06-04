import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/** Interface que representa o perfil do utilizador */
export interface Utilizador {
  nome: string;
  email: string;
  avatar: string;
  membroDesde: string;
}

/**
 * Service para gestão do perfil do utilizador.
 * Guarda e carrega dados usando localStorage (substituível por Ionic Storage).
 */
@Injectable({
  providedIn: 'root'
})
export class UtilizadorService {

  /** Chave usada para guardar o perfil no storage */
  private readonly STORAGE_KEY = 'papelada_utilizador';

  /** Perfil padrão para utilizador não autenticado */
  private perfilPadrao: Utilizador = {
    nome: 'José Vieira',
    email: 'joseviera@email.com',
    avatar: '',
    membroDesde: '2025'
  };

  /** BehaviorSubject reativo com o perfil atual */
  private utilizadorSubject = new BehaviorSubject<Utilizador>(this.perfilPadrao);

  /** Observable público para subscrever o perfil */
  utilizador$ = this.utilizadorSubject.asObservable();

  constructor() {
    this.carregarPerfil();
  }

  /**
   * Carrega o perfil do utilizador do localStorage.
   */
  carregarPerfil(): void {
    const guardado = localStorage.getItem(this.STORAGE_KEY);
    if (guardado) {
      try {
        const perfil: Utilizador = JSON.parse(guardado);
        this.utilizadorSubject.next(perfil);
      } catch (e) {
        console.error('Erro ao carregar perfil:', e);
        this.utilizadorSubject.next(this.perfilPadrao);
      }
    }
  }

  /**
   * Retorna o perfil atual do utilizador.
   */
  getPerfil(): Utilizador {
    return this.utilizadorSubject.getValue();
  }

  /**
   * Atualiza o perfil do utilizador e guarda no localStorage.
   * @param dados - Dados parciais a atualizar (nome e/ou email)
   */
  atualizarPerfil(dados: Partial<Utilizador>): void {
    const perfilAtual = this.getPerfil();
    const perfilAtualizado: Utilizador = { ...perfilAtual, ...dados };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(perfilAtualizado));
    this.utilizadorSubject.next(perfilAtualizado);
  }

  /**
   * Apaga o perfil do utilizador do localStorage e repõe o padrão.
   */
  apagarConta(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.utilizadorSubject.next(this.perfilPadrao);
  }
}
