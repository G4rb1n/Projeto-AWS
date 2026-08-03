import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout.component';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'produtos',
    pathMatch: 'full'
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'produtos',
        loadComponent: () =>
          import('./features/produtos/produto-list/produto-list.component').then(
            (m) => m.ProdutoListComponent
          ),
      },
      {
        path: 'usuarios',
        loadComponent: () =>
          import('./features/usuarios/usuario-list/usuario-list.component').then(
            (m) => m.UsuarioListComponent
          ),
        canActivate: [roleGuard],
        data: { expectedRole: 'GERENTE' }
      },
      {
        path: 'operacoes',
        loadComponent: () =>
          import('./features/operacoes/operacao-list/operacao-list.component').then(
            (m) => m.OperacaoListComponent
          ),
      },
      {
        path: 'categorias',
        loadComponent: () =>
          import('./features/categorias/categoria-list.component').then(
            (m) => m.CategoriaListComponent
          ),
      },
      {
        path: 'tags',
        loadComponent: () =>
          import('./features/tags/tag-list.component').then(
            (m) => m.TagListComponent
          ),
      },
      {
        path: '',
        redirectTo: 'produtos',
        pathMatch: 'full'
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'produtos'
  },
];
