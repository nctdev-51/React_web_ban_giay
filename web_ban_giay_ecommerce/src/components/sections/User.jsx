import React, { useState, useEffect, useRef } from 'react';

const User = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Khởi tạo ref để trỏ tới thẻ div chứa danh sách sản phẩm
  const carouselRef = useRef(null);

  useEffect(() => {
    fetch('https://dummyjson.com/c/124a-92c7-4986-bfe9')
      .then((res) => res.json())
      .then((data) => {
        const items = Array.isArray(data) ? data : data.products || [];
        setProducts(items);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
        setLoading(false);
      });
  }, []);

  // Hàm format tiền tệ VNĐ
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price * 25000);
  };

  // Hàm xử lý cuộn qua trái
  const scrollLeft = () => {
    if (carouselRef.current) {
      // Cuộn lùi một khoảng bằng độ rộng 1 card (300px) + gap (16px)
      carouselRef.current.scrollBy({ left: -316, behavior: 'smooth' });
    }
  };

  // Hàm xử lý cuộn qua phải
  const scrollRight = () => {
    if (carouselRef.current) {
      // Cuộn tiến một khoảng bằng độ rộng 1 card (300px) + gap (16px)
      carouselRef.current.scrollBy({ left: 316, behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 font-sans text-neutral-900">
      
      {/* 1. SUB-HEADER / THÔNG TIN USER */}
      <main className="flex flex-wrap justify-between items-center pb-10 mb-10 border-b border-gray-200 gap-5">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 bg-gray-100 rounded-full"></div>
          <div>
            <h1 className="text-3xl font-medium mb-2">Quốc Trần</h1>
            <p className="text-base text-gray-500 m-0">Nike Member Since March 2026</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-5 py-2 rounded-full border border-gray-300 bg-white text-base font-medium hover:bg-gray-50 hover:border-gray-400 transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeWidth="1.5" d="M12.75 13.5h4.5m1.5 0h1.5m-7.5 3h1.5m6 3H16.5v-3h3.75m-15.75-6h6v-6h-6v6zm0 9h6v-6h-6v6zm9-9h6v-6h-6v6z"></path>
          </svg>
          View Member Pass
        </button>
      </main>

      {/* 2. INTERESTS SECTION */}
      <section className="mb-16">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-2xl font-medium m-0">Interests</h3>
          <button className="px-4 py-1.5 rounded-full border border-gray-300 bg-white font-medium hover:bg-gray-50 transition-colors">
            Edit
          </button>
        </div>
        
        {/* Tabs */}
        <div className="flex gap-6 border-b border-gray-200 pb-2.5 mb-5 overflow-x-auto whitespace-nowrap scrollbar-hide">
          <span className="cursor-pointer text-black font-medium text-base border-b-2 border-black pb-2.5 -mb-[11px]">All</span>
          <span className="cursor-pointer text-gray-500 hover:text-black font-medium text-base transition-colors">Sports</span>
          <span className="cursor-pointer text-gray-500 hover:text-black font-medium text-base transition-colors">Products</span>
          <span className="cursor-pointer text-gray-500 hover:text-black font-medium text-base transition-colors">Teams</span>
          <span className="cursor-pointer text-gray-500 hover:text-black font-medium text-base transition-colors">Athletes</span>
          <span className="cursor-pointer text-gray-500 hover:text-black font-medium text-base transition-colors">Cities</span>
        </div>

        <div className="mt-5">
          <p className="text-base text-neutral-900 mb-5">
            Add your interests to shop a collection of products that are based on what you're into.
          </p>
          <button className="flex flex-col items-center justify-center w-32 h-32 rounded-xl border border-gray-200 bg-white cursor-pointer gap-2 text-sm font-medium hover:bg-gray-50 transition-colors">
            <span className="text-2xl font-light">+</span> Add Interests
          </button>
        </div>
      </section>

      {/* 3. FIND YOUR NEXT FAVOURITE (CAROUSEL VỚI NÚT ĐIỀU HƯỚNG) */}
      <section className="mb-16">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-2xl font-medium m-0">Find your next favourite</h3>
          
          {/* Cụm nút điều hướng Trái/Phải */}
          <div className="flex gap-3">
            <button 
              onClick={scrollLeft} 
              className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-900 transition-colors"
              aria-label="Previous"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <button 
              onClick={scrollRight} 
              className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-900 transition-colors"
              aria-label="Next"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <p className="text-gray-500 font-medium animate-pulse">Loading products...</p>
          </div>
        ) : (
          /* Thêm ref={carouselRef} vào div container */
          <div 
            ref={carouselRef}
            className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {products.map((product) => (
              <a 
                href={`#product/${product.id}`} 
                key={product.id} 
                className="min-w-[300px] snap-start group block"
              >
                <div className="bg-gray-100 rounded-lg overflow-hidden mb-3 aspect-square">
                  <img 
                    src={product.thumbnail || product.images?.[0] || 'https://via.placeholder.com/300'} 
                    alt={product.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out"
                  />
                </div>
                <div>
                  <h4 className="text-base font-medium mb-1 truncate">{product.title}</h4>
                  <p className="text-base text-gray-500 mb-2">{product.category || "Lifestyle"}</p>
                  <p className="text-base font-medium m-0">{formatPrice(product.price)}</p>
                </div>
              </a>
            ))}
          </div>
        )}
      </section>

    </div>
  );
};

export default User;