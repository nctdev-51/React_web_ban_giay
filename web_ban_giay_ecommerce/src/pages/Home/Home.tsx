import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import type { ProductSummary } from "../../types/product";
import { getProductsByCategory } from "../../lib/productsApi";

// SWIPER
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

// Dữ liệu Mock cho phần "Always Iconic" (Vì đây là các dòng giày cố định của Nike)
const classicSilhouettes = [
  {
    name: "Air Force 1",
    image:
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80",
    link: "/category/lifestyle",
  },
  {
    name: "Air Jordan 1",
    image:
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=80",
    link: "/category/basketball",
  },
  {
    name: "Air Max",
    image:
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=80",
    link: "/category/running",
  },
  {
    name: "Nike Dunk",
    image:
      "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=600&q=80",
    link: "/category/skateboarding",
  },
];

export default function Home() {
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadTrendingProducts() {
      try {
        setIsLoading(true);
        const allProducts = await getProductsByCategory();
        if (isMounted) setProducts(allProducts.slice(0, 10)); // Lấy 10 đôi làm Trending
      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadTrendingProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-[#111]">
      {/* KHÔNG GIAN BÙ TRỪ CHO NAVBAR STICKY (NẾU CÓ) */}
      <div className="pt-4"></div>

      <main className="pb-24">
        {/* ==========================================
            1. HERO SECTION (FULL BLEED)
        ========================================== */}
        <section className="px-6 md:px-12 max-w-[1920px] mx-auto">
          <div className="relative w-full h-[70vh] md:h-[85vh] bg-[#f5f5f5] overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1556906781-9a412961c28c?w=1920&q=80"
              alt="Nike Hero"
              className="absolute inset-0 w-full h-full object-cover object-top"
            />
            {/* Lớp phủ tối nhẹ để chữ nổi bật hơn */}
            <div className="absolute inset-0 bg-black/20"></div>
          </div>

          <div className="flex flex-col items-center text-center mt-12 px-4">
            <p className="text-base font-medium mb-2">Feel the Unreal</p>
            <h1 className="text-6xl md:text-[84px] font-black uppercase tracking-tighter mb-6 leading-none">
              AIR MAX DN
            </h1>
            <p className="text-base md:text-lg mb-8 max-w-2xl text-[#111] font-medium">
              The next generation of Air technology is here. Experience unreal
              comfort and a dynamic transition with every step.
            </p>
            <div className="flex gap-4">
              <Link
                to="/category"
                className="bg-black text-white px-8 py-3.5 rounded-full font-medium hover:bg-gray-800 transition-colors"
              >
                Shop
              </Link>
            </div>
          </div>
        </section>

        {/* ==========================================
            2. TRENDING THIS WEEK (SWIPER SẢN PHẨM DB)
        ========================================== */}
        <section className="px-6 md:px-12 max-w-[1920px] mx-auto mt-24 relative">
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-[24px] font-medium">Trending This Week</h2>
            <div className="flex gap-4 items-center">
              <Link
                to="/category"
                className="text-base font-medium hover:text-gray-500 hidden sm:block"
              >
                Shop All
              </Link>
            </div>
          </div>

          <Swiper
            modules={[FreeMode, Navigation]}
            freeMode={true}
            navigation={true}
            spaceBetween={16}
            slidesPerView="auto"
            className="pb-4 trending-swiper"
          >
            {products.map((product) => (
              <SwiperSlide
                key={product.id}
                className="!w-[280px] md:!w-[400px]"
              >
                <Link
                  to={`/product/${product.id}`}
                  className="group block cursor-pointer"
                >
                  <div className="bg-[#f6f6f6] aspect-square overflow-hidden mb-4">
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="flex justify-between items-start mt-4 px-1">
                    <div>
                      <h4 className="font-medium text-base text-[#111]">
                        {product.title}
                      </h4>
                      <p className="text-[#707072] text-base mt-1">
                        {product.sport}
                      </p>
                    </div>
                    <p className="font-medium text-base whitespace-nowrap ml-4">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>

        {/* ==========================================
            3. DON'T MISS (ĐIỂM NHẤN CHIẾN DỊCH)
        ========================================== */}
        <section className="px-6 md:px-12 max-w-[1920px] mx-auto mt-28">
          <h2 className="text-[24px] font-medium mb-8">Don't Miss</h2>
          <div className="relative w-full h-[60vh] md:h-[75vh] bg-[#f5f5f5] overflow-hidden group">
            <img
              src="https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=1920&q=80"
              alt="Don't Miss Campaign"
              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-1000"
            />
          </div>
          <div className="flex flex-col items-start mt-10">
            <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6">
              STEP INTO GREATNESS
            </h3>
            <p className="text-lg mb-8 max-w-xl text-[#111]">
              Elevate your game with the latest collection engineered for peak
              performance and unapologetic style.
            </p>
            <Link
              to="/category/sports"
              className="bg-black text-white px-8 py-3.5 rounded-full font-medium hover:bg-gray-800 transition-colors"
            >
              Shop Collection
            </Link>
          </div>
        </section>

        {/* ==========================================
            4. ALWAYS ICONIC (CÁC DÒNG GIÀY HUYỀN THOẠI)
        ========================================== */}
        <section className="px-6 md:px-12 max-w-[1920px] mx-auto mt-28">
          <h2 className="text-[24px] font-medium mb-8">Always Iconic</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {classicSilhouettes.map((classic, index) => (
              <Link
                to={classic.link}
                key={index}
                className="group cursor-pointer"
              >
                <div className="aspect-square overflow-hidden bg-[#f6f6f6] mb-6">
                  <img
                    src={classic.image}
                    alt={classic.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <h3 className="text-xl font-medium group-hover:text-gray-600 transition-colors">
                  {classic.name}
                </h3>
              </Link>
            ))}
          </div>
        </section>

        {/* ==========================================
            5. THE ESSENTIALS (PHÂN LOẠI ĐỐI TƯỢNG)
        ========================================== */}
        <section className="px-6 md:px-12 max-w-[1920px] mx-auto mt-28">
          <h2 className="text-[24px] font-medium mb-8">The Essentials</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: "Men's",
                img: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800&q=80",
                link: "/category/men",
              },
              {
                title: "Women's",
                img: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&q=80",
                link: "/category/women",
              },
              {
                title: "Kids'",
                img: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=800&q=80",
                link: "/category/kids",
              },
            ].map((essential, idx) => (
              <Link
                to={essential.link}
                key={idx}
                className="relative aspect-[4/5] overflow-hidden group"
              >
                <img
                  src={essential.img}
                  alt={essential.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-500"></div>
                <div className="absolute bottom-10 left-10">
                  <span className="bg-white text-black px-6 py-3 rounded-full font-medium text-base hover:bg-gray-200 transition">
                    {essential.title}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ==========================================
            6. NIKE MEMBERSHIP (KÊU GỌI HÀNH ĐỘNG CUỐI TRANG)
        ========================================== */}
        <section className="px-6 md:px-12 max-w-[1920px] mx-auto mt-28 mb-10">
          <h2 className="text-[24px] font-medium mb-8">Nike Membership</h2>
          <div className="relative w-full h-[50vh] md:h-[60vh] bg-[#f5f5f5] overflow-hidden group">
            <img
              src="https://images.unsplash.com/photo-1574629810360-7efbb1925536?w=1920&q=80"
              alt="Join Nike Membership"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-black/40"></div>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
              <h3 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter mb-6">
                BECOME A MEMBER
              </h3>
              <p className="text-lg text-white mb-8 max-w-xl font-medium">
                Sign up for free. Join the community. Get exclusive access to
                the best of Nike products, inspiration and community.
              </p>
              <div className="flex gap-4">
                <Link
                  to="/auth"
                  className="bg-white text-black px-8 py-3.5 rounded-full font-medium hover:bg-gray-200 transition-colors"
                >
                  Join Us
                </Link>
                <Link
                  to="/auth"
                  className="bg-transparent border border-white text-white px-8 py-3.5 rounded-full font-medium hover:bg-white/10 transition-colors"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
