import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Configuration } from '../interfaces/configuration.interface';
import { Observable, filter, map } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  configurationDocument!: AngularFirestoreDocument<Configuration>;
  configuration!: Observable<Configuration>;

  //unique id of collection
  id = "1";


  constructor(private fireStoreDb: AngularFirestore) { }

  getConfiguration():Observable<Configuration>{
    this.configurationDocument = this.fireStoreDb.doc<Configuration>(`configuracion/${this.id}`);

    this.configuration = this.configurationDocument.valueChanges().pipe(

      // Utilizamos el operador filter para asegurarnos de que configuracion no sea undefined
      // Utilizamos el operador map para convertir Configuracion | undefined a Configuracion
      filter(configuration => !!configuration),
      map(configuracion => configuracion as Configuration)
    );

    return this.configuration;
  }

  editConfiguration( configuration: Configuration){
    this.configurationDocument = this.fireStoreDb.doc<Configuration>(`configuracion/${this.id}`);
    this.configurationDocument.update(configuration);
  }
}
