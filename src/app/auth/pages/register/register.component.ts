import { Component, OnInit } from '@angular/core';
import { ErrorType } from 'src/app/core/interfaces';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { AuthService, SnackBarService } from 'src/app/core/services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit{

  public hasRegisterError: boolean = false;
  public errorMessage = "";
  public isHidden = true;

  public registerForm!: FormGroup;

  constructor(private authService: AuthService,
              private fb: FormBuilder,
              private router: Router,
              private snackBarService: SnackBarService){}

  ngOnInit(){

    this.createForm();

    this.authService.getAuthenticatedUser().subscribe( userLoggedIn => {

      if(userLoggedIn) this.router.navigate(['/'])

    })
  }

  private createForm(){
    this.registerForm = this.fb.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern(/^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/)]],
      password: ['', [Validators.required, Validators.minLength(10)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(10)]]
    }, {
      validators: [ this.isFieldOneEqualFieldTwo('password', 'confirmPassword') ]
    });
  }

  sendRegisterData() {

    this.authService.registerUser(this.registerForm.value)
      .then( resp => {
        if(resp){
          this.snackBarService.snackBarMessages('Registro Exitoso', 'Ok', 'green-snackbar', 'bottom');
          this.router.navigate(['/']);
        }
      })
      .catch(error => {

        if(error){
          this.hasRegisterError = true;
          this.errorMessage = error;
          setTimeout(() => {
            this.hasRegisterError = false;
          },4000)

        }
      });

  }

  isFieldOneEqualFieldTwo( formControlName1: string, formControlName2: string ) {

    return ( formGroup: AbstractControl ): ValidationErrors | null => {

      const fieldValue1 = formGroup.get(formControlName1)?.value;
      const fieldValue2 = formGroup.get(formControlName2)?.value;

      if ( fieldValue1 !== fieldValue2 ) {
        formGroup.get(formControlName2)?.setErrors({ notEqual: true });
        return { notEqual: true }
      }

      formGroup.get(formControlName2)?.setErrors(null);
      return null;
    }
  }

}
