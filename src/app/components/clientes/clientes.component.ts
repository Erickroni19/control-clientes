import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Cliente } from 'src/app/interfaces/cliente';
import { ClienteServices } from 'src/app/services/clientes.service';
import { DialogAgregarClientComponent } from '../dialog-agregar-client/dialog-agregar-client.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { LoginService } from 'src/app/services/login.service';
import { ErrorType } from 'src/app/interfaces/error-type';
import { SnackBarService } from 'src/app/services/snackBar.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit, AfterViewInit{
  dataSource: MatTableDataSource<Cliente> = new MatTableDataSource();
  displayedColumns: string[] = ['id','nombre','apellido', 'email', 'saldo', 'editar', 'eliminar'];

  //Variables
  confirmDialogOpen: boolean = false;
  spinnerCheck: boolean = true;
  clientesCopy: Cliente[] = [];
  dialogOpen: boolean = false;
  saldoTotalVar: number = 0;
  clientes: Cliente[] = [];
  idObject: any = {};
  clientesLength = 0;
  uid: string = '';
  editData!: any;

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
      this.uid = auth?.uid || '';
    })
    
  }

  ngAfterViewInit() {
   
    //Obtenemos la información de los clientes
    this.clientesService.getClientes().subscribe(clientesDb => {
          
          this.clientes = clientesDb;

          //Copia el array
          this.clientesCopy = JSON.parse(JSON.stringify(clientesDb));
          let newId = 0;

          /*Se asigna un nuevo id y se crea objeto
          * para almacenar el id original como valor clave
          * del obejeto donde se guardaran ambos id*/
          this.clientesCopy.forEach( cliente => {
            let oldId = cliente.id;

            cliente.id = `${++newId}`;
            
            this.idObject[cliente.id] = oldId;
          })
          
          //Asignamos la data al datasource
          this.dataSource = new MatTableDataSource(this.clientesCopy);

          if(this.dataSource.data && this.paginator){

            this.clientesLength = this.dataSource.data.length;
            this.dataSource.paginator = this.paginator;

            this.spinnerCheck = false;
          }
          
          //Saldo total
          this.saldoTotalVar = this.saldoTotal(this.clientes);
    })
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
  
          this.clientesService.agregarCliente(result)
          .then((clienteId) => {
            if(clienteId){
              this.snackBarService.snackBarMessages('Cliente Agregado Exitosamente', 'Ok', 'green-snackbar','bottom');
            }
          });
  
        }else if(result && idEjecucion === 'Editar'){
        
          this.clientesService.modificarCliente(result, this.editData.id).then(() => {
              this.snackBarService.snackBarMessages('Cliente Editado Exitosamente', 'Ok', 'green-snackbar', 'bottom');
          }, (error) => {
            if(error){
              const errorMessage = this.errorTranslations[error.message] || 'Error Desconocido';
              this.snackBarService.snackBarMessages(errorMessage, 'Ok', 'red-snackbar', 'bottom');
            }
          })
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
      if(result === 'Si'){
        this.clientesService.eliminarCliente(this.editData).then(() =>{
          this.snackBarService.snackBarMessages('Cliente Eliminado Exitosamente', 'Ok', 'red-snackbar', 'bottom');
        },(error: any) => {
          if(error){
            const errorMessage = this.errorTranslations[error.message] || 'Error Desconocido';
            this.snackBarService.snackBarMessages(errorMessage, 'Ok', 'red-snackbar', 'bottom');
          }
        })
      }          
    })

  }

  /**Obtiene la información del cliente */
  getOrDeleteDataClient(element: any, idEjecucion: string){
    
    this.confirmDialogOpen = false;
    
    const idOriginal = this.getIdClient(element);
    
    this.clientesService.getCliente(idOriginal).subscribe( cliente => {
      this.editData = cliente;
      
      /**Elimina la informacion del cliente */
      if(idEjecucion === 'delete'){
        this.openDialogConfirm();
      }
      idEjecucion = ''
    })
  }

  /**Obtiene el id original del cliente*/
  getIdClient(element: any) { 
    return this.idObject[element.id]
  }

  /**Filtra los datos de la lista */
  filterData(){

    const filterValue = this.filtro;

    // Aplica filtro a la lista original
    const filteredList = this.clientesCopy.filter(client => {
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
