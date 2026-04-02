export const DEFAULT_PRODUCT_QUERY = {
  search: "",
  category: "all",
  sortBy: "popularity-desc",
  minPrice: "",
  maxPrice: "",
  minRating: "all",
  inStockOnly: false,
  favoritesOnly: false,
};

export const VALID_CATEGORIES = new Set(["all", "ses", "cevre-birim"]);
export const VALID_SORT_OPTIONS = new Set([
  "popularity-desc",
  "price-asc",
  "price-desc",
  "rating-desc",
  "rating-asc",
]);
export const VALID_MIN_RATINGS = new Set(["all", "4", "4.5"]);
