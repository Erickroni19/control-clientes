import { Component, ViewChild } from '@angular/core';
import { OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';


@Component({
  selector: 'app-cabecero',
  templateUrl: './cabecero.component.html',
  styleUrls: ['./cabecero.component.css']
})

export class CabeceroComponent implements OnInit{

  // @ViewChild('sidenav') sidenav!: MatSidenav;

  constructor() {}
  
  ngOnInit() {
    // Código que se ejecutará cuando se inicialice el componente
  }

  // toggleSidenav() {
  //   console.log('correcto');
  //   this.sidenav.toggle();
  // }

}
