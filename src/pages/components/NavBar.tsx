import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { Menu, X, Search, LogOut, LogIn, User, ShoppingCart } from "lucide-react";
import logoFarmacia from "@/assets/Logo2.png";

interface NavbarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  showSearchTerm?: boolean;
}

export function Navbar({ searchTerm, setSearchTerm, showSearchTerm = true }: NavbarProps) {
  const navigate = useNavigate();
  const [isLogged, setIsLogged] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLogged(true);
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUserEmail(payload.email || null);
      } catch {
        setUserEmail(null);
      }
    } else {
      setIsLogged(false);
      setUserEmail(null);
    }
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLogged(false);
    setUserEmail(null);
    navigate("/login");
    setMobileMenuOpen(false);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16 sm:h-18 md:h-20">
            {/* Logo */}
            <div
              className="flex items-center gap-2 sm:gap-3 cursor-pointer group flex-shrink-0"
              onClick={() => handleNavigation("/")}
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 flex items-center justify-center transition-transform transform group-hover:scale-105">
                <img
                  src={logoFarmacia}
                  alt="Logo Farmacia Santi"
                  className="w-full h-full object-contain rounded-lg sm:rounded-xl"
                />
              </div>
              <div className="transition-colors group-hover:text-blue-600">
                <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900 leading-tight">
                  Farmacia Santi
                </h1>
                <p className="text-[10px] sm:text-xs text-gray-500 hidden sm:block">
                  Cuidando tu salud
                </p>
              </div>
            </div>

            {/* Búsqueda Desktop y Tablet grande */}
            {showSearchTerm && (
              <div className="hidden md:flex items-center flex-1 max-w-sm lg:max-w-md xl:max-w-lg mx-4 lg:mx-8">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 lg:w-5 lg:h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar productos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 lg:pl-10 pr-4 py-2 lg:py-2.5 text-sm lg:text-base rounded-lg border border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
                  />
                </div>
              </div>
            )}

            {/* Botones Desktop y Tablet grande */}
            <div className="hidden md:flex items-center gap-2 lg:gap-3 flex-shrink-0">
              {isLogged ? (
                <>
                  {/* Botón Mis Compras */}
                  <button
                    onClick={() => handleNavigation("/mis-compras")}
                    className="flex items-center gap-1.5 lg:gap-2 px-3 lg:px-4 py-2 lg:py-2.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-medium text-sm lg:text-base"
                  >
                    <ShoppingCart />
                    Mis Compras
                  </button>

                  <div className="hidden lg:flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
                    <User className="w-4 h-4 text-gray-600" />
                    <span className="text-gray-700 text-sm font-medium max-w-[120px] xl:max-w-[150px] truncate">
                      {userEmail || "Usuario"}
                    </span>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 lg:gap-2 px-3 lg:px-5 py-2 lg:py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium shadow-sm hover:shadow-md text-sm lg:text-base"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden lg:inline">Cerrar sesión</span>
                    <span className="lg:hidden">Salir</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleNavigation("/login")}
                  className="flex items-center gap-1.5 lg:gap-2 px-3 lg:px-5 py-2 lg:py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm hover:shadow-md text-sm lg:text-base"
                >
                  <LogIn className="w-4 h-4" />
                  Ingresar
                </button>
              )}
            </div>

            {/* Botón menú móvil y tablet pequeño */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
              aria-label="Menú"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>

          {/* Búsqueda móvil y tablet pequeño (debajo del header) */}
          {showSearchTerm && (
            <div className="md:hidden pb-3">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
                />
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Overlay del menú móvil */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 z-[60] animate-in fade-in duration-200"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Menú lateral móvil */}
      <div
        className={`md:hidden fixed top-0 right-0 bottom-0 w-[280px] sm:w-80 bg-white shadow-2xl z-[70] transform transition-transform duration-300 ease-out ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <div className="flex flex-col h-full">
          {/* Header del menú */}
          <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Menú</h2>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-white/80 transition-colors"
              aria-label="Cerrar menú"
            >
              <X className="w-6 h-6 text-gray-700" />
            </button>
          </div>

          {/* Contenido del menú */}
          <div className="flex-1 p-4 sm:p-5 space-y-4 overflow-y-auto">
            {isLogged ? (
              <>
                {/* Botón Mis Compras */}
                <button
                  onClick={() => handleNavigation("/mis-compras")}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-medium shadow-sm text-sm"
                >
                  <ShoppingCart />
                  Mis Compras
                </button>

                {/* Info usuario */}
                <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                  <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-blue-700" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-gray-600 font-medium mb-0.5">Conectado como</p>
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {userEmail || "Usuario"}
                    </p>
                  </div>
                </div>

                {/* Botón Logout */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 active:bg-red-700 transition-colors font-medium shadow-sm active:scale-[0.98] text-sm"
                >
                  <LogOut className="w-4 h-4" />
                  Cerrar sesión
                </button>
              </>
            ) : (
              <button
                onClick={() => handleNavigation("/login")}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors font-medium shadow-sm active:scale-[0.98] text-sm"
              >
                <LogIn className="w-4 h-4" />
                Ingresar
              </button>
            )}

            {/* Información adicional */}
            <div className="mt-8 pt-4 border-t border-gray-200">
              <div className="space-y-1.5 text-center">
                <p className="text-sm font-semibold text-gray-900">Farmacia Santi</p>
                <p className="text-xs text-gray-500">Cuidando tu salud con dedicación</p>
              </div>
            </div>
          </div>

          {/* Footer del menú */}
          <div className="p-4 sm:p-5 border-t border-gray-200 bg-gray-50">
            <p className="text-xs text-gray-500 text-center">
              © 2025 Farmacia Santi
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
