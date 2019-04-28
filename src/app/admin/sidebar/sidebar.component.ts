import { Component, OnInit, Input } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  @Input() usuario:Usuario = new Usuario()

  constructor() { }

  ngOnInit() {
  }

}
