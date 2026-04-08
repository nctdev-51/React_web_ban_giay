import { Link } from "react-router-dom";
import type { ProductSummary } from "../../types/product";

interface CategoryProductCardProps {
  product: ProductSummary;
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

export function CategoryProductCard({ product }: CategoryProductCardProps) {
  return (
    <Link
      to={`/product/${product.id}`}
      className="group cursor-pointer flex flex-col"
    >
      {/* Khối hình ảnh */}
      <div className="relative aspect-square bg-[#f6f6f6] mb-3 overflow-hidden rounded-md">
        <img
          src={product.thumbnail}
          alt={product.title}
          loading="lazy"
          className="w-full h-full object-cover object-center mix-blend-multiply transition-transform duration-700 ease-out group-hover:scale-105"
        />
        {/* Lớp phủ mờ nhẹ khi hover (Tùy chọn, giống web xịn) */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300"></div>
      </div>

      {/* Khối text */}
      <div className="flex flex-col">
        {/* Đổi màu text khi hover vào card */}
        <h3 className="font-medium text-[#111111] group-hover:text-[#707072] transition-colors duration-300 leading-tight truncate">
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

        <p className="font-medium text-[#111111] mt-3">
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  );
}
