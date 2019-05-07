import { Component, OnInit, Input } from '@angular/core';
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
export class HeaderComponent implements OnInit {

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
  @Input() usuario:Usuario = new Usuario()

  //data de agora
  date:number = Date.now()

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
  }

  initChat(){
    this.chave = this.messageS.getRoom(this.usuario.uid ,this.parter.uid)
    this.messageS.getData(this.chave).subscribe((msg:Messagem[])=>{
      this.msg = msg
    })
  }

  closeChat(){
    this.chave = undefined;
  }

  sendMessage(){
    let msg:Messagem = new Messagem(this.form.value)
    this.messageS.sendMenssage(msg, this.chave, this.usuario, this.parter).then(()=>{
      this.form.reset()
      
    })
  }

  logout(){
    this.loginS.logout(this.usuario.uid)
    .then(()=>{
      this.toastr.success("logout feito com sucesso!!!")
    })
    .catch((e)=>{
      this.spinner.hide()
      this.toastr.error(this.loginS.erroTratament(e).message)
    })
  }

}
