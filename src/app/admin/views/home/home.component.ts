import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/models/usuario.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  usuario:Usuario = new Usuario()

  usersRegistres:Usuario[] = new Array<Usuario>()

  usersOnline:Usuario[] =  new Array<Usuario>();

  constructor(
    private usuarioS:UsuarioService
  ) { }

  ngOnInit() {
    this.usuarioS.currentUser().then((user:Usuario)=>{
      this.usuario = user
    })
    this.usuarioS.getUsersOnline().subscribe((online:Usuario[])=>{
      this.usersOnline = online
    })
    this.usuarioS.getUsersResgistres().subscribe((registre:Usuario[])=>{
      this.usersRegistres = registre
    })
  }

}
