export default function ProductFilters({
  productQuery,
  onQueryChange,
  onClearFilters,
  hasActiveFilters,
  visibleCount,
  searchSuggestions,
  isSuggestionOpen,
  setIsSuggestionOpen,
  highlightedSuggestionIndex,
  setHighlightedSuggestionIndex,
  onSuggestionSelect,
  onSuggestionKeyDown,
}) {
  const searchInputId = "product-search";
  const suggestionListId = "search-suggestion-list";
  const categoryInputId = "product-category";
  const sortInputId = "product-sort";
  const minPriceInputId = "product-min-price";
  const maxPriceInputId = "product-max-price";
  const minRatingInputId = "product-min-rating";
  const inStockOnlyInputId = "product-instock-only";
  const favoritesOnlyInputId = "product-favorites-only";

  return (
    <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-8">
        <label htmlFor={searchInputId} className="relative flex flex-col gap-2 text-sm text-slate-700">
          Urun Ara
          <input
            id={searchInputId}
            type="search"
            value={productQuery.search}
            onChange={(event) => {
              onQueryChange("search", event.target.value);
              setIsSuggestionOpen(true);
              setHighlightedSuggestionIndex(-1);
            }}
            onFocus={() => setIsSuggestionOpen(true)}
            onKeyDown={onSuggestionKeyDown}
            onBlur={() => {
              setTimeout(() => {
                setIsSuggestionOpen(false);
              }, 120);
            }}
            placeholder="Orn: kulaklik"
            className="rounded-lg border border-slate-300 px-3 py-2 outline-none ring-slate-200 transition focus:ring"
            autoComplete="off"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={isSuggestionOpen && searchSuggestions.length > 0}
            aria-controls={suggestionListId}
            aria-activedescendant={
              highlightedSuggestionIndex >= 0
                ? `search-suggestion-${highlightedSuggestionIndex}`
                : undefined
            }
          />

          {isSuggestionOpen && searchSuggestions.length > 0 && (
            <ul
              id={suggestionListId}
              role="listbox"
              aria-label="Arama onerileri"
              className="absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg"
            >
              {searchSuggestions.map((suggestion, index) => (
                <li
                  id={`search-suggestion-${index}`}
                  role="option"
                  aria-selected={highlightedSuggestionIndex === index}
                  key={suggestion}
                >
                  <button
                    type="button"
                    onMouseDown={(event) => {
                      event.preventDefault();
                    }}
                    onClick={() => onSuggestionSelect(suggestion)}
                    tabIndex={-1}
                    className={`w-full px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-100 ${
                      highlightedSuggestionIndex === index ? "bg-slate-100" : ""
                    }`}
                  >
                    {suggestion}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </label>

        <label htmlFor={categoryInputId} className="flex flex-col gap-2 text-sm text-slate-700">
          Kategori
          <select
            id={categoryInputId}
            value={productQuery.category}
            onChange={(event) => onQueryChange("category", event.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 outline-none ring-slate-200 transition focus:ring"
          >
            <option value="all">Tum Kategoriler</option>
            <option value="ses">Ses</option>
            <option value="cevre-birim">Cevre Birimleri</option>
          </select>
        </label>

        <label htmlFor={sortInputId} className="flex flex-col gap-2 text-sm text-slate-700">
          Siralama
          <select
            id={sortInputId}
            value={productQuery.sortBy}
            onChange={(event) => onQueryChange("sortBy", event.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 outline-none ring-slate-200 transition focus:ring"
          >
            <option value="popularity-desc">Populerlik (Yuksek)</option>
            <option value="price-asc">Fiyat (Artan)</option>
            <option value="price-desc">Fiyat (Azalan)</option>
            <option value="rating-desc">Puan (Yuksek)</option>
            <option value="rating-asc">Puan (Dusuk)</option>
          </select>
        </label>

        <label htmlFor={minPriceInputId} className="flex flex-col gap-2 text-sm text-slate-700">
          Min Fiyat
          <input
            id={minPriceInputId}
            type="number"
            min="0"
            value={productQuery.minPrice}
            onChange={(event) => onQueryChange("minPrice", event.target.value)}
            placeholder="Orn: 1500"
            className="rounded-lg border border-slate-300 px-3 py-2 outline-none ring-slate-200 transition focus:ring"
          />
        </label>

        <label htmlFor={maxPriceInputId} className="flex flex-col gap-2 text-sm text-slate-700">
          Max Fiyat
          <input
            id={maxPriceInputId}
            type="number"
            min="0"
            value={productQuery.maxPrice}
            onChange={(event) => onQueryChange("maxPrice", event.target.value)}
            placeholder="Orn: 3500"
            className="rounded-lg border border-slate-300 px-3 py-2 outline-none ring-slate-200 transition focus:ring"
          />
        </label>

        <label htmlFor={minRatingInputId} className="flex flex-col gap-2 text-sm text-slate-700">
          Min Puan
          <select
            id={minRatingInputId}
            value={productQuery.minRating}
            onChange={(event) => onQueryChange("minRating", event.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 outline-none ring-slate-200 transition focus:ring"
          >
            <option value="all">Tum Puanlar</option>
            <option value="4">4.0 ve Uzeri</option>
            <option value="4.5">4.5 ve Uzeri</option>
          </select>
        </label>

        <label
          htmlFor={inStockOnlyInputId}
          className={`self-end flex h-10 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg border px-3 text-sm font-medium transition ${
            productQuery.inStockOnly
              ? "border-emerald-300 bg-emerald-50 text-emerald-700"
              : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
          }`}
          title="Sadece stokta olan urunleri goster"
        >
          <input
            id={inStockOnlyInputId}
            type="checkbox"
            checked={productQuery.inStockOnly}
            onChange={(event) => onQueryChange("inStockOnly", event.target.checked)}
            className="sr-only"
          />
          <span className="text-base leading-none">Stokta</span>
        </label>

        <label
          htmlFor={favoritesOnlyInputId}
          className={`self-end flex h-10 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg border px-3 text-sm font-medium transition ${
            productQuery.favoritesOnly
              ? "border-rose-300 bg-rose-50 text-rose-700"
              : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
          }`}
          title="Sadece favori urunleri goster"
        >
          <input
            id={favoritesOnlyInputId}
            type="checkbox"
            checked={productQuery.favoritesOnly}
            onChange={(event) => onQueryChange("favoritesOnly", event.target.checked)}
            className="sr-only"
          />
          <span className="text-base leading-none">Favoriler</span>
        </label>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500" aria-live="polite">
          {visibleCount} urun listeleniyor.
        </p>
        <button
          type="button"
          onClick={onClearFilters}
          disabled={!hasActiveFilters}
          aria-label="Tum filtreleri temizle"
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Filtreleri Temizle
        </button>
      </div>
    </section>
  );
}
