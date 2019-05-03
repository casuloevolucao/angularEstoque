import { Component, OnInit, Input } from '@angular/core';
import { UsuarioService } from '../services/usuario.service';
import { Usuario } from '../models/usuario.model';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  usuario:Usuario = new Usuario()

  constructor(
    private usuarioS:UsuarioService,
    private spinner:NgxSpinnerService,
  ) { }

  ngOnInit() {
    this.usuarioS.currentUser().then((user:Usuario)=>{
      localStorage.setItem('tipoUsuario', user.tipoUsuario.toString())
      this.spinner.hide()
      this.usuario = user
    })
  }
}
