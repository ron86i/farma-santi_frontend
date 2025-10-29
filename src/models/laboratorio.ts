export interface LaboratorioInfo {
    id:number;
    nombre: string;
    estado: string;
    direccion: string;
    createdAt: Date;
    deletedAt: Date | null;
}