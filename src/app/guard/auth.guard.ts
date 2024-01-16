import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Injectable} from '@angular/core';
import { Router} from '@angular/router';
import { map } from 'rxjs';

@Injectable()
export class AuthGuard {

    constructor(private router: Router,
                private afAuth: AngularFireAuth){
    }

    canActivate(){
        return this.afAuth.authState.pipe(
            map( auth => {
                
                if(!auth){
                    this.router.navigate(['/login']);
                    return false;
                }else{
                    return true;
                }
            })
        )
    }
}



