import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { getProductsByCategory } from "../../lib/productsApi";
import type { ProductSummary } from "../../types/product";

const User: React.FC = () => {
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mounted = true;

    const fetchFavorites = async () => {
      try {
        setLoading(true);
        // Gọi API dùng chung của ứng dụng, không fetch chay
        const data = await getProductsByCategory();
        if (mounted) {
          setProducts(data.slice(0, 10)); // Lấy 10 đôi gợi ý
        }
      } catch (error) {
        console.error("Error fetching favorite products:", error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchFavorites();

    return () => {
      mounted = false;
    };
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -316, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 316, behavior: "smooth" });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 font-sans text-neutral-900 min-h-[70vh]">
      {/* 1. SUB-HEADER / THÔNG TIN USER */}
      <main className="flex flex-wrap justify-between items-center pb-10 mb-10 border-b border-gray-200 gap-5">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-medium text-2xl">
            QT {/* Avatar thay thế bằng ký tự */}
          </div>
          <div>
            <h1 className="text-3xl font-medium mb-2">Quốc Trần</h1>
            <p className="text-base text-gray-500 m-0">
              Nike Member Since March 2026
            </p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-gray-300 bg-white text-base font-medium hover:bg-gray-50 hover:border-gray-400 transition-colors">
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z"
            />
          </svg>
          View Member Pass
        </button>
      </main>

      {/* 2. INTERESTS SECTION */}
      <section className="mb-16">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-[24px] font-medium m-0">Interests</h3>
          <button className="px-6 py-2 rounded-full border border-gray-300 bg-white font-medium hover:bg-gray-50 hover:border-gray-400 transition-colors">
            Edit
          </button>
        </div>

        <div className="flex gap-6 border-b border-gray-200 pb-0 mb-6 overflow-x-auto whitespace-nowrap hide-scrollbar">
          <span className="cursor-pointer text-[#111] font-medium text-base border-b-2 border-black pb-3">
            All
          </span>
          <span className="cursor-pointer text-gray-500 hover:text-[#111] font-medium text-base transition-colors pb-3">
            Sports
          </span>
          <span className="cursor-pointer text-gray-500 hover:text-[#111] font-medium text-base transition-colors pb-3">
            Products
          </span>
          <span className="cursor-pointer text-gray-500 hover:text-[#111] font-medium text-base transition-colors pb-3">
            Teams
          </span>
          <span className="cursor-pointer text-gray-500 hover:text-[#111] font-medium text-base transition-colors pb-3">
            Athletes
          </span>
        </div>

        <div className="mt-5 bg-gray-50 p-8 rounded-xl text-center md:text-left flex flex-col md:flex-row items-center justify-between border border-gray-200">
          <p className="text-base text-gray-600 max-w-xl mb-6 md:mb-0">
            Add your interests to shop a collection of products that are based
            on what you're into.
          </p>
          <button className="px-6 py-3 rounded-full bg-white border border-gray-300 font-medium hover:border-gray-400 hover:bg-gray-50 transition-colors">
            + Add Interests
          </button>
        </div>
      </section>

      {/* 3. CAROUSEL GỢI Ý */}
      <section className="mb-16">
        <div className="flex justify-between items-end mb-6">
          <h3 className="text-[24px] font-medium m-0">
            Find your next favourite
          </h3>

          <div className="flex gap-2">
            <button
              onClick={scrollLeft}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-[#f5f5f5] hover:bg-gray-200 text-gray-900 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            </button>
            <button
              onClick={scrollRight}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-[#f5f5f5] hover:bg-gray-200 text-gray-900 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <p className="text-gray-500 font-medium animate-pulse">
              Loading suggestions...
            </p>
          </div>
        ) : (
          <div
            ref={carouselRef}
            className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory hide-scrollbar"
          >
            {products.map((product) => (
              <Link
                to={`/product/${product.id}`}
                key={product.id}
                className="min-w-[300px] snap-start group block"
              >
                <div className="bg-[#f6f6f6] rounded-md overflow-hidden mb-3 aspect-square">
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div>
                  <h4 className="text-base font-medium mb-1 text-[#111] group-hover:text-gray-600 transition-colors">
                    {product.title}
                  </h4>
                  <p className="text-base text-gray-500 mb-1">
                    {product.sport} {product.productType}
                  </p>
                  <p className="text-base font-medium m-0">
                    {formatPrice(product.price)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `,
        }}
      />
    </div>
  );
};

export default User;
