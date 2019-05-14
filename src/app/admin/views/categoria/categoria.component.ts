import { Component, OnInit, TemplateRef } from '@angular/core';
import { CategoriaService } from 'src/app/services/categoria.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/models/usuario.model';
import { Categoria } from 'src/app/models/categoria.model';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.css']
})
export class CategoriaComponent implements OnInit {
  private categorias:Categoria[];
  modalRef: BsModalRef;
  usuario: Usuario = new Usuario()
  img: File;
  dtTrigger: Subject<any> = new Subject();

  form: FormGroup = new FormGroup({
    "nome": new FormControl("", [Validators.required]),
    "descricao": new FormControl("", [Validators.required]),
    "foto": new FormControl("", [Validators.required]),
  })

  constructor(
    private usuarioS: UsuarioService,
    private modalService: BsModalService,
    private categoriaS: CategoriaService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
    ) { }

  ngOnInit() {
    this.usuarioS.currentUser().subscribe((user:Usuario)=>{
      this.usuario = user;
      this.categoriaS.getData(user).subscribe((categorias:Categoria[])=>{
          this.categorias = categorias;
      })
    })
  }

  ngOnDestroy() {
    this.dtTrigger.unsubscribe();
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  capturarImg(event: Event): void {
    this.img = (<HTMLInputElement>event.target).files[0]
  }

  submit() {
    this.spinner.show()
    let categoria: Categoria = new Categoria(this.form.value)
    this.categoriaS.addCadategoria(this.usuario, categoria).then(() => {
      this.spinner.hide()
      this.toastr.success("Categoria cadastrado com sucesso!")
      this.form.reset()
    }).catch((e) => {
      this.spinner.hide()
      this.toastr.error("Não foi possivel cadastrar o Categoria")
    })
  }

}
