import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Cliente } from '../interfaces/cliente';
import {Observable, from, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { error } from 'jquery';

@Injectable({
  providedIn: 'root'
})
export class ClienteServices {
  clientesColeccion: AngularFirestoreCollection<Cliente>;
  clienteDoc!: AngularFirestoreDocument<Cliente | null>;
  clientes!: Observable<Cliente[]>;
  cliente!: Observable<Cliente | null>;
  
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
  
  /**---Agrega un nuevo cliente a la base de datos--- */
  agregarCliente(cliente: Cliente){
    this.clientesColeccion.add(cliente);
  }

  /**---Obtenemos el cliente que deseamos mediante id--- */
  getCliente(id:string){
    this.clienteDoc = this.firebaseDb.doc<Cliente | null>(`clientes/${id}`);

    this.cliente = this.clienteDoc.snapshotChanges().pipe(
      map( accion => {
        if(accion.payload.exists === false){
          return null;
        }else{
          const datos = accion.payload.data() as Cliente;
          datos.id = accion.payload.id;
          return datos;
        }
      })
      );
      return this.cliente;
  }

  /**---Modificamos la información del cliente--- */
  modificarCliente(cliente: Cliente, id: string): Observable<void>{
  this.clienteDoc = this.firebaseDb.doc(`clientes/${id}`);

     return from(this.clienteDoc.update(cliente)).pipe(
       catchError((error) => {

        console.error('Error al actualizar cliente:', error)

        return throwError (() => error)
       })
    );
  }

  /**---Elimina la información del cliente--- */
  eliminarCliente(cliente: Cliente): Observable<void>{
    if(cliente){
      this.clienteDoc = this.firebaseDb.doc(`clientes/${cliente.id}`);
  
      return from(this.clienteDoc.delete()).pipe(
        catchError((error) => {

          console.error('Error al tratar de eliminar el cliente:', error)
  
          return throwError (() => error)
         })
      )
    }else{
      return throwError (() => new Error('The client is null or undefined'))
    }
 }
}
