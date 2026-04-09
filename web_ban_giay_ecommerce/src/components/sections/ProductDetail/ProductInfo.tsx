import type { Product } from "../../../types/product";

function formatPrice(price: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}

export function ProductInfo({ product }: { product: Product }) {
  // BẢO VỆ: Thêm dấu ? và || 0
  const totalStock =
    product.sizes?.reduce((sum, item) => sum + item.stock, 0) || 0;

  return (
    <div className="space-y-2">
      <h1 className="text-3xl md:text-[32px] font-medium leading-tight text-[#111]">
        {product.title}
      </h1>

      <p className="text-base text-gray-600 font-medium">
        {product.sport} {product.productType}
      </p>

      <p className="text-[22px] font-medium text-[#111] pt-4 pb-2">
        {formatPrice(product.price)}
      </p>

      {totalStock <= 0 ? (
        <p className="text-red-600 font-medium text-sm">Hết hàng</p>
      ) : (
        <p className="text-green-600 font-medium text-sm">Còn hàng</p>
      )}

      {/* BẢO VỆ: Kiểm tra product.tags có tồn tại không */}
      {product.tags && product.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-4">
          {product.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-sm bg-gray-100 px-3 py-1 text-xs font-medium text-gray-800 uppercase tracking-wide"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
