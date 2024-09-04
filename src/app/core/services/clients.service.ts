import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from '@angular/fire/compat/firestore';
import { Client } from '../interfaces/client.interface';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { User } from 'src/app/core/interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class ClientsServices {

  //TODO: Revisar que es private y que es public
  public clientsCollection: AngularFirestoreCollection<Client>;
  public clientDocument!: AngularFirestoreDocument<Client | null>;
  public clients!: Observable<Client[]>;
  public client!: Observable<Client | null>;

  constructor(private firebaseDb: AngularFirestore) {
    this.clientsCollection = firebaseDb.collection('clientes', ref => ref.orderBy('nombre', 'asc'))
  }

  getClients(): Observable<Client[]>{
      this.clients = this.clientsCollection.snapshotChanges().pipe(
        map( changes => {
          return changes.map( action => {
            const data = action.payload.doc.data() as Client;
            data.id = action.payload.doc.id;
            return data
          })
        })
      )
      return this.clients
  }

  addClient(client: Client): Promise<string>{
    return this.clientsCollection.add(client)
      .then((docRef) => {
        console.log('Cliente agregado con Id: ', docRef.id);
        return docRef.id;
      })
      .catch((error) => {
        console.error('Error al agregar cliente:', error);
        throw error;
      })
  }

  getClientById(id:string){
    this.clientDocument = this.firebaseDb.doc<Client | null>(`clientes/${id}`);

    this.client = this.clientDocument.snapshotChanges().pipe(
      map( action => {
        if(action.payload.exists === false){
          return null;
        }else{
          const data = action.payload.data() as Client;
          data.id = action.payload.id;
          return data;
        }
      })
      );
      return this.client;
  }

  editClient(client: Client, id: string): Promise<void>{
    this.clientDocument = this.firebaseDb.doc(`clientes/${id}`);

    return this.clientDocument.update(client).then((docRef) =>{
      return docRef
    }).catch((error) =>{
      console.error(error);
      throw error
    });
  }

  deleteClient(client: Client): Promise<void>{
    if(client){
      this.clientDocument = this.firebaseDb.doc(`clientes/${client.id}`);

      return this.clientDocument.delete().then((docRef) => {
          return docRef
      }).catch((error) =>{
        console.error(error);
        throw error
      })
    }
    return client;
 }
}
