type AddToCartActionsProps = {
  quantity: number;
  onQuantityChange: (nextQuantity: number) => void;
  onAddToCart: () => void;
  selectedSize: number | null;
};

export function AddToCartActions({
  quantity,
  onQuantityChange,
  onAddToCart,
  selectedSize,
}: AddToCartActionsProps) {
  const canAdd = Boolean(selectedSize);

  return (
    <div className="space-y-6 pt-4">
      {/* Bộ chọn số lượng */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-gray-900">Số lượng:</span>
        <div className="flex items-center gap-2 bg-gray-100 rounded-full px-2 py-1">
          <button
            type="button"
            onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
            className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors text-lg"
            aria-label="Decrease quantity"
          >
            -
          </button>

          <div className="min-w-[2rem] text-center font-medium text-slate-900">
            {quantity}
          </div>

          <button
            type="button"
            onClick={() => onQuantityChange(quantity + 1)}
            className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors text-lg"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      {/* Nút thêm vào giỏ */}
      <button
        type="button"
        onClick={onAddToCart}
        className={`w-full py-4 rounded-full text-base font-medium transition-all duration-300 ${
          canAdd
            ? "bg-black text-white hover:bg-gray-800 shadow-lg hover:shadow-xl"
            : "bg-gray-200 text-gray-500 cursor-not-allowed"
        }`}
      >
        Thêm vào giỏ hàng
      </button>
    </div>
  );
}
