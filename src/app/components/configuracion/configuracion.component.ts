import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Configuracion } from 'src/app/interfaces/configuracion';
import { ConfiguracionService } from 'src/app/services/configuracion.service';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.css']
})
export class ConfiguracionComponent implements OnInit{

  permitirRegistro: boolean = false;

  constructor(private configuracionService: ConfiguracionService,
              private router: Router){}

  ngOnInit() {
      this.configuracionService.getConfiguracion().subscribe(       
        (configuracion: Configuracion) => {

          if(configuracion && configuracion.permitirRegistro !== undefined){
            this.permitirRegistro = configuracion.permitirRegistro;
          }

        }
      )
  }

  /**Guarda la configuración */
  saveConfiguration(){

    let configuracion = {
      permitirRegistro: this.permitirRegistro
    };

    this.configuracionService.modificarConfiguracion(configuracion);

    //navegamos a inicio
    this.router.navigate(['/']);
  }

}
