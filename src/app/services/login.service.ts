import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private authService: AngularFireAuth) { }

  validateLoginCredentials(email: string, password: string){
    return new Promise((resolve, reject) =>{
      this.authService.signInWithEmailAndPassword(email, password)
      .then(data => resolve(data),
      error => reject(error));
    })
  }

  getAuthenticatedUser(){
    return this.authService.authState.pipe(
      map( auth => auth)
    )
  }

  logout(){
    this.authService.signOut();
  }

  registerUser(email: string, password: string){
    return new Promise((resolve, reject) =>{
      this.authService.createUserWithEmailAndPassword(email, password)
      .then(data => resolve(data), 
      error => reject(error))
    })
  }

  changePassword(email: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.authService.sendPasswordResetEmail(email)
        .then(() => resolve())
        .catch((error) => reject(error));
    });
  }
}
