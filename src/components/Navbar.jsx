import { useCart } from "../context";
import { Link } from "react-router-dom";

export default function Navbar() {
  const { cartCount } = useCart();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-xl font-bold text-slate-900">
          Modern Shop
        </Link>

        <div className="flex items-center gap-5 text-sm font-medium text-slate-700">
          <Link to="/" className="transition hover:text-slate-900">
            Urunler
          </Link>
          <Link to="/cart" className="relative flex items-center gap-2 rounded-md px-1 py-1 transition hover:text-slate-900">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-5 w-5"
            >
              <path d="M3 3h2l2.2 10.1a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.6L21 6H7" />
              <circle cx="10" cy="20" r="1.2" />
              <circle cx="18" cy="20" r="1.2" />
            </svg>
            <span>Sepet</span>

            {cartCount > 0 ? (
              <span className="absolute -right-3 -top-2 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-semibold text-white shadow-sm">
                {cartCount}
              </span>
            ) : null}
          </Link>
        </div>
      </nav>
    </header>
  );
}
