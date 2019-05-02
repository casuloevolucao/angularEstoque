import { Injectable } from '@angular/core';

//@Author Ismael Alves
@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  static getMonth(date:Date):string{
    const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "June",
    "Junho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];
    return meses[date.getMonth()];
  }

  static formatDate(date:Date):string{
    const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "June",
    "Junho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];
    const dias = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];

    return `${dias[date.getDay()]} de ${meses[date.getMonth()]} de ${date.getFullYear()}`
  }
}
