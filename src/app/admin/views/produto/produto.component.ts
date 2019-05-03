import { Component, OnInit, TemplateRef } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Subject } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { produtoService } from 'src/app/services/produto.service';
import { Produto } from 'src/app/models/produto.model';

@Component({
  selector: 'app-produto',
  templateUrl: './produto.component.html',
  styleUrls: ['./produto.component.css']
})
export class ProdutoComponent implements OnInit {

  modalRef: BsModalRef;

  // Currente User
  usuario:Usuario = new Usuario()

  //data
  produtos:Produto[] = new Array<Produto>()

  //option da tabela
  dtOptions:DataTables.Settings = {}
  
  //controlado de dados da tabela
  dtTrigger: Subject<any> = new Subject();

  constructor(
    private usuarioS:UsuarioService,
    private modalService: BsModalService,
    private produtosS: produtoService
  ) { }

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      language: {
        processing:    'Procesando...',
        lengthMenu:    "Mostrar _MENU_ registros",
        zeroRecords:   "nenhum resultado encontrado",
        emptyTable:    "Não há dados disponíveis nesta tabela",
        info:          "Mostrando registros de _START_ a _END_ de um total de _TOTAL_ registros",
        infoEmpty:     "Mostrando registros de 0 a 0 do total de 0 registros",
        infoFiltered:  "(filtrando um total de registros _MAX_)",
        infoPostFix:   "",
        search:        "Pesquisar:",
        url:           "",
        thousands:  ",",
        loadingRecords: "Carregando...",
        paginate: {
            first:    "Primeiro",
            last:    "Último",
            next:    "Proximo",
            previous: "Anterior"
        },
        aria: {
            sortAscending:  ": Ative para ordenar a coluna ascendente ",
            sortDescending: ": Ative para ordenar a coluna de maneira descendente "
        }
      },
      pageLength: 5,
      processing: true
    }
    this.usuarioS.currentUser().then((user:Usuario) => {
      this.usuario = user
      this.produtosS.getData(user).subscribe((produtos:Produto[]) => {
        this.produtos = produtos
      })
    })
    
  }

  ngOnDestroy() {
    this.dtTrigger.unsubscribe();
  }

  // Abre modal
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

}