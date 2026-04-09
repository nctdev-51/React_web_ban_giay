import type { Product } from "../../types/product";

export function ProductDescription({ product }: { product: Product }) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold text-slate-900">Description</h2>
      <p className="text-slate-700 leading-7">{product.description}</p>
    </section>
  );
}
