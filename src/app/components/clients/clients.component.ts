import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { DialogAddClientComponent } from '../dialog-add-client/dialog-add-client.component';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ClienteServices } from 'src/app/services/clientes.service';
import { SnackBarService } from 'src/app/services/snackBar.service';
import { LoginService } from 'src/app/services/login.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Cliente, Ids } from 'src/app/interfaces/cliente';
import { ErrorType } from 'src/app/interfaces/error-type';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientesComponent implements OnInit, AfterViewInit{
  dataSource: MatTableDataSource<Cliente> = new MatTableDataSource();
  displayedColumns: string[] = ['id','nombre','apellido', 'email', 'saldo', 'editar', 'eliminar'];

  isDialogOpen: boolean = false;
  clientsCopy: Cliente[] = [];
  isLoading: boolean = true;
  clientsLength: number = 0;
  totalBalance: number = 0;
  clients: Cliente[] = [];
  userId: string = "";
  
  clientData: Cliente = {};
  idsClients: Ids = {};
  filtro: Cliente = {};

  errorTranslations: ErrorType= {
    'Missing or insufficient permissions.': '!Solo puedes eliminar o editar los clientes que tu agregas¡',
    'The client is null or undefined': 'El cliente es null o undefined'
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private clientesService: ClienteServices,
              private snackBarService :SnackBarService,
              private loginService: LoginService,
              public dialog: MatDialog,
              ) {
  }

  ngOnInit(){

    this.loginService.getAuth().subscribe( userLoggedIn => {
      this.userId = userLoggedIn?.uid || '';
    })
    
  }

  ngAfterViewInit() {
   
    this.clientesService.getClientes().subscribe(clientesDb => {
          
          this.clients = clientesDb;

          this.clientsCopy = JSON.parse(JSON.stringify(clientesDb));

          this.assignNewId(this.clientsCopy);
          
          this.dataSource = new MatTableDataSource(this.clientsCopy);

          if(this.dataSource.data && this.paginator){

            this.clientsLength = this.dataSource.data.length;
            this.dataSource.paginator = this.paginator;

            this.isLoading = false;
          }
        
          this.totalBalance = this.getTotalBalance(this.clients);
    })
  }

  openAddAndEditDialog(idEjecucion: string, client: string){
    
    if(this.isDialogOpen) return;

    if(idEjecucion === 'Editar') this.getClient(client);
    
    setTimeout(() => {      
      const dialogRef = this.dialog.open(DialogAddClientComponent,{
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

        if(result && idEjecucion === 'Agregar') this.addClient(result);
        
        if(result && idEjecucion === 'Editar' && this.clientData.id) this.editClient(result, this.clientData.id);

        this.isDialogOpen = false; 
      });  
    }, 20);
  }

  openConfirmDialog(client: string){
    
    if(this.isDialogOpen) return;

    const dialogRef = this.dialog.open(ConfirmationDialogComponent,{
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

      this.getClient(client);

      setTimeout(() => { 
        if(result === 'Si') this.deleteClient(this.clientData);  

      },50)
  
      this.isDialogOpen = false;          
    })
  }

  deleteClient(clientData: Cliente){
    
    this.clientesService.eliminarCliente(clientData).then(() =>{
      this.snackBarService.snackBarMessages('Cliente Eliminado Exitosamente', 'Ok', 'green-snackbar', 'bottom');

    },(error: Error) => {

      if(error){
        const errorMessage = this.errorTranslations[error.message] || 'Error Desconocido';
        this.snackBarService.snackBarMessages(errorMessage, 'Ok', 'red-snackbar', 'bottom');
      }
    })
  }

  getClient(client: string){

    const idOriginal = this.getIdClient(client);

    if(idOriginal !== undefined){
      this.clientesService.getCliente(idOriginal).subscribe( cliente => {

        if(cliente !== null) this.clientData = cliente;
            
      })
    }
  }

  getIdClient(client: any) { 
    return this.idsClients[client.id]
  }

  addClient(client: Cliente){
    client.uid = this.userId;
  
          this.clientesService.agregarCliente(client)
          .then((clienteId) => {

            if(clienteId) this.snackBarService.snackBarMessages('Cliente Agregado Exitosamente', 'Ok', 'green-snackbar','bottom');

          });
  }

  editClient(client: Cliente, id: string){
    this.clientesService.modificarCliente(client, id).then(() => {
      this.snackBarService.snackBarMessages('Cliente Editado Exitosamente', 'Ok', 'green-snackbar', 'bottom');
    }, (error) => {
      if(error){
        const errorMessage = this.errorTranslations[error.message] || 'Error Desconocido';
        this.snackBarService.snackBarMessages(errorMessage, 'Ok', 'red-snackbar', 'bottom');
      }
    })
  }

  filterClients(){

    const filterValue = this.filtro;

    const filteredList = this.clientsCopy.filter(client => {
      return Object.keys(filterValue).every(key => {
        const filterKeyValue = filterValue[key];

        if (filterKeyValue !== null && filterKeyValue !== undefined) {
          return String(client[key]).toLowerCase().includes(String(filterKeyValue).toLowerCase());
        }

        return true;
      });
    });

    this.dataSource.data = filteredList;
  }

  getTotalBalance(clientes: Cliente[]){
    
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

  assignNewId(cliente: Cliente[]){
    let newId: number = 0;

    cliente.forEach( cliente => {
      let oldId = cliente.id;

      cliente.id = `${++newId}`;
      
      this.idsClients[cliente.id] = oldId;  
    })
  }
}
