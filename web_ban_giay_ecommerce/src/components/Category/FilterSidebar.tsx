export function FilterSidebar() {
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

  return (
    <aside
      className="w-[260px] flex-shrink-0 pr-8 hidden md:block overflow-y-auto max-h-[calc(100vh-120px)] sticky top-[120px] 
      [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full"
    >
      <div className="flex flex-col gap-3 pb-10">
        {categories.map((cat) => (
          <a
            key={cat}
            href="#"
            className="text-[15px] font-medium text-[#111111] hover:text-[#707072] transition-colors"
          >
            {cat}
          </a>
        ))}
      </div>

      <div className="border-t border-gray-200 py-6">
        <h3 className="font-medium text-[16px] mb-4">Gender</h3>
        <div className="flex flex-col gap-3">
          {["Men", "Women", "Unisex"].map((gender) => (
            <label
              key={gender}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="checkbox"
                className="w-5 h-5 rounded border-gray-300 accent-[#111111] cursor-pointer"
              />
              <span className="text-[15px] group-hover:text-gray-600">
                {gender}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-200 py-6">
        <h3 className="font-medium text-[16px] mb-4">Shop by Price</h3>
        <div className="flex flex-col gap-3">
          {["Under $50", "$50 - $100", "$100 - $150", "Over $150"].map(
            (price) => (
              <label
                key={price}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded border-gray-300 accent-[#111111] cursor-pointer"
                />
                <span className="text-[15px] group-hover:text-gray-600">
                  {price}
                </span>
              </label>
            ),
          )}
        </div>
      </div>

      <div className="border-t border-gray-200 py-6">
        <h3 className="font-medium text-[16px] mb-4">Size</h3>
        <div className="grid grid-cols-3 gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              className="border border-gray-300 rounded py-2 hover:border-[#111111] transition-colors text-[14px]"
            >
              {size}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
