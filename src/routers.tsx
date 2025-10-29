import { BrowserRouter, Route, Routes } from "react-router";
import { Main } from "./pages/Main/page";
import { Catalogo } from "./pages/Catalogo/page";
import { ProductoDetalle } from "./pages/Producto/page";
import { Login } from "./pages/Login/page";
import { MisCompras } from "./pages/MisCompras/page";


export function Routers() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />

                {/* Rutas protegidas */}
                <Route >
                    <Route path="/" element={<Main />} />
                    <Route path="/catalogo" element={<Catalogo />} />
                    <Route path="/productos/:productoId" element={<ProductoDetalle />} />
                    <Route path="/mis-compras" element={<MisCompras />} />
                </Route>

                {/* Ruta por defecto */}
                <Route path="*" />
            </Routes>

        </BrowserRouter>
    )
}