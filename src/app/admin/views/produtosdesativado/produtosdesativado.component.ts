import { Component, OnInit, ViewChild } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { Produto } from 'src/app/models/produto.model';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { UsuarioService } from 'src/app/services/usuario.service';
import { produtoService } from 'src/app/services/produto.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-produtosdesativado',
  templateUrl: './produtosdesativado.component.html',
  styleUrls: ['./produtosdesativado.component.css']
})
export class ProdutosdesativadoComponent implements OnInit {

  // Currente User
  usuario: Usuario = new Usuario()

  //data
  produtos: Produto[] = new Array<Produto>()

  //option da tabela
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {}

  //controlado de dados da tabela
  dtTrigger: Subject<any> = new Subject();

  constructor(
    private usuarioS: UsuarioService,
    private produtosS: produtoService,
  ) { }

  ngOnInit() {
    this.dtOptions = {
      language: {
        processing: 'Procesando...',
        lengthMenu: "Mostrar _MENU_ registros",
        zeroRecords: "nenhum resultado encontrado",
        emptyTable: "Não há dados disponíveis nesta tabela",
        info: "Mostrando registros de _START_ a _END_ de um total de _TOTAL_ registros",
        infoEmpty: "Mostrando registros de 0 a 0 do total de 0 registros",
        infoFiltered: "(filtrando um total de registros _MAX_)",
        infoPostFix: "",
        search: "Pesquisar:",
        url: "",
        thousands: ",",
        loadingRecords: "Carregando...",
        paginate: {
          first: "Primeiro",
          last: "Último",
          next: "Proximo",
          previous: "Anterior"
        },
        aria: {
          sortAscending: ": Ative para ordenar a coluna ascendente ",
          sortDescending: ": Ative para ordenar a coluna de maneira descendente "
        }
      },
      pageLength: 5,
      processing: true
    }
    
    this.usuarioS.currentUser().subscribe((user: Usuario) => {
      this.usuario = user
      this.produtosS.getDataDisable(user).subscribe((produtos: Produto[]) => {
        this.produtos = produtos
        this.rerender()
      })
    })
  }

  ngAfterViewInit(){
    this.dtTrigger.next()
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destrui tabela primeiro
      dtInstance.destroy();
      // Chamar o dtTrigger para rerenderizar novamente
      this.dtTrigger.next();
    });
  }

  ngOnDestroy() {
    this.dtTrigger.unsubscribe();
  }

  ativar(produto, usuario){
    Swal.fire({
      title: `Tem certeza que deseja ativar o produto ${produto.nome} ?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if(result.value){
        this.produtosS.activateProduto(usuario, produto).then(()=>{
          Swal.fire({
            title: "Produto ativado com sucesso!",
            type: 'success'
          })
        })
      }
    })
  }

  deletar(produto, usuario){
    Swal.fire({
      title: `Tem certeza que deseja deletar o produto ${produto.nome} ?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if(result.value){
        this.produtosS.deleteProduto(usuario, produto).then(()=>{
          Swal.fire({
            title: "Produto deletado com sucesso!",
            type: 'success'
          })
        })
      }
    })
  }

}

