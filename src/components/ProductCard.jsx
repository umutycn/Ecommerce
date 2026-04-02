import { formatPrice } from "../utils";
import { useCart } from "../context";
import { toast } from "react-hot-toast";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
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

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-52 overflow-hidden bg-slate-100">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>

      <div className="space-y-3 p-5">
        <h3 className="line-clamp-1 text-lg font-semibold text-slate-900">{product.name}</h3>
        <p className="line-clamp-2 text-sm text-slate-600">{product.description}</p>

        <div className="flex items-center justify-between pt-2">
          <span className="text-lg font-bold text-slate-900">{formatPrice(product.price)}</span>
          <button
            type="button"
            onClick={handleAddToCart}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            Sepete Ekle
          </button>
        </div>
      </div>
    </article>
  );
}
