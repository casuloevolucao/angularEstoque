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

  //pegar as categorias ativas
  getData(usuario:Usuario){
    return this.af.collection("users").doc(usuario.uid).collection("categoria", ref=> ref.where("esta_ativo", "==", true).orderBy("dtCadastro"))
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
  //pegar as categorias ativas
  getCategoriesRegistre(usuario:Usuario){
    return this.af.collection("users").doc(usuario.uid).collection("categoria").valueChanges()
  }
  
  //pegar as categorias desativadas
  getDataDisable(usuario:Usuario){
    return this.af.collection("users").doc(usuario.uid).collection("categoria", ref => ref.where("esta_ativo", "==", false).orderBy("dtCadastro"))
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
  async addCadategoria(usuario:Usuario, categoria:Categoria){
    return new Promise((resolve, reject)=>{
      if(categoria.foto != null){
        return  this.af.collection("users").doc(usuario.uid).collection("categoria").add({
          nome: categoria.nome,
          descricao: categoria.descricao,
          dtCadastro:new Date(),
          esta_ativo: true
        })
        .then((id)=>{
          this.afs.ref(`categoria/${id.id}`).put(categoria.foto).then((rs)=>{
            rs.ref.getDownloadURL().then((url)=>{
              this.af.collection("users").doc(usuario.uid).collection("categoria").doc(id.id).update({
                foto:url
              }).then(()=>{
                resolve("cadastrou")
              })
            })
          })
        })
      }else{
        return  this.af.collection("users").doc(usuario.uid).collection("categoria").add({
          nome: categoria.nome,
          descricao: categoria.descricao,
          dtCadastro:new Date(),
          esta_ativo: true
        }).then(()=>{
          resolve("cadastrou")
        })
      }
    })
  }

  //editar categorias
  async editCategoria(usuario:Usuario, categoria:Categoria){
    return new Promise((resolve, reject)=>{
      if(categoria.foto != null){
        return this.afs.ref(`categoria/${categoria.id}`).put(categoria.foto).then((rs)=>{
          rs.ref.getDownloadURL().then((url)=>{
            this.af.collection("users").doc(usuario.uid).collection("categoria").doc(categoria.id).update({
              nome: categoria.nome,
              descricao: categoria.descricao,
              foto: url,
              esta_ativo:categoria.esta_ativo,
            }).then(()=>{
              resolve("atualizado")
            })
          })
        })
      }else{
        this.af.collection("users").doc(usuario.uid).collection("categoria").doc(categoria.id).update({
          nome: categoria.nome,
          descricao: categoria.descricao,
          foto: null,
          esta_ativo:categoria.esta_ativo,
        }).then(()=>{
          this.afs.ref(`categoria/${categoria.id}`).delete()
          resolve("atualizado")
        })
      }
    })
  }

  //deletar categoria
  deleteCategoria(usuario:Usuario, categoria:Categoria){
    return this.af.collection("users").doc(usuario.uid).collection("categoria").doc(categoria.id).delete().then((rs)=>{
      this.afs.ref(`categoria/${categoria.id}`).delete()
    })
  }

  //desativar categoria
  disableCategoria(usuario:Usuario, categoria:Categoria){
    return this.af.collection("users").doc(usuario.uid).collection("categoria").doc(categoria.id).update({
      esta_ativo:false
    })
  }

  //ativar categoria
  activateCategoria(usuario:Usuario, categoria:Categoria){
    return this.af.collection("users").doc(usuario.uid).collection("user").doc(categoria.id).update({
      esta_ativo:true
    })
  }

}
