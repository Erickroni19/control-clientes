import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private authService: AngularFireAuth) { }
}
