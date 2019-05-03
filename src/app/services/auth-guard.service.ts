import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { LoginService } from './login.service';

//@Author Ismael Alves
@Injectable({
  providedIn: 'root'
})

export class AuthGuardService implements CanActivate {
  constructor(
    private loginS:LoginService,
  ){ }
  

  //protege a rota de chat
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
    return this.loginS.usersPermissions(route.data.permission)
  }
}
