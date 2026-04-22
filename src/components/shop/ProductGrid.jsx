import { ProductCard } from '../ui/ProductCard';

export function ProductGrid({ products }) {
    if (!products || products.length === 0) {
        return (
            <div className="text-center py-20 text-stone-400">
                <p>No artisans found.</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
                <ProductCard
                    key={product.id}
                    image={product.image}
                    title={product.title}
                    creator={product.creator}
                    price={product.price}
                    isVerified={product.isVerified}
                />
            ))}
        </div>
    );
}
