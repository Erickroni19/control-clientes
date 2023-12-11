import { Component, HostListener} from '@angular/core';
import { OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';



@Component({
  selector: 'app-cabecero',
  templateUrl: './cabecero.component.html',
  styleUrls: ['./cabecero.component.css']
})

export class CabeceroComponent implements OnInit{

  //Variables
  screenWidth: number;
  acumClick: number = 0;
  checkDropDown: boolean = false;
  menuButtonCheck: boolean = false;
  isLoggedIn: boolean = false;
  loggedInUser!: string;

  constructor(private renderer: Renderer2,
              private loginService: LoginService,
              private router: Router
  ) {
    this.screenWidth = window.innerWidth;
  }
  
  ngOnInit() {

    /**Verificamos que el usuario este autenticado */
    this.loginService.getAuth().subscribe( auth => {
      if(auth){
        this.isLoggedIn = true;

        if(auth.email !== null) this.loggedInUser = auth.email;
      }else{
        this.isLoggedIn = false;
        this.router.navigate(['/login'])
      }
    })
  }

  //Captura la medida de la pantalla
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.screenWidth = window.innerWidth;

    if(this.screenWidth <= 700) this.menuButtonCheck = true;
    else this.menuButtonCheck = false;
  }

  //Controla el menu DropDown del Cabecero
  controlDropDown(event: Event) {
    console.log(this.acumClick);
    
    if(event.type == 'click' && this.acumClick === 0) {
      this.checkDropDown = true
      this.acumClick = 1;

    }else if(event.type == 'click' && this.acumClick == 1){

      this.checkDropDown = false
      this.acumClick = 0;
    }
  }

  /**Cierra a la sesión de la app */
  logout(){

    this.loginService.logout();

    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }


}
