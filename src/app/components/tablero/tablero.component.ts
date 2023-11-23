import { Component } from '@angular/core';
import { OnInit} from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
@Component({
  selector: 'app-tablero',
  templateUrl: './tablero.component.html',
  styleUrls: ['./tablero.component.css']
})
export class TableroComponent implements OnInit{

  isLoggedIn: boolean = false;

  constructor(private loginService: LoginService){}

  ngOnInit(){
    this.loginService.getAuth().subscribe( auth => {
      if(auth){
        this.isLoggedIn = true;
      }
    })
  }

}
