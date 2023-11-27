import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Cliente } from 'src/app/interfaces/cliente';
import { ClienteServices } from 'src/app/services/clientes.service';
import { DialogAgregarClientComponent } from '../dialog-agregar-client/dialog-agregar-client.component';
import { MatDialog } from '@angular/material/dialog';

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
  spinnerCheck: boolean = true;
  saldoTotalVar: number = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private clientesService: ClienteServices,
              private router: Router,
              public dialog: MatDialog,
              ) {
  }

  ngOnInit(){

    this.clientesService.getClientes().subscribe(clientesDb => {
          // this.spinnerCheck = true;
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
          this.spinnerCheck = false;
    })   
  }

  /**Funciones - Metodos */

  /**Abre el dialog */
  openDialog(){

    const dialogRef = this.dialog.open(DialogAgregarClientComponent,{
      width: '600px',
      height: '265px',
      disableClose: true,
      enterAnimationDuration: '600ms',
      exitAnimationDuration: '500ms',
      // data:{}
    });

    dialogRef.afterClosed().subscribe(result => {
        console.log('Dialogo cerrado', result);
    });

  }

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

  /**Obtien la ruta de editar */
  rutaEditar(){
    this.router.navigate(['cliente/editar/{{clientes.id}}'])
  }

}
