import { Component,HostListener} from '@angular/core';
import { OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';



@Component({
  selector: 'app-cabecero',
  templateUrl: './cabecero.component.html',
  styleUrls: ['./cabecero.component.css']
})

export class CabeceroComponent implements OnInit{

  //Variables
  screenWidth: boolean = window.innerWidth <= 700;
  acumClick: number = 0;
  checkDropDown: boolean = false;
  isLoggedIn: boolean = false;
  loggedInUser!: string;

  constructor(private loginService: LoginService,
              private router: Router
  ) {}
  
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
    this.screenWidth = window.innerWidth <= 700;
  }


  //Controla el menu DropDown del Cabecero
  controlDropDown(event: Event) {
    
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
