// src/components/ui/ProductCard.tsx

export type ApiProduct = {
  id: number;
  title: string;
  category: string;
  price: number;
  thumbnail: string;
};

export function ProductCard({ product }: { product: ApiProduct }) {
  const priceInVND = product.price * 25000;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div className="group cursor-pointer flex flex-col gap-3">
      <div className="bg-[#F6F6F6] aspect-square overflow-hidden flex items-center justify-center">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </div>

      <div className="flex flex-col text-left">
        <h3 className="font-medium text-black text-base truncate">
          {product.title}
        </h3>
        <p className="text-gray-500 text-base capitalize">
          {product.category.replace("-", " ")}
        </p>
        <p className="font-medium text-black mt-2">{formatPrice(priceInVND)}</p>
      </div>
    </div>
  );
}
