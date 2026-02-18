import { useEffect, useState, useMemo } from "react";
import { useQuery } from "../../hooks/generic";
import { obtenerListaCategorias } from "../../services";
import { obtenerListaFormasFarmaceuticas, obtenerListaProductos } from "../../services/productoService";
import type { ProductoInfo } from "../../models";
import { X, Filter, Package, AlertCircle, Pill, ChevronRight } from "lucide-react";
import { obtenerListaLaboratorios } from "../../services/laboratorioService";
import { useDebounce } from "../../hooks/useDebounce";
import { Navbar } from "../components/NavBar";
import { ProductoCard } from "./components/ProductoCard";
import { useNavigate } from "react-router";
import { Footer } from "../components/Footer";
import { Helmet } from 'react-helmet-async';

const generateProductSchema = (products: ProductoInfo[]) => {
    if (!products || products.length === 0) return '';
    const itemListElements = products.slice(0, 10).map((product, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
            "@type": "Product",
            "name": product.nombreComercial,
            "description": `Busca ${product.nombreComercial} y más en nuestro catálogo.`,
            "url": `${window.location.origin}/productos/${product.id}`,
            "image": product.urlFoto || `${window.location.origin}/default-product.jpg`,
            "offers": {
                "@type": "Offer",
                "priceCurrency": "BOB",
                "price": product.precioVenta || 0,
                "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
            }
        }
    }));
    const schema = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "mainEntity": {
            "@type": "ItemList",
            "name": "Catálogo de Productos Farmacéuticos | Tu Farmacia Online",
            "numberOfItems": products.length,
            "itemListElement": itemListElements,
        }
    };
    return JSON.stringify(schema);
};

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

    const categories = listaCategorias || [];
    const laboratorios = listaLaboratorios || [];
    const formasFarmaceuticas = listaFF || [];

    // Bloquear scroll en móvil cuando se abre el filtro
    useEffect(() => {
        if (showFilters) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'auto';
        return () => { document.body.style.overflow = 'auto'; };
    }, [showFilters]);

    const getActiveFiltersTitle = useMemo(() => {
        const activeNames: string[] = [];
        selectedCategories.forEach(id => {
            const cat = categories.find((c: any) => String(c.id) === id);
            if (cat) activeNames.push(cat.nombre);
        });
        // ... (resto de lógica igual)
        if (debouncedSearchTerm) activeNames.push(`"${debouncedSearchTerm}"`);
        return activeNames.length > 0 ? activeNames.join(', ') : '';
    }, [selectedCategories, selectedLaboratorios, selectedFormasFarmaceuticas, debouncedSearchTerm, categories]);

    const { title, metaDescription } = useMemo(() => {
        const baseTitle = "Catálogo Completo de Productos Farmacéuticos";
        let title = baseTitle;
        let description = 'Explora nuestro amplio catálogo...';
        if (getActiveFiltersTitle) {
            title = `${baseTitle} - Filtro: ${getActiveFiltersTitle}`;
        }
        return { title, metaDescription: description };
    }, [getActiveFiltersTitle]);

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

    // Helpers toggle
    const toggleCategory = (id: string) => setSelectedCategories(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
    const toggleLaboratorio = (id: string) => setSelectedLaboratorios(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
    const toggleFormaFarmaceutica = (id: string) => setSelectedFormasFarmaceuticas(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

    const activeFiltersCount = selectedCategories.length + selectedLaboratorios.length + selectedFormasFarmaceuticas.length;
    const navigate = useNavigate();
    const jsonLdSchema = generateProductSchema(listaProductos || []);

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
            <style>{`
                .scrollbar-thin::-webkit-scrollbar { width: 6px; }
                .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
                .scrollbar-thin::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 20px; }
            `}</style>
            
            <Helmet>
                <title>{title}</title>
                <meta name="description" content={metaDescription} />
                <script type="application/ld+json">{jsonLdSchema}</script>
            </Helmet>

            <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

            {/* --- HEADER STICKY: Título y Filtros Activos --- */}
            <div className="bg-white border-b border-gray-200 sticky top-[73px] lg:top-[88px] z-30 shadow-sm">
                <div className="container mx-auto px-4 py-3 lg:px-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-50 rounded-lg hidden sm:block text-blue-600">
                                <Package size={20} />
                            </div>
                            <div>
                                <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Catálogo</h1>
                                <p className="text-sm text-gray-500">{(listaProductos || []).length} resultados</p>
                            </div>
                        </div>

                        {/* Botón Filtros (SOLO MÓVIL) */}
                        <button 
                            onClick={() => setShowFilters(true)}
                            className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-gray-700 font-medium active:bg-gray-50"
                        >
                            <Filter size={18} /> Filtros
                            {activeFiltersCount > 0 && (
                                <span className="bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded-full">{activeFiltersCount}</span>
                            )}
                        </button>
                    </div>

                    {/* Chips de filtros (Desktop: Wrap / Móvil: Scroll Horizontal) */}
                    {activeFiltersCount > 0 && (
                        <div className="flex gap-2 mt-3 overflow-x-auto pb-2 lg:pb-0 scrollbar-thin">
                            {selectedCategories.map(id => {
                                const item = categories.find((c: any) => String(c.id) === id);
                                return <FilterChip key={id} label={item?.nombre || ""} onRemove={() => toggleCategory(id)} color="blue" />
                            })}
                            {selectedLaboratorios.map(id => {
                                const item = laboratorios.find((c: any) => String(c.id) === id);
                                return <FilterChip key={id} label={item?.nombre || ""} onRemove={() => toggleLaboratorio(id)} color="purple" />
                            })}
                            {selectedFormasFarmaceuticas.map(id => {
                                const item = formasFarmaceuticas.find((c: any) => String(c.id) === id);
                                return <FilterChip key={id} label={item?.nombre || ""} onRemove={() => toggleFormaFarmaceutica(id)} color="green" />
                            })}
                            <button 
                                onClick={() => { setSelectedCategories([]); setSelectedLaboratorios([]); setSelectedFormasFarmaceuticas([]); setSearchTerm(""); }}
                                className="text-xs text-red-600 hover:underline font-medium px-2 whitespace-nowrap"
                            >
                                Borrar todo
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* --- LAYOUT PRINCIPAL: SIDEBAR + GRID --- */}
            <main className="container mx-auto px-4 lg:px-8 py-6 flex items-start gap-8">
                
                {/* 1. SIDEBAR DE FILTROS */}
                <aside className={`
                    fixed inset-0 z-50 bg-white transform transition-transform duration-300 ease-in-out flex flex-col
                    ${showFilters ? 'translate-x-0' : '-translate-x-full'}
                    lg:static lg:translate-x-0 lg:w-64 lg:flex-shrink-0 lg:bg-transparent lg:block lg:z-auto
                `}>
                    {/* Header Móvil del Sidebar */}
                    <div className="lg:hidden flex items-center justify-between p-4 border-b">
                        <span className="font-bold text-lg">Filtros</span>
                        <button onClick={() => setShowFilters(false)} className="p-2 bg-gray-100 rounded-full"><X size={20} /></button>
                    </div>

                    {/* Contenido Scrollable */}
                    <div className="flex-1 overflow-y-auto p-4 lg:p-0 lg:overflow-visible lg:sticky lg:top-48 custom-scrollbar">
                        
                        {/* Grupo Categorías */}
                        <FilterGroup 
                            title="Categorías" 
                            icon={<Filter size={16} className="text-blue-600"/>}
                            loading={loadingCategorias}
                        >
                            {categories.map((cat: any) => (
                                <FilterOption 
                                    key={cat.id} 
                                    id={String(cat.id)} 
                                    label={cat.nombre} 
                                    checked={selectedCategories.includes(String(cat.id))} 
                                    onChange={() => toggleCategory(String(cat.id))}
                                />
                            ))}
                        </FilterGroup>

                        <div className="h-px bg-gray-200 my-4" />

                        {/* Grupo Formas */}
                        <FilterGroup 
                            title="Formas Farmacéuticas" 
                            icon={<Pill size={16} className="text-green-600"/>}
                            loading={loadingFF}
                        >
                            {formasFarmaceuticas.map((ff: any) => (
                                <FilterOption 
                                    key={ff.id} 
                                    id={String(ff.id)} 
                                    label={ff.nombre} 
                                    checked={selectedFormasFarmaceuticas.includes(String(ff.id))} 
                                    onChange={() => toggleFormaFarmaceutica(String(ff.id))}
                                />
                            ))}
                        </FilterGroup>

                        <div className="h-px bg-gray-200 my-4" />

                        {/* Grupo Laboratorios */}
                        <FilterGroup 
                            title="Laboratorios" 
                            icon={<Package size={16} className="text-purple-600"/>}
                            loading={loadingLaboratorios}
                        >
                            {laboratorios.map((lab: any) => (
                                <FilterOption 
                                    key={lab.id} 
                                    id={String(lab.id)} 
                                    label={lab.nombre} 
                                    checked={selectedLaboratorios.includes(String(lab.id))} 
                                    onChange={() => toggleLaboratorio(String(lab.id))}
                                />
                            ))}
                        </FilterGroup>

                        {/* Espacio extra en móvil para el botón flotante */}
                        <div className="h-20 lg:hidden"></div>
                    </div>

                    {/* Footer Móvil (Botón Ver Resultados) */}
                    <div className="lg:hidden p-4 border-t bg-white absolute bottom-0 left-0 right-0">
                        <button 
                            onClick={() => setShowFilters(false)}
                            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold shadow-lg active:scale-95 transition-transform"
                        >
                            Ver {(listaProductos || []).length} resultados
                        </button>
                    </div>
                </aside>
                
                {/* Backdrop Oscuro (Solo Móvil) */}
                {showFilters && (
                    <div className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm" onClick={() => setShowFilters(false)} />
                )}

                {/*  GRID DE PRODUCTOS */}
                <section className="flex-1 w-full min-w-0">
                    {loadingProductos ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                            {[1,2,3,4,5,6,7,8].map(i => (
                                <div key={i} className="bg-white rounded-2xl h-80 shadow-sm border border-gray-100 animate-pulse"></div>
                            ))}
                        </div>
                    ) : (listaProductos || []).length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                            <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-bold text-gray-900">No encontramos productos</h3>
                            <p className="text-gray-500 mt-1">Intenta cambiar los filtros o tu búsqueda.</p>
                            <button 
                                onClick={() => { setSearchTerm(""); setSelectedCategories([]); }}
                                className="mt-4 text-blue-600 font-medium hover:underline"
                            >
                                Limpiar búsqueda
                            </button>
                        </div>
                    ) : (
                        // Ajuste para pc
                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                            {(listaProductos || []).map((product: ProductoInfo) => (
                                <ProductoCard
                                    key={product.id}
                                    product={product}
                                    onClick={() => navigate("/productos/" + product.id)}
                                />
                            ))}
                        </div>
                    )}
                </section>

            </main>
            <Footer />
        </div>
    );
}

// Subcomponentes para limpiar el código

function FilterChip({ label, onRemove, color }: { label: string, onRemove: () => void, color: 'blue'|'green'|'purple' }) {
    const colors = {
        blue: "bg-blue-50 text-blue-700 border-blue-100",
        green: "bg-green-50 text-green-700 border-green-100",
        purple: "bg-purple-50 text-purple-700 border-purple-100",
    };
    return (
        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${colors[color]}`}>
            {label}
            <button onClick={onRemove} className="hover:bg-black/10 rounded-full p-0.5"><X size={12} /></button>
        </span>
    );
}

function FilterGroup({ title, icon, loading, children }: any) {
    return (
        <div className="mb-2">
            <h3 className="font-bold text-gray-900 text-sm mb-3 flex items-center gap-2">
                {icon} {title}
            </h3>
            {loading ? (
                <div className="space-y-2 px-1">
                    {[1,2,3].map(i => <div key={i} className="h-6 bg-gray-100 rounded animate-pulse" />)}
                </div>
            ) : (
                <div className="space-y-1 max-h-60 overflow-y-auto pr-1 scrollbar-thin">
                    {children}
                </div>
            )}
        </div>
    );
}

function FilterOption({ label, checked, onChange }: any) {
    return (
        <label className={`flex items-center gap-3 px-2 py-1.5 rounded-lg cursor-pointer transition-colors text-sm group ${checked ? 'bg-blue-50' : 'hover:bg-gray-50'}`}>
            <div className="relative flex items-center">
                <input 
                    type="checkbox" 
                    checked={checked} 
                    onChange={onChange}
                    className="peer appearance-none w-4 h-4 border border-gray-300 rounded checked:bg-blue-600 checked:border-blue-600 transition-all"
                />
                <ChevronRight size={12} className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none inset-0 m-auto" />
            </div>
            <span className={`truncate flex-1 ${checked ? 'font-semibold text-blue-700' : 'text-gray-600 group-hover:text-gray-900'}`}>
                {label}
            </span>
        </label>
    );
}