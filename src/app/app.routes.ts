import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { authGuard } from './guards/auth-guard';
import { Posts } from './pages/admin/posts/posts';
import { Categories } from './pages/admin/categories/categories';
import { Stats } from './pages/admin/stats/stats';
import { Register } from './pages/register/register';

export const routes: Routes = [
  { path: '', component: Home },
  {
    path: 'post/:id',
    loadComponent: () => import('./pages/post-details/post-details').then((m) => m.PostDetails),
  },
  { path: 'login', loadComponent: () => import('./pages/login/login').then((m) => m.Login) },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register').then((m) => m.Register),
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/admin/admin').then((m) => m.Admin),
    children: [
      { path: '', redirectTo: 'posts', pathMatch: 'full' },
      { path: 'posts', component: Posts },
      { path: 'categories', component: Categories },
      { path: 'stats', component: Stats },
    ],
  },
  { path: '**', redirectTo: '' },
];
