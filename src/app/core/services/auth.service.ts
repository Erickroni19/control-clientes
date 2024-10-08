import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { User } from '../interfaces';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public usersCollection: AngularFirestoreCollection<User>;

  constructor(
    private authService: AngularFireAuth,
    private firebaseDb: AngularFirestore
  ){

    this.usersCollection = firebaseDb.collection('users');
  }

  login(email: string, password: string){
    return new Promise((resolve, reject) =>{
      this.authService.signInWithEmailAndPassword(email, password)
      .then(data => resolve(data),
      error => reject(error.code));
    })
  }

  getAuthenticatedUser(){
    return this.authService.authState.pipe(
      map( auth => auth)
    )
  }


  registerUser(user: User){

    const { username, email, password } = user;

    return new Promise((resolve, reject) => {

      if( password ) {

        this.authService.createUserWithEmailAndPassword(email, password)
        .then(data => {
          this.addUser({username, email});
          resolve(data);
        })
        .catch( (error) => reject(error.code) );
      }
    })
  }

  changePassword(email: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.authService.sendPasswordResetEmail(email)
      .then(() => resolve())
      .catch((error) => reject(error));
    });
  }

  private addUser(user: User): Promise<string> {

    return this.usersCollection.add(user)
    .then((docRef) => {
      console.log('Usuario agregado con Id: ', docRef.id);
      return docRef.id;
    })
    .catch((error) => {
      console.error('Error al agregar usuario:', error);
      throw error;
    })
  }

  logout(){
    this.authService.signOut();
  }
}
