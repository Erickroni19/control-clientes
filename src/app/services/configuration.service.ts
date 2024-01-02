import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Configuration } from '../interfaces/configuration';
import { Observable, filter, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracionService {

  configuracionDoc!: AngularFirestoreDocument<Configuration>;
  configuracion!: Observable<Configuration>;

  //unico id de la colección
  id = "1";


  constructor(private fireStoreDb: AngularFirestore) { }

  getConfiguracion():Observable<Configuration>{
    this.configuracionDoc = this.fireStoreDb.doc<Configuration>(`configuracion/${this.id}`);

    this.configuracion = this.configuracionDoc.valueChanges().pipe(

      // Utilizamos el operador filter para asegurarnos de que configuracion no sea undefined
      // Utilizamos el operador map para convertir Configuracion | undefined a Configuracion
      filter(configuracion => !!configuracion),
      map(configuracion => configuracion as Configuration)
    );

    return this.configuracion;
  }

  modificarConfiguracion( configuracion: Configuration){
    this.configuracionDoc = this.fireStoreDb.doc<Configuration>(`configuracion/${this.id}`);
    this.configuracionDoc.update(configuracion);
  }
}
