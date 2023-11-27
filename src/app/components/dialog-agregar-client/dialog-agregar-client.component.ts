import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

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
      apellido: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern(/^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/)]],
      saldo: ['', Validators.required]
    })
  }

  /**Cierra el dialog */
  dialogClose(){
    this.dialogRef.close();
  }

  /**Guardar data cliente */
  saveData(){
    /**Se pasa la información para abrirlo con el afterClose */
    this.dialogRef.close(this.addClientForm.value); 
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

  /**Envia mensaje de error de las validaciones */
  getErrorMessage(fieldInput: string){
    this.disableButton = false;
    
    if(this.addClientForm.get(`${fieldInput}`)?.hasError('required')){

      this.disableButton = true;
      return 'Campo requerido'
      
    }

    if(fieldInput ==='email' && this.addClientForm.get('email')?.hasError('pattern')){
      this.disableButton = true;
      return 'El email no es valido'
    }
    return '';
  }

}
