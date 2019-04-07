import { Component, OnInit } from '@angular/core';
import { RelatorioService } from '../services/relatorio.service';
import { Produto } from '../models/produto.model';

@Component({
  selector: 'app-acesso',
  templateUrl: './acesso.component.html',
  styleUrls: ['./acesso.component.css']
})
export class AcessoComponent implements OnInit {

  produtos:Produto[]

  constructor(
    private relatorio:RelatorioService
  ) { }

  ngOnInit() {
  }

}
