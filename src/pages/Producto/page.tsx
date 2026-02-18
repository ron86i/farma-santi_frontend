import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Helmet } from "react-helmet-async"; 
import { X, Pill, Loader2, Frown, ChevronLeft, ChevronRight, ImageOff } from "lucide-react";
import { useQuery } from "../../hooks/generic";
import { obtenerProductoById } from "../../services/productoService";
import { Navbar } from "../components/NavBar";
import type { ProductoDetail } from "../../models";
import { Footer } from "../components/Footer";

export function ProductoDetalle() {
    const { productoId } = useParams<{ productoId: string }>();
    const { fetch: fetchProducto, data: dataProducto, loading: loadingProducto } = useQuery(obtenerProductoById);
    const [selectedImage, setSelectedImage] = useState<string>("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentModalIndex, setCurrentModalIndex] = useState(0);

    useEffect(() => {
        if (productoId) fetchProducto(productoId);
    }, [productoId]);

    useEffect(() => {
        // Esta lógica está bien, solo se ejecuta si hay fotos.
        if (dataProducto?.urlFotos.length) {
            setSelectedImage(dataProducto.urlFotos[0]);
        }
    }, [dataProducto]);

    const openModal = (imageUrl: string) => {
        const initialIndex = dataProducto?.urlFotos.indexOf(imageUrl) || 0;
        setCurrentModalIndex(initialIndex);
        setIsModalOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setIsModalOpen(false);
        document.body.style.overflow = 'unset';
    };

    const nextImage = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevenir que el evento se propague al modal
        if (dataProducto) {
            setCurrentModalIndex((prev) =>
                prev === dataProducto.urlFotos.length - 1 ? 0 : prev + 1
            );
        }
    };

    const prevImage = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevenir que el evento se propague al modal
        if (dataProducto) {
            setCurrentModalIndex((prev) =>
                prev === 0 ? dataProducto.urlFotos.length - 1 : prev - 1
            );
        }
    };

    const handleThumbnailClick = (e: React.MouseEvent, idx: number) => {
        e.stopPropagation(); // Prevenir que el evento se propague al modal
        setCurrentModalIndex(idx);
    };

    // Navegación con teclado
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isModalOpen) return;

            switch (e.key) {
                case 'Escape':
                    closeModal();
                    break;
                case 'ArrowRight':
                    // Simular clic en next sin evento de mouse
                    if (dataProducto) {
                        setCurrentModalIndex((prev) =>
                            prev === dataProducto.urlFotos.length - 1 ? 0 : prev + 1
                        );
                    }
                    break;
                case 'ArrowLeft':
                    // Simular clic en prev sin evento de mouse
                    if (dataProducto) {
                        setCurrentModalIndex((prev) =>
                            prev === 0 ? dataProducto.urlFotos.length - 1 : prev - 1
                        );
                    }
                    break;
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isModalOpen, dataProducto]);

    if (loadingProducto) {
        return (
            // Nota: Aquí se podría poner un <Helmet> genérico de carga,
            // pero no es estrictamente necesario, ya que solo es un estado transitorio.
            <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
                <Navbar searchTerm="" setSearchTerm={() => { }} showSearchTerm={false} />
                <div className="flex flex-1 items-center justify-center py-32">
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                        <span className="text-gray-700 font-medium text-lg">Cargando producto...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (!dataProducto) {
        return (
            <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
                <Helmet>
                    <title>Producto No Encontrado | Farmacia Santi</title>
                    <meta name="robots" content="noindex" />
                </Helmet> 
               
                <Navbar searchTerm="" setSearchTerm={() => { }} showSearchTerm={false} />
                <div className="flex flex-1 items-center justify-center py-32">
                    <div className="text-center">
                        <Frown className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <span className="text-gray-600 font-medium text-lg block">Producto no encontrado</span>
                        <p className="text-gray-500 mt-2">El producto que buscas no existe o no está disponible</p>
                    </div>
                </div>
            </div>
        );
    }

    const producto: ProductoDetail = dataProducto;
    const stockColor = producto.stock > 10 ? "green" : producto.stock > 0 ? "yellow" : "red";
    
    // 🟢 LÓGICA SEO DINÁMICA 🟢
    
    // Título: Nombre del Producto | Laboratorio | Farmacia Santi
    const seoTitle = `${producto.nombreComercial} | ${producto.laboratorio.nombre} | Farmacia Santi`;
    
    // Descripción: Usar principios activos y categorías para crear una descripción rica
    const categoriasStr = producto.categorias.map(c => c.nombre).join(', ');
    const principiosActivosStr = producto.principiosActivos.map(pa => pa.principioActivo.nombre).join(', ');
    
    let seoDescription = `Comprar ${producto.nombreComercial}.`;
    if (principiosActivosStr) {
        seoDescription += ` Principios activos: ${principiosActivosStr}.`;
    }
    if (categoriasStr) {
        seoDescription += ` Categoría: ${categoriasStr}.`;
    }
    seoDescription += ` Disponible en ${producto.formaFarmaceutica.nombre}.`;
    
    // URL Canónica: Debe ser la URL limpia de este producto
    // Asume que la URL es algo como /producto/ID-o-Slug
    const canonicalUrl = `https://farmaciasanti.net/producto/${productoId}`; 
    
    // Imagen OG: La primera foto del producto para redes sociales
    const ogImage = producto.urlFotos.length > 0 ? producto.urlFotos[0] : 'https://farmaciasanti.net/default-product-image.jpg';


    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
            
            {/* 🟢 IMPLEMENTACIÓN DE REACT HELMET 🟢 */}
            <Helmet>
                <title>{seoTitle}</title>
                <meta name="description" content={seoDescription} />
                <link rel="canonical" href={canonicalUrl} />
                
                {/* Etiquetas Open Graph para compartir en redes sociales */}
                <meta property="og:title" content={seoTitle} />
                <meta property="og:description" content={seoDescription} />
                <meta property="og:type" content="product" />
                <meta property="og:url" content={canonicalUrl} />
                <meta property="og:image" content={ogImage} />
                
                {/* Opcional: Etiquetas de Twitter Card */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={seoTitle} />
                <meta name="twitter:description" content={seoDescription} />
                <meta name="twitter:image" content={ogImage} />
            </Helmet>
            {/* ------------------------------------- */}
            
            <Navbar searchTerm="" setSearchTerm={() => { }} showSearchTerm={false} />

            <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col lg:flex-row gap-8 sm:gap-12">
                {/* Galería de imágenes */}
                <div className="flex-1 flex flex-col items-center gap-6">
                    {producto.urlFotos.length > 0 ? (
                        // ... (Resto de tu galería de imágenes)
                        <>
                            <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-lg">
                                <img
                                    src={selectedImage}
                                    alt={producto.nombreComercial}
                                    className="w-full h-80 object-contain rounded-lg transition-transform duration-300 hover:scale-105 cursor-zoom-in"
                                    onClick={() => openModal(selectedImage)}
                                />
                            </div>

                            {producto.urlFotos.length > 1 && (
                                <div className="bg-white rounded-2xl shadow-lg p-4 w-full max-w-lg">
                                    <h3 className="text-sm font-semibold text-gray-600 mb-3 text-center">Imágenes del producto</h3>
                                    <div className="flex gap-3 overflow-x-auto pb-2">
                                        {producto.urlFotos.map((img, idx) => (
                                            <img
                                                key={idx}
                                                src={img+"?timestamp="+Date.now()}
                                                alt={`Foto ${idx + 1}`}
                                                className={`w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg cursor-pointer transition-all duration-200 flex-shrink-0 ${selectedImage === img
                                                    ? "ring-4 ring-blue-500 ring-opacity-60 scale-105"
                                                    : "ring-2 ring-gray-200 hover:ring-blue-300"
                                                    }`}
                                                onClick={() => setSelectedImage(img)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        // ... (Contenido para sin imágenes)
                        <>
                            <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-lg">
                                <div className="w-full h-80 flex flex-col items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                                    <ImageOff className="w-16 h-16 text-gray-400 mb-3" />
                                    <span className="text-gray-500 font-medium">Sin imágenes</span>
                                    <span className="text-sm text-gray-400 mt-1">Este producto no tiene fotos disponibles.</span>
                                </div>
                            </div>
                        </>
                    )}

                </div>

                {/* Información de venta */}
                <div className="flex-1">
                    <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
                        {/* Header */}
                        <div className="border-b border-gray-200 pb-6 mb-6">
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">{producto.nombreComercial}</h1>

                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {producto.formaFarmaceutica.nombre}
                                </span>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    {producto.laboratorio.nombre}
                                </span>
                            </div>
                        </div>

                        {/* Precio y Stock */}
                        <div className="mb-6">
                            <div className="flex items-baseline gap-3 mb-2">
                                <span className="text-3xl font-bold text-blue-600">Bs {producto.precioVenta.toFixed(2)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`inline-flex items-center text-sm font-medium px-2.5 py-0.5 rounded-full bg-${stockColor}-100 text-${stockColor}-800`}>
                                    <span className={`w-2 h-2 rounded-full mr-1 bg-${stockColor}-500`}></span>
                                    {producto.stock > 0 ? `${producto.stock} en stock` : "Sin stock"}
                                </span>
                            </div>
                        </div>

                        {/* Información detallada */}
                        <div className="space-y-6">
                            {/* Información básica */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                <div className="flex flex-col gap-1">
                                    <span className="font-semibold text-gray-700">Forma farmacéutica</span>
                                    <span className="text-gray-600">{producto.formaFarmaceutica.nombre}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="font-semibold text-gray-700">Laboratorio</span>
                                    <span className="text-gray-600">{producto.laboratorio.nombre}</span>
                                </div>
                            </div>
                            {/* Categorías */}
                            {producto.categorias.length > 0 && (
                                <div>
                                    <h3 className="font-semibold text-gray-900 text-lg mb-3">Categorías</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {producto.categorias.map((categoria, index) => (
                                            <span
                                                key={index}
                                                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                                            >
                                                {categoria.nombre}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Principios activos */}
                            {producto.principiosActivos.length > 0 && (
                                <div>
                                    <h3 className="font-semibold text-gray-900 text-lg mb-3 flex items-center gap-2">
                                        <Pill className="w-5 h-5 text-blue-500" />
                                        Principios activos
                                    </h3>
                                    <div className="bg-blue-50 rounded-lg p-4">
                                        <ul className="space-y-2">
                                            {producto.principiosActivos.map((pa, idx) => (
                                                <li key={idx} className="flex justify-between items-center text-sm">
                                                    <span className="font-medium text-gray-700">{pa.principioActivo.nombre}</span>
                                                    <span className="text-gray-600 bg-white px-2 py-1 rounded-md">
                                                        {pa.concentracion} {pa.unidadMedida.abreviatura || pa.unidadMedida.nombre}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal para imagen expandida con carrusel */}
            {isModalOpen && dataProducto && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 animate-in fade-in duration-300"
                    onClick={closeModal}
                >
                    <div className="flex flex-col items-center w-full max-w-6xl">
                        {/* Encabezado del modal */}
                        <div className="w-full flex justify-between items-center px-4">
                            {/* Contador de imágenes */}
                            {producto.urlFotos.length > 1 && (
                                <div className="bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                                    {currentModalIndex + 1} / {producto.urlFotos.length}
                                </div>
                            )}

                            {/* Botón de cerrar */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    closeModal();
                                }}
                                className="bg-white/20 hover:bg-white/30 text-white rounded-full p-2.5 transition-all duration-200 backdrop-blur-sm group"
                                aria-label="Cerrar imagen"
                            >
                                <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-200" />
                            </button>
                        </div>

                        {/* Área de imagen principal con controles */}
                        <div className="relative w-full flex items-center justify-center">
                            {/* Botón anterior */}
                            {producto.urlFotos.length > 1 && (
                                <button
                                    onClick={prevImage}
                                    className="absolute left-4 z-20 bg-white/20 hover:bg-white/30 text-white rounded-full p-3 transition-all duration-200 backdrop-blur-sm group"
                                    aria-label="Imagen anterior"
                                >
                                    <ChevronLeft className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
                                </button>
                            )}

                            {/* Imagen actual */}
                            <div className="flex-1 flex justify-center">
                                <img
                                    src={producto.urlFotos[currentModalIndex]}
                                    alt={`${producto.nombreComercial} - Imagen ${currentModalIndex + 1}`}
                                    className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-300"
                                />
                            </div>

                            {/* Botón siguiente */}
                            {producto.urlFotos.length > 1 && (
                                <button
                                    onClick={nextImage}
                                    className="absolute right-4 z-20 bg-white/20 hover:bg-white/30 text-white rounded-full p-3 transition-all duration-200 backdrop-blur-sm group"
                                    aria-label="Imagen siguiente"
                                >
                                    <ChevronRight className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
                                </button>
                            )}
                        </div>

                        {/* Miniaturas separadas de la imagen */}
                        {producto.urlFotos.length > 1 && (
                            <div className="w-full max-w-2xl px-4">
                                <div className="flex gap-3 overflow-x-auto py-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                                    {producto.urlFotos.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={(e) => handleThumbnailClick(e, idx)}
                                            className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden transition-all duration-200 border-2 ${currentModalIndex === idx
                                                ? "border-white scale-110 shadow-lg"
                                                : "border-gray-400 opacity-70 hover:opacity-100 hover:scale-105"
                                                }`}
                                        >
                                            <img
                                                src={img}
                                                alt={`Miniatura ${idx + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
            {/* Footer */}
            <Footer />
        </div>
    );
}