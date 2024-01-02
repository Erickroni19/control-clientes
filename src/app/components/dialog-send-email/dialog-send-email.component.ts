import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-send-email',
  templateUrl: './dialog-send-email.component.html',
  styleUrls: ['./dialog-send-email.component.css']
})
export class DialogSendEmailComponent implements OnInit{

  email = new FormControl('', [Validators.required, Validators.pattern(/^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/)]);

  isButtonDisabled: boolean = false;

  constructor(public dialog: MatDialog,
              public dialogRef: MatDialogRef<DialogSendEmailComponent>,
              @Inject(MAT_DIALOG_DATA) public data:any){}

  ngOnInit(){
  }

  validateForm(){
    
    this.email.valid ? this.isButtonDisabled = false : this.isButtonDisabled = true;
    
    return this.isButtonDisabled;
  }

  getErrorMessage(){

    if(this.email.hasError('required')) return 'Campo requerido';
      
    if(this.email.hasError('pattern')) return 'El email no es valido'
    
    return '';
  }

  dialogClose(){
    this.dialogRef.close();
  }

  saveEmail(){
    this.dialogRef.close(this.email.value);
  }

}
