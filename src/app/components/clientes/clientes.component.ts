import { Component, OnInit } from '@angular/core';
import { Cliente } from 'src/app/interfaces/cliente';
import { ClienteServices } from 'src/app/services/clientes.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit{

  //Variables
  clientes!: Cliente[];

  constructor(private clientesService: ClienteServices) {

  }

  ngOnInit(){
      this.clientesService.getClientes().subscribe(clientesDb => {
          this.clientes = clientesDb;
      })
  }

}
