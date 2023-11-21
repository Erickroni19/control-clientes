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
  validarEmail: boolean = false;

  constructor(private clientesService: ClienteServices,
    private loginService: LoginService,
    private fb: FormBuilder,
    private router: Router) {
}
  ngOnInit() {
    this.loginForm = this.fb.group({
      email: [['', Validators.required, Validators.email]],
      password: [['', Validators.required, Validators.minLength(10)]]
    });

    /**Si el usuario esta logeado redirecciona a la ventana de inicio */
    this.loginService.getAuth().subscribe( auth => {

      if(auth) this.router.navigate(['/'])

    })
  }

   /**Obtiene valores ingresados por el usuario */
  //  login(){
    
  //   console.log(
  //     this.loginForm.get('email')?.value
  //   );
    
  //  }

   onSubmit() {
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
    if(this.loginForm.get(`${fieldInput}`)?.hasError('required')){
      this.validarEmail = true;
      
      return 'Campo requerido'
      
    }
      return this.loginForm.get('email')?.hasError('email') ? 'El email no es valido' : '';
      
  }

  /**Valida que el formulario este correctamente gestionado
   * antes de enviarlo
   */
  validateForm(fieldName: string){
    if(!this.loginForm.get(`${fieldName}`)?.hasError('required')){
      this.validarEmail = false;
    } 
    return this.validarEmail
  }


}
