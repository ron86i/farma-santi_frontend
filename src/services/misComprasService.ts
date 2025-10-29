import type { VentaDetail, VentaInfo } from "../models/venta";
import apiClient, { parseAxiosError } from "./axiosClient";

export async function obtenerListaMisCompras(): Promise<VentaInfo[]> {
    try {
        const response = await apiClient.get('/mis-compras');
        return response.data as VentaInfo[];
    } catch (err) {
        throw parseAxiosError(err, "Error al listar compras realizadas");
    }
};

export async function obtenerCompraById(id:number): Promise<VentaDetail> {
    try {
        const response = await apiClient.get(`/mis-compras/${id}`);
        return response.data as VentaDetail;
    } catch (err) {
        throw parseAxiosError(err, "Error al obtener compra");
    }
};
