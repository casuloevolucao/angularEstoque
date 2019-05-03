import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Messagem } from '../models/messagem.model';
import { Usuario } from '../models/usuario.model';
import { Config } from '../models/config.model';

//@Author Ismael Alves
@Injectable({
  providedIn: 'root'
})
export class MessagemService {
  
  adminUid:string = 'EtsDKauC0EQXMstWArscfYAvCCi1';

  notification:number = 0;

  config:Config = new Config();

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
    if(this.getSalveKeyRoom() == null){
      this.salveKeyRoom(key)
    }
    if(this.getSalveKeyRoom() != key){
      this.setChatConfigOf(key, current)
      this.salveKeyRoom(key)
    }
    await this.setChatConfigOn(key, current, parter)
    this.af.collection('msg').doc(key).collection("menssagens").add({
      msg:msg.msg,
      dt: new Date(),
      nome: current.nome,
      uid: current.uid,
      email: current.email,
      foto: current.foto
    })
 
  }

  //envia Notificação
   async sendNotification( keyRoom:string ,current:Usuario, parter:Usuario){
    return new Promise(async (resolve, reject)=>{
      this.af.collection('msg').doc(keyRoom).valueChanges().subscribe((config:Config)=>{
        if(config.admin == undefined){
          config.admin = false
        }   
        console.log(config)
        this.config = config
      })
      if(current.tipoUsuario == 0 ){
        await this.af.collection('users').doc(parter.uid).valueChanges().subscribe((notification:Usuario[])=>{
          this.notification = notification[0].notification
        })
        await this.af.collection('users').doc(parter.uid).update({
          notification: this.notification =+ 1
        })
        resolve(this.notification)
      }else if(current.tipoUsuario == 1){
        await this.af.collection('users').doc(this.adminUid).collection("notification").doc(parter.uid).valueChanges().subscribe((notification:Usuario[])=>{
          this.notification = notification[0].notification
        })
        console.log("entrou")
        await this.af.collection('users').doc(this.adminUid).collection("notification").doc(parter.uid).set({
          uid: current.uid,
          foto: current.foto,
          email: current.email,
          nome: current.nome,
          online: current.online,
          tipoUsuario: 1,
          dtCadastro: current.dtCadastro,
          notification: this.notification += 1
        })
        resolve(this.notification)
      } 
    })
  }

  async setChatConfigOn(keyRoom:string , current:Usuario, parter:Usuario){
    if(current.tipoUsuario == 0){
      await this.af.collection('msg').doc(keyRoom).set({
        admin:true,
      })
    }else if (current.tipoUsuario == 1){
      await this.af.collection('msg').doc(keyRoom).set({
        client:true
      })
    }
  }

  async setChatConfigOf(keyRoom:string , current:Usuario){
    if(current.tipoUsuario == 0){
      this.af.collection('msg').doc(keyRoom).update({
        admin:false
      })
    }else{
      this.af.collection('msg').doc(keyRoom).update({
        client:false
      })
    }
  }

  salveKeyRoom(keyRoom:string){
    localStorage.setItem("keyRoom", keyRoom)
  }

  getSalveKeyRoom():string{
    return localStorage.getItem("keyRoom")
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
