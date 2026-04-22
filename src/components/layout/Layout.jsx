import { useState } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

export function Layout({ children }) {
    return (
        <div className="min-h-screen bg-stone-50 relative flex flex-col font-sans text-stone-900 selection:bg-ochre-light/30">
            <Header />
            <main className="flex-grow pt-24">
                {children}
            </main>
            <Footer />
        </div>
    );
}
