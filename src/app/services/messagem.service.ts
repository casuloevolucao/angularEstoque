import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Messagem } from '../models/messagem.model';
import { Usuario } from '../models/usuario.model';

//@Author Ismael Alves
@Injectable({
  providedIn: 'root'
})
export class MessagemService {
  
  constructor(
    private af:AngularFirestore,
  ) { }

  //pegar msg dos usuarios Cadastrados
  getUsersMsg(){
    return this.af.collection('users', ref => ref.where('tipoUsuario', '==', 1).where('chat', '==', true)).valueChanges()
  }
  
  //pega o admin como parter
  getAdmin(){
    return this.af.collection('users', ref => ref.where('tipoUsuario', '==', 0)).valueChanges()
  }
  //pegar as messagens do chat
  getData(key:string){
    return this.af.collection("msg").doc(key).collection("menssagens", ref=> ref.orderBy("dt")).valueChanges()
  }

  //envia a menssagem
  async sendMenssage(msg:Messagem, key:string, current:Usuario, parter?:Usuario){
   this.sendNotification(current)
    return this.af.collection('msg').doc(key).collection("menssagens").add({
      msg:msg.msg,
      dt: new Date(),
      nome: current.nome,
      uid: current.uid,
      email: current.email,
      foto: current.foto
    })
  }

  //salva o chat ativo
  salveRoom(ketRoom:string){
    localStorage.setItem("keyRoom", ketRoom)
  }

  //pegar chat Ativo
  getSalveRoom():string{
    return localStorage.getItem("keyRoom")
  }

  //limpa notificação
  clearNotification(users:Usuario){
    if(users.tipoUsuario == 1){
      this.af.collection('users').doc(users.uid).update({
        notification: 0,
        chat:true
      })
    }else{
      this.af.collection('users').doc('EtsDKauC0EQXMstWArscfYAvCCi1').collection("notification")
    }
  }

  //envia Notificação
  sendNotification(current:Usuario){
    if(current.tipoUsuario == 1){
      this.af.collection('users').doc(current.uid).update({
        notification: current.notification += 1,
        chat:true
      })
    }else{
      this.af.collection('users').doc('EtsDKauC0EQXMstWArscfYAvCCi1').collection("notification")
    }
  }

  //pega a sala de bate-papo
  getRoom(uid2:string):string{
    let uid1 = 'EtsDKauC0EQXMstWArscfYAvCCi1';
    let keyRoom:string;
    if(uid1 < uid2 ){
      keyRoom = `${uid1}${uid2}`
    }else{
      keyRoom = `${uid2}${uid1}`
    }
    return keyRoom
  }
}
