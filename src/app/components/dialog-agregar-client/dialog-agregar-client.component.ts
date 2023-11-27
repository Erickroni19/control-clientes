import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Cliente } from 'src/app/interfaces/cliente';

@Component({
  selector: 'app-dialog-agregar-client',
  templateUrl: './dialog-agregar-client.component.html',
  styleUrls: ['./dialog-agregar-client.component.css']
})
export class DialogAgregarClientComponent implements OnInit{

  addClientForm!: FormGroup;
  disableButton: boolean = true;
  
  constructor(public dialog: MatDialog,
              private fb: FormBuilder,
              public dialogRef: MatDialogRef<DialogAgregarClientComponent>,
              @Inject(MAT_DIALOG_DATA) public data:any){
  }

  ngOnInit(){
    //FormGroup
    this.addClientForm = this.fb.group({
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern(/^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/)]],
      saldo: ['', Validators.required]
    })
  }

  /**Cierra el dialog */
  dialogClose(){
    this.dialogRef.close('Dialog Cerrado')
  }

  /**Guardar data cliente */
  saveData(){
    console.log(this.addClientForm.value);   
  }

  /**Captura los datos ingresados por el usuario*/
  inputField(fieldName: String){
    let fieldInput = '';
    fieldInput = this.addClientForm.get(`${fieldName}`)?.value
    console.log(fieldInput);

    return fieldInput
  }

   /**Validamos Que el formulario no sea invalido */
   validarFormulario(){

    if(this.addClientForm.valid) this.disableButton = false;
    else this.disableButton = true;

    return this.disableButton;
    
  }

}
