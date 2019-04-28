import { Component, OnInit, OnDestroy, ViewChild  } from '@angular/core';
import { Produto } from '../models/produto.model';
import { RelatorioService } from '../services/relatorio.service';
import { produtoService } from '../services/produto.service';
import { Usuario } from '../models/usuario.model';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-teste',
  templateUrl: './teste.component.html',
  styleUrls: ['./teste.component.css']
})
export class TesteComponent implements OnInit, OnDestroy  {

  //lista de resultado vindo da api
  results:Produto[] = new Array<Produto>()

  //option da tabela
  dtOptions:any = {}
  @ViewChild('dataTable') table;
  dataTable: any;
  //controlado de dados da tabela
  dtTrigger: Subject<any> = new Subject();

  constructor(
    private relatorioS:RelatorioService,
    private produtoS:produtoService
  ) { }

  ngOnInit() {
    let usuario:Usuario = new Usuario();
    usuario.uid = "szVbJL6lrnbfzV0WRjpefqwKL4q2"

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
            previous: "Anterior",
        },
        aria: {
            sortAscending:  ": Ative para ordenar a coluna ascendente ",
            sortDescending: ": Ative para ordenar a coluna de maneira descendente "
        },
      },
      dom: 'Bfrtip',
      // Configure the buttons
      buttons: [
        'colvis',
        'copy',
        'print',
        'excel',
      ],
      pageLength: 5,
      processing: true
    }
    this.produtoS.getData(usuario).subscribe((rs:Produto[])=>{
      this.results = rs
      this.dtTrigger.next()
    })
  }
  ngOnDestroy() {
    this.dtTrigger.unsubscribe();
  }

  submit(){
    /*let produto:Produto = new Produto();
    let usuario:Usuario = new Usuario();
    usuario.uid = "szVbJL6lrnbfzV0WRjpefqwKL4q2"
    let cont = 6
    for (let i = 0; i < cont; i++) {
      produto.nome = `teste ismael${i}º`
      produto.quantidade = 5+10+i
      produto.descricao = `testes ${i}º`
      produto.valorEntrada = 20+20+i
      produto.valorSaida = 20+20+i
      produto.categoria = "teste"
      console.log("produto =>",produto)
      console.log("usuario =>",usuario)
      this.produtoS.addProduto(usuario, produto)
      .then((s)=>{
        console.log(s)
      })
      .catch((e)=>{
        console.log(e)
      })
    }*/
    let usuario:Usuario = new Usuario();
    usuario.uid = "szVbJL6lrnbfzV0WRjpefqwKL4q2"
    let mesInicio:Date = new Date(2019, 3,25);
    let mesFim:Date = new Date(2019, 3, 27);
    this.relatorioS.generatePdfByMonth(usuario, mesInicio, mesFim).then((rs:Produto[])=>{
      
     console.log(rs)
    }).catch((e)=>{
      console.log(e)
    })
  }

}
