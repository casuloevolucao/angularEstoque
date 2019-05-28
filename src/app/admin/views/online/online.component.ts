import { Component, OnInit, ViewChild } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/models/usuario.model';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-online',
  templateUrl: './online.component.html',
  styleUrls: ['./online.component.css']
})
export class OnlineComponent implements OnInit {

  //data
  usuarios:Usuario[] = new Array<Usuario>()

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {}
   
  //controlado de dados da tabela
  dtTrigger: Subject<any> = new Subject();
   
  constructor(
     private usuarioS:UsuarioService
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
     this.usuarioS.getUsersOnline().subscribe((users:Usuario[])=>{
       this.usuarios = users
       this.rerender()
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
 
}
