import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Usuario } from '../models/usuario.model';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  erro:string

  form:FormGroup = new FormGroup({
    "email": new FormControl("", [Validators.required, Validators.email]),
    "senha": new FormControl("", [Validators.required, Validators.minLength(6)])
  })

  constructor(
    private loginS:LoginService,
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
    console.log(usuario)
    this.loginS.login(usuario).then(()=>{
      this.spinner.hide()
      this.toastr.success(`Usuário ${usuario.email} logado com sucesso!!!`)
    }).catch((e)=>{
      this.spinner.hide()
      this.erro = this.loginS.erroTratament(e).message
      this.toastr.error(this.loginS.erroTratament(e).message)
    })
  }
}
