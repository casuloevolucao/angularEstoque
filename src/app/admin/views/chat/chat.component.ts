import { Component, OnInit } from '@angular/core';
import { MessagemService } from 'src/app/services/messagem.service';
import { Subject } from 'rxjs';
import { Usuario } from 'src/app/models/usuario.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Messagem } from 'src/app/models/messagem.model';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  //chave do chat
  chave:string

  //chat parter
  parter:Usuario

  //data
  usuarios:Usuario[] = new Array<Usuario>()

  //option da tabela
  dtOptions:DataTables.Settings = {}
  
  //controlado de dados da tabela
  dtTrigger: Subject<any> = new Subject();
  
  //form message
  form:FormGroup = new FormGroup({
    "msg": new FormControl(null, [Validators.required])
  })

  //current usuario
  usuario:Usuario = new Usuario()

  //msgs
  msg:Messagem[] = new Array<Messagem>()

  constructor(
    private messageS:MessagemService,
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
    this.messageS.getUsersMsg().subscribe((users:Usuario[])=>{
      this.usuarios = users
      this.dtTrigger.next()
    })
    this.usuarioS.currentUser().then((user:Usuario)=>{
      this.usuario = user
    })
  }

  ngOnDestroy() {
    
    this.dtTrigger.unsubscribe();
  }

  initChat(parter:Usuario){
    this.parter = parter
    this.chave = this.messageS.getRoom(parter.uid)
    this.messageS.getData(this.chave).subscribe((msg:Messagem[])=>{
      this.msg = msg
    })
  }

  closeChat(){
    this.chave = undefined;
    this.parter = undefined;
  }

  sendMessage(){
    let msg:Messagem = new Messagem(this.form.value)
    this.messageS.sendMenssage(msg, this.chave, this.usuario).then(()=>{
      this.form.reset()
    })
  }
}
