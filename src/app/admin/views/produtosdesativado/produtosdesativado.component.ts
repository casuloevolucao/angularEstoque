import { Component, OnInit, ViewChild, AfterViewInit, TemplateRef } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { Produto } from 'src/app/models/produto.model';
import { Categoria } from 'src/app/models/categoria.model';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { UsuarioService } from 'src/app/services/usuario.service';
import { produtoService } from 'src/app/services/produto.service';
import { CategoriaService } from 'src/app/services/categoria.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import Swal from 'sweetalert2';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RelatorioService } from 'src/app/services/relatorio.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-produtosdesativado',
  templateUrl: './produtosdesativado.component.html',
  styleUrls: ['./produtosdesativado.component.css']
})
export class ProdutosdesativadoComponent implements OnInit, AfterViewInit {

  modalRef: BsModalRef;

  // Currente User
  usuario: Usuario = new Usuario()

  //data
  produtos: Produto[] = new Array<Produto>()
  categorias: Categoria[] = new Array<Categoria>()

  //option da tabela
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {}

  //controlado de dados da tabela
  dtTrigger: Subject<any> = new Subject();

  img: File;

  relatorio:FormGroup = new FormGroup({
    "dateInicio": new FormControl(null, [Validators.required]),
    "dateFim": new FormControl(null, [Validators.required])
  })

  datePickerConfig: Partial<BsDatepickerConfig>;

  constructor(
    private usuarioS: UsuarioService,
    private produtosS: produtoService,
    private categoriaS: CategoriaService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private localeService: BsLocaleService,
    private relatorioS:RelatorioService,
    private modalService: BsModalService,
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
    this.datePickerConfig = {
      containerClass: 'theme-default',
      showWeekNumbers: false,
      dateInputFormat:'MMMM Do YYYY',
    };
    this.usuarioS.currentUser().subscribe((user: Usuario) => {
      this.usuario = user
      this.produtosS.getDataDisable(user).subscribe((produtos: Produto[]) => {
        this.produtos = produtos
        this.rerender()
      })
      this.categoriaS.getData(user).subscribe((categorias: Categoria[]) => {
        this.categorias = categorias
      })
    })
    this.localeService.use('pt-br'); 
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

    // Abre modal
    openModal(template: TemplateRef<any>) {
      this.modalRef = this.modalService.show(template);
    }
    // Abre modal Relatorio
    openModalRelatorio(search: TemplateRef<any>) {
      this.modalRef = this.modalService.show(search);
    }

  ativar(produto, usuario){
    Swal.fire({
      title: `Tem certeza que ativar o produto ${produto.nome} ?`,
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
      title: `Tem certeza que deletar o produto ${produto.nome} ?`,
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

  //pequisar 
  pesquisar(){
    let dateInicio:Date = this.relatorio.value.dateInicio
    let dateFim:Date = this.relatorio.value.dateFim
    this.spinner.show()
    this.relatorioS.search(this.usuario, dateInicio, dateFim).then(
      (produtos:Produto[])=>{
        this.spinner.hide()
        if(produtos.length > 0){
          Swal.fire({
            title: `Encontramos ${produtos.length} Produtos Deseja exportar o Relátorio ?`,
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sim',
            cancelButtonText: 'Cancelar'
          }).then(result => {
            if(result.value){
              this.relatorioS.generatePdfByMonth(produtos, dateInicio, dateFim).then(()=>{
                Swal.fire({
                  title: "Relatorio Exportado com sucesso!",
                  type: 'success'
                }).then(()=>{
                  this.modalRef.hide()
                  this.relatorio.reset()
                })
              })
            }
          })
        }else{
          this.toastr.error("Não foi Encontrado nem um produto")
        }
      }
    )
  }

}

