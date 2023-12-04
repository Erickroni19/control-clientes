import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Configuracion } from '../interfaces/configuracion';
import { Observable, filter, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracionService {

  configuracionDoc!: AngularFirestoreDocument<Configuracion>;
  configuracion!: Observable<Configuracion>;

  //unico id de la colección
  id = "1";


  constructor(private fireStoreDb: AngularFirestore) { }

  getConfiguracion():Observable<Configuracion>{
    this.configuracionDoc = this.fireStoreDb.doc<Configuracion>(`configuracion/${this.id}`);

    this.configuracion = this.configuracionDoc.valueChanges().pipe(

      // Utilizamos el operador filter para asegurarnos de que configuracion no sea undefined
      // Utilizamos el operador map para convertir Configuracion | undefined a Configuracion
      filter(configuracion => !!configuracion),
      map(configuracion => configuracion as Configuracion)
    );

    return this.configuracion;
  }

  modificarConfiguracion( configuracion: Configuracion){
    this.configuracionDoc = this.fireStoreDb.doc<Configuracion>(`configuracion/${this.id}`);
    this.configuracionDoc.update(configuracion);
  }
}
