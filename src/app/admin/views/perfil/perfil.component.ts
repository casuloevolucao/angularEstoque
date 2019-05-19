import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/models/usuario.model';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from 'src/app/services/login.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  img:File

  usuario:Usuario

  form:FormGroup = new FormGroup({
    "nome": new FormControl(null, [Validators.required]),
    "email": new FormControl(null, [Validators.required, Validators.email]),
    "senha": new FormControl(null, [Validators.required, Validators.minLength(6)]),
    "foto": new FormControl(null),
  })

  formConfirm:FormGroup = new FormGroup({
    "senha": new FormControl(null, [Validators.required, Validators.minLength(6)]),
  })

  modalRef: BsModalRef;

  constructor(
    private usuarioS:UsuarioService,
    private loginS:LoginService,
    private modalService: BsModalService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private router:Router
  ) { }

  ngOnInit() {
    this.usuarioS.currentUser().subscribe((user:Usuario)=>{
      this.usuario = user
      this.form.patchValue({
        nome:user.nome,
        email:user.email,
      })
    })
  }
  
  // Abre modal
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  capturarImg(event: Event): void {
    this.img = (<HTMLInputElement>event.target).files[0]
  }
  
  deletar(){
    Swal.fire({
      title: `Tem certeza que deseja deletar sua conta ${this.usuario.nome} ?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if(result.value){
        this.usuarioS.deleteUser().then(()=>{
          Swal.fire({
            title: "Conta deletada com sucesso :) Ate Aproxima!",
            type: 'success'
          }).then(()=>{
            this.router.navigate(["/"])
          })
        })
      }
    })
  }

  submit(){
    let usuario:Usuario = new Usuario(this.form.value)
    usuario.foto = this.img
    this.spinner.show()
    this.usuarioS.editUser(usuario, this.formConfirm.value.senha).then(()=>{
      this.spinner.hide()
      this.form.reset()
      this.formConfirm.reset()
      this.img = null
      this.modalRef.hide()
      this.toastr.success("Usuário alterado com sucesso!!!")
    }).catch((e)=>{
      this.toastr.error(this.loginS.erroTratament(e).message)
    })
  }

}
