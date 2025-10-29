import type { LaboratorioInfo } from "../models/laboratorio";
import apiClient, { parseAxiosError } from "./axiosClient";

// Obtener lista de laboratorios
export async function obtenerListaLaboratorios(): Promise<LaboratorioInfo[]> {
    try {
        const response = await apiClient.get('/laboratorios');
        return response.data as LaboratorioInfo[];
    } catch (err) {
        throw parseAxiosError(err, "Error al obtener lista de laboratorios");
    }
};