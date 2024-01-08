import { Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Configuration } from 'src/app/interfaces/configuration';
import { ErrorType } from 'src/app/interfaces/error-type';
import { ConfiguracionService } from 'src/app/services/configuration.service';
import { LoginService } from 'src/app/services/login.service';
import { SnackBarService } from 'src/app/services/snackBar.service';
import { DialogSendEmailComponent } from '../dialog-send-email/dialog-send-email.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  isButtonDisabled: boolean = false;
  hasLoginError: boolean = false;
  canRegister: boolean = false;
  errorMessage: string = "";
  isHidden: boolean = true;

  loginForm!: FormGroup;
  
  errorTranslations: ErrorType= {
    'Firebase: Error (auth/invalid-login-credentials).': 'Email o contraseña invalido',
  };
 
  constructor(private configurationService: ConfiguracionService,
              private snackBarService: SnackBarService,
              private loginService: LoginService,
              public dialog: MatDialog,
              private formBuilder: FormBuilder,
              private router: Router
              ) {}

  ngOnInit() {

    this.configurationService.getConfiguracion().subscribe(       
      (configuration: Configuration) => {

        if(configuration.canRegister) this.canRegister = configuration.canRegister;

      }
    )

    this.createForm();

    this.loginService.getAuth().subscribe( userLoggedIn => {
      
      if(userLoggedIn) this.router.navigate(['/']);
      
    })

  }

  sendLoginData() {

    let emailValue = this.getFormData('email');
    let passwordValue = this.getFormData('password');
    
    this.loginService.login(emailValue, passwordValue)
    .then( userLoggedIn => {

      if(userLoggedIn) this.router.navigate(['/']);
      
    })
    .catch(error => {
    
      if(error) {
        this.errorMessage = this.errorTranslations[error.message] || 'Error Desconocido';

        this.hasLoginError = true;

        setTimeout(() => {

          this.hasLoginError = false;

        },3500)
      }
    });
   
  }

  getFormData(fieldName: String){
    let fieldInput = '';
    fieldInput = this.loginForm.get(`${fieldName}`)?.value

    return fieldInput
  }

  getErrorMessage(fieldInput: string){
    this.isButtonDisabled = false;
    
    if(this.loginForm.get(`${fieldInput}`)?.hasError('required')){

      this.isButtonDisabled = true;
      return 'Campo requerido'
      
    }

    if(fieldInput ==='email' && this.loginForm.get('email')?.hasError('pattern')){

      this.isButtonDisabled = true;
      return 'El email no es valido'
    }
    
    return '';
  }

  validatePassword(){
    const password = this.getFormData('password');

    if(password.length < 10) return true;

    return false
  }

  validateForm(){

    this.loginForm.valid ? this.isButtonDisabled = false : this.isButtonDisabled = true;
   
    return this.isButtonDisabled;
    
  }

  private createForm(){
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(/^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/)]],
      password: ['', [Validators.required]]
    });
  }

  navigateToRegistro() {
    this.router.navigate(['/registrarse']);
  } 

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
