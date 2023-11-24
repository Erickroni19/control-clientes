import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-agregar-client',
  templateUrl: './dialog-agregar-client.component.html',
  styleUrls: ['./dialog-agregar-client.component.css']
})
export class DialogAgregarClientComponent implements OnInit{


constructor(public dialog: MatDialog){

}

ngOnInit(){

}

/**Abre el dialog */
openDialog(){

  const dialogRef = this.dialog.open(DialogAgregarClientComponent,{
    width: '250px',
    height: '400px',
    // data:{}
  });

  dialogRef.afterClosed().subscribe(result => {
    console.log('Dialogo cerrado', result);
  })

}

}
