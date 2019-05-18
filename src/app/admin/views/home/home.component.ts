import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/models/usuario.model';
import { CategoriaService } from 'src/app/services/categoria.service';
import { produtoService } from 'src/app/services/produto.service';
import { Categoria } from 'src/app/models/categoria.model';
import { Produto } from 'src/app/models/produto.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  usuario:Usuario = new Usuario()

  usersRegistres:Usuario[] = new Array<Usuario>()

  usersOnline:Usuario[] =  new Array<Usuario>();

  categorias:Categoria[] = new Array<Categoria>()

  produtos:Produto[] = new Array<Produto>()

  constructor(
    private usuarioS:UsuarioService,
    private categoriaS:CategoriaService,
    private produtoS:produtoService
  ) { }

  ngOnInit() {
    this.usuarioS.currentUser().subscribe((user:Usuario)=>{
      this.usuario = user
      if(user.tipoUsuario == 1){
        this.categoriaS.getCategoriesRegistre(this.usuario).subscribe((categoria:Categoria[])=>{
          this.categorias = categoria
        })
        this.produtoS.getProductRegistre(this.usuario).subscribe((produto:Produto[])=>{
          this.produtos = produto
        })
      }
    })
    this.usuarioS.getUsersOnline().subscribe((online:Usuario[])=>{
      this.usersOnline = online
    })
    this.usuarioS.getUsersResgistres().subscribe((registre:Usuario[])=>{
      this.usersRegistres = registre
    })
  }

}
