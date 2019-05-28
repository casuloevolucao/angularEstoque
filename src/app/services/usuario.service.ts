import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireStorage } from '@angular/fire/storage';
import { Usuario } from '../models/usuario.model';
import * as firebase from 'firebase'
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

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
       foto: null,
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
  async deleteUser(){
    return this.afa.authState.subscribe((user)=>{
      user.delete().then(()=>{
        this.af.collection("users").doc(user.uid).delete()
        this.afs.ref(`users/${user.uid}`).delete()
        localStorage.clear()
      })
    })
  }

  //editar usuario
  //metodo que edita usuario
  async editUser(usuario:Usuario, senha:string){
    return new Promise((resolve, reject)=>{
      if(usuario.foto != null){
        this.afa.authState.subscribe((user)=>{
          user.reauthenticateWithCredential(firebase.auth.EmailAuthProvider.credential(user.email, senha))
          .then(()=>{
            user.updateEmail(usuario.email)
              .then(()=>{
                user.updatePassword(usuario.senha)
                this.afs.ref(`users/${user.uid}`).put(usuario.foto).then((foto)=>{
                  foto.ref.getDownloadURL().then((fotoUrl)=>{
                    this.af.collection("users").doc(user.uid).update({
                      foto: fotoUrl,
                      email: usuario.email,
                      nome: usuario.nome,
                    })
                    resolve(user)
                  })
                })
              })
          })
          .catch((e)=>{
            reject(e)
          })
        })
      }else{
        this.afa.authState.subscribe((user)=>{
          user.reauthenticateWithCredential(firebase.auth.EmailAuthProvider.credential(user.email, senha))
          .then(()=>{
            user.updateEmail(usuario.email).then(()=>{
              user.updatePassword(usuario.senha)
                this.af.collection("users").doc(user.uid).update({
                  foto: null,
                  email: usuario.email,
                  nome: usuario.nome,
                })
              resolve(user)
            })
          })
          .catch((e)=>{
            reject(e)
          })
        })
      }
    })
  }

  //metodo que pega usuario autenticado
  currentUser(){
    //metodo retornara uma promessa personalizada
    return new Observable(
      (resolve)=>{
      //verificando usuario logado
      this.afa.authState.subscribe(
        user=>{
          //pegando dados do usuário logado
          this.af.collection("users").doc(user.uid).valueChanges().subscribe(
          (user:Usuario)=>{
            resolve.next(user)
          })
          error=>{
            resolve.error(error)
          }    
      })
    })
  }
  
  //pegar todos os clientes registrados
  getUsersResgistres(){
    return this.af.collection("users", ref => ref.where('tipoUsuario', '==', 1)).valueChanges()
  }

  //pegar todos os clientes que estão online
  getUsersOnline(){
    return this.af.collection("users", ref => ref.where('tipoUsuario', '==', 1).where('online', '==', true)).valueChanges()
  }

  //pegar todos os clientes registrados hoje
  getUsersResgistresDay(){
    return this.af.collection("users", ref => ref.where('tipoUsuario', '==', 1).where('dtCadastro', '<=', new Date())).valueChanges()
  }

}
