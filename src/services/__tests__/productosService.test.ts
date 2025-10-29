import { describe, it, expect, beforeAll, vi } from 'vitest';
import { obtenerListaProductos } from '../productoService';

beforeAll(() => {
  globalThis.localStorage = {
    getItem: vi.fn(() => null),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  } as any;
});

describe('obtenerListaProductos - prueba de integración', () => {
  it('debe devolver un array real desde la API con productos válidos', async () => {
    try {
      const result = await obtenerListaProductos();
      console.log('Vitest: obtenerListaProductos devuelve ->', result);

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);

      const producto = result[0];
      expect(producto).toHaveProperty('id');
      expect(producto).toHaveProperty('nombreComercial');
      expect(producto).toHaveProperty('formaFarmaceutica');
      expect(producto).toHaveProperty('laboratorio');
      expect(producto).toHaveProperty('precioCompra');
      expect(producto).toHaveProperty('precioVenta');
      expect(producto).toHaveProperty('stock');
      expect(producto).toHaveProperty('stockMin');
      expect(producto).toHaveProperty('estado');
      expect(producto).toHaveProperty('urlFoto');
    } catch (err) {
      console.error('Error al obtener lista de productos', err);
      throw err;
    }
  });
});
