import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { DialogAddClientComponent } from '../dialog-add-client/dialog-add-client.component';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ClientsServices } from 'src/app/services/clients.service';
import { SnackBarService } from 'src/app/services/snackBar.service';
import { LoginService } from 'src/app/services/login.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Client, Ids } from 'src/app/interfaces/client';
import { ErrorType } from 'src/app/interfaces/error-type';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent implements OnInit, AfterViewInit{
  dataSource: MatTableDataSource<Client> = new MatTableDataSource();
  displayedColumns: string[] = ['id','nombre','apellido', 'email', 'saldo', 'editar', 'eliminar'];

  isDialogOpen: boolean = false;
  clientsCopy: Client[] = [];
  isLoading: boolean = true;
  clientsLength: number = 0;
  totalBalance: number = 0;
  clients: Client[] = [];
  userId: string = "";
  
  clientData: Client = {};
  idsClients: Ids = {};
  filtro: Client = {};

  errorTranslations: ErrorType= {
    'Missing or insufficient permissions.': '!Solo puedes eliminar o editar los clientes que tu agregas¡',
    'The client is null or undefined': 'El cliente es null o undefined'
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private clientsService: ClientsServices,
              private snackBarService :SnackBarService,
              private loginService: LoginService,
              public dialog: MatDialog,
              ) {
  }

  ngOnInit(){

    this.loginService.getAuthenticatedUser().subscribe( userLoggedIn => {
      this.userId = userLoggedIn?.uid || '';
    })
    
  }

  ngAfterViewInit() {
   
    this.clientsService.getClients().subscribe(clientsDb => {
          
          this.clients = clientsDb;

          this.clientsCopy = JSON.parse(JSON.stringify(clientsDb));

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

  openAddAndEditDialog(idExecution: string, client: string){
    
    if(this.isDialogOpen) return;

    if(idExecution === 'Editar') this.getClient(client);
    
    setTimeout(() => {      
      const dialogRef = this.dialog.open(DialogAddClientComponent,{
        width: '600px',
        height: '265px',
        disableClose: true,
        enterAnimationDuration: '600ms',
        exitAnimationDuration: '500ms',
        data:{
          editData: this.clientData || '',
          idEjecucion: idExecution,
          uid: this.userId
        }
      });
      
      this.isDialogOpen = true
  
      dialogRef.afterClosed().subscribe(result => {

        if(result && idExecution === 'Agregar') this.addClient(result);
        
        if(result && idExecution === 'Editar' && this.clientData.id) this.editClient(result, this.clientData.id);

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

  deleteClient(clientData: Client){
    
    this.clientsService.deleteClient(clientData).then(() =>{
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
      this.clientsService.getClientById(idOriginal).subscribe( client => {

        if(client !== null) this.clientData = client;
            
      })
    }
  }

  getIdClient(client: any) { 
    return this.idsClients[client.id]
  }

  addClient(client: Client){
    client.uid = this.userId;
  
          this.clientsService.addClient(client)
          .then((clientId) => {

            if(clientId) this.snackBarService.snackBarMessages('Cliente Agregado Exitosamente', 'Ok', 'green-snackbar','bottom');

          });
  }

  editClient(client: Client, id: string){
    this.clientsService.editClient(client, id).then(() => {
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

  getTotalBalance(clients: Client[]){
    
    let saldoTotal: number = 0;
    
    clients.forEach( client => {
      if(client && client.saldo !== undefined){
        saldoTotal += client.saldo;
      }else {
        return;
      }
    })
    return saldoTotal;
  }

  assignNewId(client: Client[]){
    let newId: number = 0;

    client.forEach( client => {
      let oldId = client.id;

      client.id = `${++newId}`;
      
      this.idsClients[client.id] = oldId;  
    })
  }
}
