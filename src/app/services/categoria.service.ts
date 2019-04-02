import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Usuario } from '../models/usuario.model';

//@Author Ismael Alves
@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  constructor(
    private af:AngularFirestore,
  ) { }

  //pegar as messagens do chat
  getData(key:string){
    return this.af.collection("categoria").doc(key).collection("user", ref=> ref.orderBy("dt")).valueChanges()
  }

  addCadategoria(key:string){
    return this.af.collection("categoria").doc(key).collection("user").add({

    })
  }

  editCategoria(key:string){
    return this.af.collection("categoria").doc(key).collection("user")
  }

  deleteCategoria(key:string){
    return this.af.collection("categoria").doc(key).collection("user")
  }

}
