import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
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
export class ClientesComponent implements OnInit, AfterViewInit{
  dataSource: MatTableDataSource<Cliente> = new MatTableDataSource();
  displayedColumns: string[] = ['id','nombre','apellido', 'email', 'saldo', 'editar'];

  //Variables
  clientes!: Cliente[];
  clientesCopy !: Cliente[];
  booleanCheck: boolean = false;
  spinnerCheck: boolean = true;
  paginatorPrueba: boolean = false;
  saldoTotalVar: number = 0;
  pageSize = 5;

  @ViewChild(MatPaginator) set paginator(value: MatPaginator) {
    this.dataSource.paginator = value;
  }

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
          
          this.dataSource.paginator = this.paginator;
          console.log(this.paginator);
          
          // console.log(this.dataSource.data, this.clientes);
          this.booleanCheck = true;  

          //Saldo total
          this.saldoTotalVar = this.saldoTotal(this.clientes);
          console.log(this.saldoTotalVar);
          this.spinnerCheck = false;
    })   
  }

  ngAfterViewInit() {

    // setTimeout(() => {
    //   console.log(this.paginator.firstPage);
    // }, 1000);
    
  }

  /**Funciones - Metodos */

  /**Abre el dialog */
  openDialog(id: String, element: any){

    console.log(element);
    
    
    const dialogRef = this.dialog.open(DialogAgregarClientComponent,{
      width: '600px',
      height: '265px',
      disableClose: true,
      enterAnimationDuration: '600ms',
      exitAnimationDuration: '500ms',
      data:{
        nombre: 'Erick',
        apellido: 'Romero',
        email: 'email@sjsh.co',
        saldo: 0,
        id: id
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.clientesService.agregarCliente(result);
      }
    });

  }

  /**Obtener la información del cliente */
  getClient(id: string){
    this.clientesService.getCliente(id).subscribe( cliente => {
      console.log(cliente);
    })
  }

  /**Ver detalles de la fila */
  verDetalles(element: any) {
    // element contiene toda la información de la fila
    console.log('Detalles de la fila:', element);
    // Realiza las operaciones que necesites con la información de la fila
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
