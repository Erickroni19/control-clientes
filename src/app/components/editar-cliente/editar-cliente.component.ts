import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Cliente } from 'src/app/interfaces/cliente';
import { ClienteServices } from 'src/app/services/clientes.service';

@Component({
  selector: 'app-editar-cliente',
  templateUrl: './editar-cliente.component.html',
  styleUrls: ['./editar-cliente.component.css']
})
export class EditarClienteComponent implements OnInit{

  cliente: Cliente = {
    nombre: '',
    apellido: '',
    email: '',
    saldo: 0
  }

  id!: string;

  constructor(private clientesSevice: ClienteServices,
              private router: Router,
              private route: ActivatedRoute){

  }

  ngOnInit(){
    this.id = this.route.snapshot.params['id'];
    this.clientesSevice.getCliente(this.id).subscribe( resp =>{
      console.log(resp); 
    })
  }

}
