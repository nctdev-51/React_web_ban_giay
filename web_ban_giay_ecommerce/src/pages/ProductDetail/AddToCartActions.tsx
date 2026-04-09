import { memo, useCallback } from "react";

type AddToCartActionsProps = {
  quantity: number;
  onQuantityChange: (nextQuantity: number) => void;
  onAddToCart: () => void;
  selectedSize: number | null;
};

function AddToCartActionsComponent({
  quantity,
  onQuantityChange,
  onAddToCart,
  selectedSize,
}: AddToCartActionsProps) {
  const canAdd = Boolean(selectedSize);
  const handleDecrease = useCallback(() => {
    onQuantityChange(Math.max(1, quantity - 1));
  }, [onQuantityChange, quantity]);

  const handleIncrease = useCallback(() => {
    onQuantityChange(quantity + 1);
  }, [onQuantityChange, quantity]);

  return (
<<<<<<< Updated upstream:web_ban_giay_ecommerce/src/components/sections/ProductDetail/AddToCartActions.tsx
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
          className="h-10 w-10 rounded-full border border-slate-300 hover:border-slate-500"
          aria-label="Decrease quantity"
        >
          -
        </button>

        <div className="min-w-14 text-center font-medium text-slate-900">{quantity}</div>

        <button
          type="button"
          onClick={() => onQuantityChange(quantity + 1)}
          className="h-10 w-10 rounded-full border border-slate-300 hover:border-slate-500"
          aria-label="Increase quantity"
        >
          +
        </button>
=======
    <div className="space-y-6 pt-4">
      {/* Bộ chọn số lượng */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-gray-900">Số lượng:</span>
        <div className="flex items-center gap-2 bg-gray-100 rounded-full px-2 py-1">
          <button
            type="button"
            onClick={handleDecrease}
            className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors text-lg"
            aria-label="Decrease quantity"
          >
            -
          </button>

          <div className="min-w-8 text-center font-medium text-slate-900">
            {quantity}
          </div>

          <button
            type="button"
            onClick={handleIncrease}
            className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors text-lg"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
>>>>>>> Stashed changes:web_ban_giay_ecommerce/src/pages/ProductDetail/AddToCartActions.tsx
      </div>

      <button
        type="button"
        onClick={onAddToCart}
        disabled={!canAdd}
        className="w-full h-12 rounded-full bg-black text-white font-medium hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {canAdd ? "Add to cart" : "Select a size first"}
      </button>
    </div>
  );
}

export const AddToCartActions = memo(AddToCartActionsComponent);
