export function formatPrice(value, locale = "tr-TR", currency = "TRY") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}
