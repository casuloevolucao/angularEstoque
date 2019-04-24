import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css']
})
export class ResetComponent implements OnInit {

  form:FormGroup = new FormGroup({
    "email": new FormControl("", [Validators.required, Validators.email]),
  })

  constructor(
    private loginS:LoginService,
    private spinner:NgxSpinnerService,
    private toastr:ToastrService
  ) { }

  ngOnInit() {
  }

  submit(){
    this.spinner.show()
    let usuario:Usuario = new Usuario(this.form.value)
    this.loginS.resetPassword(usuario.email).then(() => {
      this.spinner.hide()
      this.toastr.success('Um link de redefinição de senha foi enviado para o seu endereço de e-mail!') 
    }).catch((e) => {
      this.spinner.hide()
      this.toastr.error(this.loginS.erroTratament(e).message)
    })
  }

}
