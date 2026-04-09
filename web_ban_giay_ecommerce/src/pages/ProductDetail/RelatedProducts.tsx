import type { ProductSummary } from "../../types/product";
import { ProductCard } from "../../components/ui/ProductCard";

export function RelatedProducts({ products }: { products: ProductSummary[] }) {
  if (products.length === 0) return null;

  return (
    <section className="space-y-5">
      <h2 className="text-xl font-semibold text-slate-900">Related Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
