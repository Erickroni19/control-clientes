import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-add-client',
  templateUrl: './dialog-add-client.component.html',
  styleUrls: ['./dialog-add-client.component.css']
})
export class DialogAddClientComponent implements OnInit, AfterViewInit{

  addClientForm!: FormGroup;
  isButtonDisabled: boolean = true;
  
  constructor(public dialog: MatDialog,
              private fb: FormBuilder,
              public dialogRef: MatDialogRef<DialogAddClientComponent>,
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

  ngAfterViewInit() {

    setTimeout(() => {
      if(this.data.idEjecucion === 'Editar'){
       this.setInputData(this.data.editData)
      }
    }, 10);
    
  }
  
  setInputData(editData: any){
    if(editData){
      this.addClientForm.setValue({
        nombre: editData.nombre,
        apellido: editData.apellido,
        email: editData.email,
        saldo: editData.saldo
      })
    }
  }

  validateForm(){

    this.addClientForm.valid ? this.isButtonDisabled = false : this.isButtonDisabled = true;

    return this.isButtonDisabled;    
  }

  getErrorMessage(fieldInput: string){
    this.isButtonDisabled = false;
    
    if(this.addClientForm.get(`${fieldInput}`)?.hasError('required')){

      this.isButtonDisabled = true;
      return 'Campo requerido'
      
    }

    if(fieldInput ==='email' && this.addClientForm.get('email')?.hasError('pattern')){
      this.isButtonDisabled = true;
      return 'El email no es valido'
    }
    return '';
  }

  saveClient(){
    
    this.dialogRef.close(this.addClientForm.value); 
  }

  dialogClose(){
    this.dialogRef.close();
  }

}
