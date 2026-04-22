import { Link } from 'react-router-dom';

export function CheckoutLayout({ children }) {
    return (
        <div className="min-h-screen bg-stone-50 flex flex-col">
            {/* Minimal Header */}
            <header className="h-20 flex items-center justify-center border-b border-stone-200 bg-white shadow-sm">
                <Link to="/" className="text-2xl font-serif font-bold tracking-tight text-stone-900">
                    Artisan.
                </Link>
            </header>

            {/* Content */}
            <main className="flex-1 w-full max-w-3xl mx-auto px-6 py-12">
                {children}
            </main>

            {/* Minimal Footer */}
            <footer className="py-6 text-center text-sm text-stone-400">
                <p>© 2025 Craftistan. Secure Checkout.</p>
            </footer>
        </div>
    );
}
