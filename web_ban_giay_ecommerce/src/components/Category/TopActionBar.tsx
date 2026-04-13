interface TopActionBarProps {
  title: string;
  itemCount: number;
  isFilterOpen: boolean;
  toggleFilter: () => void;
  // Thêm props để xử lý Sort
  currentSort?: string;
  onSortChange?: (value: string) => void;
}

export function TopActionBar({
  title,
  itemCount,
  isFilterOpen,
  toggleFilter,
  currentSort = "featured",
  onSortChange,
}: TopActionBarProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-baseline justify-between py-6 sticky top-[60px] bg-white z-20 transition-all">
      <h1 className="text-[24px] font-medium text-[#111111] mb-4 md:mb-0">
        {title}{" "}
        <span className="text-gray-500 text-lg font-normal">({itemCount})</span>
      </h1>

      <div className="flex items-center gap-6">
        <button
          onClick={toggleFilter}
          className="flex items-center gap-2 text-[15px] font-medium text-[#111111] hover:text-[#707072] transition-colors cursor-pointer"
        >
          {isFilterOpen ? "Hide Filters" : "Show Filters"}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path
              d="M21 4H14M10 4H3M16 12H21M3 12H12M12 20H21M3 20H8"
              strokeLinecap="round"
            />
            <circle cx="12" cy="4" r="2" />
            <circle cx="14" cy="12" r="2" />
            <circle cx="10" cy="20" r="2" />
          </svg>
        </button>

        {/* Khối Sort By được tối ưu UI */}
        <div className="relative flex items-center gap-1 group cursor-pointer">
          <span className="text-[15px] text-[#707072] group-hover:text-[#111]">
            Sort By
          </span>

          <div className="flex items-center gap-1">
            {/* Hiển thị label hiện tại để UI đẹp hơn, ẩn text của select đi */}
            <span className="text-[15px] font-medium text-[#111111]">
              {currentSort === "newest"
                ? "Newest"
                : currentSort === "high-low"
                  ? "Price: High-Low"
                  : currentSort === "low-high"
                    ? "Price: Low-High"
                    : "Featured"}
            </span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-[#111111]"
            >
              <path
                d="M6 9l6 6 6-6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Thẻ select tàng hình đè lên trên cùng để nhận sự kiện click */}
          <select
            value={currentSort}
            onChange={(e) => onSortChange && onSortChange(e.target.value)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          >
            <option value="featured">Featured</option>
            <option value="newest">Newest</option>
            <option value="high-low">Price: High-Low</option>
            <option value="low-high">Price: Low-High</option>
          </select>
        </div>
      </div>
    </div>
  );
}
