import { Component, OnInit, Input } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { MessagemService } from 'src/app/services/messagem.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  @Input() usuario:Usuario

  notification:number

  usuariosNotificatio:Usuario[]

  constructor(
    private messageS:MessagemService
  ) { }

  ngOnInit() {
    this.messageS.getUsersMsg().subscribe((usuario:Usuario[])=>{
      this.notification = 0
      if(this.notification == 0){
        usuario.forEach((value)=>{
          this.notification += value.notification
        })
      }
      this.usuariosNotificatio = usuario
    })
  }
}
