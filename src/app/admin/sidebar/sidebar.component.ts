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

  notification:number = 0

  usuariosNotificatio:Usuario[]

  constructor(
    private messageS:MessagemService
  ) { }

  ngOnInit() {
    this.messageS.getUsersMsg().subscribe((usuario:Usuario[])=>{
      this.usuariosNotificatio = usuario
    })
  }
}
