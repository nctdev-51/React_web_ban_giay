import React, { useState, useEffect, useRef } from 'react';

// --- MOCK DATA (Chỉ giữ lại Hero Slides, các mảng tĩnh khác đã bị xoá) ---
const heroSlides = [
  {
    id: 1,
    image: 'https://static.nike.com/a/images/f_auto,cs_srgb/w_1920,c_limit/97b15157-84f1-4e29-8924-c3b6ff6dfe49/nike-just-do-it.jpg',
    subtitle: 'LeBron XXIII Elite',
    title: "'GOOD INTENTIONS'",
    description: 'Only one King can make a decision that alters the landscape of the NBA forever.',
  },
  {
    id: 2,
    image: 'https://static.nike.com/a/images/f_auto,cs_srgb/w_1920,c_limit/33f20a67-9cda-48eb-bf3b-9e23ebc4e332/nike-just-do-it.jpg',
    subtitle: 'Just Do It',
    title: "'CHASE GREATNESS'",
    description: 'Push your limits and define your own legacy on the court.',
  }
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // State lưu trữ dữ liệu API cho 3 khu vực
  const [featuredData, setFeaturedData] = useState([]);
  const [latestData, setLatestData] = useState([]);
  const [sportData, setSportData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Refs dùng để điều khiển scroll cho carousels
  const latestCarouselRef = useRef(null);
  const sportCarouselRef = useRef(null);

  // Auto swiper effect cho Hero Banner
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Fetch API
  useEffect(() => {
    fetch('https://dummyjson.com/c/124a-92c7-4986-bfe9')
      .then((res) => res.json())
      .then((data) => {
        const items = Array.isArray(data) ? data : data.products || [];
        
        // Chia dữ liệu ra 3 phần để giao diện đa dạng hơn
        // Lấy 2 sản phẩm đầu cho Featured
        setFeaturedData(items.slice(0, 2));
        // Lấy các sản phẩm tiếp theo cho Latest in Basketball
        setLatestData(items.slice(2, 10));
        // Lấy 4 sản phẩm tiếp theo (hoặc quay lại lấy từ đầu nếu thiếu) cho Shop By Sport
        setSportData(items.slice(10, 14).length > 0 ? items.slice(10, 14) : items.slice(0, 4));
        
        setLoading(false);
      })
      .catch((error) => {
        console.error('Lỗi khi tải dữ liệu API:', error);
        setLoading(false);
      });
  }, []);

  // Hàm định dạng giá tiền (Giả lập nhân 25000 để ra VNĐ)
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format((price || 0) * 25000);
  };

  // Các hàm xử lý trượt (Scroll)
  const scrollLatest = (direction) => {
    if (latestCarouselRef.current) {
      const scrollAmount = direction === 'left' ? -416 : 416; // 400px width + 16px gap
      latestCarouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollSport = (direction) => {
    if (sportCarouselRef.current) {
      const scrollAmount = direction === 'left' ? -396 : 396; // 380px width + 16px gap
      sportCarouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <main className="pb-20">
        
        {/* Hero Section */}
        <section className="px-6 md:px-10 max-w-[1920px] mx-auto mt-6">
          <div className="relative w-full h-[60vh] md:h-[80vh] bg-gray-100 flex items-center justify-center overflow-hidden">
            {heroSlides.map((slide, index) => (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                }`}
              >
                <img 
                  src={slide.image} 
                  alt={slide.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40"></div>
                
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white space-y-4 z-20 px-4">
                  <p className="text-sm md:text-base font-medium">{slide.subtitle}</p>
                  <h1 className="text-4xl md:text-7xl font-extrabold uppercase">{slide.title}</h1>
                  <p className="text-base max-w-lg mx-auto">{slide.description}</p>
                  <div className="flex space-x-4 pt-4">
                    <button className="bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-gray-200 transition pointer-events-auto">Shop Now</button>
                    <button className="bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-gray-200 transition pointer-events-auto">Learn More</button>
                  </div>
                </div>
              </div>
            ))}

            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-30">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentSlide ? "bg-white" : "bg-white/50 hover:bg-white/80"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Featured Section (Dùng API) */}
        <section className="px-6 md:px-10 max-w-[1920px] mx-auto mt-20">
          <h2 className="text-2xl font-medium mb-6">Featured</h2>
          
          {loading ? (
             <div className="h-[500px] flex items-center justify-center bg-gray-50 animate-pulse">Loading Featured...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {featuredData.map((item) => (
                <div key={item.id} className="relative h-[500px] md:h-[700px] group cursor-pointer overflow-hidden bg-gray-100">
                  {/* Nếu ảnh bị lỗi, dùng placeholder */}
                  <img 
                    src={item.thumbnail || item.images?.[0] || 'https://via.placeholder.com/800'} 
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-700" 
                    alt={item.title} 
                  />
                  {/* Gradient nhẹ để chữ dễ đọc */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute bottom-10 left-10 text-white z-10">
                    <p className="text-sm uppercase tracking-wider">{item.category}</p>
                    <h3 className="text-2xl font-medium mb-4">{item.title}</h3>
                    <button className="bg-white text-black px-6 py-2 rounded-full font-semibold hover:bg-gray-200 transition">Shop</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Product Slider: Latest in Basketball (Dùng API) */}
        <section className="px-6 md:px-10 max-w-[1920px] mx-auto mt-20">
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-2xl font-medium">Latest in Basketball</h2>
            <div className="flex space-x-4 items-center">
              <a href="#shop-all" className="font-semibold hidden md:block">Shop All</a>
              <div className="flex space-x-2">
                <button onClick={() => scrollLatest('left')} className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                </button>
                <button onClick={() => scrollLatest('right')} className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
            </div>
          </div>
          
          {loading ? (
             <div className="h-[400px] flex items-center justify-center bg-gray-50 animate-pulse">Loading Products...</div>
          ) : (
            <div ref={latestCarouselRef} className="flex overflow-x-auto gap-4 pb-4 hide-scrollbar snap-x">
              {latestData.map((product) => (
                <div key={product.id} className="min-w-[300px] md:min-w-[400px] snap-start flex-shrink-0 cursor-pointer group">
                  <div className="bg-[#f6f6f6] overflow-hidden mb-4 h-[300px] md:h-[400px] flex items-center justify-center">
                    <img 
                      src={product.thumbnail || product.images?.[0]} 
                      alt={product.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                    />
                  </div>
                  <div className="flex justify-between items-start">
                    <div className="pr-4">
                      <h4 className="font-medium text-base truncate w-48 md:w-60">{product.title}</h4>
                      <p className="text-gray-500 text-base capitalize">{product.category}</p>
                    </div>
                    <p className="font-medium text-base whitespace-nowrap">{formatPrice(product.price)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Shop By Sport (Dùng API) */}
        <section className="px-6 md:px-10 max-w-[1920px] mx-auto mt-20">
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-2xl font-medium">Shop by Sport</h2>
            <div className="flex space-x-2">
                <button onClick={() => scrollSport('left')} className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                </button>
                <button onClick={() => scrollSport('right')} className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                </button>
            </div>
          </div>
          
          {loading ? (
             <div className="h-[350px] md:h-[480px] flex items-center justify-center bg-gray-50 animate-pulse">Loading Sports...</div>
          ) : (
            <div ref={sportCarouselRef} className="flex overflow-x-auto gap-4 pb-4 hide-scrollbar snap-x">
              {sportData.map((sport) => (
                <div key={sport.id} className="relative min-w-[280px] md:min-w-[380px] h-[350px] md:h-[480px] snap-start flex-shrink-0 cursor-pointer group overflow-hidden bg-gray-200">
                  <img 
                    src={sport.thumbnail || sport.images?.[0]} 
                    alt={sport.title} 
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-700" 
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition"></div>
                  <div className="absolute bottom-6 left-6 text-white z-10 pr-6">
                    {/* Hiển thị Category làm tiêu đề to (giống với Sport name) và Title làm mô tả nhỏ */}
                    <h3 className="text-2xl font-medium capitalize mb-1">{sport.category || "Sport"}</h3>
                    <p className="text-sm font-medium">{sport.title}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
}