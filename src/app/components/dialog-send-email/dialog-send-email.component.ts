import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-send-email',
  templateUrl: './dialog-send-email.component.html',
  styleUrls: ['./dialog-send-email.component.css']
})
export class DialogSendEmailComponent implements OnInit{

  email = new FormControl('', [Validators.required, Validators.pattern(/^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/)]);

  disableButton: boolean = false;

  constructor(public dialog: MatDialog,
              private fb: FormBuilder,
              public dialogRef: MatDialogRef<DialogSendEmailComponent>,
              @Inject(MAT_DIALOG_DATA) public data:any){}

  ngOnInit(){
      console.log(this.email.invalid);
      
  }

  /**Cierra el dialog */
  dialogClose(){
    this.dialogRef.close(this.email.value);
  }

  /**Envia mensaje de error de las validaciones */
  getErrorMessage(fieldInput: string){
    if(this.email.hasError('required')){

      return 'Campo requerido'
      
    }else if(this.email.hasError('pattern')){
      return 'El email no es valido'
    }
    
    return '';
  }

  /**Captura los datos ingresados por el usuario*/
  inputField(fieldName: String){
    let fieldInput = '';
    fieldInput = this.email.get(`${fieldName}`)?.value

    return fieldInput
  }

   /**Validamos Que el formulario no sea invalido */
   validarFormulario(){
    console.log(this.disableButton);
    
    if(this.email.valid) this.disableButton = false;
    else this.disableButton = true;

    return this.disableButton;
    
  }
}
