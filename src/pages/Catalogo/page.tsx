import { useEffect, useState } from "react";
import { useQuery } from "../../hooks/generic";
import { obtenerListaCategorias } from "../../services";
import { obtenerListaFormasFarmaceuticas, obtenerListaProductos } from "../../services/productoService";
import type { ProductoInfo } from "../../models";
import { X, Filter, Package, AlertCircle, Pill } from "lucide-react";
import type { LaboratorioInfo } from "../../models/laboratorio";
import { obtenerListaLaboratorios } from "../../services/laboratorioService";
import { useDebounce } from "../../hooks/useDebounce";
import { Navbar } from "../components/NavBar";
import { ProductoCard } from "./components/ProductoCard";
import { useNavigate } from "react-router";
import { Footer } from "../components/Footer";

export function Catalogo() {
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedLaboratorios, setSelectedLaboratorios] = useState<string[]>([]);
    const [selectedFormasFarmaceuticas, setSelectedFormasFarmaceuticas] = useState<string[]>([]);
    const [showFilters, setShowFilters] = useState(false);

    const { fetch: fetchProductos, data: listaProductos, loading: loadingProductos } = useQuery(obtenerListaProductos);
    const { fetch: fetchCategorias, data: listaCategorias, loading: loadingCategorias } = useQuery(obtenerListaCategorias);
    const { fetch: fetchLaboratorios, data: listaLaboratorios, loading: loadingLaboratorios } = useQuery(obtenerListaLaboratorios);
    const { fetch: fetchFF, data: listaFF, loading: loadingFF } = useQuery(obtenerListaFormasFarmaceuticas);

    useEffect(() => {
        fetchCategorias();
        fetchLaboratorios();
        fetchFF();
    }, []);

    useEffect(() => {
        const params = [];
        if (selectedCategories.length > 0) params.push(`categorias=${selectedCategories.join(",")}`);
        if (selectedLaboratorios.length > 0) params.push(`laboratorios=${selectedLaboratorios.join(",")}`);
        if (selectedFormasFarmaceuticas.length > 0) params.push(`formasFarmaceuticas=${selectedFormasFarmaceuticas.join(",")}`);
        if (debouncedSearchTerm) params.push(`search=${encodeURIComponent(debouncedSearchTerm)}`);

        const query = params.join("&");
        fetchProductos(query);
    }, [selectedCategories, selectedLaboratorios, selectedFormasFarmaceuticas, debouncedSearchTerm]);

    const toggleCategory = (category: string) => {
        setSelectedCategories(prev =>
            prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
        );
    };

    const toggleLaboratorio = (laboratorio: string) => {
        setSelectedLaboratorios(prev =>
            prev.includes(laboratorio) ? prev.filter(l => l !== laboratorio) : [...prev, laboratorio]
        );
    };

    const toggleFormaFarmaceutica = (ff: string) => {
        setSelectedFormasFarmaceuticas(prev =>
            prev.includes(ff) ? prev.filter(f => f !== ff) : [...prev, ff]
        );
    };

    const categories = listaCategorias || [];
    const laboratorios = listaLaboratorios || [];
    const formasFarmaceuticas = listaFF || [];
    const activeFiltersCount = selectedCategories.length + selectedLaboratorios.length + selectedFormasFarmaceuticas.length;
    const navigate = useNavigate();
    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* Navbar */}
            <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

            {/* Header de catálogo */}
            <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-[73px] lg:top-[89px] z-40 shadow-sm">
                <div className="container mx-auto px-4 sm:px-6 py-4">
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-xl shadow-lg">
                                <Package className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    Catálogo
                                </h2>
                                <p className="text-sm text-gray-500">
                                    {(listaProductos || []).length} productos disponibles
                                </p>
                            </div>
                        </div>

                        {/* Botón de filtros móvil */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="lg:hidden flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl
                                hover:bg-blue-700 transition-colors shadow-md relative"
                        >
                            <Filter className="w-5 h-5" />
                            <span>Filtros</span>
                            {activeFiltersCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs 
                                    w-6 h-6 rounded-full flex items-center justify-center font-bold shadow-lg">
                                    {activeFiltersCount}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Chips de filtros activos */}
                    {activeFiltersCount > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                            {selectedCategories.map(catId => {
                                const cat = categories.find((c: any) => String(c.id) === catId);
                                const categoryName = cat?.nombre || cat?.nombre || catId;
                                return (
                                    <span
                                        key={`cat-${catId}`}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 
                                            text-blue-700 rounded-full text-sm font-medium"
                                    >
                                        {categoryName}
                                        <button
                                            onClick={() => toggleCategory(catId)}
                                            className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </span>
                                );
                            })}
                            {selectedLaboratorios.map(labId => {
                                const lab = laboratorios.find((l: LaboratorioInfo) => String(l.id) === labId);
                                const labName = lab?.nombre || lab?.nombre || labId;
                                return (
                                    <span
                                        key={`lab-${labId}`}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 
                                            text-purple-700 rounded-full text-sm font-medium"
                                    >
                                        {labName}
                                        <button
                                            onClick={() => toggleLaboratorio(labId)}
                                            className="hover:bg-purple-200 rounded-full p-0.5 transition-colors"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </span>
                                );
                            })}
                            {selectedFormasFarmaceuticas.map(ffId => {
                                const ff = formasFarmaceuticas.find((f: any) => String(f.id) === ffId);
                                const ffName = ff?.nombre || ff?.nombre || ffId;
                                return (
                                    <span
                                        key={`ff-${ffId}`}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-100 
                                            text-green-700 rounded-full text-sm font-medium"
                                    >
                                        {ffName}
                                        <button
                                            onClick={() => toggleFormaFarmaceutica(ffId)}
                                            className="hover:bg-green-200 rounded-full p-0.5 transition-colors"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </span>
                                );
                            })}
                            <button
                                onClick={() => {
                                    setSelectedCategories([]);
                                    setSelectedLaboratorios([]);
                                    setSelectedFormasFarmaceuticas([]);
                                }}
                                className="text-sm text-gray-500 hover:text-gray-700 font-medium underline"
                            >
                                Limpiar todo
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <main className="container mx-auto px-4 sm:px-6 py-8 flex flex-col lg:flex-row gap-6">
                {/* Sidebar mejorado */}
                <aside className={`
                    ${showFilters ? 'block' : 'hidden lg:block'}
                    w-full lg:w-72 flex-shrink-0 h-fit lg:sticky lg:top-44
                `}>
                    <div className="space-y-4">
                        {/* Filtro de Categorías */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                            <div className="flex items-center justify-between mb-5">
                                <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                                    <Filter className="w-5 h-5 text-blue-600" />
                                    Categorías
                                </h3>
                                {selectedCategories.length > 0 && (
                                    <span className="bg-blue-600 text-white text-xs px-2.5 py-1 rounded-full font-bold">
                                        {selectedCategories.length}
                                    </span>
                                )}
                            </div>

                            {loadingCategorias ? (
                                <div className="space-y-3">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="h-10 bg-gray-100 rounded-lg animate-pulse" />
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                    {categories.map((cat: any) => {
                                        const categoryId = String(cat.id);
                                        const categoryName = cat.nombre || cat.name;
                                        const isSelected = selectedCategories.includes(categoryId);
                                        return (
                                            <label
                                                key={cat.id}
                                                className={`
                                                    flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer 
                                                    transition-all duration-200 group
                                                    ${isSelected
                                                        ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-300'
                                                        : 'hover:bg-gray-50 border-2 border-transparent'
                                                    }
                                                `}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={() => toggleCategory(categoryId)}
                                                    className="w-5 h-5 text-blue-600 border-gray-300 rounded-md 
                                                        focus:ring-2 focus:ring-blue-500 cursor-pointer"
                                                />
                                                <span className={`
                                                    font-medium text-sm flex-1
                                                    ${isSelected ? 'text-blue-700' : 'text-gray-700'}
                                                `}>
                                                    {categoryName}
                                                </span>
                                            </label>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Filtro de Formas Farmacéuticas */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                            <div className="flex items-center justify-between mb-5">
                                <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                                    <Pill className="w-5 h-5 text-green-600" />
                                    Formas Farmacéuticas
                                </h3>
                                {selectedFormasFarmaceuticas.length > 0 && (
                                    <span className="bg-green-600 text-white text-xs px-2.5 py-1 rounded-full font-bold">
                                        {selectedFormasFarmaceuticas.length}
                                    </span>
                                )}
                            </div>

                            {loadingFF ? (
                                <div className="space-y-3">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="h-10 bg-gray-100 rounded-lg animate-pulse" />
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                    {formasFarmaceuticas.map((ff: any) => {
                                        const ffId = String(ff.id);
                                        const ffName = ff.nombre || ff.nombre;
                                        const isSelected = selectedFormasFarmaceuticas.includes(ffId);
                                        return (
                                            <label
                                                key={ff.id}
                                                className={`
                                                    flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer 
                                                    transition-all duration-200 group
                                                    ${isSelected
                                                        ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300'
                                                        : 'hover:bg-gray-50 border-2 border-transparent'
                                                    }
                                                `}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={() => toggleFormaFarmaceutica(ffId)}
                                                    className="w-5 h-5 text-green-600 border-gray-300 rounded-md 
                                                        focus:ring-2 focus:ring-green-500 cursor-pointer"
                                                />
                                                <span className={`
                                                    font-medium text-sm flex-1
                                                    ${isSelected ? 'text-green-700' : 'text-gray-700'}
                                                `}>
                                                    {ffName}
                                                </span>
                                            </label>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Filtro de Laboratorios */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                            <div className="flex items-center justify-between mb-5">
                                <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                                    <Package className="w-5 h-5 text-purple-600" />
                                    Laboratorios
                                </h3>
                                {selectedLaboratorios.length > 0 && (
                                    <span className="bg-purple-600 text-white text-xs px-2.5 py-1 rounded-full font-bold">
                                        {selectedLaboratorios.length}
                                    </span>
                                )}
                            </div>

                            {loadingLaboratorios ? (
                                <div className="space-y-3">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="h-10 bg-gray-100 rounded-lg animate-pulse" />
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                    {laboratorios.map((lab: LaboratorioInfo) => {
                                        const labId = String(lab.id);
                                        const labName = lab.nombre || lab.nombre;
                                        const isSelected = selectedLaboratorios.includes(labId);
                                        return (
                                            <label
                                                key={lab.id}
                                                className={`
                                                    flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer 
                                                    transition-all duration-200 group
                                                    ${isSelected
                                                        ? 'bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-300'
                                                        : 'hover:bg-gray-50 border-2 border-transparent'
                                                    }
                                                `}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={() => toggleLaboratorio(labId)}
                                                    className="w-5 h-5 text-purple-600 border-gray-300 rounded-md 
                                                        focus:ring-2 focus:ring-purple-500 cursor-pointer"
                                                />
                                                <span className={`
                                                    font-medium text-sm flex-1
                                                    ${isSelected ? 'text-purple-700' : 'text-gray-700'}
                                                `}>
                                                    {labName}
                                                </span>
                                            </label>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </aside>

                {/* Grid de productos mejorado */}
                <section className="flex-1 min-w-0">
                    {loadingProductos ? (
                        <div className="flex flex-col items-center justify-center py-32">
                            <div className="relative">
                                <div className="w-16 h-16 border-4 border-blue-200 rounded-full"></div>
                                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0"></div>
                            </div>
                            <p className="text-gray-600 mt-6 font-medium">Cargando productos...</p>
                        </div>
                    ) : (listaProductos || []).length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-32 bg-white rounded-2xl shadow-sm">
                            <div className="bg-gray-100 p-6 rounded-full mb-4">
                                <AlertCircle className="w-12 h-12 text-gray-400" />
                            </div>
                            <h4 className="text-2xl font-bold text-gray-800 mb-2">No encontramos productos</h4>
                            <p className="text-gray-500 mb-6">Intenta ajustar tus filtros o búsqueda</p>
                            {(activeFiltersCount > 0 || searchTerm) && (
                                <button
                                    onClick={() => {
                                        setSelectedCategories([]);
                                        setSelectedLaboratorios([]);
                                        setSelectedFormasFarmaceuticas([]);
                                        setSearchTerm("");
                                    }}
                                    className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 
                                        transition-colors font-medium shadow-md"
                                >
                                    Limpiar filtros
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
                            {(listaProductos || []).map((product: ProductoInfo) => (
                                <ProductoCard product={product} onClick={() => navigate("/productos/" + product.id)} />
                            ))}
                        </div>
                    )}
                </section>
            </main>
            {/* Footer */}
            <Footer />
        </div>
    );
}