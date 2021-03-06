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

  //pegar as produtos ativos
  getData(usuario:Usuario){
    return this.af.collection("users").doc(usuario.uid).collection("produto", ref=> ref.where("esta_ativo", "==", true).orderBy("dtCadastro"))
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

  //pegar as produtos ativos
  getProductRegistre(usuario:Usuario){
    return this.af.collection("users").doc(usuario.uid).collection("produto").valueChanges()
  }

  //pegar as produtos desativados
  getDataDisable(usuario:Usuario){
    return this.af.collection("users").doc(usuario.uid).collection("produto", ref => ref.where("esta_ativo", "==", false).orderBy("dtCadastro"))
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
  async addProduto(usuario:Usuario, produto:Produto){ 
    return new Promise((resolve, reject)=>{
      if(produto.foto != null){
          this.af.collection("users").doc(usuario.uid).collection("produto").add({
          nome: produto.nome,
          descricao: produto.descricao,
          quantidade: produto.quantidade,
          valorEntrada: produto.valorEntrada,
          valorSaida: produto.valorSaida,
          categoria: produto.categoria,
          dtCadastro:new Date(),
          esta_ativo: true
        })
        .then((id)=>{
          this.afs.ref(`produto/${id.id}`).put(produto.foto).then((rs)=>{
            rs.ref.getDownloadURL().then((url)=>{
              this.af.collection("users").doc(usuario.uid).collection("produto").doc(id.id).update({
                foto:url
              })
            })
          })
          resolve(id.id)
        })
        .catch((e)=>{
          reject(e)
        })
      }else{
        return  this.af.collection("users").doc(usuario.uid).collection("produto").add({
          nome: produto.nome,
          descricao: produto.descricao,
          quantidade: produto.quantidade,
          valorEntrada: produto.valorEntrada,
          valorSaida: produto.valorSaida,
          categoria: produto.categoria,
          dtCadastro:new Date(),
          foto: null,
          esta_ativo: true
        })
        .then((id)=>{
          resolve(id.id)
        })
        .catch((e)=>{
          reject(e)
        })
      }
    })
  }

  //editar produtos
  editProduto(usuario:Usuario, produto:Produto){
    if(produto.foto != null){
      return this.afs.ref(`produto/${produto.id}`).put(produto.foto).then((rs)=>{
        rs.ref.getDownloadURL().then((url)=>{
          this.af.collection("users").doc(usuario.uid).collection("produto").doc(produto.id).update({
            nome: produto.nome,
            descricao: produto.descricao,
            foto: url,
            esta_ativo:produto.esta_ativo,
            dtCadastro:new Date()
          })
        })
      })
    }else{
      return this.af.collection("users").doc(usuario.uid).collection("produto").doc(produto.id).update({
          nome: produto.nome,
          descricao: produto.descricao,
          esta_ativo:produto.esta_ativo,
          quantidade: produto.quantidade,
          valorEntrada: produto.valorEntrada,
          valorSaida: produto.valorSaida,
          categoria: produto.categoria,
          foto:null,
        }).then(()=>{
          this.afs.ref(`produto/${produto.id}`).delete()
        })
    }
  }

  //deletar produto
  deleteProduto(usuario:Usuario, produto:Produto){
    return this.af.collection("users").doc(usuario.uid).collection("produto").doc(produto.id).delete()
    .then(()=>{
      this.afs.ref(`produto/${produto.id}`).delete()
    })
  }

  //desabilitar produto
  disableProduto(usuario:Usuario, produto:Produto){
    return this.af.collection("users").doc(usuario.uid).collection("produto").doc(produto.id).update({
      esta_ativo:false
    })
  }

  //ativar produto
  activateProduto(usuario:Usuario, produto:Produto){
    return this.af.collection("users").doc(usuario.uid).collection("produto").doc(produto.id).update({
      esta_ativo:true
    })
  }

}
