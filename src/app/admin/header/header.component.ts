import { Component, OnInit, Input } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Input() usuario:Usuario = new Usuario()

  constructor() { 
   
  }

  ngOnInit() {
    
  }

}
