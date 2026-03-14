// src/pages/CategoryPage.tsx
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom"; // Hook để lấy biến từ URL
import { ProductCard, ApiProduct } from "../ui/ProductCard";

// Mock danh sách danh mục cho thanh Sidebar
const SIDEBAR_CATEGORIES = [
  { name: "Men's Shoes", slug: "mens-shoes" },
  { name: "Women's Shoes", slug: "womens-shoes" },
  { name: "Jordan", slug: "mens-shirts" }, // Dùng tạm danh mục áo vì DummyJSON ít giày
  { name: "Basketball", slug: "mens-watches" },
];

export function CategoryPage() {
  // 1. Lấy chuỗi phân loại từ URL. Ví dụ URL là web.com/category/mens-shoes -> categorySlug = "mens-shoes"
  const { categorySlug } = useParams<{ categorySlug: string }>();

  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 2. Fetch dữ liệu LẠI mỗi khi categorySlug thay đổi
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        // Nối biến categorySlug vào thẳng đường dẫn API
        const response = await fetch(
          `https://dummyjson.com/products/category/${categorySlug}`,
        );
        if (!response.ok) throw new Error("Không tìm thấy dữ liệu!");

        const data = await response.json();
        setProducts(data.products);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    // Gọi hàm fetch nếu có categorySlug
    if (categorySlug) {
      fetchProducts();
    }
  }, [categorySlug]); // <-- Mảng phụ thuộc này cực kỳ quan trọng!

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-8">
      {/* Phần Header của Trang Danh mục */}
      <div className="flex justify-between items-center mb-8 sticky top-0 bg-white z-10 py-4">
        <h1 className="text-2xl font-medium capitalize">
          {categorySlug?.replace("-", " ")} ({products.length})
        </h1>
        <div className="flex gap-6 items-center">
          <button className="text-base flex items-center gap-2 hover:text-gray-500 hidden md:flex">
            Hide Filters <span className="text-xl">≏</span>
          </button>
          <button className="text-base flex items-center gap-2 hover:text-gray-500">
            Sort By <span className="text-xl">⌄</span>
          </button>
        </div>
      </div>

      {/* Phần Content chính: Chia 2 cột (Sidebar & Grid) */}
      <div className="flex gap-12">
        {/* Cột Trái: Sidebar (Ẩn trên mobile, hiện trên màn hình lớn) */}
        <aside className="hidden lg:block w-48 flex-shrink-0">
          <ul className="flex flex-col gap-4 font-medium text-black">
            {SIDEBAR_CATEGORIES.map((cat) => (
              <li key={cat.slug}>
                <Link
                  to={`/category/${cat.slug}`}
                  // Đổi màu nếu danh mục đang được chọn
                  className={
                    categorySlug === cat.slug
                      ? "text-black"
                      : "text-gray-500 hover:text-black"
                  }
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        {/* Cột Phải: Lưới Sản Phẩm */}
        <div className="flex-1">
          {isLoading ? (
            <div className="h-64 flex items-center justify-center">
              Đang tải...
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-10">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
