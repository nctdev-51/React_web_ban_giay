import type { Product } from "../../../types/product";

function formatPrice(price: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}

export function ProductInfo({ product }: { product: Product }) {
  const totalStock = product.sizes.reduce((sum, item) => sum + item.stock, 0);

  return (
    <div className="space-y-3">
      <p className="text-xs uppercase tracking-wide text-slate-500">
        {product.productType} · {product.collection}
      </p>

      <h1 className="text-3xl md:text-4xl font-semibold leading-tight text-slate-900">
        {product.title}
      </h1>

      <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
        <span>{product.sport}</span>
        <span>•</span>
        <span>{product.gender.join(" / ")}</span>
        <span>•</span>
        <span>{totalStock} in stock</span>
      </div>

      <p className="text-2xl font-semibold text-slate-900">{formatPrice(product.price)}</p>

      {product.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {product.tags.map((tag) => (
            <span key={tag} className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
