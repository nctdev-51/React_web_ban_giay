import type { Product } from "../../types/product";

function SpecsRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null;

  return (
    <div className="grid grid-cols-3 gap-4 py-3 border-b border-slate-100 last:border-b-0">
      <dt className="text-slate-500 text-sm">{label}</dt>
      <dd className="col-span-2 text-slate-900 text-sm">{value}</dd>
    </div>
  );
}

export function ProductSpecs({ product }: { product: Product }) {
  const availableSizes = product.sizes
    .filter((item) => item.stock > 0)
    .map((item) => item.size)
    .sort((a, b) => a - b)
    .join(", ");

  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold text-slate-900">Specifications</h2>

      <dl className="rounded-lg border border-slate-200 px-4">
        <SpecsRow label="Product Type" value={product.productType} />
        <SpecsRow label="Sport" value={product.sport} />
        <SpecsRow label="Collection" value={product.collection} />
        <SpecsRow label="Gender" value={product.gender.join(", ")} />
        <SpecsRow label="Available Sizes" value={availableSizes} />
      </dl>
    </section>
  );
}
