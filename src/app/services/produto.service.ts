import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Usuario } from '../models/usuario.model';
import { AngularFireStorage } from '@angular/fire/storage';
import { map } from 'rxjs/operators';
import { Produto } from '../models/produto.model';

//@Author Ismael Alves
@Injectable({
  providedIn: 'root'
})
export class produtoService {

  constructor(
    private af:AngularFirestore,
    private afs:AngularFireStorage
  ) { }

  //pegar as produtos
  getData(usuario:Usuario){
    return this.af.collection("produto").doc(usuario.uid).collection("user", ref=> ref.where("esta_ativo", "==", true).orderBy("dtCadastro"))
    .snapshotChanges().pipe(
      //pegar id dos documentos
      map((e)=>{
        return e.map((m)=>{
          let data:Produto = m.payload.doc.data() as Produto
          data.id = m.payload.doc.id
          return data
        })
      })
    )
  }

  getDataDesable(usuario:Usuario){
    return this.af.collection("produto").doc(usuario.uid).collection("user", ref => ref.where("esta_ativo", "==", false).orderBy("dtCadastro"))
    .snapshotChanges().pipe(
      //pegar id dos documentos
      map((e)=>{
        return e.map((m)=>{
          let data:Produto = m.payload.doc.data() as Produto
          data.id = m.payload.doc.id
          return data
        })
      })
    )
  }

  //adicionar produtos
  addProduto(usuario:Usuario, produto:Produto){
    return  this.af.collection("produto").doc(usuario.uid).collection("user").add({
      nome: produto.nome,
      descricao: produto.descricao,
      dtCadastro:new Date(),
      esta_ativo: true
    })
    .then((id)=>{
      this.afs.ref(`produto/${id.id}`).put(produto.foto).then((rs)=>{
        rs.ref.getDownloadURL().then((url)=>{
          this.af.collection("produto").doc(usuario.uid).collection("user").doc(id.id).update({
            foto:url
          })
        })
      })
    })
  }

  //editar produtos
  editProduto(usuario:Usuario, produto:Produto){
    return this.afs.ref(`produto/${produto.id}`).put(produto.foto).then((rs)=>{
      rs.ref.getDownloadURL().then((url)=>{
        this.af.collection("produto").doc(usuario.uid).collection("user").add({
          nome: produto.nome,
          descricao: produto.descricao,
          foto: url,
          esta_ativo:produto.esta_ativo,
          dtCadastro:new Date()
        })
      })
    })
  }

  //deletear produto
  deleteProduto(usuario:Usuario, produto:Produto){
    return this.af.collection("produto").doc(usuario.uid).collection("user").doc(produto.id).delete().then((rs)=>{
      this.afs.ref(`produto/${produto.id}`).delete()
    })
  }

  //desabilitar produto
  disableProduto(usuario:Usuario, produto:Produto){
    return this.af.collection("produto").doc(usuario.uid).collection("user").doc(produto.id).update({
      esta_ativo:false
    })
  }

}
