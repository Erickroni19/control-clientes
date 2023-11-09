import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Cliente } from '../interfaces/cliente';
import {Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ClienteServicesService {
  clientesColeccion: AngularFirestoreCollection<Cliente>;
  clienteDoc!: AngularFirestoreDocument<Cliente>;
  clientes!: Observable<Cliente[]>;
  cliente!: Observable<Cliente>;
  
  constructor(private firebaseDb: AngularFirestore) {
    //Se hace la petición a la firebase para que retorne los nombres en orden ascendente 
    this.clientesColeccion = firebaseDb.collection('clientes', ref => ref.orderBy('nombre', 'asc'))
  }

  /**---Nos retorna la información de los clientes-----*/
  getClientes(): Observable<Cliente[]>{
      //Obtenemos los clientes
      this.clientes = this.clientesColeccion.snapshotChanges().pipe(
        map( cambios => {
          return cambios.map( accion => {
            const datos = accion.payload.doc.data() as Cliente;
            datos.id = accion.payload.doc.id;
            return datos
          })
        })
      )
      return this.clientes
  }   
}
