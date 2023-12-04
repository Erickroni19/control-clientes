import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})

export class RegistroComponent implements OnInit{

  registerForm!: FormGroup;

  constructor(private loginService: LoginService,
              private fb: FormBuilder,
              private router: Router){}

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
  
}
