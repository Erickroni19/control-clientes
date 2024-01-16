import { ConfiguracionService } from 'src/app/services/configuration.service';
import { Configuration } from 'src/app/interfaces/configuration';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css']
})
export class ConfigurationComponent implements OnInit{

  canRegister: boolean = false;

  constructor(private configurationService: ConfiguracionService,
              private router: Router){}

  ngOnInit() {
    this.configurationService.getConfiguracion().subscribe(       
      (configuration: Configuration) => {

        if(configuration.canRegister) this.canRegister = configuration.canRegister;
          
      }
    )
  }

  saveConfiguration(){

    let configuration = {
      canRegister: this.canRegister
    };

    this.configurationService.modificarConfiguracion(configuration);

    //navegamos a inicio
    this.router.navigate(['/']);
  }

}
