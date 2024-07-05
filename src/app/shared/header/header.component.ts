import { Component,HostListener} from '@angular/core';
import { Router } from '@angular/router';
import { OnInit} from '@angular/core';
import { LoginService } from 'src/app/core/services/login.service';



@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit{

  isHeaderResponsive: boolean = window.innerWidth <= 700;
  hasHideResponsiveMenu: boolean = false;
  emailOfLoggedInUser: string = '';
  isLoggedIn: boolean = false;
  hasClicked: boolean = false;
  userStatus: string = '';

  constructor(private loginService: LoginService,
              private router: Router
  ) {}

  ngOnInit() {

    this.loginService.getAuthenticatedUser().subscribe( auth => {
      if(auth){
        this.isLoggedIn = true;
        this.userStatus = 'Bienvenido';

        if(auth.email !== null) this.emailOfLoggedInUser = auth.email;
      }else{
        this.isLoggedIn = false;

        this.userStatus = 'Iniciar Sesion';
      }
    })
  }

  @HostListener('window:resize', ['$event'])
  captureScreenSize(event: Event) {
    this.isHeaderResponsive = window.innerWidth <= 700;
  }


  controlDropDown(event: Event) {

    if(event.type == 'click' && !this.hasClicked) {
      this.hasHideResponsiveMenu = true
      this.hasClicked = true;

    }else if(event.type == 'click' && this.hasClicked){

      this.hasHideResponsiveMenu = false
      this.hasClicked = false;
    }
  }

  logout(){

    this.loginService.logout();

    this.isLoggedIn = false;
    this.router.navigate(['auth/login']);
  }

}
