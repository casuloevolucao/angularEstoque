import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Usuario } from '../models/usuario.model';
import { AngularFireStorage } from '@angular/fire/storage';
import { Categoria } from '../models/categoria.model';
import { map } from 'rxjs/operators';

//@Author Ismael Alves
@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  constructor(
    private af:AngularFirestore,
    private afs:AngularFireStorage
  ) { }

  //pegar as categorias
  getData(usuario:Usuario){
    return this.af.collection("categoria").doc(usuario.uid).collection("user", ref=> ref.where("esta_ativo", "==", true).orderBy("dtCadastro"))
    .snapshotChanges().pipe(
      //pegar id dos documentos
      map((e)=>{
        return e.map((m)=>{
          let data:Categoria = m.payload.doc.data() as Categoria
          data.id = m.payload.doc.id
          return data
        })
      })
    )
  }

  getDataDesable(usuario:Usuario){
    return this.af.collection("categoria").doc(usuario.uid).collection("user", ref => ref.where("esta_ativo", "==", false).orderBy("dtCadastro"))
    .snapshotChanges().pipe(
      //pegar id dos documentos
      map((e)=>{
        return e.map((m)=>{
          let data:Categoria = m.payload.doc.data() as Categoria
          data.id = m.payload.doc.id
          return data
        })
      })
    )
  }

  //adicionar categorias
  addCadategoria(usuario:Usuario, categoria:Categoria){
    return  this.af.collection("categoria").doc(usuario.uid).collection("user").add({
      nome: categoria.nome,
      descricao: categoria.descricao,
      dtCadastro:new Date(),
      esta_ativo: true
    })
    .then((id)=>{
      this.afs.ref(`categoria/${id.id}`).put(categoria.foto).then((rs)=>{
        rs.ref.getDownloadURL().then((url)=>{
          this.af.collection("categoria").doc(usuario.uid).collection("user").doc(id.id).update({
            foto:url
          })
        })
      })
    })
  }

  //editar categorias
  editCategoria(usuario:Usuario, categoria:Categoria){
    return this.afs.ref(`categoria/${categoria.id}`).put(categoria.foto).then((rs)=>{
      rs.ref.getDownloadURL().then((url)=>{
        this.af.collection("categoria").doc(usuario.uid).collection("user").add({
          nome: categoria.nome,
          descricao: categoria.descricao,
          foto: url,
          esta_ativo:categoria.esta_ativo,
          dtCadastro:new Date()
        })
      })
    })
  }

  //deletear categoria
  deleteCategoria(usuario:Usuario, categoria:Categoria){
    return this.af.collection("categoria").doc(usuario.uid).collection("user").doc(categoria.id).delete().then((rs)=>{
      this.afs.ref(`categoria/${categoria.id}`).delete()
    })
  }

  //desabilitar categoria
  disableCategoria(usuario:Usuario, categoria:Categoria){
    return this.af.collection("categoria").doc(usuario.uid).collection("user").doc(categoria.id).update({
      esta_ativo:false
    })
  }

}
