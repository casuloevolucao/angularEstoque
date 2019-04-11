import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { Usuario } from 'src/app/models/usuario.model';
import { FirebaseError } from 'firebase';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private loginS:LoginService
  ) { }

  ngOnInit() {
    let usuario:Usuario = new Usuario()
    usuario.email = "teste@teste.com"
    usuario.senha = "123456"
    this.loginS.login(usuario).then((s)=>{
      console.log(s)
    }).catch((e)=>{
      console.log(this.loginS.erroTratament(e).message)
    })
  }

}
