import { ConfigurationService } from 'src/app/core/services/configuration.service';
import { Configuration } from 'src/app/core/interfaces/configuration.interface';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css']
})
export class ConfigurationComponent implements OnInit{

  canRegister: boolean = false;

  constructor(private configurationService: ConfigurationService,
              private router: Router){}

  ngOnInit() {
    this.configurationService.getConfiguration().subscribe(
      (configuration: Configuration) => {

        if(configuration.canRegister) this.canRegister = configuration.canRegister;

      }
    )
  }

  saveConfiguration(){

    let configuration = {
      canRegister: this.canRegister
    };

    this.configurationService.editConfiguration(configuration);

    //navegamos a inicio
    this.router.navigate(['/home']);
  }

}
