import { ProductCard, StateView } from "../components";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { demoProducts } from "../data/demoProducts";
import { useLocalStorage } from "../hooks";

const DEFAULT_PRODUCT_QUERY = {
  search: "",
  category: "all",
  sortBy: "popularity-desc",
  minPrice: "",
  maxPrice: "",
  minRating: "all",
  inStockOnly: false,
  favoritesOnly: false,
};

const VALID_CATEGORIES = new Set(["all", "ses", "cevre-birim"]);
const VALID_SORT_OPTIONS = new Set([
  "popularity-desc",
  "price-asc",
  "price-desc",
  "rating-desc",
  "rating-asc",
]);
const VALID_MIN_RATINGS = new Set(["all", "4", "4.5"]);

function getQueryFromSearchParams(searchParams) {
  const search = (searchParams.get("q") || "").trim();
  const category = searchParams.get("category") || DEFAULT_PRODUCT_QUERY.category;
  const sortBy = searchParams.get("sort") || DEFAULT_PRODUCT_QUERY.sortBy;
  const minPriceParam = (searchParams.get("minPrice") || "").trim();
  const maxPriceParam = (searchParams.get("maxPrice") || "").trim();
  const minRatingParam = searchParams.get("minRating") || DEFAULT_PRODUCT_QUERY.minRating;
  const inStockOnlyParam = searchParams.get("inStock") || "0";
  const favoritesOnlyParam = searchParams.get("favorites") || "0";

  const parsedMinPrice = Number(minPriceParam);
  const parsedMaxPrice = Number(maxPriceParam);
  const minPrice =
    minPriceParam && Number.isFinite(parsedMinPrice) && parsedMinPrice >= 0
      ? String(Math.floor(parsedMinPrice))
      : "";
  const maxPrice =
    maxPriceParam && Number.isFinite(parsedMaxPrice) && parsedMaxPrice >= 0
      ? String(Math.floor(parsedMaxPrice))
      : "";

  return {
    search,
    category: VALID_CATEGORIES.has(category) ? category : DEFAULT_PRODUCT_QUERY.category,
    sortBy: VALID_SORT_OPTIONS.has(sortBy) ? sortBy : DEFAULT_PRODUCT_QUERY.sortBy,
    minPrice,
    maxPrice,
    minRating: VALID_MIN_RATINGS.has(minRatingParam)
      ? minRatingParam
      : DEFAULT_PRODUCT_QUERY.minRating,
    inStockOnly: inStockOnlyParam === "1",
    favoritesOnly: favoritesOnlyParam === "1",
  };
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [products, setProducts] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [productQuery, setProductQuery] = useState(() => getQueryFromSearchParams(searchParams));
  const [favoriteProductIds, setFavoriteProductIds] = useLocalStorage("favoriteProductIds", []);
  const [isSuggestionOpen, setIsSuggestionOpen] = useState(false);
  const [highlightedSuggestionIndex, setHighlightedSuggestionIndex] = useState(-1);

  const startLoading = () => {
    setIsLoading(true);
    setLoadError("");

    const timer = setTimeout(() => {
      try {
        if (!Array.isArray(demoProducts)) {
          throw new Error("Urun verisi okunamadi.");
        }

        setProducts(demoProducts);
        setIsLoading(false);
      } catch {
        setLoadError("Urunler yuklenirken bir sorun olustu.");
        setIsLoading(false);
      }
    }, 900);

    return timer;
  };

  useEffect(() => {
    const timer = startLoading();

    return () => clearTimeout(timer);
  }, [loadAttempt]);

  useEffect(() => {
    const nextQuery = getQueryFromSearchParams(searchParams);

    setProductQuery((prev) => {
      const isSameQuery =
        prev.search === nextQuery.search &&
        prev.category === nextQuery.category &&
        prev.sortBy === nextQuery.sortBy &&
        prev.minPrice === nextQuery.minPrice &&
        prev.maxPrice === nextQuery.maxPrice &&
        prev.minRating === nextQuery.minRating &&
        prev.inStockOnly === nextQuery.inStockOnly &&
        prev.favoritesOnly === nextQuery.favoritesOnly;

      return isSameQuery ? prev : nextQuery;
    });
  }, [searchParams]);

  useEffect(() => {
    const nextParams = new URLSearchParams();

    if (productQuery.search) {
      nextParams.set("q", productQuery.search);
    }

    if (productQuery.category !== DEFAULT_PRODUCT_QUERY.category) {
      nextParams.set("category", productQuery.category);
    }

    if (productQuery.sortBy !== DEFAULT_PRODUCT_QUERY.sortBy) {
      nextParams.set("sort", productQuery.sortBy);
    }

    if (productQuery.minPrice) {
      nextParams.set("minPrice", productQuery.minPrice);
    }

    if (productQuery.maxPrice) {
      nextParams.set("maxPrice", productQuery.maxPrice);
    }

    if (productQuery.minRating !== DEFAULT_PRODUCT_QUERY.minRating) {
      nextParams.set("minRating", productQuery.minRating);
    }

    if (productQuery.inStockOnly) {
      nextParams.set("inStock", "1");
    }

    if (productQuery.favoritesOnly) {
      nextParams.set("favorites", "1");
    }

    const currentParamString = searchParams.toString();
    const nextParamString = nextParams.toString();

    if (currentParamString !== nextParamString) {
      setSearchParams(nextParams, { replace: true });
    }
  }, [productQuery, searchParams, setSearchParams]);

  const handleQueryChange = (field, value) => {
    setProductQuery((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleClearFilters = () => {
    setProductQuery(DEFAULT_PRODUCT_QUERY);
    setIsSuggestionOpen(false);
  };

  const handleSuggestionSelect = (suggestion) => {
    setProductQuery((prev) => ({
      ...prev,
      search: suggestion,
    }));
    setIsSuggestionOpen(false);
  };

  const handleToggleFavorite = (productId) => {
    setFavoriteProductIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const hasActiveFilters =
    productQuery.search !== DEFAULT_PRODUCT_QUERY.search ||
    productQuery.category !== DEFAULT_PRODUCT_QUERY.category ||
    productQuery.sortBy !== DEFAULT_PRODUCT_QUERY.sortBy ||
    productQuery.minPrice !== DEFAULT_PRODUCT_QUERY.minPrice ||
    productQuery.maxPrice !== DEFAULT_PRODUCT_QUERY.maxPrice ||
    productQuery.minRating !== DEFAULT_PRODUCT_QUERY.minRating ||
    productQuery.inStockOnly !== DEFAULT_PRODUCT_QUERY.inStockOnly ||
    productQuery.favoritesOnly !== DEFAULT_PRODUCT_QUERY.favoritesOnly;

  const normalizedSearch = productQuery.search.trim().toLowerCase();
  const minPrice = productQuery.minPrice ? Number(productQuery.minPrice) : null;
  const maxPrice = productQuery.maxPrice ? Number(productQuery.maxPrice) : null;
  const minRating = productQuery.minRating === "all" ? null : Number(productQuery.minRating);
  const searchSuggestions = Array.from(
    new Set(
      products
        .filter((product) => {
          if (!normalizedSearch) {
            return false;
          }

          return product.name.toLowerCase().includes(normalizedSearch);
        })
        .map((product) => product.name)
    )
  )
    .filter((name) => name.toLowerCase() !== normalizedSearch)
    .slice(0, 5);

  useEffect(() => {
    if (!isSuggestionOpen || searchSuggestions.length === 0) {
      setHighlightedSuggestionIndex(-1);
      return;
    }

    setHighlightedSuggestionIndex((prev) =>
      prev >= searchSuggestions.length ? searchSuggestions.length - 1 : prev
    );
  }, [isSuggestionOpen, searchSuggestions]);

  const handleSuggestionKeyDown = (event) => {
    if (!isSuggestionOpen || searchSuggestions.length === 0) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlightedSuggestionIndex((prev) => (prev + 1) % searchSuggestions.length);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightedSuggestionIndex((prev) =>
        prev <= 0 ? searchSuggestions.length - 1 : prev - 1
      );
      return;
    }

    if (event.key === "Enter" && highlightedSuggestionIndex >= 0) {
      event.preventDefault();
      handleSuggestionSelect(searchSuggestions[highlightedSuggestionIndex]);
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      setIsSuggestionOpen(false);
    }
  };

  const visibleProducts = products
    .filter((product) => {
      if (!normalizedSearch) {
        return true;
      }

      return [product.name, product.description]
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch);
    })
    .filter((product) => {
      if (productQuery.category === "all") {
        return true;
      }

      return product.category === productQuery.category;
    })
    .filter((product) => {
      if (minPrice !== null && product.price < minPrice) {
        return false;
      }

      if (maxPrice !== null && product.price > maxPrice) {
        return false;
      }

      return true;
    })
    .filter((product) => {
      if (minRating !== null && product.rating < minRating) {
        return false;
      }

      if (productQuery.inStockOnly && !product.inStock) {
        return false;
      }

      if (productQuery.favoritesOnly && !favoriteProductIds.includes(product.id)) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (productQuery.sortBy === "popularity-desc") {
        return b.popularity - a.popularity;
      }

      if (productQuery.sortBy === "price-asc") {
        return a.price - b.price;
      }

      if (productQuery.sortBy === "price-desc") {
        return b.price - a.price;
      }

      if (productQuery.sortBy === "rating-desc") {
        return b.rating - a.rating;
      }

      if (productQuery.sortBy === "rating-asc") {
        return a.rating - b.rating;
      }

      return 0;
    });

  const renderHeader = (
    <div className="mb-8">
      <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">Yeni Sezon</p>
      <h1 className="mt-2 text-3xl font-bold text-slate-900 md:text-4xl">Populer Teknoloji Urunleri</h1>
      <p className="mt-3 max-w-2xl text-slate-600">
        Premium urun seckisi, hizli sepet aksiyonlari ve profesyonel alisveris deneyimi.
      </p>
    </div>
  );

  if (loadError) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8">
        {renderHeader}
        <StateView
          variant="error"
          title="Urunler Yuklenemedi"
          description={loadError}
          actionLabel="Tekrar Dene"
          onAction={() => {
            setLoadAttempt((prev) => prev + 1);
          }}
        />
      </main>
    );
  }

  if (!isLoading && products.length === 0) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8">
        {renderHeader}
        <StateView
          variant="empty"
          title="Urun Verisi Bulunamadi"
          description="Urunler su an listelenemiyor. Tekrar deneyin."
          actionLabel="Tekrar Dene"
          onAction={() => {
            setLoadAttempt((prev) => prev + 1);
          }}
        />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      {renderHeader}

      <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-8">
          <label className="relative flex flex-col gap-2 text-sm text-slate-700">
            Urun Ara
            <input
              type="search"
              value={productQuery.search}
              onChange={(event) => {
                handleQueryChange("search", event.target.value);
                setIsSuggestionOpen(true);
                setHighlightedSuggestionIndex(-1);
              }}
              onFocus={() => setIsSuggestionOpen(true)}
              onKeyDown={handleSuggestionKeyDown}
              onBlur={() => {
                setTimeout(() => {
                  setIsSuggestionOpen(false);
                }, 120);
              }}
              placeholder="Orn: kulaklik"
              className="rounded-lg border border-slate-300 px-3 py-2 outline-none ring-slate-200 transition focus:ring"
              autoComplete="off"
            />

            {isSuggestionOpen && searchSuggestions.length > 0 && (
              <ul className="absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg">
                {searchSuggestions.map((suggestion, index) => (
                  <li key={suggestion}>
                    <button
                      type="button"
                      onMouseDown={(event) => {
                        event.preventDefault();
                      }}
                      onClick={() => handleSuggestionSelect(suggestion)}
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

          <label className="flex flex-col gap-2 text-sm text-slate-700">
            Kategori
            <select
              value={productQuery.category}
              onChange={(event) => handleQueryChange("category", event.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2 outline-none ring-slate-200 transition focus:ring"
            >
              <option value="all">Tum Kategoriler</option>
              <option value="ses">Ses</option>
              <option value="cevre-birim">Cevre Birimleri</option>
            </select>
          </label>

          <label className="flex flex-col gap-2 text-sm text-slate-700">
            Siralama
            <select
              value={productQuery.sortBy}
              onChange={(event) => handleQueryChange("sortBy", event.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2 outline-none ring-slate-200 transition focus:ring"
            >
              <option value="popularity-desc">Populerlik (Yuksek)</option>
              <option value="price-asc">Fiyat (Artan)</option>
              <option value="price-desc">Fiyat (Azalan)</option>
              <option value="rating-desc">Puan (Yuksek)</option>
              <option value="rating-asc">Puan (Dusuk)</option>
            </select>
          </label>

          <label className="flex flex-col gap-2 text-sm text-slate-700">
            Min Fiyat
            <input
              type="number"
              min="0"
              value={productQuery.minPrice}
              onChange={(event) => handleQueryChange("minPrice", event.target.value)}
              placeholder="Orn: 1500"
              className="rounded-lg border border-slate-300 px-3 py-2 outline-none ring-slate-200 transition focus:ring"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm text-slate-700">
            Max Fiyat
            <input
              type="number"
              min="0"
              value={productQuery.maxPrice}
              onChange={(event) => handleQueryChange("maxPrice", event.target.value)}
              placeholder="Orn: 3500"
              className="rounded-lg border border-slate-300 px-3 py-2 outline-none ring-slate-200 transition focus:ring"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm text-slate-700">
            Min Puan
            <select
              value={productQuery.minRating}
              onChange={(event) => handleQueryChange("minRating", event.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2 outline-none ring-slate-200 transition focus:ring"
            >
              <option value="all">Tum Puanlar</option>
              <option value="4">4.0 ve Uzeri</option>
              <option value="4.5">4.5 ve Uzeri</option>
            </select>
          </label>

          <label className="flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={productQuery.inStockOnly}
              onChange={(event) => handleQueryChange("inStockOnly", event.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-400"
            />
            Sadece Stokta Olanlar
          </label>

          <label className="flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={productQuery.favoritesOnly}
              onChange={(event) => handleQueryChange("favoritesOnly", event.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-400"
            />
            Sadece Favoriler
          </label>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-500">{visibleProducts.length} urun listeleniyor.</p>
          <button
            type="button"
            onClick={handleClearFilters}
            disabled={!hasActiveFilters}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Filtreleri Temizle
          </button>
        </div>
      </section>

      {isLoading ? (
        <div className="mt-6">
          <StateView
            variant="loading"
            title="Urunler Yukleniyor"
            description="Urun listesi hazirlaniyor. Lutfen kisa bir sure bekleyin."
          />
        </div>
      ) : (
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visibleProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isFavorite={favoriteProductIds.includes(product.id)}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </section>
      )}

      {!isLoading && visibleProducts.length === 0 && (
        <div className="mt-6">
          <StateView
            variant="empty"
            title="Uygun Urun Bulunamadi"
            description="Aramana uygun urun bulunamadi. Filtreleri temizleyip tekrar dene."
          />
        </div>
      )}
    </main>
  );
}
