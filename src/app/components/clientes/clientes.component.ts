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
  displayedColumns: string[] = ['apellido', 'email', 'id', 'nombre', 'saldo'];

  //Variables
  clientes!: Cliente[];
  booleanCheck: boolean = false;


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private clientesService: ClienteServices) {
  }

  ngOnInit(){
      this.clientesService.getClientes().subscribe(clientesDb => {
          this.clientes = clientesDb;

          //Asignamos la data al datasource
          this.dataSource = new MatTableDataSource(this.clientes)
          console.log(this.dataSource.data, this.clientes);
          this.booleanCheck = true;  
      })
  }

}
