import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ClienteServices } from 'src/app/services/clientes.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  loginForm!: FormGroup;
  disableButton: boolean = false;
  hide = true;

  constructor(private clientesService: ClienteServices,
    private loginService: LoginService,
    private fb: FormBuilder,
    private router: Router) {
}
  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(/^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/)]],
      password: ['', [Validators.required, Validators.minLength(10)]]
    });

    /**Si el usuario esta logeado redirecciona a la ventana de inicio */
    this.loginService.getAuth().subscribe( auth => {

      if(auth) this.router.navigate(['/'])

    })
  }

  /**Obtiene la información ingresada por el usuario y la envia a back*/
  dataSubmit() {
    // Obtener los valores del formulario
    const emailValue = this.inputField('email');
    const passwordValue = this.inputField('password');

    console.log(`Email: ${emailValue}, Contraseña: ${passwordValue}`);
    this.loginService.login(emailValue, passwordValue)
    .then( resp =>{
      this.router.navigate(['/']);
    })
    .catch(error => {
      console.log(error);
    });
  }

  /**Captura los datos ingresados por el usuario*/
  inputField(fieldName: String){
    let fieldInput = '';
    fieldInput = this.loginForm.get(`${fieldName}`)?.value
    console.log(fieldInput);

    return fieldInput
  }

  /**Envia mensaje de error de las validaciones */
  getErrorMessage(fieldInput: string){
    // console.log(this.disableButton);
    this.disableButton = false;
    
    if(this.loginForm.get(`${fieldInput}`)?.hasError('required')){

      this.disableButton = true;
      return 'Campo requerido'
      
    }

    if(fieldInput ==='email' && this.loginForm.get('email')?.hasError('pattern')){
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

    if(this.loginForm.valid) this.disableButton = false;
    else this.disableButton = true;

    return this.disableButton;
    
  }


}
