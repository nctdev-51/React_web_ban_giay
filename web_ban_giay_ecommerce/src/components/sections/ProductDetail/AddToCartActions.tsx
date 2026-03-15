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
