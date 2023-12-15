import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private authService: AngularFireAuth) { }

  /**Valida la información de acceso de los usuarios */
  login(email: string, password: string){
    return new Promise((resolve, reject) =>{
      this.authService.signInWithEmailAndPassword(email, password)
      .then(datos => resolve(datos),
      error => reject(error));
    })
  }

  /**Retorna la información del usuario autenticado */
  getAuth(){
    return this.authService.authState.pipe(
      map( auth => auth)
    )
  }

  /**Cierra sesion del usuario */
  logout(){
    this.authService.signOut();
  }

  /**Registrar un nuevo usuario */
  register(email: string, password: string){
    return new Promise((resolve, reject) =>{
      this.authService.createUserWithEmailAndPassword(email, password)
      .then(datos => resolve(datos), 
      error => reject(error))
    })
  }

  /**Cambiar Contraseña*/
  sendPasswordResetEmail(email: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.authService.sendPasswordResetEmail(email)
        .then(() => resolve())
        .catch((error) => reject(error));
    });
  }
}
