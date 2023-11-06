import { Component, ViewChild } from '@angular/core';
import { OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';


@Component({
  selector: 'app-cabecero',
  templateUrl: './cabecero.component.html',
  styleUrls: ['./cabecero.component.css']
})

export class CabeceroComponent implements OnInit{

  //Variables
  acumClick: number = 0;
  checkDropDown: boolean = false;
  menuButtonCheck: boolean = false;

  constructor() {}
  
  ngOnInit() {
    // Código que se ejecutará cuando se inicialice el componente
  }

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
