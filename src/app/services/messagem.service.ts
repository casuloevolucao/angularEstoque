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

  contNotification:number = 0;

  config:Config;

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
    if(MessagemService.getSalveKeyRoom() == null){
      MessagemService.salveKeyRoom(key)
    }
    if(MessagemService.getSalveKeyRoom() != key){
      this.setChatConfigOf(key, current).then(()=>{
        MessagemService.salveKeyRoom(key)
      })
    }

    this.validateNotification(key, current, parter)
    return this.af.collection('msg').doc(key).collection("menssagens").add({
      msg:msg.msg,
      dt: new Date(),
      nome: current.nome,
      uid: current.uid,
      email: current.email,
      foto: current.foto
    })
 
  }

  //metodo que valida notificação
  validateNotification( keyRoom:string ,current:Usuario, parter:Usuario){
    this.af.collection('msg').doc(keyRoom).valueChanges().subscribe((config:Config)=>{
      this.config = config
    })
    let configTemp:Config = new Config()
    if(this.config == undefined ){
      configTemp.admin = false
      this.setChatConfigOn(keyRoom, current, configTemp).then(()=>{
        console.log("true a noficação envia pro admin",configTemp.admin == false && current.tipoUsuario == 1)
        console.log("se for true a notificação envia pro usuario",configTemp.client == false && current.tipoUsuario == 0)
        console.log("contador temp", this.contNotification)
        if(configTemp.admin == false && current.tipoUsuario == 1){
          this.sendNotificationClient(current)
        }
        if(configTemp.client == false && current.tipoUsuario == 0){
          this.sendNotificationAdmin(parter)
        }
      })
    }else{
      this.setChatConfigOn(keyRoom, current, this.config).then(()=>{
        console.log("true a noficação envia pro admin", this.config.admin == false && current.tipoUsuario == 1)
        console.log("contador", this.contNotification)
        console.log("se for true a notificação envia pro usuario",this.config.client == false && current.tipoUsuario == 0)
        if(this.config.admin == false && current.tipoUsuario == 1){
          this.sendNotificationClient(current)
        }
        if(this.config.client == false && current.tipoUsuario == 0){
          this.sendNotificationAdmin(parter)
        }
      })
    }
  }

  //manda notificação para o cliente do sistema
  sendNotificationAdmin(parter:Usuario){
    this.af.collection('users').doc(parter.uid).valueChanges().subscribe((notif:Usuario)=>{
      if(this.contNotification == 0){
        this.contNotification += notif.notification
      }
    })
    this.af.collection('users').doc(parter.uid).update({
      notification: this.contNotification += 1
    })
  }

  //manda notificação para o admin do sistema
  sendNotificationClient(current:Usuario){
    this.af.collection('users').doc(this.adminUid).collection("notification").doc(current.uid).valueChanges().subscribe((notif:Usuario)=>{
      if(this.contNotification == 0){
        this.contNotification += notif.notification  
      }   
    })
    this.af.collection('users').doc(this.adminUid).collection("notification").doc(current.uid).set({
      uid: current.uid,
      foto: current.foto,
      email: current.email,
      nome: current.nome,
      online: current.online,
      tipoUsuario: 1,
      dtCadastro: current.dtCadastro,
      notification: this.contNotification += 1
    })
  }

  //limpa notificação para o cliente do sistema
  clearNotificationAdmin(current:Usuario){
    this.af.collection('users').doc(current.uid).update({
      notification: 0
    })
  }

  //limpa notificação para o admin do sistema
  clearNotificationClient(parter:Usuario){
    this.af.collection('users').doc(this.adminUid).collection("notification").doc(parter.uid).update({
      notification: 0
    })
  }

  //colocar usuario online no chat
  async setChatConfigOn(keyRoom:string , current:Usuario, config:Config){
    if(current.tipoUsuario == 0){
    return await this.af.collection('msg').doc(keyRoom).update({
        admin:true,
      })
    }else if (current.tipoUsuario == 1 && config.admin == false){
    return await this.af.collection('msg').doc(keyRoom).set({
        client:true,
        admin:false
      })
    }
  }

  //colocar usuario offline no chat
  async setChatConfigOf(keyRoom:string , current:Usuario){
    if(current.tipoUsuario == 0){
      this.af.collection('msg').doc(keyRoom).update({
        admin:false
      })
    }else if(current.tipoUsuario){
      this.af.collection('msg').doc(keyRoom).update({
        client:false
      })
    }
  }

  //salvar chave do chat
  static salveKeyRoom(keyRoom:string){
    localStorage.setItem("keyRoom", keyRoom)
  }

  //pegar chave do chat salva
  static getSalveKeyRoom():string{
    return localStorage.getItem("keyRoom")
  }

  getParterChat(parter:Usuario){
    return this.af.collection('users').doc(this.adminUid).collection("notification").doc(parter.uid).valueChanges()
  }

  //pega a sala de bate-papo
  getRoom(uid1, uid2:string):string{
    let keyRoom:string;
    if(uid1 < uid2 ){
      keyRoom = `${uid1}${uid2}`
    }else{
      keyRoom = `${uid2}${uid1}`
    }
    return keyRoom
  }
}
