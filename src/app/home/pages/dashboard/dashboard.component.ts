import { Component } from '@angular/core';
import { OnInit} from '@angular/core';
import { LoginService } from 'src/app/core/services/login.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{

  isLoggedIn: boolean = false;

  constructor(private loginService: LoginService){}

  ngOnInit(){
    this.loginService.getAuthenticatedUser().subscribe( userLoggedIn => {

      if(userLoggedIn) this.isLoggedIn = true;

    })
  }

}
