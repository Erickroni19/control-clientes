import { Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Configuracion } from 'src/app/interfaces/configuracion';
import { ErrorType } from 'src/app/interfaces/error-type';
import { ConfiguracionService } from 'src/app/services/configuracion.service';
import { LoginService } from 'src/app/services/login.service';
import { SnackBarService } from 'src/app/services/snackBar.service';
import { DialogSendEmailComponent } from '../dialog-send-email/dialog-send-email.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  loginForm!: FormGroup;
  disableButton: boolean = false;
  hide = true;
  loginError: boolean = false;
  permitirRegistro: boolean = false;
  errorMessage = "";

  
  //Traducción de los errores
  errorTranslations: ErrorType= {
    'Firebase: Error (auth/invalid-login-credentials).': 'Email o contraseña invalido',
  };
 
  constructor(private loginService: LoginService,
              private configuracionService: ConfiguracionService,
              private snackBarService: SnackBarService,
              private fb: FormBuilder,
              private router: Router,
              public dialog: MatDialog) {}

  ngOnInit() {
    this.configuracionService.getConfiguracion().subscribe(       
      (configuracion: Configuracion) => {

        if(configuracion && configuracion.permitirRegistro !== undefined){
          this.permitirRegistro = configuracion.permitirRegistro;
        }

      }
    )
    //Inicia el formulario
    this.crearFormulario();

    /**Si el usuario esta logeado redirecciona a la ventana de inicio */
    this.loginService.getAuth().subscribe( auth => {

      if(auth) this.router.navigate(['/'])
      
    })

  }

  /**Obtiene la información ingresada por el usuario y la envia a back*/
  dataSubmit() {
    // Obtener los valores del formulario
    let emailValue = this.inputField('email');
    let passwordValue = this.inputField('password');
    
    this.loginService.login(emailValue, passwordValue)
    .then( resp => {
      if(resp){
        this.router.navigate(['/']);
      }
    })
    .catch(error => {
      //Mostrar Mensaje De Error
      if(error){
        this.errorMessage = this.errorTranslations[error.message] || 'Error Desconocido';
        this.loginError = true;
        setTimeout(() => {
          this.loginError = false;
        },3500)
      }
    });
   
  }

  /**Captura los datos ingresados por el usuario*/
  inputField(fieldName: String){
    let fieldInput = '';
    fieldInput = this.loginForm.get(`${fieldName}`)?.value

    return fieldInput
  }

  /**Envia mensaje de error de las validaciones */
  getErrorMessage(fieldInput: string){
    this.disableButton = false;
    
    if(this.loginForm.get(`${fieldInput}`)?.hasError('required')){

      this.disableButton = true;
      return 'Campo requerido'
      
    }

    if(fieldInput ==='email' && this.loginForm.get('email')?.hasError('pattern')){
      this.disableButton = true;
      return 'El email no es valido'
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

  /**Validar contraseña */
  customPasswordValidator(control: any) {
    const value = control.value;

    // Requiere al menos un carácter y un número consecutivo
    const regex = /^(?=.*[A-Za-z])(?=.*\d{2,})/;

    return regex.test(value) ? null : { invalidPassword: true };
  }

  /**Validamos Que el formulario no sea invalido */
  validarFormulario(){

    if(this.loginForm.valid) this.disableButton = false;
    else this.disableButton = true;

    return this.disableButton;
    
  }

  private crearFormulario(){
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(/^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/)]],
      password: ['', [Validators.required]]
    });
  }

  // Para navegar a la página de registro
  navigateToRegistro() {
    this.router.navigate(['/registrarse']);
  } 

  /**Abre el dialog de olvifo su contraseña */
  OpenDialogNewPassword(){
    const dialogRef = this.dialog.open(DialogSendEmailComponent,{
      width: '500px',
      height: '200px',
      disableClose: true,
      enterAnimationDuration: '600ms',
      exitAnimationDuration: '500ms',
      data:{
        email: '',
    }});

    dialogRef.afterClosed().subscribe(result => {
      console.log('result:' , result);
      if(result !== undefined){
        this.loginService.sendPasswordResetEmail(result).then(()=>{
          const message = 'Se ha enviado un email, verifica tu bandeja de entrada';
          this.snackBarService.snackBarMessages(message, 'OK', 'green-snackbar', 'top')
        })
      }
    })
  }


}
