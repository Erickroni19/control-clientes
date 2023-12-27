import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Cliente, Ids } from 'src/app/interfaces/cliente';
import { ClienteServices } from 'src/app/services/clientes.service';
import { DialogAgregarClientComponent } from '../dialog-agregar-client/dialog-agregar-client.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { LoginService } from 'src/app/services/login.service';
import { ErrorType } from 'src/app/interfaces/error-type';
import { SnackBarService } from 'src/app/services/snackBar.service';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientesComponent implements OnInit, AfterViewInit{
  dataSource: MatTableDataSource<Cliente> = new MatTableDataSource();
  displayedColumns: string[] = ['id','nombre','apellido', 'email', 'saldo', 'editar', 'eliminar'];

  //Variables
  isDialogOpen: boolean = false;
  clientsCopy: Cliente[] = [];
  isLoading: boolean = true;
  totalBalance: number = 0;
  clients: Cliente[] = [];
  idsClients: Ids = {};
  clientsLength = 0;
  userId: string = '';
  clientData!: any;

  /**Filtro */
  filtro: Cliente = {};

  //Traducción de los errores
  errorTranslations: ErrorType= {
    'Missing or insufficient permissions.': '!Solo puedes eliminar o editar los clientes que tu agregas¡',
    'The client is null or undefined': 'El cliente es null o undefined'
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private clientesService: ClienteServices,
              private snackBarService :SnackBarService,
              private loginService: LoginService,
              public dialog: MatDialog,
              private router: Router,
              ) {
  }

  ngOnInit(){

    //Obtenemos el uid del usuario loggeado
    this.loginService.getAuth().subscribe( auth => {
      this.userId = auth?.uid || '';
    })
    
  }

  ngAfterViewInit() {
   
    //Obtenemos la información de los clientes
    this.clientesService.getClientes().subscribe(clientesDb => {
          
          this.clients = clientesDb;

          //Copia el array
          this.clientsCopy = JSON.parse(JSON.stringify(clientesDb));
          let newId = 0;

          /*Se asigna un nuevo id y se crea objeto
          * para almacenar el id original como valor clave
          * del obejeto donde se guardaran ambos id*/
          this.clientsCopy.forEach( cliente => {
            let oldId = cliente.id;

            cliente.id = `${++newId}`;
            
            this.idsClients[cliente.id] = oldId;      
          })
          
          //Asignamos la data al datasource
          this.dataSource = new MatTableDataSource(this.clientsCopy);

          if(this.dataSource.data && this.paginator){

            this.clientsLength = this.dataSource.data.length;
            this.dataSource.paginator = this.paginator;

            this.isLoading = false;
          }
          
          //Saldo total
          this.totalBalance = this.saldoTotal(this.clients);
    })
  }

  /**Funciones - Metodos */

  /**Abre el dialog añadir - editar*/
  openDialog(idEjecucion: string, element: any){
    console.log(this.isDialogOpen, 'sss');
    //Evitar doble ejecucion
    if(this.isDialogOpen) {
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
          editData: this.clientData || '',
          idEjecucion: idEjecucion,
          uid: this.userId
        }
      });
  
      this.isDialogOpen = true
  
      dialogRef.afterClosed().subscribe(result => {
        if(result && idEjecucion === 'Agregar'){
          result.uid = this.userId;
  
          this.clientesService.agregarCliente(result)
          .then((clienteId) => {
            if(clienteId){
              this.snackBarService.snackBarMessages('Cliente Agregado Exitosamente', 'Ok', 'green-snackbar','bottom');
            }
          });
  
        }else if(result && idEjecucion === 'Editar'){
          
          this.clientesService.modificarCliente(result, this.clientData.id).then(() => {
              this.snackBarService.snackBarMessages('Cliente Editado Exitosamente', 'Ok', 'green-snackbar', 'bottom');
          }, (error) => {
            if(error){
              const errorMessage = this.errorTranslations[error.message] || 'Error Desconocido';
              this.snackBarService.snackBarMessages(errorMessage, 'Ok', 'red-snackbar', 'bottom');
            }
          })
      }

        this.isDialogOpen = false; 
      });  
    }, 20);
  }

  /**OpenDialog Confirm */
  openDialogConfirm(){
    
    if(this.isDialogOpen){
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

    this.isDialogOpen = true;

    dialogRef.afterClosed().subscribe(result => {
      if(result === 'Si'){
        this.clientesService.eliminarCliente(this.clientData).then(() =>{
          this.snackBarService.snackBarMessages('Cliente Eliminado Exitosamente', 'Ok', 'red-snackbar', 'bottom');
        },(error: any) => {
          if(error){
            const errorMessage = this.errorTranslations[error.message] || 'Error Desconocido';
            this.snackBarService.snackBarMessages(errorMessage, 'Ok', 'red-snackbar', 'bottom');
          }
        })
      }          
    })

    console.log(this.isDialogOpen, 'OpenConfirm');

  }

  /**Obtiene la información del cliente */
  getOrDeleteDataClient(element: any, idEjecucion: string){
    
    this.isDialogOpen = false;
    
    const idOriginal = this.getIdClient(element);

    if(idOriginal !== undefined){
      this.clientesService.getCliente(idOriginal).subscribe( cliente => {
        this.clientData = cliente;
        console.log(this.clientData);
        
        
        /**Elimina la informacion del cliente */
        if(idEjecucion === 'delete'){
          this.openDialogConfirm();
        }
        this.isDialogOpen = false;
  
        console.log(this.isDialogOpen, 'funcion');
        idEjecucion = ''
      })
    }
    
  }

  /**Obtiene el id original del cliente*/
  getIdClient(element: any) { 
    return this.idsClients[element.id]
  }

  /**Filtra los datos de la lista */
  filterData(){

    const filterValue = this.filtro;

    // Aplica filtro a la lista original
    const filteredList = this.clientsCopy.filter(client => {
      return Object.keys(filterValue).every(key => {
        const filterKeyValue = filterValue[key];

        // Verifica si el valor del filtro no es nulo ni indefinido
        if (filterKeyValue !== null && filterKeyValue !== undefined) {
          return String(client[key]).toLowerCase().includes(String(filterKeyValue).toLowerCase());
        }

        // Si el valor del filtro es nulo o indefinido, no aplica filtro para ese campo
        return true;
      });
    });

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

  /**Obtiene la ruta de editar */
  rutaEditar(){
    this.router.navigate(['cliente/editar/{{clientes.id}}'])
  }

}
