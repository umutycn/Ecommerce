import { formatPrice } from "../utils";

export default function CartSummary({
  couponInput,
  setCouponInput,
  onApplyCoupon,
  couponMessage,
  appliedCoupon,
  isAppliedCouponEligible,
  onRemoveCoupon,
  appliedCouponCode,
  cartTotal,
  discountAmount,
  shippingAmount,
  freeShippingThreshold,
  grandTotal,
}) {
  const couponInputId = "coupon-code";

  return (
    <aside className="mt-8 ml-auto w-full max-w-md rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-bold text-slate-900">Siparis Ozeti</h3>

      <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3">
        <label htmlFor={couponInputId} className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Kupon Kodu
        </label>
        <div className="mt-2 flex gap-2">
          <input
            id={couponInputId}
            type="text"
            value={couponInput}
            onChange={(event) => setCouponInput(event.target.value)}
            placeholder="Orn: WELCOME10"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-200 focus:ring"
          />
          <button
            type="button"
            onClick={onApplyCoupon}
            aria-label="Kupon kodunu uygula"
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

        {couponMessage && (
          <p className="mt-2 text-xs text-slate-700" aria-live="polite">
            {couponMessage}
          </p>
        )}

        {appliedCoupon && !isAppliedCouponEligible && (
          <p className="mt-2 text-xs text-amber-700">
            Kupon kayitli ancak sepet tutari su an minimum {formatPrice(appliedCoupon.minSubtotal)}
            sartini saglamiyor.
          </p>
        )}

        {appliedCoupon && (
          <button
            type="button"
            onClick={onRemoveCoupon}
            aria-label="Uygulanan kuponu kaldir"
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
            {shippingAmount === 0
              ? `Ucretsiz (>= ${formatPrice(freeShippingThreshold)})`
              : formatPrice(shippingAmount)}
          </span>
        </div>
        <div className="flex items-center justify-between border-t border-slate-200 pt-3 text-base text-slate-900">
          <span className="font-bold">Genel Toplam</span>
          <span className="font-bold">{formatPrice(grandTotal)}</span>
        </div>
      </div>
    </aside>
  );
}
