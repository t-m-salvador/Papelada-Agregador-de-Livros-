import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Storage } from '@ionic/storage-angular';

/** Interface que representa o perfil do utilizador */
export interface Utilizador {
  nome: string;
  email: string;
  avatar: string;
  membroDesde: string;
}

/**
 * Service para gestão do perfil do utilizador.
 * Guarda e carrega dados usando Ionic Storage (req. 9).
 */
@Injectable({
  providedIn: 'root'
})
export class UtilizadorService {

  /** Chave usada para guardar o perfil no Ionic Storage */
  private readonly STORAGE_KEY = 'papelada_utilizador';

  /** Perfil padrão */
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

  /** Indica se o Storage já foi inicializado */
  private storageReady = false;

  constructor(private storage: Storage) {
    this.inicializar();
  }

  /**
   * Inicializa o Ionic Storage e carrega o perfil guardado.
   */
  async inicializar() {
    await this.storage.create();
    this.storageReady = true;
    await this.carregarPerfil();
  }

  /**
   * Carrega o perfil do utilizador do Ionic Storage.
   */
  async carregarPerfil() {
    const perfil = await this.storage.get(this.STORAGE_KEY);
    if (perfil) {
      this.utilizadorSubject.next(perfil);
    }
  }

  /**
   * Retorna o perfil atual do utilizador.
   */
  getPerfil(): Utilizador {
    return this.utilizadorSubject.getValue();
  }

  /**
   * Atualiza o perfil do utilizador e guarda no Ionic Storage.
   * @param dados - Dados parciais a atualizar
   */
  async atualizarPerfil(dados: Partial<Utilizador>) {
    const perfilAtualizado: Utilizador = { ...this.getPerfil(), ...dados };
    await this.storage.set(this.STORAGE_KEY, perfilAtualizado);
    this.utilizadorSubject.next(perfilAtualizado);
  }

  /**
   * Apaga o perfil do utilizador do Ionic Storage e repõe o padrão.
   */
  async apagarConta() {
    await this.storage.remove(this.STORAGE_KEY);
    this.utilizadorSubject.next(this.perfilPadrao);
  }
}
