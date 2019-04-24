import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from 'src/app/services/login.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/models/usuario.model';


@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent implements OnInit {

  erro:string

  img:File

  form:FormGroup = new FormGroup({
    "nome": new FormControl("", [Validators.required]),
    "email": new FormControl("", [Validators.required, Validators.email]),
    "foto": new FormControl("", [Validators.required]),
    "senha": new FormControl("", [Validators.required, Validators.minLength(6)])
  })

  constructor(
    private loginS:LoginService,
    private usuarioS:UsuarioService,
    private spinner:NgxSpinnerService,
    private toastr:ToastrService
  ) { }

  ngOnInit() {
  }

  getFoto(event:Event){
    this.img = (<HTMLInputElement>event.target).files[0]
  }

  loginFacebook(){
    this.spinner.show()
    this.loginS.loginFacebook()
    .then(()=>{
      this.spinner.hide()
      this.toastr.success("login feito com sucesso!!!")
    })
    .catch((e)=>{
      this.spinner.hide()
      this.erro = this.loginS.erroTratament(e).message
      this.toastr.error(this.loginS.erroTratament(e).message)
    })
  }

  loginGoogle(){
    this.spinner.show()
    this.loginS.loginGoogle()
    .then(()=>{
      this.spinner.hide()
      this.toastr.success("login feito com sucesso!!!")
    })
    .catch((e)=>{
      this.spinner.hide()
      this.erro = this.loginS.erroTratament(e).message
      this.toastr.error(this.loginS.erroTratament(e).message)
    })
  }

  submit(){
    this.spinner.show()
    let usuario:Usuario = new Usuario(this.form.value)
    this.usuarioS.createUser(usuario).then(()=> {
      this.spinner.hide()
      this.toastr.success(`Usuário ${usuario.nome} Criado com sucesso!!!`)
    }).catch((e)=> {
      this.spinner.hide()
      this.erro = this.loginS.erroTratament(e).message
      this.toastr.error(this.loginS.erroTratament(e).message)
    })
  }


}
