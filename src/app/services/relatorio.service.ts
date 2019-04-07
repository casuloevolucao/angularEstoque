import { Injectable } from '@angular/core';
import { Produto } from '../models/produto.model';
import * as jsPDF from 'jspdf';

//@Author Ismael Alves
@Injectable({
  providedIn: 'root'
})
export class RelatorioService {

  constructor() { }

  geraRelatorio(produtos:Produto[]){
    let documento = new jsPDF();

    
    documento.text("Relatorio de produtos", 80, 15);
    
    
    documento.text("Código", 12, 25);
    documento.text("Nome", 52, 25);
    documento.text("Data de Cadastro", 92, 25);
    documento.text("Quantidade", 142, 25);
    documento.text("R$ Valor", 180, 25);

    for(let i = 0; i < produtos.length; i++){
      documento.text(produtos[i].id, 12, 35);
      documento.text(produtos[i].nome, 52, 35);
      documento.text(produtos[i].dtCadastro, 92, 35);
      documento.text(produtos[i].quantidade, 142, 35);
      documento.text(`R$ Valor ${produtos[i].valor}`, 180, 35);
    }

    
  

  documento.output("dataurlnewwindow");
  }
}
