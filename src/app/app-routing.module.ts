//Cinfugrações
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from './services/auth-guard.service';

//Componets

import { AdminComponent } from './admin/admin.component';
import { LoginComponent } from './acesso/login/login.component';
import { CadastroComponent } from './acesso/cadastro/cadastro.component';
import { ResetComponent } from './acesso/reset/reset.component';
import { HomeComponent } from './admin/views/home/home.component';

const routes: Routes = [
  {path: "", component: LoginComponent},
  {path: "cadastro", component: CadastroComponent},
  {path: "recuperarsenha", component: ResetComponent},
  {path: "admin", component: AdminComponent, canActivate:[AuthGuardService], children:[
    {path:"", component: HomeComponent}
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
