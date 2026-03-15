import { Link } from "react-router-dom";
import type { ProductSummary } from "../../types/product";

function formatPrice(price: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}

export function ProductCard({ product }: { product: ProductSummary }) {
  return (
    <Link to={`/product/${product.id}`} className="group block">
      <div className="bg-[#F6F6F6] aspect-square overflow-hidden rounded-lg">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </div>

      <div className="mt-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-medium text-black text-base">{product.title}</h3>
          <p className="text-slate-500 text-sm">
            {product.sport} · {product.productType}
          </p>
        </div>
        <p className="font-medium text-black text-sm whitespace-nowrap">{formatPrice(product.price)}</p>
      </div>
    </Link>
  );
}
