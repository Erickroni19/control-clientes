import { Component,HostListener} from '@angular/core';
import { OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';



@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit{

  //Variables
  isHeaderResponsive: boolean = window.innerWidth <= 700;
  hasHideResponsiveMenu: boolean = false;
  isLoggedIn: boolean = false;
  hasClicked: boolean = false;
  emailOfLoggedInUser: string = '';

  constructor(private loginService: LoginService,
              private router: Router
  ) {}
  
  ngOnInit() {

    /**Verificamos que el usuario este autenticado */
    this.loginService.getAuth().subscribe( auth => {
      if(auth){
        this.isLoggedIn = true;

        if(auth.email !== null) this.emailOfLoggedInUser = auth.email;
      }else{
        this.isLoggedIn = false;
        this.router.navigate(['/login'])
      }
    })
  }

  //Captura la medida de la pantalla
  @HostListener('window:resize', ['$event'])
  captureScreenSize(event: Event) {
    this.isHeaderResponsive = window.innerWidth <= 700;
  }


  //Controla el menu DropDown del Cabecero
  controlDropDown(event: Event) {
    
    if(event.type == 'click' && !this.hasClicked) {
      this.hasHideResponsiveMenu = true
      this.hasClicked = true;

    }else if(event.type == 'click' && this.hasClicked){

      this.hasHideResponsiveMenu = false
      this.hasClicked = false;
    }
  }

  /**Cierra a la sesión de la app */
  logout(){

    this.loginService.logout();

    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }


}
