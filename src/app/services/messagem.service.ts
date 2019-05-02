import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Messagem } from '../models/messagem.model';
import { Usuario } from '../models/usuario.model';

//@Author Ismael Alves
@Injectable({
  providedIn: 'root'
})
export class MessagemService {
  
  adminUid:string = 'EtsDKauC0EQXMstWArscfYAvCCi1';

  notification:number = 0;

  constructor(
    private af:AngularFirestore,
  ) { }

  //pegar msg dos usuarios Cadastrados
  getUsersMsg(){
    return this.af.collection('users').doc(this.adminUid).collection('notification').valueChanges()
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
   this.sendNotification(current, parter)
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

  //envia Notificação
  sendNotification(current:Usuario, parter:Usuario){
    
    if(current.tipoUsuario == 0){
      this.af.collection('users').doc(parter.uid).valueChanges().subscribe((notification:Usuario[])=>{
        this.notification = notification[0].notification
      })
      this.af.collection('users').doc(parter.uid).update({
        notification: this.notification =+ 1
      })
    }else{
      this.af.collection('users').doc(this.adminUid).collection("notification").doc(parter.uid).valueChanges().subscribe((notification:Usuario[])=>{
        this.notification = notification[0].notification
      })
      this.af.collection('users').doc(this.adminUid).collection("notification").doc(parter.uid).set({
        uid: current.uid,
        foto: current.foto,
        email: current.email,
        nome: current.nome,
        online: current.online,
        tipoUsuario: 1,
        dtCadastro: current.dtCadastro,
        notification: this.notification += 1
      })
    }
  }

  //pega a sala de bate-papo
  getRoom(uid1, uid2:string):string{
    let keyRoom:string;
    if(uid1 < uid2 ){
      keyRoom = `${uid1}${uid2}`
    }else{
      keyRoom = `${uid2}${uid1}`
    }
    console.log(keyRoom)
    return keyRoom
  }
}
