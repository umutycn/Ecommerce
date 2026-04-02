import { formatPrice } from "../utils";

export default function CartItemsList({
  cartItems,
  addToCart,
  decreaseQuantity,
  removeFromCart,
}) {
  return (
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
              aria-label={`${item.name} adet azalt`}
            >
              -
            </button>
            <span className="min-w-6 text-center text-sm font-semibold text-slate-900">{item.quantity}</span>
            <button
              type="button"
              className="h-8 w-8 rounded-md border border-slate-300 text-lg font-semibold text-slate-700 transition hover:bg-slate-100"
              onClick={() => addToCart(item)}
              aria-label={`${item.name} adet artir`}
            >
              +
            </button>
          </div>

          <div className="flex items-center justify-between gap-4 md:justify-end">
            <span className="font-semibold text-slate-900">{formatPrice(item.price * (item.quantity ?? 1))}</span>
            <button
              type="button"
              className="text-sm font-medium text-red-600 transition hover:text-red-700"
              onClick={() => removeFromCart(item.id)}
              aria-label={`${item.name} urununu sepetten sil`}
            >
              Sil
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
