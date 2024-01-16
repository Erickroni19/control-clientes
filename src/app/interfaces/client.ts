export interface Client{
    apellido?: string;
    email?: string;
    id?: string;
    nombre?: string;
    saldo?: number;
    uid?: string;
    [key: string]: string | number | undefined; //Firma de indice
}
export interface Ids{
    [key: string]: string | undefined;
}