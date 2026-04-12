import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { TopActionBar } from "../../components/Category/TopActionBar";
import { FilterSidebar } from "../../components/Category/FilterSidebar";
import { CategoryProductCard } from "../../components/Category/CategoryProductCard";
import { searchProducts } from "../../lib/productsApi";
import type { ProductSummary } from "../../types/product";

export function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = (searchParams.get("q") || "").trim();

  // States cho UI
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // States cho Data
  const [products, setProducts] = useState<ProductSummary[]>([]);

  // States cho Lọc & Sắp xếp
  const [currentSort, setCurrentSort] = useState<string>("featured");
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<number[]>([]);
  const [price, setPrice] = useState<number>(99999999999);

  useEffect(() => {
    let mounted = true;
    window.scrollTo(0, 0);

    async function fetchResults() {
      if (!query) {
        setProducts([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const data = await searchProducts(query);
        if (mounted) setProducts(data);
      } catch (err) {
        if (mounted) {
          setError(
            err instanceof Error ? err.message : "Failed to load results.",
          );
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    fetchResults();

    // Reset bộ lọc khi đổi từ khóa
    setCurrentSort("featured");
    setSelectedSports([]);
    setSelectedGenders([]);
    setSelectedSizes([]);
    setPrice(99999999999);

    return () => {
      mounted = false;
    };
  }, [query]);

  const displayedProducts = useMemo(() => {
    let result = [...products];

    if (selectedSports.length > 0) {
      result = result.filter((p) =>
        selectedSports.some((sport) => p.sport?.includes(sport)),
      );
    }

    if (selectedGenders.length > 0) {
      result = result.filter((p) => {
        if (!Array.isArray(p.gender)) return false;
        return p.gender.some((productGender) =>
          selectedGenders.some(
            (selected) => selected.toLowerCase() === productGender.toLowerCase(),
          ),
        );
      });
    }

    if (selectedSizes.length > 0) {
      result = result.filter((p) => {
        if (!Array.isArray(p.sizes)) return false;
        return p.sizes.some(
          (s) => selectedSizes.includes(s.size) && s.stock > 0,
        );
      });
    }

    result = result.filter((p) => p.price < price);

    if (currentSort === "low-high") {
      result.sort((a, b) => a.price - b.price);
    } else if (currentSort === "high-low") {
      result.sort((a, b) => b.price - a.price);
    } else if (currentSort === "newest") {
      result.sort((a, b) => b.id - a.id);
    }

    return result;
  }, [
    products,
    currentSort,
    selectedSports,
    selectedGenders,
    selectedSizes,
    price,
  ]);

  const title = query
    ? `Kết quả cho "${query}"`
    : "Kết quả tìm kiếm";

  const handleFilterChange = (filterType: string, value: string | number) => {
    if (filterType === "sport") {
      setSelectedSports((prev) =>
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
    } else if (filterType === "price") {
      setPrice(Number(value));
    }
  };

  return (
    <main className="max-w-[1440px] mx-auto px-6 md:px-12 pb-20">
      <TopActionBar
        title={title}
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
          <FilterSidebar
            selectedGenders={selectedGenders}
            selectedSizes={selectedSizes}
            selectedSports={selectedSports}
            price={price}
            onFilterChange={handleFilterChange}
          />
        </div>

        <div className="flex-1 transition-all duration-300">
          {!query ? (
            <div className="py-20 text-center text-[#707072]">
              Vui lòng nhập từ khóa để tìm kiếm.
            </div>
          ) : isLoading ? (
            <div className="py-20 text-center text-[#707072]">
              Loading products...
            </div>
          ) : error ? (
            <div className="py-20 text-center text-red-600">{error}</div>
          ) : displayedProducts.length === 0 ? (
            <div className="py-20 text-center text-[#707072]">
              Không tìm thấy sản phẩm nào phù hợp.
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

export default SearchResults;
