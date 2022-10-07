import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'reset-password',
    loadChildren: () => import('./pages/reset-password/reset-password.module').then(m => m.ResetPasswordPageModule)
  },
  {
    path: 'user-profile',
    loadChildren: () => import('./pages/user-profile/user-profile/user-profile.module').then(m => m.UserProfilePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'blog-posts',
    loadChildren: () => import('./pages/blog-posts/blog-posts.module').then(m => m.BlogPostsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'blog-post-view/:id',
    loadChildren: () => import('./pages/blog-post-view/blog-post-view.module').then(m => m.BlogPostViewPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'tax-news',
    loadChildren: () => import('./pages/tax-news/tax-news.module').then(m => m.TaxNewsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'laws/:groupCode/:lawCode/:code',
    loadChildren: () => import('./pages/laws/laws.module').then(m => m.LawsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'bookmarks',
    loadChildren: () => import('./pages/bookmarks/bookmarks.module').then(m => m.BookmarksPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'videos',
    loadChildren: () => import('./pages/videos/videos.module').then(m => m.VideosPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'questions',
    loadChildren: () => import('./pages/questions/questions.module').then(m => m.QuestionsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'contact',
    loadChildren: () => import('./pages/contact/contact.module').then(m => m.ContactPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'blog-post-list/:category',
    loadChildren: () => import('./pages/blog-post-list/blog-post-list.module').then(m => m.BlogPostListPageModule),
    canActivate: [AuthGuard]
  },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
