
import { HomeHeader, ProductFilters, ProductGrid, StateView } from "../components";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { demoProducts } from "../data/demoProducts";
import { useLocalStorage } from "../hooks";
import { DEFAULT_PRODUCT_QUERY } from "../constants/productQuery";
import { getQueryFromSearchParams } from "../utils/productQuery";

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

  const handleQueryChange = useCallback((field, value) => {
    setProductQuery((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setProductQuery(DEFAULT_PRODUCT_QUERY);
    setIsSuggestionOpen(false);
  }, []);

  const handleSuggestionSelect = useCallback((suggestion) => {
    setProductQuery((prev) => ({
      ...prev,
      search: suggestion,
    }));
    setIsSuggestionOpen(false);
  }, []);

  const handleToggleFavorite = useCallback((productId) => {
    setFavoriteProductIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  }, [setFavoriteProductIds]);

  const hasActiveFilters = useMemo(
    () =>
      productQuery.search !== DEFAULT_PRODUCT_QUERY.search ||
      productQuery.category !== DEFAULT_PRODUCT_QUERY.category ||
      productQuery.sortBy !== DEFAULT_PRODUCT_QUERY.sortBy ||
      productQuery.minPrice !== DEFAULT_PRODUCT_QUERY.minPrice ||
      productQuery.maxPrice !== DEFAULT_PRODUCT_QUERY.maxPrice ||
      productQuery.minRating !== DEFAULT_PRODUCT_QUERY.minRating ||
      productQuery.inStockOnly !== DEFAULT_PRODUCT_QUERY.inStockOnly ||
      productQuery.favoritesOnly !== DEFAULT_PRODUCT_QUERY.favoritesOnly,
    [productQuery]
  );

  const normalizedSearch = productQuery.search.trim().toLowerCase();
  const minPrice = productQuery.minPrice ? Number(productQuery.minPrice) : null;
  const maxPrice = productQuery.maxPrice ? Number(productQuery.maxPrice) : null;
  const minRating = productQuery.minRating === "all" ? null : Number(productQuery.minRating);
  const favoriteProductIdSet = useMemo(() => new Set(favoriteProductIds), [favoriteProductIds]);

  const searchSuggestions = useMemo(
    () =>
      Array.from(
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
        .slice(0, 5),
    [products, normalizedSearch]
  );

  useEffect(() => {
    if (!isSuggestionOpen || searchSuggestions.length === 0) {
      setHighlightedSuggestionIndex(-1);
      return;
    }

    setHighlightedSuggestionIndex((prev) =>
      prev >= searchSuggestions.length ? searchSuggestions.length - 1 : prev
    );
  }, [isSuggestionOpen, searchSuggestions]);

  const handleSuggestionKeyDown = useCallback((event) => {
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
  }, [highlightedSuggestionIndex, isSuggestionOpen, searchSuggestions, handleSuggestionSelect]);

  const visibleProducts = useMemo(
    () =>
      products
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

          if (productQuery.favoritesOnly && !favoriteProductIdSet.has(product.id)) {
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
        }),
    [
      products,
      normalizedSearch,
      productQuery.category,
      minPrice,
      maxPrice,
      minRating,
      productQuery.inStockOnly,
      productQuery.favoritesOnly,
      productQuery.sortBy,
      favoriteProductIdSet,
    ]
  );

  if (loadError) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8">
        <HomeHeader />
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
        <HomeHeader />
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
      <HomeHeader />

      <ProductFilters
        productQuery={productQuery}
        onQueryChange={handleQueryChange}
        onClearFilters={handleClearFilters}
        hasActiveFilters={hasActiveFilters}
        visibleCount={visibleProducts.length}
        searchSuggestions={searchSuggestions}
        isSuggestionOpen={isSuggestionOpen}
        setIsSuggestionOpen={setIsSuggestionOpen}
        highlightedSuggestionIndex={highlightedSuggestionIndex}
        setHighlightedSuggestionIndex={setHighlightedSuggestionIndex}
        onSuggestionSelect={handleSuggestionSelect}
        onSuggestionKeyDown={handleSuggestionKeyDown}
      />

      <ProductGrid
        isLoading={isLoading}
        products={visibleProducts}
        favoriteProductIds={favoriteProductIds}
        onToggleFavorite={handleToggleFavorite}
      />

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
