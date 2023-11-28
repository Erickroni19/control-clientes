import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  editClientForm!: FormGroup;
  disableButton: boolean = true;

  constructor(private clientesSevice: ClienteServices,
              private router: Router,
              private fb: FormBuilder,
              private route: ActivatedRoute){

  }

  ngOnInit(){
    //FormGroup
    this.editClientForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern(/^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/)]],
      saldo: ['', Validators.required]
    })




    this.id = this.route.snapshot.params['id'];
    this.clientesSevice.getCliente(this.id).subscribe( resp =>{
      console.log(resp); 
    })
  }


   /**Captura los datos ingresados por el usuario*/
   inputField(fieldName: String){
    let fieldInput = '';
    fieldInput = this.editClientForm.get(`${fieldName}`)?.value
    console.log(fieldInput);

    return fieldInput
  }

}
