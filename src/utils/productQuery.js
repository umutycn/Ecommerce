import {
  DEFAULT_PRODUCT_QUERY,
  VALID_CATEGORIES,
  VALID_MIN_RATINGS,
  VALID_SORT_OPTIONS,
} from "../constants/productQuery";

export function getQueryFromSearchParams(searchParams) {
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
