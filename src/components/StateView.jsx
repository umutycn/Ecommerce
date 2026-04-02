export default function StateView({
  variant = "empty",
  title,
  description,
  actionLabel,
  onAction,
}) {
  const variantStyles = {
    loading: "border-blue-200 bg-blue-50 text-blue-900",
    empty: "border-slate-300 bg-slate-50 text-slate-900",
    error: "border-rose-200 bg-rose-50 text-rose-900",
  };

  const defaultTitleByVariant = {
    loading: "Yukleniyor",
    empty: "Icerik Bulunamadi",
    error: "Bir Hata Olustu",
  };

  const defaultDescriptionByVariant = {
    loading: "Veriler hazirlaniyor, lutfen bekleyin.",
    empty: "Bu kriterlere uygun bir sonuc bulunamadi.",
    error: "Lutfen tekrar deneyin.",
  };

  const regionRoleByVariant = {
    loading: "status",
    empty: "status",
    error: "alert",
  };

  const liveByVariant = {
    loading: "polite",
    empty: "polite",
    error: "assertive",
  };

  return (
    <div
      role={regionRoleByVariant[variant] || "status"}
      aria-live={liveByVariant[variant] || "polite"}
      className={`rounded-xl border border-dashed p-6 text-center ${
        variantStyles[variant] || variantStyles.empty
      }`}
    >
      <h2 className="text-lg font-bold">{title || defaultTitleByVariant[variant]}</h2>
      <p className="mt-2 text-sm opacity-90">{description || defaultDescriptionByVariant[variant]}</p>

      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
