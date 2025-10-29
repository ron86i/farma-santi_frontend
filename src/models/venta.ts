import type { ProductoSimple } from "./producto";

export interface VentaInfo {
  id: number;
  codigo: string;
  usuario: UsuarioSimple;
  cliente: ClienteSimple;
  fecha: Date;
  estado: string;
  deletedAt: Date | null;
  total:number | 0;
  url:string;
}

export interface UsuarioSimple {
  id: number;
  username: string;
  estado:string;
}

export interface ClienteSimple {
  id: number;
  nitCi: number | null;
  complemento: string | null;
  razonSocial: string;
  email: string
}


export interface VentaDetail extends VentaInfo{
  detalles: DetalleVentaDetail[];
}

export interface DetalleVentaDetail {
  id: number;
  producto: ProductoSimple;
  lotes: VentaLote[];
  cantidad: number;
  precio: number;
  total: number;
  url:string;
}

export interface VentaLote {
  id: number;
  lote: string;
  cantidad: number;
  fechaVencimiento: Date;
}

