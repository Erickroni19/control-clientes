export interface Cliente{
    id?: string;
    nombre?: string;
    apellido?: string;
    email?: string;
    saldo?: number;
    uid?: string,
    [key: string]: string | number | undefined; //Firma de indice
}