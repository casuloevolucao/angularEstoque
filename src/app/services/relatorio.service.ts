import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Usuario } from '../models/usuario.model';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { Produto } from '../models/produto.model';

//@Author Ismael Alves
@Injectable({
  providedIn: 'root'
})
export class RelatorioService {

  constructor(
    private af:AngularFirestore
  ) { }
  
  buildTableBody(rs:Produto[], columns) {
		var body = [];
		body.push(columns);
    let value = new Array<any>()  
    rs.forEach((item)=>{
      value.push(new Array<string>(`${item.nome}`,`${item.descricao}`,`${item.categoria}`,`${item.quantidade}`,`${item.valorEntrada}`,`${item.valorSaida}`))
    })  
		value.forEach(function(row) {
			body.push(row);
		});
		return body;
  }

  search(usuario:Usuario, mesInicio:Date, mesFim:Date){
    return this.af.collection("users").doc(usuario.uid)
    .collection("produto", ref => ref.where('esta_ativo', '==', true).where('dtCadastro', '>=', mesInicio).where('dtCadastro', '<=', mesFim).orderBy('dtCadastro')).valueChanges()
  }

  async generatePdfByMonth(produtos:Produto[], mesInicio:Date, mesFim:Date){
    return new Promise((resolve, reject)=>{
          pdfMake.vfs = pdfFonts.pdfMake.vfs;
          var pdf = {
            content: [
              {text: `Relatorio  de ${mesInicio.toLocaleDateString('pt')} até ${mesFim.toLocaleDateString('pt')}`, style: 'header',alignment: 'center'},
              'Relatorio expedido pelo sistema Sys Toque',
              {
                layout: 'lightHorizontalLines', // optional
                table: {
                  // headers are automatically repeated if the table spans over multiple pages
                  // you can declare how many rows should be treated as headers
                  headerRows: 1,
                  widths: [ '*', '*', 'auto', 'auto', 'auto','auto' ],   
                  body: this.buildTableBody(produtos,['Nome', 'Descrição', 'Categoria', 'Quant', 'Valor Ent', 'Valor Sai'])      
                }
              }
            ],
            styles: {
              header: {
                fontSize: 18,
                bold: true
              }
            }
          };
          pdfMake.createPdf(pdf).download(`relatorio ${mesInicio.toLocaleDateString('pt')} a ${mesFim.toLocaleDateString('pt')}.pdf`);
          resolve(pdfMake.createPdf(pdf).download(`relatorio ${mesInicio.toLocaleDateString('pt')} a ${mesFim.toLocaleDateString('pt')}.pdf`))
      })
  }
}
