import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { TopActionBar } from "../../components/Category/TopActionBar";
import { FilterSidebar } from "../../components/Category/FilterSidebar";
import { CategoryProductCard } from "../../components/Category/CategoryProductCard";
import { getProductsByCategory } from "../../lib/productsApi";
import type { ProductSummary } from "../../types/product";

export function CategoryPage() {
  const { categorySlug } = useParams<{ categorySlug: string }>();

  // States cho UI
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // States cho Data
  const [products, setProducts] = useState<ProductSummary[]>([]);

  // States cho Lọc & Sắp xếp
  const [currentSort, setCurrentSort] = useState<string>("featured");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<number[]>([]);

  // 1. Fetch dữ liệu từ API
  useEffect(() => {
    let mounted = true;
    window.scrollTo(0, 0);

    async function fetchProducts() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getProductsByCategory(categorySlug);
        if (mounted) setProducts(data);
      } catch (err) {
        if (mounted)
          setError(
            err instanceof Error ? err.message : "Failed to load products.",
          );
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    fetchProducts();

    // Reset lại bộ lọc khi đổi danh mục (ví dụ từ Men sang Women)
    setCurrentSort("featured");
    setSelectedCategories([]);
    setSelectedGenders([]);
    setSelectedSizes([]);

    return () => {
      mounted = false;
    };
  }, [categorySlug]);

  // 2. Hàm xử lý khi người dùng tick vào các checkbox trong Sidebar
  const handleFilterChange = (filterType: string, value: string | number) => {
    if (filterType === "category") {
      setSelectedCategories((prev) =>
        prev.includes(value as string)
          ? prev.filter((v) => v !== value)
          : [...prev, value as string],
      );
    } else if (filterType === "gender") {
      setSelectedGenders((prev) =>
        prev.includes(value as string)
          ? prev.filter((v) => v !== value)
          : [...prev, value as string],
      );
    } else if (filterType === "size") {
      setSelectedSizes((prev) =>
        prev.includes(value as number)
          ? prev.filter((v) => v !== value)
          : [...prev, value as number],
      );
    }
  };

  // 3. Logic xử lý Lọc và Sắp xếp mượt mà trên Frontend
  const displayedProducts = useMemo(() => {
    let result = [...products];

    // Lọc theo danh mục (Category)
    if (selectedCategories.length > 0) {
      result = result.filter((p) =>
        selectedCategories.some(
          (cat) => p.sport?.includes(cat) || p.collection?.includes(cat),
        ),
      );
    }

    // Sắp xếp (Sort)
    if (currentSort === "low-high") {
      result.sort((a, b) => a.price - b.price);
    } else if (currentSort === "high-low") {
      result.sort((a, b) => b.price - a.price);
    } else if (currentSort === "newest") {
      // Giả sử ID lớn hơn là sản phẩm mới hơn
      result.sort((a, b) => b.id - a.id);
    }

    return result;
  }, [
    products,
    currentSort,
    selectedCategories,
    selectedGenders,
    selectedSizes,
  ]);

  const formatTitle = (slug?: string) => {
    if (!slug) return "All Shoes";
    const capitalized = slug.charAt(0).toUpperCase() + slug.slice(1);
    return `${capitalized}'s Shoes`;
  };

  return (
    <main className="max-w-[1440px] mx-auto px-6 md:px-12 pb-20">
      {/* Truyền số lượng sản phẩm ĐÃ LỌC (displayedProducts.length) 
        và hàm xử lý sắp xếp xuống TopActionBar 
      */}
      <TopActionBar
        title={formatTitle(categorySlug)}
        itemCount={displayedProducts.length}
        isFilterOpen={isFilterOpen}
        toggleFilter={() => setIsFilterOpen(!isFilterOpen)}
        currentSort={currentSort}
        onSortChange={setCurrentSort}
      />

      <div className="flex mt-2 transition-all duration-300">
        <div
          className={`${
            isFilterOpen
              ? "w-[260px] opacity-100"
              : "w-0 opacity-0 overflow-hidden"
          } transition-all duration-300 ease-in-out shrink-0`}
        >
          {/* Truyền States và hàm xử lý bộ lọc xuống Sidebar */}
          <FilterSidebar
            selectedGenders={selectedGenders}
            selectedSizes={selectedSizes}
            onFilterChange={handleFilterChange}
          />
        </div>

        <div className="flex-1 transition-all duration-300">
          {isLoading ? (
            <div className="py-20 text-center text-[#707072]">
              Loading products...
            </div>
          ) : error ? (
            <div className="py-20 text-center text-red-600">{error}</div>
          ) : displayedProducts.length === 0 ? (
            <div className="py-20 text-center text-[#707072]">
              Không tìm thấy sản phẩm nào phù hợp với bộ lọc.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-10">
              {displayedProducts.map((shoe) => (
                <CategoryProductCard key={shoe.id} product={shoe} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
