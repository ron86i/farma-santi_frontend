import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest';
import MockAdapter from 'axios-mock-adapter';
import apiClient from '../axiosClient';
import { obtenerListaProductos } from '../productoService';

const mock = new MockAdapter(apiClient);

beforeAll(() => {
  // Mock de localStorage
  globalThis.localStorage = {
    getItem: vi.fn(() => "token"),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  } as any;
});

// describe('obtenerListaProductos - Caso de prueba 1', () => {
//   afterEach(() => mock.reset());

//   it('debe devolver un array simulado con al menos un producto', async () => {
//     // Mock de la API
//     mock.onGet(/\/productos(\?.*)?$/).reply(200, [
//       {
//         id: '70579eb2-acf0-4e6b-a7ba-17a367433bf8',
//         nombreComercial: 'AZITROMICINA 500',
//         formaFarmaceutica: 'Cápsula',
//         laboratorio: 'BAGO',
//         precioCompra: 2,
//         precioVenta: 2.5,
//         stock: 34,
//         stockMin: 20,
//         estado: 'Activo',
//         urlFoto: 'https://farmasanti-s1.soft-solution.org/uploads/productos/70579eb2-acf0-4e6b-a7ba-17a367433bf8/1.jpg'
//       }
//     ]);

//     const result = await obtenerListaProductos();

//     // Validaciones
//     expect(Array.isArray(result)).toBe(true);
//     expect(result.length).toBeGreaterThan(0);

//   });
// });


describe('obtenerListaProductos - Caso de prueba 2', () => {
  afterEach(() => mock.reset());

  it('debe devolver productos con campos esperados', async () => {
    mock.onGet(/\/productos(\?.*)?$/).reply(200, [
      {
        id: '70579eb2-acf0-4e6b-a7ba-17a367433bf8',
        nombreComercial: 'AZITROMICINA 500',
        formaFarmaceutica: 'Cápsula',
        laboratorio: 'BAGO',
        precioCompra: 2,
        precioVenta: 2.5,
        stock: 34,
        stockMin: 20,
        estado: 'Activo',
        urlFoto: 'https://farmasanti-s1.soft-solution.org/uploads/productos/70579eb2-acf0-4e6b-a7ba-17a367433bf8/1.jpg'
      }
    ]);

    const result = await obtenerListaProductos();

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
  });
});
