import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TableroComponent } from './components/tablero/tablero.component';
import { LoginComponent } from './components/login/login.component';
import { RegistroComponent } from './components/registro/registro.component';
import { ConfiguracionComponent } from './components/configuracion/configuracion.component';
import { NoEncontradoComponent } from './components/no-encontrado/no-encontrado.component';

const routes: Routes = [
  {path: '', component: TableroComponent},
  {path: 'login', component: LoginComponent},
  {path: 'registro', component: RegistroComponent},
  {path: 'configuracion', component: ConfiguracionComponent},
  {path: '**', component: NoEncontradoComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
