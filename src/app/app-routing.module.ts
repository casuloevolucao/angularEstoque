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
import { TesteComponent } from './teste/teste.component';
import { UsuariosComponent } from './admin/views/usuarios/usuarios.component';
import { OnlineComponent } from './admin/views/online/online.component';
import { ProdutoComponent } from './admin/views/produto/produto.component';
import { CategoriaComponent } from './admin/views/categoria/categoria.component';
import { NotfoundComponent } from './admin/erros/notfound/notfound.component';
import { NotuthorizationComponent } from './admin/erros/notuthorization/notuthorization.component';
import { ChatComponent } from './admin/views/chat/chat.component';

const routes: Routes = [
  {path: "", component: LoginComponent},
  {path: "cadastro", component: CadastroComponent},
  {path: "recuperarsenha", component: ResetComponent},
  {path: "admin", component: AdminComponent, canActivate:[AuthGuardService], children:[
    {path:"", component: HomeComponent},
    {path:"users", canActivate:[AuthGuardService],
      data:{
        permission: 'admin'
      }, component: UsuariosComponent},
    {path:"online", canActivate:[AuthGuardService],
      data:{
        permission: 'admin'
      }, component: OnlineComponent},
    {path:"chat", canActivate:[AuthGuardService],
      data:{
        permission: 'admin'
      }, component: ChatComponent},
    {path:"produtos", canActivate:[AuthGuardService],
      component: ProdutoComponent},
    {path:"categorias", component: CategoriaComponent},
    {path:"authorization", component: NotuthorizationComponent},
    {path:"**", component:NotfoundComponent},
  ]}  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
