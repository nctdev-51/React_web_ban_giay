import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TopActionBar } from "../../components/Category/TopActionBar";
import { FilterSidebar } from "../../components/Category/FilterSidebar";
import { CategoryProductCard } from "../../components/Category/CategoryProductCard";
import { getProductsByCategory } from "../../lib/productsApi";
import type { ProductSummary } from "../../types/product";

export function CategoryPage() {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const [isFilterOpen, setIsFilterOpen] = useState(true);

  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    return () => {
      mounted = false;
    };
  }, [categorySlug]);

  const formatTitle = (slug?: string) => {
    if (!slug) return "All Shoes";
    const capitalized = slug.charAt(0).toUpperCase() + slug.slice(1);
    return `${capitalized}'s Shoes`;
  };

  return (
    <main className="max-w-[1440px] mx-auto px-6 md:px-12 pb-20">
      <TopActionBar
        title={formatTitle(categorySlug)}
        itemCount={products.length}
        isFilterOpen={isFilterOpen}
        toggleFilter={() => setIsFilterOpen(!isFilterOpen)}
      />

      <div className="flex mt-2 transition-all duration-300">
        <div
          className={`${isFilterOpen ? "w-[260px] opacity-100" : "w-0 opacity-0 overflow-hidden"} 
          transition-all duration-300 ease-in-out shrink-0`}
        >
          <FilterSidebar />
        </div>

        <div className="flex-1 transition-all duration-300">
          {isLoading ? (
            <div className="py-20 text-center text-[#707072]">
              Loading products...
            </div>
          ) : error ? (
            <div className="py-20 text-center text-red-600">{error}</div>
          ) : products.length === 0 ? (
            <div className="py-20 text-center text-[#707072]">
              No products found for this category.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-10">
              {products.map((shoe) => (
                <CategoryProductCard key={shoe.id} product={shoe} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
