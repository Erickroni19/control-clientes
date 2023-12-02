import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TableroComponent } from './components/tablero/tablero.component';
import { LoginComponent } from './components/login/login.component';
import { RegistroComponent } from './components/registro/registro.component';
import { ConfiguracionComponent } from './components/configuracion/configuracion.component';
import { NoEncontradoComponent } from './components/no-encontrado/no-encontrado.component';
import { AuthGuard } from './guard/auth.guard';

const routes: Routes = [
  {path: '', component: TableroComponent, canActivate: [AuthGuard]},
  {path: 'login', component: LoginComponent},
  {path: 'registro', component: RegistroComponent, canActivate: [AuthGuard]},
  {path: 'configuracion', component: ConfiguracionComponent},
  {path: '**', component: NoEncontradoComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
