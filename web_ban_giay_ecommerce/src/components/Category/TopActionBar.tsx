interface TopActionBarProps {
  title: string;
  itemCount: number;
  isFilterOpen: boolean;
  toggleFilter: () => void;
}

export function TopActionBar({
  title,
  itemCount,
  isFilterOpen,
  toggleFilter,
}: TopActionBarProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-baseline justify-between py-6 sticky top-[60px] bg-white z-20">
      <h1 className="text-[24px] font-medium text-[#111111] mb-4 md:mb-0">
        {title} ({itemCount})
      </h1>

      <div className="flex items-center gap-6">
        <button
          onClick={toggleFilter}
          className="flex items-center gap-2 text-[15px] font-medium text-[#111111] hover:text-[#707072] transition-colors"
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

        <div className="flex items-center gap-1 group">
          <span className="text-[15px] text-[#707072]">Sort By:</span>
          <select className="text-[15px] font-medium text-[#111111] bg-transparent outline-none cursor-pointer appearance-none group-hover:text-[#707072] transition-colors">
            <option value="featured">Featured</option>
            <option value="newest">Newest</option>
            <option value="high-low">Price: High-Low</option>
            <option value="low-high">Price: Low-High</option>
          </select>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-[#111111] group-hover:text-[#707072]"
          >
            <path
              d="M6 9l6 6 6-6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
