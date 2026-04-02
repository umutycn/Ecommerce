import { formatPrice } from "../utils";

export default function ProductDetail() {
  const product = {
    id: 1,
    name: "Kablosuz Kulaklik",
    description: "40 saat pil omru, hizli sarj destegi.",
    price: 2999,
  };

  return (
    <section className="mx-auto max-w-4xl px-4 py-8">
      <h2 className="text-2xl font-bold">{product.name}</h2>
      <p className="mt-2 text-gray-700">{product.description}</p>
      <p className="mt-4 text-xl font-semibold">{formatPrice(product.price)}</p>
    </section>
  );
}
