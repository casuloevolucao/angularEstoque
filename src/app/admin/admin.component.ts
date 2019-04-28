import { Component, OnInit, Input } from '@angular/core';
import { UsuarioService } from '../services/usuario.service';
import { Usuario } from '../models/usuario.model';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  @Input() usuario:Usuario

  constructor(
    private usuarioS:UsuarioService,
    private loginS:LoginService
  ) { }

  ngOnInit() {
    this.usuarioS.currentUser().then((user:Usuario)=>{
      this.usuario = user
      console.log(this.usuario)
    }).catch((e)=>{
      console.log(e)
    })
  }
}
