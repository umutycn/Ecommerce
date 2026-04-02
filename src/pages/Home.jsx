import { ProductCard, ProductSkeleton } from "../components";
import { useEffect, useState } from "react";

const demoProducts = [
  {
    id: 1,
    name: "Nova ANC Kulaklik",
    description: "Hibrit aktif gurultu engelleme ve 36 saat pil omru.",
    price: 3299,
    image:
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 2,
    name: "Aurora Mekanik Klavye",
    description: "Hot-swap switch, aliminyum govde ve RGB aydinlatma.",
    price: 2599,
    image:
      "https://images.unsplash.com/photo-1541140532154-b024d705b90a?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 3,
    name: "Pulse Kablosuz Mouse",
    description: "Ergonomik tasarim, 16000 DPI sensor ve dusuk gecikme.",
    price: 1499,
    image:
      "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=1000&q=80",
  },
];

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 900);

    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">Yeni Sezon</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900 md:text-4xl">Populer Teknoloji Urunleri</h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          Premium urun seckisi, hizli sepet aksiyonlari ve profesyonel alisveris deneyimi.
        </p>
      </div>

      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading
          ? Array.from({ length: 6 }).map((_, index) => <ProductSkeleton key={index} />)
          : demoProducts.map((product) => <ProductCard key={product.id} product={product} />)}
      </section>
    </main>
  );
}
