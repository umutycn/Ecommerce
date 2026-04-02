export function calculateDiscount(subtotal, coupon) {
  if (!coupon) {
    return 0;
  }

  let discount = coupon.type === "percent" ? subtotal * (coupon.value / 100) : coupon.value;

  if (coupon.maxDiscount) {
    discount = Math.min(discount, coupon.maxDiscount);
  }

  return Math.min(discount, subtotal);
}
