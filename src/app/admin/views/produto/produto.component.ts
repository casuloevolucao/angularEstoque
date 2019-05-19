import { Component, OnInit, TemplateRef, ViewChild, AfterViewInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Subject } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { produtoService } from 'src/app/services/produto.service';
import { Produto } from 'src/app/models/produto.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CategoriaService } from 'src/app/services/categoria.service';
import { Categoria } from 'src/app/models/categoria.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { DataTableDirective } from 'angular-datatables';
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { RelatorioService } from 'src/app/services/relatorio.service';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { ptBrLocale } from 'ngx-bootstrap/locale';
defineLocale('pt-br', ptBrLocale); 

@Component({
  selector: 'app-produto',
  templateUrl: './produto.component.html',
  styleUrls: ['./produto.component.css']
})
export class ProdutoComponent implements OnInit, AfterViewInit {

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

  form: FormGroup = new FormGroup({
    "id": new FormControl(null, ),
    "categoria": new FormControl(null, [Validators.required]),
    "nome": new FormControl(null, [Validators.required]),
    "quantidade": new FormControl(null, [Validators.required,]),
    "descricao": new FormControl(null, [Validators.required]),
    "foto": new FormControl(null, ),
    "esta_ativo": new FormControl(null, ),
    "valorEntrada": new FormControl(null, [Validators.required, Validators.min(1)]),
    "valorSaida": new FormControl(null, [Validators.required, Validators.min(1)]),
  })

  relatorio:FormGroup = new FormGroup({
    "dateInicio": new FormControl(null, [Validators.required]),
    "dateFim": new FormControl(null, [Validators.required])
  })

  datePickerConfig: Partial<BsDatepickerConfig>;

  constructor(
    private usuarioS: UsuarioService,
    private modalService: BsModalService,
    private produtosS: produtoService,
    private categoriaS: CategoriaService,
    private relatorioS:RelatorioService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private localeService: BsLocaleService
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
      this.produtosS.getData(user).subscribe((produtos: Produto[]) => {
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

  capturarImg(event: Event): void {
    this.img = (<HTMLInputElement>event.target).files[0]
  }
  
  editarProduto(produto, editar: TemplateRef<any>){
    this.form.patchValue({
      id: produto.id,
      nome: produto.nome,
      quantidade: produto.quantidade,
      descricao: produto.descricao,
      esta_ativo: produto.esta_ativo,
      categoria: produto.categoria,
      valorEntrada: produto.valorEntrada,
      valorSaida: produto.valorSaida
    })
    this.openModal(editar);
  }

  // Desativar produto
  desativarProduto(usuario, produto){
    Swal.fire({
      title: `Tem certeza que deseja desativar o produto ${produto.nome} ?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if(result.value){
        this.produtosS.disableProduto(usuario, produto).then(()=>{
          Swal.fire({
            title: "Produto desativado com sucesso!",
            type: 'success'
          })
        })
      }
    })
  }

  // Cadastrar e Editar Produto
  submit() {
    this.spinner.show()
    let produto: Produto = new Produto(this.form.value) 
    produto.foto = this.img
    if(produto.id != null){
      this.produtosS.editProduto(this.usuario, produto).then(() => {
        this.spinner.hide()
        this.toastr.success(`Produto ${produto.nome} atualizado com sucesso!!`)
        this.form.reset()
        this.img = null
      }).catch((e) => {
        this.spinner.hide()
        this.toastr.error("Não foi possivel editar o produto")
      })
    }else{
      this.produtosS.addProduto(this.usuario, produto).then(() => {
        this.spinner.hide()
        this.img = null
        this.toastr.success("Produto cadastrado com sucesso!")
        this.form.reset()
      }).catch((e) => {
        this.spinner.hide()
        this.toastr.error("Não foi possivel cadastrar o produto")
      })
    }
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