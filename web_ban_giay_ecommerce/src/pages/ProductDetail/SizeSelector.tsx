import type { ProductSize } from "../../types/product";

type SizeSelectorProps = {
  sizes: ProductSize[];
  selectedSize: number | null;
  onSelectSize: (size: number) => void;
};

// BẢO VỆ: Thêm gán mặc định sizes = []
export function SizeSelector({
  sizes = [],
  selectedSize,
  onSelectSize,
}: SizeSelectorProps) {
  const sortedSizes = [...sizes].sort((a, b) => a.size - b.size);

  return (
    <section className="space-y-3">
      <h2 className="text-sm font-semibold text-slate-900">Select Size (EU)</h2>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {sortedSizes.map(({ size, stock }) => {
          const isSelected = selectedSize === size;
          const isOut = stock <= 0;

          return (
            <button
              key={size}
              type="button"
              onClick={() => onSelectSize(size)}
              disabled={isOut}
              className={`h-11 rounded-md border text-sm font-medium transition ${
                isOut
                  ? "border-slate-200 text-slate-300 cursor-not-allowed"
                  : isSelected
                    ? "border-black bg-black text-white"
                    : "border-slate-300 text-slate-700 hover:border-slate-500"
              }`}
            >
              {size}
            </button>
          );
        })}
      </div>
    </section>
  );
}
