import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID  } from '@angular/core';
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
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
registerLocaleData(localePt);

//ngx-bootstrap
import { ModalModule } from 'ngx-bootstrap/modal'; 
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

//Services
import { AuthGuardService } from './services/auth-guard.service';
import { LoginService } from './services/login.service';
import { CategoriaService } from './services/categoria.service';
import { produtoService } from './services/produto.service';
import { UsuarioService } from './services/usuario.service';

//Componets
import { AppComponent } from './app.component';
import { AdminComponent } from './admin/admin.component';
import { LoginComponent } from './acesso/login/login.component';
import { CadastroComponent } from './acesso/cadastro/cadastro.component';
import { ResetComponent } from './acesso/reset/reset.component';
import { HomeComponent } from './admin/views/home/home.component';
import { CategoriaComponent } from './admin/views/categoria/categoria.component';
import { ProdutoComponent } from './admin/views/produto/produto.component';
import { SidebarComponent } from './admin/sidebar/sidebar.component';
import { HeaderComponent } from './admin/header/header.component';
import { FooterComponent } from './admin/footer/footer.component';
import { CompareValidatorDirective } from './directives/compare-validator.directive';
import { TesteComponent } from './teste/teste.component';
import { UsuariosComponent } from './admin/views/usuarios/usuarios.component';
import { OnlineComponent } from './admin/views/online/online.component';
import { NotfoundComponent } from './admin/erros/notfound/notfound.component';
import { NotuthorizationComponent } from './admin/erros/notuthorization/notuthorization.component';
import { ChatComponent } from './admin/views/chat/chat.component';
import { MessagemService } from './services/messagem.service';
import { ProdutosdesativadoComponent } from './admin/views/produtosdesativado/produtosdesativado.component';
import { CategoriadesativadoComponent } from './admin/views/categoriadesativado/categoriadesativado.component';
import { PerfilComponent } from './admin/views/perfil/perfil.component';

@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    LoginComponent,
    CadastroComponent,
    ResetComponent,
    HomeComponent,
    CategoriaComponent,
    ProdutoComponent,
    SidebarComponent,
    HeaderComponent,
    FooterComponent,
    CompareValidatorDirective,
    TesteComponent,
    UsuariosComponent,
    OnlineComponent,
    NotfoundComponent,
    NotuthorizationComponent,
    ChatComponent,
    ProdutosdesativadoComponent,
    CategoriadesativadoComponent,
    PerfilComponent,
  ],
  imports: [
    BrowserModule,
    DataTablesModule,
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
    ReactiveFormsModule,
    ModalModule.forRoot(),
    BsDatepickerModule.forRoot()
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    AuthGuardService,
    LoginService,
    UsuarioService,
    CategoriaService,
    produtoService,
    MessagemService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}