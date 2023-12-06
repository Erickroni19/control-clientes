export interface Cliente{
    id?: string;
    nombre?: string;
    apellido?: string;
    email?: string;
    saldo?: number;
    [key: string]: string | number | undefined;
}