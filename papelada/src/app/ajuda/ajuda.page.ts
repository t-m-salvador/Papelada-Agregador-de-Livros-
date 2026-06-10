import { Component } from '@angular/core';

/** Interface para um passo de ajuda */
interface Passo {
  num: number;
  titulo: string;
  descricao: string;
}

/** Interface explícita para os passos (evita index signature) */
interface Passos {
  avaliar: Passo[];
  adicionar: Passo[];
  opiniao: Passo[];
  perfil: Passo[];
  pesquisa: Passo[];
}

/**
 * AjudaPage — Página de ajuda acessível a partir do Meu Perfil.
 * Apresenta instruções para cada funcionalidade da app em acordeão.
 */
@Component({
  selector: 'app-ajuda',
  templateUrl: './ajuda.page.html',
  styleUrls: ['./ajuda.page.scss'],
  standalone: false,
})
export class AjudaPage {

  /** Passos de ajuda organizados por funcionalidade */
  passos: Passos = {

    avaliar: [
      { num: 1, titulo: 'Pesquisa o livro', descricao: 'Na página principal, usa a barra de pesquisa no topo para encontrar o livro que queres avaliar.' },
      { num: 2, titulo: 'Abre a página do livro', descricao: 'Toca no resultado da pesquisa para aceder à página de detalhe do livro.' },
      { num: 3, titulo: 'Toca nas estrelas', descricao: 'Na secção de avaliação, toca na estrela correspondente à pontuação que queres dar (1 a 5 estrelas).' },
      { num: 4, titulo: 'Confirmação', descricao: 'Aparece uma mensagem de confirmação e a média do livro é atualizada automaticamente.' },
    ],

    adicionar: [
      { num: 1, titulo: 'Vai ao separador "Adicionar Livro"', descricao: 'Toca no ícone "+" na barra de navegação inferior.' },
      { num: 2, titulo: 'Fotografa a capa', descricao: 'Toca na área de imagem para abrir a câmara ou a galeria e selecionar a fotografia da capa.' },
      { num: 3, titulo: 'Preenche o formulário', descricao: 'Escreve o título, o nome do(s) autor(es), seleciona o género e adiciona uma tag (tema).' },
      { num: 4, titulo: 'Publica o livro', descricao: 'Toca em "Adicionar". O livro fica disponível no catálogo global para todos os utilizadores.' },
    ],

    opiniao: [
      { num: 1, titulo: 'Abre a página do livro', descricao: 'Pesquisa o livro e toca no resultado para aceder ao seu detalhe.' },
      { num: 2, titulo: 'Escreve a tua opinião', descricao: 'Na secção "Opinião", toca no ícone de lápis (✎) para abrir o editor de crítica.' },
      { num: 3, titulo: 'Submete a crítica', descricao: 'Escreve a tua opinião e toca em "Confirmar" para a publicar.' },
      { num: 4, titulo: 'Sugere um livro similar', descricao: 'Toca em "Sugerir Livro Similar", pesquisa e seleciona um livro para criar uma ligação entre as duas obras.' },
      { num: 5, titulo: 'Partilha no Twitter/X', descricao: 'Toca no ícone do Twitter/X no topo da página para partilhar a tua opinião com um link para o livro.' },
    ],

    perfil: [
      { num: 1, titulo: 'Vai ao separador "Meu Perfil"', descricao: 'Toca no ícone de pessoa na barra de navegação inferior.' },
      { num: 2, titulo: 'Edita as tuas informações', descricao: 'Toca em "Alterar Informações" para mudar o teu nome ou email. As alterações ficam guardadas automaticamente.' },
      { num: 3, titulo: 'Altera a autenticação', descricao: 'Toca em "Alterar Informações de Autenticação" para atualizar o teu email de acesso ou palavra-passe.' },
    ],

    pesquisa: [
      { num: 1, titulo: 'Usa a barra de pesquisa', descricao: 'Na página principal, toca na barra de pesquisa no topo e começa a escrever o título ou o nome do autor.' },
      { num: 2, titulo: 'Resultados em tempo real', descricao: 'Os resultados aparecem automaticamente enquanto escreves — não precisas de premir "Enter".' },
      { num: 3, titulo: 'Filtra por género', descricao: 'Na página "Minha Biblioteca", usa os filtros de género na parte superior para ver apenas livros de uma categoria.' },
      { num: 4, titulo: 'Ordena a lista', descricao: 'Usa o menu de ordenação para organizar os livros por ordem alfabética ou por avaliação.' },
    ],
  };

  /** Descrição de cada tab da barra de navegação */
  tabs = [
    { icone: 'search-outline',     nome: 'Procurar',         descricao: 'Pesquisa livros e vê os destaques e opiniões recentes.' },
    { icone: 'bookmark-outline',   nome: 'Minha Biblioteca', descricao: 'Explora todos os livros com filtros por género e ordenação.' },
    { icone: 'add-circle-outline', nome: 'Adicionar Livro',  descricao: 'Fotografa e cataloga um novo livro no Papelada.' },
    { icone: 'person-outline',     nome: 'Meu Perfil',       descricao: 'Gere o teu perfil e acede às definições e ajuda.' },
  ];
}
