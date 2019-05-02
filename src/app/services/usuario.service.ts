import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireStorage } from '@angular/fire/storage';
import { Usuario } from '../models/usuario.model';
import * as firebase from 'firebase'
import { Router } from '@angular/router';

//@Author Ismael Alves
@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(
    private af:AngularFirestore,
    private afa:AngularFireAuth,
    private afs:AngularFireStorage,
    private router:Router
  ) { }

  //metodo criar usuario
  async createUser(create:Usuario){
    return this.afa.auth.createUserWithEmailAndPassword(create.email, create.senha).then((user)=>{
     this.af.collection('users').doc(user.user.uid).set({
       uid: user.user.uid,
       foto: '',
       email: create.email,
       nome: create.nome,
       online:false,
       tipoUsuario: 1,
       dtCadastro: new Date()
     })
     this.router.navigate(["/"])
   })
  }  

  //deletar usuario
  async desativateUser(){
    return this.afa.authState.subscribe((user)=>{
      user.delete()
      this.af.collection("users").doc(user.uid).delete()
    })
  }

  //editar usuario
  async editUser(usuarioNovo:Usuario, usuarioAntigo:Usuario){
    //validando se existe foto
    if(usuarioNovo.foto){
      //metodo retornara uma promessa personalizada
      return new Promise ((resolve, reject)=>{
        //fazendo o upload da imagem
        this.afs.ref(`users/${usuarioAntigo.uid}`).put(usuarioNovo.foto).then((foto)=>{
          //pegando url da foto
          foto.ref.getDownloadURL().then((fotoUrl)=>{
            //atualizando o perfil de usuario do firebase
            this.afa.authState.subscribe((user)=>{
              //fazendo uma retenticação pelo firebase
              user.reauthenticateWithCredential( firebase.auth.EmailAuthProvider.credential(usuarioAntigo.email, usuarioAntigo.senha))
              .then(()=>{
                //atualiza email
                user.updateEmail(usuarioNovo.email).then(()=>{
                  //atualizar senha
                  user.updatePassword(usuarioNovo.senha)
                  //atualizar base da dados
                  this.af.collection('users').doc(usuarioAntigo.uid).update({
                    email: usuarioNovo.email,
                    foto: fotoUrl,
                    nome: usuarioNovo.nome
                  })
                  //retorno de quando o metodo acabar e der certo
                  resolve(usuarioNovo)
                })  
              })
              .catch((e)=>{
                //retorno caso der erro
                reject(e)
              })
            })
          })
        })
      })
    }else{
      //metodo retornara uma promessa personalizada
      return new Promise((resolve, reject)=>{
        //atualizando o perfil de usuario do firebase
        this.afa.authState.subscribe((user)=>{
          //fazendo uma retenticação pelo firebase
          user.reauthenticateWithCredential( firebase.auth.EmailAuthProvider.credential(usuarioAntigo.email, usuarioAntigo.senha))
          .then(()=>{
            //atualiza email
            user.updateEmail(usuarioNovo.email).then(()=>{
              //atualizar senha
              user.updatePassword(usuarioNovo.senha)
              //atualizar base da dados
              this.af.collection('users').doc(usuarioAntigo.uid).update({
                email: usuarioNovo.email,
                nome: usuarioNovo.nome
              })
              //retorno de quando o metodo acabar e der certo
              resolve(usuarioNovo)
            })  
          })
          .catch((e)=>{
            //retorno caso der erro
            reject(e)
          })
        })
      })
    }
  }

  //metodo que pega usuario autenticado
  async currentUser(){
    //metodo retornara uma promessa personalizada
    return new Promise((resolve, reject)=>{
      //verificando usuario logado
      this.afa.authState.subscribe(
        user=>{
          //pegando dados do usuário logado
          this.af.collection("users").doc(user.uid).valueChanges().subscribe((user:Usuario)=>{
            //caso encontrar dados
            resolve(user)
        })
        error=>{
          reject(error)
        }    
      })
    })
  }
  
  getUsersResgistres(){
    return this.af.collection("users", ref => ref.where('tipoUsuario', '==', 1)).valueChanges()
  }

  getUsersOnline(){
    return this.af.collection("users", ref => ref.where('tipoUsuario', '==', 1).where('online', '==', true)).valueChanges()
  }

  getUsersResgistresDay(){
    console.log(new Date())
    return this.af.collection("users", ref => ref.where('tipoUsuario', '==', 1).where('dtCadastro', '<=', new Date())).valueChanges()
  }
}
