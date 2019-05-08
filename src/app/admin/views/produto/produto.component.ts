import { Component, OnInit, TemplateRef } from '@angular/core';
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

@Component({
  selector: 'app-produto',
  templateUrl: './produto.component.html',
  styleUrls: ['./produto.component.css']
})
export class ProdutoComponent implements OnInit {

  modalRef: BsModalRef;

  // Currente User
  usuario: Usuario = new Usuario()

  //data
  produtos: Produto[] = new Array<Produto>()
  categorias: Categoria[] = new Array<Categoria>()

  //option da tabela
  dtOptions: DataTables.Settings = {}

  //controlado de dados da tabela
  dtTrigger: Subject<any> = new Subject();

  img: File;

  form: FormGroup = new FormGroup({
    "categoria": new FormControl("", [Validators.required]),
    "nome": new FormControl("", [Validators.required]),
    "quantidade": new FormControl("", [Validators.required, Validators.min(1)]),
    "descricao": new FormControl("", [Validators.required]),
    "foto": new FormControl("", [Validators.required]),
    "valorEntrada": new FormControl("", [Validators.required, Validators.min(1)]),
    "valorSaida": new FormControl("", [Validators.required, Validators.min(1)]),
  })

  constructor(
    private usuarioS: UsuarioService,
    private modalService: BsModalService,
    private produtosS: produtoService,
    private categoriaS: CategoriaService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
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
    this.usuarioS.currentUser().then((user: Usuario) => {
      this.usuario = user
      this.produtosS.getData(user).subscribe((produtos: Produto[]) => {
        this.produtos = produtos

      })

      this.categoriaS.getData(user).subscribe((categorias: Categoria[]) => {
        this.categorias = categorias
        console.log(categorias)
      })
      this.categoriaS.getData(user).subscribe((categoria:Categoria[])=>{
        console.log(categoria)
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

  public capturarImg(event: Event): void {
    this.img = (<HTMLInputElement>event.target).files[0]
    console.log(this.img)
  }

  submit() {
    this.spinner.show()
    let produto: Produto = new Produto(this.form.value)
    this.produtosS.addProduto(this.usuario, produto).then(() => {
      this.spinner.hide()
      this.toastr.success("Produto cadastrado com sucesso!")
      this.form.reset()
    }).catch((e) => {
      this.spinner.hide()
      this.toastr.error("Não foi possivel cadastrar o produto")
    })
  }

}