import { Injectable } from '@angular/core';

//@Author Ismael Alves
@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  static getMonth(month:number):string{
    console.log(month)
    const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "June",
    "Junho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];
    return meses[month];
  }
}
