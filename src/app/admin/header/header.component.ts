import { Component, OnInit, Input, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { LoginService } from 'src/app/services/login.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Messagem } from 'src/app/models/messagem.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MessagemService } from 'src/app/services/messagem.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, AfterViewChecked {

  //chave do chat
  chave:string

  //chat parter
  parter:Usuario
  
  //form message
  form:FormGroup = new FormGroup({
    "msg": new FormControl(null, [Validators.required])
  })

  //msgs
  msg:Messagem[] = new Array<Messagem>()
  
  //current usuario
  @Input() usuario:Usuario;

  //data de agora
  date:number = Date.now()

  //notificação
  usuariosNotificatio:Usuario[]

  notification:number

  @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  constructor(
    private loginS:LoginService,
    private spinner:NgxSpinnerService,
    private toastr:ToastrService,
    private messageS:MessagemService,

  ) { 
    setInterval(()=>{
      this.date = Date.now()
    },1)
  }

  ngOnInit() {
    this.messageS.getAdmin().subscribe((parter:Usuario[])=>{
      this.parter = parter[0]
    })
    this.messageS.getUsersMsg().subscribe((usuario:Usuario[])=>{
      this.notification = 0
      if(this.notification == 0){
        usuario.forEach((value)=>{
          this.notification += value.notification
        })
      }
      this.usuariosNotificatio = usuario
    })
    this.scrollToBottom();
  }

  ngAfterViewChecked() {        
    this.scrollToBottom();        
  } 

  initChat(){
    this.chave = this.messageS.getRoom(this.usuario.uid ,this.parter.uid)
    this.messageS.getData(this.chave).subscribe((msg:Messagem[])=>{
      this.msg = msg
      this.scrollToBottom();
    })
  }

  closeChat(){
    this.chave = undefined;
    this.messageS.setChatConfigOf(MessagemService.getSalveKeyRoom(), this.usuario)
  }

  awaitChat(){
    this.messageS.setChatConfigOf(MessagemService.getSalveKeyRoom(), this.usuario)
  }

  sendMessage(){
    let msg:Messagem = new Messagem(this.form.value)
    this.messageS.sendMenssage(msg, this.chave, this.usuario, this.parter).then(()=>{
      this.form.reset()
    })
    this.messageS.clearNotificationAdmin(this.usuario)
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }                 
  }

  logout(){
    this.loginS.logout(this.usuario)
    .then(()=>{
      this.toastr.success("logout feito com sucesso!!!")
    })
    .catch((e)=>{
      this.spinner.hide()
      this.toastr.error(this.loginS.erroTratament(e).message)
    })
  }

}
