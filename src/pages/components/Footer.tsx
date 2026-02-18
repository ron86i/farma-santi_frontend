export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-50 text-gray-600 border-t border-gray-200">
            <div className="container mx-auto px-6 py-4">
                <div className="pt-2 text-center text-sm text-gray-500">
                    <p>© {currentYear} Farmacia Santi - Tarija, Bolivia. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    );
}