 
import type { Categoria } from '../models';
import apiClient, { parseAxiosError } from './axiosClient';

// Obtener lista de categorías
export async function obtenerListaCategorias(): Promise<Categoria[]> {
    try {
        const response = await apiClient.get('/categorias');
        return response.data as Categoria[];
    } catch (err) {
        throw parseAxiosError(err, "Error al listar categorías");
    }
};

