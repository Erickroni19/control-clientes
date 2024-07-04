import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {

  constructor(private snackBar: MatSnackBar) { }

  snackBarMessages(mensaje: string, accion: string, panelClass: string, position: MatSnackBarVerticalPosition){
    this.snackBar.open(mensaje, accion, {
      duration: 3000,
      verticalPosition: position,
      horizontalPosition: 'center',
      panelClass: [panelClass],
    });
  }
}
