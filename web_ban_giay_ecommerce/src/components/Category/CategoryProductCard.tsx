import { Link } from "react-router-dom";
import type { ProductSummary } from "../../types/product";

interface CategoryProductCardProps {
  product: ProductSummary;
}

export function CategoryProductCard({ product }: CategoryProductCardProps) {
  return (
    <Link
      to={`/product/${product.id}`}
      className="group cursor-pointer flex flex-col"
    >
      <div className="relative aspect-square bg-[#f6f6f6] mb-3 overflow-hidden">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="w-full h-full object-cover object-center transition-opacity duration-300 group-hover:opacity-80"
        />
      </div>

      <div className="flex flex-col">
        <h3 className="font-medium text-[#111111] leading-tight truncate">
          {product.title}
        </h3>

        <p className="text-[#707072] text-[15px] mt-1 truncate">
          {product.sport} {product.productType}
        </p>

        {product.collection && (
          <p className="text-[#707072] text-[15px] truncate">
            {product.collection}
          </p>
        )}

        <p className="font-medium text-[#111111] mt-3">${product.price}</p>
      </div>
    </Link>
  );
}
