import ProductCard from "./ProductCard";
import StateView from "./StateView";

export default function ProductGrid({
  isLoading,
  products,
  favoriteProductIds,
  onToggleFavorite,
}) {
  if (isLoading) {
    return (
      <div className="mt-6">
        <StateView
          variant="loading"
          title="Urunler Yukleniyor"
          description="Urun listesi hazirlaniyor. Lutfen kisa bir sure bekleyin."
        />
      </div>
    );
  }

  return (
    <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          isFavorite={favoriteProductIds.includes(product.id)}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </section>
  );
}
