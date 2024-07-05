import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SnackBarService } from 'src/app/core/services/snackBar.service';
import { ErrorType } from 'src/app/core/interfaces/error-type.interface';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/core/services/login.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit{

  hasRegisterError: boolean = false;
  errorMessage = "";
  isHidden = true;

  registerForm!: FormGroup;

  errorTranslations: ErrorType= {
      'Firebase: The email address is already in use by another account. (auth/email-already-in-use).': 'El email ya esta en uso',
  };

  constructor(private loginService: LoginService,
              private fb: FormBuilder,
              private router: Router,
              private snackBarService: SnackBarService){}

  ngOnInit(){

    this.createForm();

    /**Si el usuario esta logeado redirecciona a la ventana de inicio */
    this.loginService.getAuthenticatedUser().subscribe( userLoggedIn => {

      if(userLoggedIn) this.router.navigate(['/'])

    })
  }

  private createForm(){
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(/^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/)]],
      password: ['', [Validators.required,Validators.minLength(10)]]
    });
  }

  getFormData(fieldName: String){
    let fieldInput = '';
    fieldInput = this.registerForm.get(`${fieldName}`)?.value

    return fieldInput
  }

  validateForm(){

    let isButtonDisabled: boolean;

    this.registerForm.valid ? isButtonDisabled = false : isButtonDisabled = true;

    return isButtonDisabled;

  }

  validatePassword(){
    const password = this.getFormData('password');

    if(password.length < 10) return true;

    return false
  }

  sendRegisterData() {
    // Obtener los valores del formulario
    let emailValue = this.getFormData('email');
    let passwordValue = this.getFormData('password');

    this.loginService.registerUser(emailValue, passwordValue)
    .then( resp => {
      if(resp){
        this.snackBarService.snackBarMessages('Registro Exitoso', 'Ok', 'green-snackbar', 'bottom');
        this.router.navigate(['/']);
      }
    })
    .catch(error => {

      if(error){
        this.hasRegisterError = true;
        this.errorMessage = this.errorTranslations[error.message] || 'Error Desconocido';
        setTimeout(() => {
          this.hasRegisterError = false;
        },3000)

      }
    });
  }

  getErrorMessage(fieldInput: string){

    if(this.registerForm.get(`${fieldInput}`)?.hasError('required')) return 'Campo requerido';

    if(fieldInput ==='email' && this.registerForm.get('email')?.hasError('pattern')) return 'El email no es valido';

    if(fieldInput ==='password' && this.validatePassword()) return 'La contraseña debe tener min 10 caracteres';

    return '';
  }

}
