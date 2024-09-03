import { Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { Configuration, ErrorType } from 'src/app/core/interfaces';
import { ConfigurationService, SnackBarService } from 'src/app/core/services';
import { DialogSendEmailComponent } from 'src/app/auth/components/dialog-send-email/dialog-send-email.component';
import { LoginService } from 'src/app/core/services/login.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  hasLoginError: boolean = false;
  canRegister: boolean = false;
  errorMessage: string = "";
  isHidden: boolean = true;

  loginForm!: FormGroup;

  errorTranslations: ErrorType= {
    'Firebase: Error (auth/invalid-login-credentials).': 'Email o contraseña invalido',
  };

  constructor(private configurationService: ConfigurationService,
              private snackBarService: SnackBarService,
              private loginService: LoginService,
              private formBuilder: FormBuilder,
              private router: Router,

              public dialog: MatDialog,
            ) {}

  ngOnInit() {

    this.configurationService.getConfiguration().subscribe(
      (configuration: Configuration) => {

        if(configuration.canRegister) this.canRegister = configuration.canRegister;

      }
    )

    this.createForm();

    this.loginService.getAuthenticatedUser().subscribe( userLoggedIn => {

      if(userLoggedIn) this.router.navigate(['/']);

    })

  }

  sendLoginData() {

    const { email, password } = this.loginForm.value;

    this.loginService.validateLoginCredentials(email, password)
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

  private createForm(){
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(/^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/)]],
      password: ['', [Validators.required]]
    });
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

        this.loginService.changePassword(result).then(()=>{

          const message = 'Se ha enviado un email, verifica tu bandeja de entrada';
          this.snackBarService.snackBarMessages(message, 'OK', 'green-snackbar', 'top')

        })
      }
    })
  }

}
