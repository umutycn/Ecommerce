import { useCart } from "../context";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "../utils";
import { useMemo, useState } from "react";
import { useLocalStorage } from "../hooks";
import { StateView } from "../components";

const COUPON_RULES = {
  WELCOME10: {
    label: "%10 indirim",
    type: "percent",
    value: 10,
    minSubtotal: 0,
  },
  SAVE150: {
    label: "150 TL indirim",
    type: "fixed",
    value: 150,
    minSubtotal: 2000,
  },
  MEGA20: {
    label: "%20 indirim (max 1200 TL)",
    type: "percent",
    value: 20,
    maxDiscount: 1200,
    minSubtotal: 5000,
  },
};

const SHIPPING_FEE = 79.9;
const FREE_SHIPPING_THRESHOLD = 3000;

function calculateDiscount(subtotal, coupon) {
  if (!coupon) {
    return 0;
  }

  let discount = coupon.type === "percent" ? subtotal * (coupon.value / 100) : coupon.value;

  if (coupon.maxDiscount) {
    discount = Math.min(discount, coupon.maxDiscount);
  }

  return Math.min(discount, subtotal);
}

export default function Cart() {
  const navigate = useNavigate();
  const { cartItems, cartTotal, addToCart, decreaseQuantity, removeFromCart, clearCart } = useCart();
  const [couponInput, setCouponInput] = useState("");
  const [appliedCouponCode, setAppliedCouponCode] = useLocalStorage("appliedCouponCode", "");
  const [couponMessage, setCouponMessage] = useState("");

  const appliedCoupon = appliedCouponCode ? COUPON_RULES[appliedCouponCode] : null;
  const isAppliedCouponEligible = appliedCoupon ? cartTotal >= appliedCoupon.minSubtotal : false;
  const discountAmount = useMemo(
    () => calculateDiscount(cartTotal, isAppliedCouponEligible ? appliedCoupon : null),
    [cartTotal, appliedCoupon, isAppliedCouponEligible]
  );
  const discountedSubtotal = Math.max(cartTotal - discountAmount, 0);
  const shippingAmount = discountedSubtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const grandTotal = discountedSubtotal + shippingAmount;

  const handleApplyCoupon = () => {
    const normalizedCode = couponInput.trim().toUpperCase();

    if (!normalizedCode) {
      setCouponMessage("Lutfen bir kupon kodu girin.");
      return;
    }

    const coupon = COUPON_RULES[normalizedCode];

    if (!coupon) {
      setCouponMessage("Gecersiz kupon kodu.");
      return;
    }

    if (cartTotal < coupon.minSubtotal) {
      setCouponMessage(
        `Bu kupon icin minimum sepet tutari ${formatPrice(coupon.minSubtotal)} olmalidir.`
      );
      return;
    }

    setAppliedCouponCode(normalizedCode);
    setCouponInput(normalizedCode);
    setCouponMessage(`${normalizedCode} uygulandi: ${coupon.label}`);
  };

  const handleRemoveCoupon = () => {
    setAppliedCouponCode("");
    setCouponInput("");
    setCouponMessage("Kupon kaldirildi.");
  };

  if (cartItems.length === 0) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-16">
        <StateView
          variant="empty"
          title="Sepetiniz Bos"
          description="Sepetiniz henuz bos. Alisverise baslayarak urun ekleyebilirsiniz."
          actionLabel="Alisverise Basla"
          onAction={() => {
            navigate("/");
          }}
        />
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

        <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Kupon Kodu</p>
          <div className="mt-2 flex gap-2">
            <input
              type="text"
              value={couponInput}
              onChange={(event) => setCouponInput(event.target.value)}
              placeholder="Orn: WELCOME10"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-200 focus:ring"
            />
            <button
              type="button"
              onClick={handleApplyCoupon}
              className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
            >
              Uygula
            </button>
          </div>

          <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-600">
            <span className="rounded bg-slate-200 px-2 py-1">WELCOME10</span>
            <span className="rounded bg-slate-200 px-2 py-1">SAVE150 (min 2000 TL)</span>
            <span className="rounded bg-slate-200 px-2 py-1">MEGA20 (min 5000 TL)</span>
          </div>

          {couponMessage && <p className="mt-2 text-xs text-slate-700">{couponMessage}</p>}

          {appliedCoupon && !isAppliedCouponEligible && (
            <p className="mt-2 text-xs text-amber-700">
              Kupon kayitli ancak sepet tutari su an minimum {formatPrice(appliedCoupon.minSubtotal)}
              sartini saglamiyor.
            </p>
          )}

          {appliedCoupon && (
            <button
              type="button"
              onClick={handleRemoveCoupon}
              className="mt-2 text-xs font-semibold text-rose-600 transition hover:text-rose-700"
            >
              Kuponu Kaldir
            </button>
          )}
        </div>

        <div className="mt-4 space-y-3 text-sm text-slate-700">
          <div className="flex items-center justify-between">
            <span>Ara Toplam</span>
            <span className="font-semibold">{formatPrice(cartTotal)}</span>
          </div>
          <div className="flex items-center justify-between text-emerald-700">
            <span>{appliedCouponCode ? `Kupon Indirimi (${appliedCouponCode})` : "Kupon Indirimi"}</span>
            <span className="font-semibold">- {formatPrice(discountAmount)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Kargo</span>
            <span className="font-semibold">
              {shippingAmount === 0 ? `Ucretsiz (>= ${formatPrice(FREE_SHIPPING_THRESHOLD)})` : formatPrice(shippingAmount)}
            </span>
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
