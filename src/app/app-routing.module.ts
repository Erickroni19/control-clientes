import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RegisterComponent } from './auth/pages/register/register.component';
import { ConfigurationComponent } from './components/configuration/configuration.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

const routes: Routes = [
  {path: '', component: DashboardComponent},
  {path: 'auth', loadChildren: () => import('./auth/auth.module').then( m => m.AuthModule )},
  // {path: 'login', component: LoginComponent},
  // {path: 'registrarse', component: RegisterComponent},
  // {path: 'configuracion', component: ConfigurationComponent},
  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
