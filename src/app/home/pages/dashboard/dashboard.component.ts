import { Component } from '@angular/core';
import { OnInit} from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{

  isLoggedIn: boolean = false;

  constructor(private authService: AuthService){}

  ngOnInit(){
    this.authService.getAuthenticatedUser().subscribe( userLoggedIn => {

      if(userLoggedIn) this.isLoggedIn = true;

    })
  }

}
