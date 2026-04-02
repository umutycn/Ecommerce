import { useCart } from "../context";
import { Link } from "react-router-dom";
import { formatPrice } from "../utils";

export default function Cart() {
  const { cartItems, cartTotal, addToCart, decreaseQuantity, removeFromCart, clearCart } = useCart();

  const taxAmount = cartTotal * 0.2;
  const grandTotal = cartTotal + taxAmount;

  if (cartItems.length === 0) {
    return (
      <section className="mx-auto flex max-w-3xl flex-col items-center px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-slate-900">Sepetiniz Bos</h1>
        <p className="mt-3 max-w-xl text-slate-600">
          Sepetiniz henuz bos. Alisverise baslamak ister misiniz?
        </p>
        <Link
          to="/"
          className="mt-7 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-slate-700"
        >
          Alisverise Basla
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Sepetim</h1>
        <button
          type="button"
          className="rounded-md border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
          onClick={clearCart}
        >
          Sepeti Temizle
        </button>
      </div>

      <ul className="space-y-3">
        {cartItems.map((item) => (
          <li
            key={item.id}
            className="grid gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_auto_auto] md:items-center"
          >
            <div>
              <h2 className="font-semibold text-slate-900">{item.name}</h2>
              <p className="mt-1 text-sm text-slate-600">Birim Fiyat: {formatPrice(item.price)}</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                className="h-8 w-8 rounded-md border border-slate-300 text-lg font-semibold text-slate-700 transition hover:bg-slate-100"
                onClick={() => decreaseQuantity(item.id)}
              >
                -
              </button>
              <span className="min-w-6 text-center text-sm font-semibold text-slate-900">{item.quantity}</span>
              <button
                type="button"
                className="h-8 w-8 rounded-md border border-slate-300 text-lg font-semibold text-slate-700 transition hover:bg-slate-100"
                onClick={() => addToCart(item)}
              >
                +
              </button>
            </div>

            <div className="flex items-center justify-between gap-4 md:justify-end">
              <span className="font-semibold text-slate-900">
                {formatPrice(item.price * (item.quantity ?? 1))}
              </span>
              <button
                type="button"
                className="text-sm font-medium text-red-600 transition hover:text-red-700"
                onClick={() => removeFromCart(item.id)}
              >
                Sil
              </button>
            </div>
          </li>
        ))}
      </ul>

      <aside className="mt-8 ml-auto w-full max-w-md rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900">Siparis Ozeti</h3>

        <div className="mt-4 space-y-3 text-sm text-slate-700">
          <div className="flex items-center justify-between">
            <span>Ara Toplam</span>
            <span className="font-semibold">{formatPrice(cartTotal)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>KDV (%20)</span>
            <span className="font-semibold">{formatPrice(taxAmount)}</span>
          </div>
          <div className="flex items-center justify-between border-t border-slate-200 pt-3 text-base text-slate-900">
            <span className="font-bold">Genel Toplam</span>
            <span className="font-bold">{formatPrice(grandTotal)}</span>
          </div>
        </div>
      </aside>
    </section>
  );
}
