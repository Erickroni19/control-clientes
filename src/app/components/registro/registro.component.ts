import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorType } from 'src/app/interfaces/error-type';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})

export class RegistroComponent implements OnInit{

  registerForm!: FormGroup;
  disableButton: boolean = false;
  registerError: boolean = false;
  errorMessage = "";

  //Traducción de los errores
  errorTranslations: ErrorType= {
      'Firebase: The email address is already in use by another account. (auth/email-already-in-use).': 'El email ya esta en uso',
  };
  
  constructor(private loginService: LoginService,
              private fb: FormBuilder,
              private router: Router,
              private snackBar: MatSnackBar){}

  ngOnInit(){
    //Creamos el formulario
    this.crearFormulario();

    /**Si el usuario esta logeado redirecciona a la ventana de inicio */
    this.loginService.getAuth().subscribe( auth => {

      if(auth) this.router.navigate(['/'])

    })
  }

  /**Inicia el formGroup */
  private crearFormulario(){
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(/^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/)]],
      password: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  /**Obtiene la información ingresada por el usuario y la envia a back*/
  dataSubmit() {
    // Obtener los valores del formulario
    let emailValue = this.inputField('email');
    let passwordValue = this.inputField('password');
    
    this.loginService.register(emailValue, passwordValue)
    .then( resp => {
      if(resp){
        this.snackBarMessages('Registro Exitoso', 'Ok', 'green-snackbar');
        this.router.navigate(['/']);
      }
    })
    .catch(error => {

      if(error){
        this.registerError = true;
        this.errorMessage = this.errorTranslations[error.message] || 'Error Desconocido';
        setTimeout(() => {
          this.registerError = false;
        },3500)

      } 
    });
  }

  /**Captura los datos ingresados por el usuario*/
  inputField(fieldName: String){
    let fieldInput = '';
    fieldInput = this.registerForm.get(`${fieldName}`)?.value
    console.log(fieldInput);
  
    return fieldInput
  }

  /**Envia mensaje de error de las validaciones */
  getErrorMessage(fieldInput: string){
    // console.log(this.disableButton);
    this.disableButton = false;
    
    if(this.registerForm.get(`${fieldInput}`)?.hasError('required')){

      this.disableButton = true;
      return 'Campo requerido'
      
    }

    if(fieldInput ==='email' && this.registerForm.get('email')?.hasError('pattern')){
      this.disableButton = true;
      return 'El email no es valido'
    }

    if(fieldInput ==='password' && this.validarPassword()){
      this.disableButton = true;
      return 'La contraseña debe tener min 10 caracteres'
    }

    return '';
  }

  /**Validar contraseña */
  validarPassword(){
    const password = this.inputField('password');
  
    if(password.length < 10){
       return true;
    }
  
    return false
  }

  /**Validamos Que el formulario no sea invalido */
  validarFormulario(){

    if(this.registerForm.valid) this.disableButton = false;
    else this.disableButton = true;

    return this.disableButton;
    
  }

  /**Snacbar: para mostrar mensajes de error ó estados de notificaciones */
  snackBarMessages(mensaje: string, accion: string, panelClass: string){
    this.snackBar.open(mensaje, accion, {
      duration: 5000, // Duración en milisegundos
      verticalPosition: 'bottom', // Posición vertical
      horizontalPosition: 'center', // Posición horizontal
      panelClass: [panelClass], // Clase de estilo personalizada
    });
  }
  
}
