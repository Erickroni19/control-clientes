import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Cliente } from 'src/app/interfaces/cliente';
import { ClienteServices } from 'src/app/services/clientes.service';
import { DialogAgregarClientComponent } from '../dialog-agregar-client/dialog-agregar-client.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit, AfterViewInit{
  dataSource: MatTableDataSource<Cliente> = new MatTableDataSource();
  displayedColumns: string[] = ['id','nombre','apellido', 'email', 'saldo', 'editar', 'eliminar'];

  //Variables
  clientes!: Cliente[];
  clientesCopy !: Cliente[];
  editData!: any;
  idObject: any = {};
  booleanCheck: boolean = false;
  spinnerCheck: boolean = true;
  paginatorPrueba: boolean = false;
  dialogOpen: boolean = false;
  confirmDialogOpen: boolean = false;
  saldoTotalVar: number = 0;
  uid: string = '';

  /**Filtro */
  filtro: Cliente = {};

  @ViewChild(MatPaginator) set paginator(value: MatPaginator) {
    this.dataSource.paginator = value;
  }

  constructor(private clientesService: ClienteServices,
              private loginService: LoginService,
              private router: Router,
              public dialog: MatDialog,
              ) {
  }

  ngOnInit(){

    //Obtenemos la información de los clientes
    this.clientesService.getClientes().subscribe(clientesDb => {
      console.log(clientesDb);
      
          // this.spinnerCheck = true;
          this.clientes = clientesDb;

          //Copia el array
          this.clientesCopy = JSON.parse(JSON.stringify(clientesDb));
          let newId = 0;

          // console.log(this.clientes, this.clientesCopy);
          /*Se asigna un nuevo id y se crea objeto
          * para almacenar el nuevo id correspondiente a cada id
          * original*/
          this.clientesCopy.forEach( cliente => {
            let oldId = cliente.id;

            cliente.id = `${++newId}`;

            
            this.idObject[cliente.id] = oldId;
          })
          
          //Asignamos la data al datasource
          this.dataSource = new MatTableDataSource(this.clientesCopy)
          
          this.dataSource.paginator = this.paginator;
          // console.log(this.paginator);
          
          // console.log(this.dataSource.data, this.clientes);
          this.booleanCheck = true;  

          //Saldo total
          this.saldoTotalVar = this.saldoTotal(this.clientes);
          console.log(this.saldoTotalVar);
          this.spinnerCheck = false;
    })

    //Obtenemos el uid del usuario loggeado
    this.loginService.getAuth().subscribe( auth => {
      this.uid = auth?.uid || '';
      console.log(this.uid);
    })
    
    
  }

  ngAfterViewInit() {

    // setTimeout(() => {
    //   console.log(this.paginator.firstPage);
    // }, 1000);
    
  }

  /**Funciones - Metodos */

  /**Abre el dialog añadir - editar*/
  openDialog(idEjecucion: string, element: any){

    //Evitar doble ejecucion
    if(this.dialogOpen) {
      return;
    }

    //Editar cliente
    if(idEjecucion === 'Editar'){
      
      this.getOrDeleteDataClient(element, idEjecucion);
      
    }

    
    setTimeout(() => {      
      const dialogRef = this.dialog.open(DialogAgregarClientComponent,{
        width: '600px',
        height: '265px',
        disableClose: true,
        enterAnimationDuration: '600ms',
        exitAnimationDuration: '500ms',
        data:{
          editData: this.editData || '',
          idEjecucion: idEjecucion,
          uid: this.uid
        }
      });
  
      this.dialogOpen = true
  
      dialogRef.afterClosed().subscribe(result => {
        if(result && idEjecucion === 'Agregar'){
          result.uid = this.uid;
          console.log(result);
          this.clientesService.agregarCliente(result); 
  
        }else if(result && idEjecucion === 'Editar'){
          
          this.clientesService.modificarCliente(result, this.editData.id);
  
          console.log('edit', result);  
        }
        this.dialogOpen = false; 
      });  
    }, 20);
  }

  /**OpenDialog Confirm */
  openDialogConfirm(){

    if(this.confirmDialogOpen){
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent,{
      width: '250px',
      disableClose: true,
      enterAnimationDuration: '600ms',
      exitAnimationDuration: '500ms',
      data:{
        message: '¿Desea Eliminar El cliente?',
        tittle: 'Eliminar Cliente'
      }
    });

    this.confirmDialogOpen = true;

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if(result === 'Si'){
        this.clientesService.eliminarCliente(this.editData);
      }
          
    })

  }

  /**Obtiene la información del cliente */
  getOrDeleteDataClient(element: any, idEjecucion: string){
    console.log('Get or delete');
    this.confirmDialogOpen = false;
    
    const idOriginal = this.getIdClient(element);
    
    this.clientesService.getCliente(idOriginal).subscribe( cliente => {
      this.editData = cliente;
      
      // }/**Elimina la informacion del cliente */
      if(idEjecucion === 'delete'){
        this.openDialogConfirm();
      }
    })
  }

  /**Obtiene el id original del cliente*/
  getIdClient(element: any) { 
    return this.idObject[element.id]
  }

  /**Filtra los datos de la lista */
  filterData(){

    const filterValue = this.filtro;

    //Aplica filtro a la lista original
    const filteredList = this.clientesCopy.filter( client => {
      return Object.keys(filterValue).every(key => {
        return !filterValue[key] || String(client[key]).toLowerCase().includes(String(filterValue[key]).toLowerCase())
      })
    })

    //Acyualiza la data
    this.dataSource.data = filteredList;
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
