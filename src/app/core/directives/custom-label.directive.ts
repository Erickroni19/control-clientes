import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { error } from 'jquery';
import { ErrorType } from '../interfaces';

@Directive({
  selector: '[CustomLabel]',
  standalone: true
})
export class CustomLabelDirective implements OnInit{

  private htmlElement?: ElementRef<HTMLElement>;
  private _color: string = 'red';
  private _errors?: ValidationErrors | null;
  private _firebaseErrors?: string;

  @Input() set color( value: string ) {
    this._color = value;
    this.setStyle();
  };

  @Input() set formErrors( value: ValidationErrors | null | undefined) {
    this._errors = value;
    this.setFormErrorMessage();
  }

  @Input() set firebaseErrors( value: string | undefined ) {
    this._firebaseErrors = value;
    this.setFirebaseErrorMessage();
  }

  constructor( private elementRef: ElementRef<HTMLElement> ) {
    this.htmlElement = elementRef;
  }

  ngOnInit(): void {
    this.setStyle();
  }

  setStyle(): void {
    if(!this.htmlElement) return;
    this.htmlElement.nativeElement.style.color = this._color;
  }

  setFirebaseErrorMessage(): void {
    if(!this.htmlElement) return;

    const firebaseErrorMessages: ErrorType = {
      'auth/invalid-login-credentials': 'Email o contraseña invalido',
      'auth/too-many-requests': 'Cuenta deshabilitada por intentos fallidos; restaura inmediatamente restableciendo la contraseña.',
      'auth/email-already-in-use': 'La dirección de correo electrónico ya está en uso por otra cuenta.',
    };

    const errorMessage = this._firebaseErrors ? firebaseErrorMessages[this._firebaseErrors] || 'Ha ocurrido un error' : '';
    this.htmlElement.nativeElement.innerText = errorMessage;

  }

  setFormErrorMessage(): void {
    if(!this.htmlElement) return;

    const formErrorMessages: ErrorType = {
      'required': 'Este campo es requerido',
      'minlength': `La contraseña debe tener mín ${this._errors?.['minlength']?.['requiredLength']} caracteres`,
      'pattern': 'Correo electrónico inválido',
      'notEqual': 'Las contraseñas no coinciden',
    };

    const firstErrorKey = this._errors ? Object.keys(this._errors)[0] : null;
    const errorMessage = firstErrorKey && formErrorMessages[firstErrorKey] ? formErrorMessages[firstErrorKey] : '';

    this.htmlElement.nativeElement.innerText = errorMessage;

  }

}
