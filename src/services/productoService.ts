import type { FormaFarmacetica, ProductoDetail, ProductoInfo, UnidadMedida } from "../models";
import apiClient, { parseAxiosError } from "./axiosClient";


// Obtener lista de productos
export async function obtenerListaProductos(filtro?: string): Promise<ProductoInfo[]> {
    const query = filtro ? `?${filtro}` : "";
    try {
        const response = await apiClient.get('/productos' + query);
        return response.data as ProductoInfo[];
    } catch (err:any) {
        throw parseAxiosError(err, "Error al obtener lista de productos");
    }
};
// Obtener formas farmaceuticas
export async function obtenerListaFormasFarmaceuticas(): Promise<FormaFarmacetica[]> {
    try {
        const response = await apiClient.get('/productos/formas-farmaceuticas');
        return response.data as FormaFarmacetica[];
    } catch (err) {
        throw parseAxiosError(err, "Error al obtener lista de formas farmaceuticas");
    }
};

// Obtener unidades de medidas
export async function obtenerListaUnidadesMedidas(): Promise<UnidadMedida[]> {
    try {
        const response = await apiClient.get('/productos/unidades-medida');
        return response.data as UnidadMedida[];
    } catch (err) {
        throw parseAxiosError(err, "Error al obtener lista de unidades de medida");
    }
};

// Obtener proveedor por id
export async function obtenerProductoById(productoId: string): Promise<ProductoDetail> {
    try {
        const response = await apiClient.get(`/productos/${productoId}`);
        return response.data as ProductoDetail;
    } catch (err) {
        throw parseAxiosError(err, "Error al obtener producto");
    }
};
