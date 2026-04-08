import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import type { ProductSummary } from "../../types/product";


const mockFavorites = [
  { id: 1, title: "Nike Air Max 270", sport: "Running", productType: "Shoes", price: 3200000, thumbnail: "https://static.nike.com/a/images/f_auto,cs_srgb/w_960,c_limit/05289fe0-ebdf-4fdd-a586-8e8d7361bbf6/nike-just-do-it.png" },
  { id: 2, title: "LeBron XX", sport: "Basketball", productType: "Shoes", price: 4500000, thumbnail: "https://static.nike.com/a/images/f_auto,cs_srgb/w_960,c_limit/96e6f2e9-c107-40ca-b76d-a97c46dc94b4/nike-just-do-it.png" },
  { id: 3, title: "Nike Dri-FIT", sport: "Training", productType: "Apparel", price: 850000, thumbnail: "https://static.nike.com/a/images/f_auto,cs_srgb/w_500,c_limit/1f6dcd2f-749b-412d-938b-abac8e505a10/nike-just-do-it.png" },
] as unknown as ProductSummary[]; // Ép kiểu ở đây để hết lỗi

const User: React.FC = () => {
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Giả lập thời gian gọi API mất 0.5s
    const timer = setTimeout(() => {
      setProducts(mockFavorites);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // GIẢI THÍCH BÁO CÁO: Dùng useCallback để hàm này không bị tạo lại mỗi lần render
  // Giúp tối ưu bộ nhớ và tránh re-render không cần thiết.
  const scrollLeft = useCallback(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -316, behavior: "smooth" });
    }
  }, []);

  const scrollRight = useCallback(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 316, behavior: "smooth" });
    }
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 font-sans text-neutral-900 min-h-[70vh]">
      {/* 1. SUB-HEADER */}
      <main className="flex flex-wrap justify-between items-center pb-10 mb-10 border-b border-gray-200 gap-5">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-medium text-2xl">
            QT
          </div>
          <div>
            <h1 className="text-3xl font-medium mb-2">Quốc Trần</h1>
            <p className="text-base text-gray-500 m-0">Nike Member Since March 2026</p>
          </div>
        </div>
      </main>

      {/* 2. INTERESTS SECTION */}
      <section className="mb-16">
        <h3 className="text-[24px] font-medium m-0 mb-6">Interests</h3>
        <div className="mt-5 bg-gray-50 p-8 rounded-xl text-center md:text-left flex flex-col md:flex-row items-center justify-between border border-gray-200">
          <p className="text-base text-gray-600 max-w-xl mb-6 md:mb-0">
            Add your interests to shop a collection of products that are based on what you're into.
          </p>
        </div>
      </section>

      {/* 3. CAROUSEL GỢI Ý */}
      <section className="mb-16">
        <div className="flex justify-between items-end mb-6">
          <h3 className="text-[24px] font-medium m-0">Find your next favourite</h3>
          <div className="flex gap-2">
            <button onClick={scrollLeft} className="w-12 h-12 rounded-full bg-[#f5f5f5] hover:bg-gray-200 transition-colors">{"<"}</button>
            <button onClick={scrollRight} className="w-12 h-12 rounded-full bg-[#f5f5f5] hover:bg-gray-200 transition-colors">{">"}</button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40 animate-pulse">Loading suggestions...</div>
        ) : (
          <div ref={carouselRef} className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory hide-scrollbar">
            {products.map((product) => (
              <Link to={`/product/${product.id}`} key={product.id} className="min-w-[300px] snap-start group block">
                <div className="bg-[#f6f6f6] rounded-md overflow-hidden mb-3 aspect-square">
                  <img src={product.thumbnail} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div>
                  <h4 className="text-base font-medium mb-1">{product.title}</h4>
                  <p className="text-base text-gray-500 mb-1">{product.sport}</p>
                  <p className="text-base font-medium m-0">{formatPrice(product.price)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <style dangerouslySetInnerHTML={{ __html: `.hide-scrollbar::-webkit-scrollbar { display: none; } .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }` }} />
    </div>
  );
};

export default User;