import { memo } from "react";
import { Link } from "react-router-dom";
import type { CartItem } from "../../store/cartSlice";

interface CartItemRowProps {
  product: CartItem;
  formatPrice: (price: number) => string;
  onIncrease: (id: number, size: string | number) => void;
  onDecrease: (id: number, size: string | number) => void;
  onRemove: (id: number, size: string | number) => void;
}


const CartItemRow = memo(function CartItemRow({
  product,
  formatPrice,
  onIncrease,
  onDecrease,
  onRemove,
}: CartItemRowProps) {
  return (
    <div className="flex flex-col sm:flex-row border-b border-gray-200 pb-8 mb-8">
      <Link
        to={`/product/${product.id}`}
        className="w-full sm:w-40 h-40 bg-[#f6f6f6] block cursor-pointer group"
      >
        <img
          src={product.thumbnail}
          alt={product.title}
          className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
        />
      </Link>

      <div className="sm:ml-8 flex-1 mt-4 sm:mt-0 flex flex-col justify-between">
        <div className="flex justify-between items-start gap-4">
          <div>
            <Link
              to={`/product/${product.id}`}
              className="font-medium text-lg hover:text-gray-600 transition-colors"
            >
              {product.title}
            </Link>

            <p className="text-gray-500 mt-1">
              {product.sport} {product.productType}
            </p>

            <p className="text-gray-500 mt-1">
              Size:{" "}
              <span className="text-[#111] font-medium">
                {product.selectedSize}
              </span>
            </p>
          </div>

          <div className="text-right">
            <p className="font-medium text-lg">{formatPrice(product.price)}</p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-[#f6f6f6] rounded-full px-2 py-1">
              <button
                onClick={() => onDecrease(product.id, product.selectedSize)}
                className="w-8 h-8 flex items-center justify-center text-lg rounded-full hover:bg-gray-200 transition-colors"
              >
                −
              </button>

              <span className="w-8 text-center text-sm font-medium">
                {product.quantity}
              </span>

              <button
                onClick={() => onIncrease(product.id, product.selectedSize)}
                className="w-8 h-8 flex items-center justify-center text-lg rounded-full hover:bg-gray-200 transition-colors"
              >
                +
              </button>
            </div>
          </div>

          <button
            onClick={() => onRemove(product.id, product.selectedSize)}
            className="text-gray-400 hover:text-red-500 transition-colors underline text-sm"
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
});

export default CartItemRow;