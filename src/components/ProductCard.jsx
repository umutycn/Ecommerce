import { formatPrice } from "../utils";
import { useCart } from "../context";
import { toast } from "react-hot-toast";

export default function ProductCard({ product, isFavorite = false, onToggleFavorite }) {
  const { addToCart } = useCart();
  const isOutOfStock = !product.inStock;
  const isTrending = (product.popularity ?? 0) >= 90;
  const fallbackImage = `https://placehold.co/1000x1000/f1f5f9/0f172a?text=${encodeURIComponent(
    product.name
  )}`;

  const handleAddToCart = () => {
    if (isOutOfStock) {
      toast.error("Bu urun su an stokta yok.", {
        position: "top-right",
      });
      return;
    }

    addToCart(product);

    toast.success("Urun sepete eklendi!", {
      position: "top-right",
      style: {
        background: "#14532d",
        color: "#ffffff",
        border: "1px solid #166534",
      },
      iconTheme: {
        primary: "#22c55e",
        secondary: "#ffffff",
      },
    });
  };

  const handleToggleFavorite = () => {
    onToggleFavorite?.(product.id);

    toast.success(isFavorite ? "Favorilerden kaldirildi." : "Favorilere eklendi.", {
      position: "top-right",
    });
  };

  return (
    <article
      className={`group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md transition ${
        isOutOfStock ? "opacity-75" : "hover:-translate-y-1 hover:shadow-xl"
      }`}
    >
      <div className="relative flex h-52 items-center justify-center overflow-hidden bg-slate-100 p-2">
        {isTrending && (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-orange-500 px-2.5 py-1 text-xs font-bold text-white shadow">
            Trend
          </span>
        )}
        <img
          src={product.image}
          alt={product.name}
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = fallbackImage;
          }}
          className={`h-full w-full object-contain transition duration-500 ${
            isOutOfStock ? "grayscale" : "group-hover:scale-105"
          }`}
        />
      </div>

      <div className="space-y-3 p-5">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleToggleFavorite}
            className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
              isFavorite
                ? "border-rose-200 bg-rose-100 text-rose-700 hover:bg-rose-200"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
            }`}
          >
            {isFavorite ? "Favoride" : "Favoriye Ekle"}
          </button>
        </div>

        <div className="flex items-center justify-between gap-3 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-indigo-100 px-2.5 py-1 text-indigo-800">
              Populerlik: %{product.popularity ?? "-"}
            </span>
            <span className="rounded-full bg-amber-100 px-2.5 py-1 text-amber-800">
              Puan: {product.rating?.toFixed(1) || "-"}
            </span>
          </div>
          <span
            className={`rounded-full px-2.5 py-1 ${
              isOutOfStock ? "bg-rose-100 text-rose-800" : "bg-emerald-100 text-emerald-800"
            }`}
          >
            {isOutOfStock ? "Stokta Yok" : "Stokta Var"}
          </span>
        </div>

        <h3 className="line-clamp-1 text-lg font-semibold text-slate-900">{product.name}</h3>
        <p className="line-clamp-2 text-sm text-slate-600">{product.description}</p>

        <div className="flex items-center justify-between pt-2">
          <span className="text-lg font-bold text-slate-900">{formatPrice(product.price)}</span>
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {isOutOfStock ? "Stokta Yok" : "Sepete Ekle"}
          </button>
        </div>
      </div>
    </article>
  );
}
