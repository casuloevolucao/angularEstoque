import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';
import { environment } from '../environments/environment';
import { AngularFireModule } from "@angular/fire";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { AngularFireStorageModule } from "@angular/fire/storage";
import { ReactiveFormsModule } from "@angular/forms";
import { DataTablesModule } from 'angular-datatables';

//Services
import { AuthGuardService } from './services/auth-guard.service';
import { LoginService } from './services/login.service';
import { CategoriaService } from './services/categoria.service';
import { produtoService } from './services/produto.service';
import { RelatorioService } from './services/relatorio.service';

//Componets
import { AppComponent } from './app.component';
import { AcessoComponent } from './acesso/acesso.component';
import { AdminComponent } from './admin/admin.component';
import { LoginComponent } from './acesso/login/login.component';
import { CadastroComponent } from './acesso/cadastro/cadastro.component';
import { ResetComponent } from './acesso/reset/reset.component';


@NgModule({
  declarations: [
    AppComponent,
    AcessoComponent,
    AdminComponent,
    LoginComponent,
    CadastroComponent,
    ResetComponent,
    
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CommonModule,
    ToastrModule.forRoot(),
    NgxSpinnerModule,
    DataTablesModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    ReactiveFormsModule
  ],
  providers: [
    AuthGuardService,
    LoginService,
    CategoriaService,
    produtoService,
    RelatorioService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
