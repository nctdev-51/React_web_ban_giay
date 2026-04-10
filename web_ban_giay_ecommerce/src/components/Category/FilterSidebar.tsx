interface FilterSidebarProps {
    selectedSports?: string[];
    selectedGenders?: string[];
    selectedSizes?: number[];
    onFilterChange?: (filterType: string, value: string | number) => void;
    price?: number;
}

export function FilterSidebar({
    selectedSports = [],
    selectedSizes = [],
    selectedGenders = [],
    price = 99999999999,
    onFilterChange,
}: FilterSidebarProps) {
    // Danh sách môn thể thao  
    const sports = [
        "Running",
        "Basketball",
        "Football",
        "Training & Gym",
        "Skateboarding",
        "Golf",
    ];
    // Danh sách kích cỡ giày
    const sizes = [38, 39, 40, 41, 42, 43, 44, 45, 46];
    // Giới tính
    const genders = ["Men", "Women", "Unisex"];

    return (
        <aside
            className="w-[260px] flex-shrink-0 pr-8 hidden md:block overflow-y-auto max-h-[calc(100vh-120px)] sticky top-[120px] 
      [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full"
        >
            {/* 1. KHU VỰC SPORT  */}
            <div className="py-6 border-b border-gray-200">
                <h3 className="font-medium text-[16px] mb-4 px-2">Sport</h3>
                <div className="flex flex-col gap-1 pb-8 mt-2">
                    {sports.map((sport) => {
                        const isSelected = selectedSports.some(s => s.toLowerCase() === sport.toLowerCase());
                        return (
                            <button
                                key={sport}
                                onClick={() => onFilterChange && onFilterChange("sport", sport)}
                                className={`text-left text-[15px] px-4 py-2 rounded-md transition-colors duration-200 cursor-pointer
                    ${isSelected
                                        ? "bg-gray-100 font-medium" // Đang chọn -> Nền đen, chữ trắng
                                        : "text-[#111111] hover:bg-gray-100 font-medium" // Bình thường -> Hover có nền xám nhạt
                                    }`}
                            >
                                {sport}
                            </button>
                        );
                    })}
                </div>
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
                <div className="px-2">
                    <select
                        value={price}
                        onChange={(e) => onFilterChange && onFilterChange("price", e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md bg-white text-[15px] focus:outline-none focus:border-black cursor-pointer"
                    >
                        <option value="999999999999999">All Prices</option>
                        <option value="1000000">Under 1.000.000₫</option>
                        <option value="3000000">Under 3.000.000₫</option>
                        <option value="5000000">Under 5.000.000₫</option>
                        <option value="10000000">Under 10.000.000₫</option>
                    </select>
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
                  ${isSelected
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
