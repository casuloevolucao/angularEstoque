import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireStorage } from '@angular/fire/storage';
import { Usuario } from '../models/usuario.model';
import { map } from 'rxjs/operators';

//@Author Ismael Alves
@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(
    private af:AngularFirestore,
    private afa:AngularFireAuth,
    private afs:AngularFireStorage
  ) { }

  //metodo criar usuario
  async createUser(create:Usuario){
    return this.afa.auth.createUserWithEmailAndPassword(create.email, create.senha).then((user)=>{
      //upload foto para storage
      this.afs.ref(`users/${user.user.uid}`).put(create.foto).then((foto)=>{
        //pegar url da foto ja no storage
        foto.ref.getDownloadURL().then((fotoUrl)=>{
          //salvar dados no firestore
          this.af.collection('users').doc(user.user.uid).set({
            uid: user.user.uid,
            foto: fotoUrl,
            email: create.email,
            nome:create.nome
          })
        })
      })
    })
  }

  //desativar usuario
  async desativateUser(usuario:Usuario){

  }

  //editar usuario
  editUser(usuario:Usuario){}

  //verifica se usuário esta logado
  isLoggedIn() {
    return this.afa.auth
  }

  //metodo que pega usuario autenticado
  currentUser(uid:string){  
    return this.af.collection("users", ref=> ref.where("uid", "==", uid)).snapshotChanges().pipe(map(e =>{
      return e.map(a =>{
        return a.payload.doc.data() as Usuario
      })
    }))
  }
}
