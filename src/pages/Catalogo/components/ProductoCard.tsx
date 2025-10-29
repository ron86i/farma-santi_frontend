import { AlertCircle, Package } from "lucide-react";
import type { ProductoInfo } from "../../../models";

interface ProductoCardProps {
  product: ProductoInfo;
  onClick?: () => void;
}

export function ProductoCard({ product, onClick }: ProductoCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl 
        transition-all duration-300 border border-gray-100 group cursor-pointer
        hover:-translate-y-1"
    >
      <div className="relative h-52 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
        <img
          src={product.urlFoto}
          alt={product.nombreComercial}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80";
          }}
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 
            group-hover:opacity-100 transition-opacity duration-300"
        />

        {product.stock <= product.stockMin ? (
          <div className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-red-600 
            text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg
            flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" />
            Stock bajo
          </div>
        ) : product.stock < 20 ? (
          <div className="absolute top-3 right-3 bg-gradient-to-r from-orange-500 to-orange-600 
            text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
            Pocas unidades
          </div>
        ) : null}
      </div>

      <div className="p-5">
        <span className="inline-block bg-gradient-to-r from-blue-50 to-purple-50 
          text-blue-700 text-xs px-3 py-1 rounded-full mb-2 font-semibold border border-blue-100">
          {product.formaFarmaceutica}
        </span>
        <h4 className="text-base font-bold text-gray-900 mb-1.5 line-clamp-2 
          group-hover:text-blue-600 transition-colors">
          {product.nombreComercial}
        </h4>
        <p className="text-sm text-gray-500 mb-2 font-medium">{product.laboratorio}</p>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Package className="w-4 h-4" />
            <span className="font-medium">Stock: {product.stock}</span>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r text-blue-600
            bg-clip-text">
            Bs{product.precioVenta.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
