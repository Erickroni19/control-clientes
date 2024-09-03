import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

@Directive({
  selector: '[CustomLabel]',
  standalone: true
})
export class CustomLabelDirective implements OnInit{

  private htmlElement?: ElementRef<HTMLElement>;
  private _color: string = 'red';
  private _errors?: ValidationErrors | null;

  @Input() set color( value: string ) {
    this._color = value;
    this.setStyle();
  };

  @Input({ required: true }) set errors( value: ValidationErrors | null | undefined) {
    this._errors = value;
    this.setErrorMessage();
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

  setErrorMessage(): void {
    if(!this.htmlElement) return;
    if(!this._errors) {
      this.htmlElement.nativeElement.innerText = '';
      return;
    }

    const errors = Object.keys(this._errors);
    console.log(errors);


    if (errors.includes('required')) {
      this.htmlElement.nativeElement.innerText = 'Este campo es requerido';
      return;
    };

    if (errors.includes('minlength')) {
      const min = this._errors['minlength']['requiredLength'];
      this.htmlElement.nativeElement.innerText = `La contraseña debe tener mín ${min} caracteres`;
      return;
    };

    if (errors.includes('pattern')) {
      this.htmlElement.nativeElement.innerText = 'Correo electrónico inválido';
      return;
    };

    if (errors.includes('notEqual')) {
      this.htmlElement.nativeElement.innerText = 'Las contraseñas no coinciden';
      return;
    };
  }

}
