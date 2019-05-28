import { Component, OnInit, TemplateRef, AfterViewInit, ViewChild } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Subject } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CategoriaService } from 'src/app/services/categoria.service';
import { Categoria } from 'src/app/models/categoria.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { DataTableDirective } from 'angular-datatables';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-categoriadesativado',
  templateUrl: './categoriadesativado.component.html',
  styleUrls: ['./categoriadesativado.component.css']
})
export class CategoriadesativadoComponent implements OnInit, AfterViewInit {

  // Currente User
  usuario: Usuario = new Usuario()

  //data
  categorias: Categoria[] = new Array<Categoria>()

  //option da tabela
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {}

  //controlado de dados da tabela
  dtTrigger: Subject<any> = new Subject();

  form: FormGroup = new FormGroup({
    "id": new FormControl(null, ),
    "nome": new FormControl("", [Validators.required]),
    "descricao": new FormControl("", [Validators.required]),
    "foto": new FormControl("", ),
    "esta_ativo": new FormControl("", ),
  })

  constructor(
    private usuarioS: UsuarioService,
    private modalService: BsModalService,
    private categoriaS: CategoriaService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
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
      processing: true,
    }
    this.usuarioS.currentUser().subscribe((user: Usuario) => {
      this.usuario = user
      this.categoriaS.getDataDisable(user).subscribe((categorias: Categoria[]) => {
        this.categorias = categorias
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

  ativar(categoria){
    Swal.fire({
      title: `Tem certeza que deseja ativar a Categoria ${categoria.nome} ?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if(result.value){
        this.categoriaS.activateCategoria(this.usuario, categoria).then(()=>{
          Swal.fire({
            title: "Categoria ativada com sucesso!",
            type: 'success'
          })
        })
      }
    })
    
  }

  deletar(categoria:Categoria){
    Swal.fire({
      title: `Tem certeza que deseja deletar a Categoria ${categoria.nome} ?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if(result.value){
        this.categoriaS.deleteCategoria(this.usuario, categoria).then(()=>{
          Swal.fire({
            title: "Categoria deletada com sucesso!",
            type: 'success'
          })
        })
      }
    })
  }

}
