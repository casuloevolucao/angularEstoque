//Cinfugrações
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from './services/auth-guard.service';

//Componets
import { AcessoComponent } from './acesso/acesso.component';
import { AdminComponent } from './admin/admin.component';

const routes: Routes = [
  {path: "", component:AcessoComponent},
  {path: "admin", component: AdminComponent, canActivate:[AuthGuardService], children:[
    
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
