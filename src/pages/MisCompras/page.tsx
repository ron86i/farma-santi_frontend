import { useEffect } from "react";
import { useQuery } from "../../hooks/generic";
import { obtenerListaMisCompras } from "../../services/misComprasService";
import { Navbar } from "../components/NavBar";
import { Loader2, FileText, ShoppingBag, Calendar, CreditCard, CheckCircle, Clock } from "lucide-react";

export function MisCompras() {
  const { fetch: fetchCompras, data: listaCompras, loading: loadingCompras } =
    useQuery(obtenerListaMisCompras);

  useEffect(() => {
    fetchCompras();
  }, []);

  const getEstadoIcon = (estado: string) => {
    return estado === "PAGADO" ? (
      <CheckCircle className="w-4 h-4" />
    ) : (
      <Clock className="w-4 h-4" />
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <Navbar searchTerm="" setSearchTerm={() => {}} showSearchTerm={false} />

      <main className="flex-1 container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-blue-600" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Mis Compras</h1>
          </div>
          <p className="text-sm sm:text-base text-gray-600">
            Historial de todas tus compras realizadas
          </p>
        </div>

        {loadingCompras ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-blue-600 w-10 h-10 mb-4" />
            <p className="text-gray-600 font-medium">Cargando compras...</p>
          </div>
        ) : listaCompras && listaCompras.length > 0 ? (
          <>
            {/* Vista Desktop - Tabla */}
            <div className="hidden lg:block overflow-x-auto bg-white shadow-lg rounded-xl border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-blue-50 to-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Código
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Cliente
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Fecha
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Estado
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Total
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Factura
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {listaCompras.map((venta) => (
                    <tr key={venta.id} className="hover:bg-blue-50/50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-gray-900">
                        #{venta.codigo}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {venta.cliente?.razonSocial}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {new Date(venta.fecha).toLocaleDateString("es-ES", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
                            venta.estado === "PAGADO"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {getEstadoIcon(venta.estado)}
                          {venta.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-900 font-semibold">
                        Bs {venta.total.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        {venta.url ? (
                          <a
                            href={venta.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg font-medium text-sm transition-colors"
                          >
                            <FileText className="w-4 h-4" />
                            Ver PDF
                          </a>
                        ) : (
                          <span className="text-gray-400 text-sm">Sin factura</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Vista Tablet - Cards medianas */}
            <div className="hidden sm:grid lg:hidden grid-cols-1 md:grid-cols-2 gap-4">
              {listaCompras.map((venta) => (
                <div
                  key={venta.id}
                  className="bg-white rounded-xl shadow-md border border-gray-200 p-5 hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Código de compra</p>
                      <p className="text-lg font-bold text-gray-900">#{venta.codigo}</p>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
                        venta.estado === "PAGADO"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {getEstadoIcon(venta.estado)}
                      {venta.estado}
                    </span>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700">
                        {new Date(venta.fecha).toLocaleDateString("es-ES", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <CreditCard className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700">{venta.cliente?.razonSocial}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Total</p>
                      <p className="text-xl font-bold text-blue-600">
                        Bs {venta.total.toFixed(2)}
                      </p>
                    </div>
                    {venta.url ? (
                      <a
                        href={venta.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-medium text-sm transition-colors"
                      >
                        <FileText className="w-4 h-4" />
                        Ver Factura
                      </a>
                    ) : (
                      <span className="text-gray-400 text-sm">Sin factura</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Vista Móvil - Cards compactas */}
            <div className="sm:hidden space-y-4">
              {listaCompras.map((venta) => (
                <div
                  key={venta.id}
                  className="bg-white rounded-xl shadow-md border border-gray-200 p-4"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Compra</p>
                      <p className="text-base font-bold text-gray-900">#{venta.codigo}</p>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        venta.estado === "PAGADO"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {getEstadoIcon(venta.estado)}
                      {venta.estado}
                    </span>
                  </div>

                  <div className="space-y-2 mb-3 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="truncate">
                        {new Date(venta.fecha).toLocaleDateString("es-ES", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600">
                      <CreditCard className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="truncate">{venta.cliente?.razonSocial}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Total</p>
                      <p className="text-lg font-bold text-blue-600">
                        Bs {venta.total.toFixed(2)}
                      </p>
                    </div>
                    {venta.url ? (
                      <a
                        href={venta.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-medium text-xs transition-colors"
                      >
                        <FileText className="w-4 h-4" />
                        Ver
                      </a>
                    ) : (
                      <span className="text-gray-400 text-xs">Sin factura</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No tienes compras registradas
            </h3>
            <p className="text-gray-600 text-sm mb-6">
              Comienza a comprar y aquí verás tu historial
            </p>
          </div>
        )}
      </main>
    </div>
  );
}