import { useCart } from "../context";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "../utils";
import { useMemo, useState } from "react";
import { useLocalStorage } from "../hooks";
import { CartItemsList, CartSummary, StateView } from "../components";
import {
  COUPON_RULES,
  FREE_SHIPPING_THRESHOLD,
  SHIPPING_FEE,
} from "../constants/couponRules";
import { calculateDiscount } from "../utils/coupon";

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

      <CartItemsList
        cartItems={cartItems}
        addToCart={addToCart}
        decreaseQuantity={decreaseQuantity}
        removeFromCart={removeFromCart}
      />

      <CartSummary
        couponInput={couponInput}
        setCouponInput={setCouponInput}
        onApplyCoupon={handleApplyCoupon}
        couponMessage={couponMessage}
        appliedCoupon={appliedCoupon}
        isAppliedCouponEligible={isAppliedCouponEligible}
        onRemoveCoupon={handleRemoveCoupon}
        appliedCouponCode={appliedCouponCode}
        cartTotal={cartTotal}
        discountAmount={discountAmount}
        shippingAmount={shippingAmount}
        freeShippingThreshold={FREE_SHIPPING_THRESHOLD}
        grandTotal={grandTotal}
      />
    </section>
  );
}
