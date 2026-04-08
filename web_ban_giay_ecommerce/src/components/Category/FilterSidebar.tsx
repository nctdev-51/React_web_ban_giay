interface FilterSidebarProps {
  selectedCategories?: string[];
  selectedGenders?: string[];
  selectedSizes?: number[];
  onFilterChange?: (filterType: string, value: string | number) => void;
}

export function FilterSidebar({
  selectedCategories = [],
  selectedSizes = [],
  selectedGenders = [],
  onFilterChange,
}: FilterSidebarProps) {
  const categories = [
    "Lifestyle",
    "Jordan",
    "Running",
    "Basketball",
    "Football",
    "Training & Gym",
    "Skateboarding",
    "Golf",
  ];
  const sizes = [38, 39, 40, 41, 42, 43, 44, 45, 46];
  const genders = ["Men", "Women", "Unisex"];
  const prices = [
    "Under 1.000.000₫",
    "1.000.000₫ - 3.000.000₫",
    "Over 3.000.000₫",
  ];

  return (
    <aside
      className="w-[260px] flex-shrink-0 pr-8 hidden md:block overflow-y-auto max-h-[calc(100vh-120px)] sticky top-[120px] 
      [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full"
    >
      {/* 1. KHU VỰC DANH MỤC LỚN - Đã thêm padding, bo góc và hiệu ứng hover nền xám */}
      <div className="flex flex-col gap-1 pb-8 border-b border-gray-200 mt-2">
        {categories.map((cat) => {
          const isSelected = selectedCategories.includes(cat);
          return (
            <button
              key={cat}
              onClick={() => onFilterChange && onFilterChange("category", cat)}
              className={`text-left text-[15px] px-4 py-2 rounded-md transition-colors duration-200 cursor-pointer
                ${
                  isSelected
                    ? "bg-black text-white font-medium" // Đang chọn -> Nền đen, chữ trắng
                    : "text-[#111111] hover:bg-gray-100 font-medium" // Bình thường -> Hover có nền xám nhạt
                }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* 2. KHU VỰC GENDER */}
      <div className="py-6 border-b border-gray-200">
        <h3 className="font-medium text-[16px] mb-4 px-2">Gender</h3>
        <div className="flex flex-col gap-1">
          {genders.map((gender) => (
            <label
              key={gender}
              className="flex items-center gap-3 cursor-pointer group px-2 py-2 rounded-md hover:bg-gray-100 transition-colors"
            >
              <input
                type="checkbox"
                checked={selectedGenders.includes(gender)}
                onChange={() =>
                  onFilterChange && onFilterChange("gender", gender)
                }
                className="w-5 h-5 rounded border-gray-300 accent-[#111111] cursor-pointer"
              />
              <span className="text-[15px] group-hover:text-black select-none">
                {gender}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* 3. KHU VỰC GIÁ */}
      <div className="py-6 border-b border-gray-200">
        <h3 className="font-medium text-[16px] mb-4 px-2">Shop by Price</h3>
        <div className="flex flex-col gap-1">
          {prices.map((price) => (
            <label
              key={price}
              className="flex items-center gap-3 cursor-pointer group px-2 py-2 rounded-md hover:bg-gray-100 transition-colors"
            >
              <input
                type="checkbox"
                className="w-5 h-5 rounded border-gray-300 accent-[#111111] cursor-pointer"
              />
              <span className="text-[15px] group-hover:text-black select-none">
                {price}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* 4. KHU VỰC SIZE */}
      <div className="py-6">
        <h3 className="font-medium text-[16px] mb-4 px-2">Size</h3>
        <div className="grid grid-cols-3 gap-2 px-2">
          {sizes.map((size) => {
            const isSelected = selectedSizes.includes(size);
            return (
              <button
                key={size}
                onClick={() => onFilterChange && onFilterChange("size", size)}
                className={`border rounded-md py-2 cursor-pointer transition-all duration-200 text-[14px] 
                  ${
                    isSelected
                      ? "border-black bg-black text-white shadow-md"
                      : "border-gray-300 hover:border-black hover:bg-gray-50 text-[#111]"
                  }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
