import { LoginService } from 'src/app/services/login.service';
import { Component } from '@angular/core';
import { OnInit} from '@angular/core';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{

  isLoggedIn: boolean = false;

  constructor(private loginService: LoginService){}

  ngOnInit(){
    this.loginService.getAuth().subscribe( userLoggedIn => {

      if(userLoggedIn) this.isLoggedIn = true;

    })
  }

}
