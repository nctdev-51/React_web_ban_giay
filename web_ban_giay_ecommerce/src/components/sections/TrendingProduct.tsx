import { useState, useEffect } from "react";
// Nhớ import Component ProductCard và type ApiProduct bạn vừa tạo ở bước trước
import { ProductCard, ApiProduct } from "../ui/ProductCard";

export function TrendingProducts() {
  // 1. Quản lý trạng thái (State)
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 2. Gọi API khi Component vừa được render (Mount)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Bật trạng thái loading
        setIsLoading(true);

        // Gọi API lấy danh sách giày nam từ DummyJSON
        const response = await fetch(
          "https://dummyjson.com/products/category/mens-shoes",
        );

        // Kiểm tra xem API có trả về lỗi không (ví dụ: 404, 500)
        if (!response.ok) {
          throw new Error("Không thể tải dữ liệu từ máy chủ!");
        }

        const data = await response.json();

        // DummyJSON trả về data có dạng { products: [...], total, skip, limit }
        // Mình chỉ lấy mảng products để lưu vào state
        setProducts(data.products);
      } catch (err: any) {
        setError(err.message);
      } finally {
        // Tắt trạng thái loading dù thành công hay thất bại
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []); // Mảng rỗng [] giúp useEffect chỉ chạy đúng 1 lần khi load trang

  // 3. Xử lý giao diện khi đang tải (Loading) hoặc có lỗi (Error)
  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center py-20">
        <p className="text-xl font-medium text-gray-500">
          Đang tải sản phẩm...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full flex justify-center items-center py-20">
        <p className="text-xl text-red-500">Lỗi: {error}</p>
      </div>
    );
  }

  // 4. Render danh sách sản phẩm khi đã có dữ liệu
  return (
    <section className="py-12 px-6 md:px-12 max-w-7xl mx-auto">
      {/* Tiêu đề section giống Nike */}
      <div className="flex justify-between items-end mb-6">
        <h2 className="text-2xl font-medium text-black">Trending Nown</h2>
      </div>

      {/* Grid hiển thị sản phẩm: Mobile 1 cột, Tablet 2 cột, Desktop 3 hoặc 4 cột */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
