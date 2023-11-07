import { Component, HostListener} from '@angular/core';
import { OnInit, Renderer2 } from '@angular/core';



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

  constructor(private renderer: Renderer2) {
    this.screenWidth = window.innerWidth;
  }
  
  ngOnInit() {
    // Código que se ejecutará cuando se inicialice el componente
  }

  //Captura la medida de la pantalla
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.screenWidth = window.innerWidth;

    if(this.screenWidth <= 699) this.menuButtonCheck = true;
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


}
