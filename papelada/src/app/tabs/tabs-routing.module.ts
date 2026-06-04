import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('../home/home.module').then(m => m.HomePageModule)
      },
      {
        path: 'minhabiblioteca',
        loadChildren: () => import('../minhabiblioteca/minhabiblioteca.module').then(m => m.MinhabibliotecaPageModule)
      },
      {
        path: 'adicionar-livro',
        loadChildren: () => import('../adicionar-livro/adicionar-livro.module').then(m => m.AdicionarLivroPageModule)
      },
      {
        path: 'meu-perfil',
        loadChildren: () => import('../meu-perfil/meu-perfil.module').then(m => m.MeuPerfilPageModule)
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsRoutingModule {}
