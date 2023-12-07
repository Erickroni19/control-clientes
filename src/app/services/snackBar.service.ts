import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {

  constructor(private snackBar: MatSnackBar) { }

  /**Snackbar: para mostrar mensajes de error ó estados de notificaciones */
  snackBarMessages(mensaje: string, accion: string, panelClass: string){
    this.snackBar.open(mensaje, accion, {
      duration: 3000, // Duración en milisegundos
      verticalPosition: 'bottom', // Posición vertical
      horizontalPosition: 'center', // Posición horizontal
      panelClass: [panelClass], // Clase de estilo personalizada
    });
  }
}
