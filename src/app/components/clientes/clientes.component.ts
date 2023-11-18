import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Cliente } from 'src/app/interfaces/cliente';
import { ClienteServices } from 'src/app/services/clientes.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit{
  dataSource!: MatTableDataSource<Cliente>;
  displayedColumns: string[] = ['id','nombre','apellido', 'email', 'saldo', 'editar'];

  //Variables
  clientes!: Cliente[];
  clientesCopy !: Cliente[];
  booleanCheck: boolean = false;
  saldoTotalVar: number = 0;


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private clientesService: ClienteServices) {
  }

  ngOnInit(){
      this.clientesService.getClientes().subscribe(clientesDb => {
          this.clientes = clientesDb;

          //Copia el array
          this.clientesCopy = JSON.parse(JSON.stringify(clientesDb));
          let newId = 0;

          console.log(this.clientes, this.clientesCopy);
          //Se asigna un nuevo id
          this.clientesCopy.forEach( cliente => {
            cliente.id = `${++newId}`; 
          })
          
          //Asignamos la data al datasource
          this.dataSource = new MatTableDataSource(this.clientesCopy)
          // console.log(this.dataSource.data, this.clientes);
          this.booleanCheck = true;  

          //Saldo total
          this.saldoTotalVar = this.saldoTotal(this.clientes);
          console.log(this.saldoTotalVar);
      })
        
      
  }

  /**Funciones - Metodos */

  /**Obtiene el Valor del saldo total */
  saldoTotal(clientes: Cliente[]){
    
    let saldoTotal: number = 0;
    
    clientes.forEach( cliente => {
      if(cliente && cliente.saldo !== undefined){
        saldoTotal += cliente.saldo;
      }else {
        return;
      }
    })
    return saldoTotal;
  }

}
