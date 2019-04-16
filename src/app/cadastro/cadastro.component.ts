import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { UsuarioService } from '../services/usuario.service';
import { Usuario } from '../models/usuario.model';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent implements OnInit {

  erro:string

  form:FormGroup = new FormGroup({
    "nome": new FormControl("", [Validators.required]),
    "email": new FormControl("", [Validators.required, Validators.email]),
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
