import { useEffect, useState } from "react";
import { useQuery } from "../../hooks/generic";
import { useDebounce } from "../../hooks/useDebounce";
import { obtenerListaCategorias } from "../../services";
import { obtenerListaProductos } from "../../services/productoService";
import type { ProductoInfo } from "../../models";
import { useNavigate } from "react-router";
import { Navbar } from "../components/NavBar";
import { ProductoCard } from "../Catalogo/components/ProductoCard";
import { Footer } from "../components/Footer";

export function Main() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [showAllCategories, setShowAllCategories] = useState(false);

  const maxVisibleCategories = 6;

  const { fetch: fetchCategorias, data: listaCategorias, loading: loadingCategorias } = useQuery(obtenerListaCategorias);
  const { fetch: fetchProductos, data: listaProductos, loading: loadingProductos } = useQuery(obtenerListaProductos);

  const navigate = useNavigate();

// Cargar categorías al inicio
useEffect(() => {
  fetchCategorias();
}, []);

// Efecto para manejar búsqueda y filtros (incluye carga inicial)
useEffect(() => {
  const params = [];

  if (selectedCategoryId !== null)
    params.push(`categoriaId=${selectedCategoryId}`);

  if (debouncedSearchTerm.trim() !== "")
    params.push(`search=${encodeURIComponent(debouncedSearchTerm.trim())}`);

  const query = params.join("&");
  fetchProductos(query);
}, [selectedCategoryId, debouncedSearchTerm]);


  // Manejo de click en categoría
  const handleCategoryClick = (categoryId: number | null) => {
    setSelectedCategoryId(categoryId);
  };

  const categories = listaCategorias || [];
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <main className="flex-grow container mx-auto px-6 py-8">
        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-12 mb-10 text-white relative overflow-hidden">
          <div className="absolute right-0 top-0 opacity-10">
            <svg className="w-64 h-64" viewBox="0 0 200 200" fill="currentColor">
              <path d="M100 20 L120 60 L160 60 L128 88 L140 130 L100 102 L60 130 L72 88 L40 60 L80 60 Z" />
            </svg>
          </div>
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-4xl font-bold mb-3">Bienvenido a Farmacia Santi</h2>
            <p className="text-blue-100 text-lg mb-6">Encuentra todos los medicamentos y productos para el cuidado de tu salud</p>
            <button
              onClick={() => navigate("/catalogo")}
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Ver catálogo completo
            </button>
          </div>
        </div>

        {/* Filtros de categorías */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Categorías</h3>
            <span className="text-sm text-gray-500">({listaProductos?.length || 0} productos)</span>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleCategoryClick(null)}
              className={`px-5 py-2 rounded-full font-medium transition-all transform hover:scale-105 ${selectedCategoryId === null
                ? "bg-blue-600 text-white shadow-md"
                : "bg-white text-gray-700 border border-gray-300 hover:border-blue-500 hover:text-blue-600"
                }`}
            >
              Todos
            </button>

            {loadingCategorias ? (
              <div className="text-gray-400 py-2">Cargando...</div>
            ) : (
              (showAllCategories ? categories : categories.slice(0, maxVisibleCategories)).map((cat: any) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  className={`px-5 py-2 rounded-full font-medium transition-all transform hover:scale-105 ${selectedCategoryId === cat.id
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-white text-gray-700 border border-gray-300 hover:border-blue-500 hover:text-blue-600"
                    }`}
                >
                  {cat.nombre}
                </button>
              ))
            )}
          </div>

          {/* Botón Ver más / Ver menos centrado */}
          {categories.length > maxVisibleCategories && (
            <div className="mt-2 flex justify-center">
              <button
                onClick={() => setShowAllCategories(prev => !prev)}
                className="text-sm text-blue-600 hover:text-blue-700 hover:underline font-medium transition-colors"
              >
                {showAllCategories ? "Ver menos" : "Ver más"}
              </button>
            </div>
          )}
        </div>

        {/* Grid de productos */}
        {loadingProductos ? (
          <div className="text-center py-20">
            <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600 mt-4">Cargando productos...</p>
          </div>
        ) : listaProductos?.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl">
            <svg className="w-20 h-20 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h4 className="text-xl font-semibold text-gray-700 mb-2">No encontramos productos</h4>
            <p className="text-gray-500 mb-4">Intenta con otros términos de búsqueda</p>
            <button
              onClick={() => {
                setSelectedCategoryId(null);
                setSearchTerm("");
              }}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Ver todos los productos
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {listaProductos?.map((product: ProductoInfo) => (
              <ProductoCard product={product} onClick={() => navigate("/productos/" + product.id)} />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer/>

    </div>
  );
}