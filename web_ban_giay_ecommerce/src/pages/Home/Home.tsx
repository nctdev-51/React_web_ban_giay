import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import type { ProductSummary } from "../../types/product";
import { getProductsByCategory } from "../../lib/productsApi"; // Import API Backend

// ==========================================
// THƯ VIỆN SWIPER
// ==========================================
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";

// Dữ liệu Banner thường ít thay đổi nên có thể hardcode ở Frontend
const banners = {
  hero: {
    image:
      "https://static.nike.com/a/images/f_auto,cs_srgb/w_1920,c_limit/97b15157-84f1-4e29-8924-c3b6ff6dfe49/nike-just-do-it.jpg",
    subtitle: "Just In",
    title: "LEBRON XXIII ELITE",
    description:
      "Define your own legacy on the court with the latest innovation.",
  },
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

export default function Home() {
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // FETCH DỮ LIỆU ĐỘNG TỪ BACKEND
  useEffect(() => {
    let isMounted = true;

    async function loadTrendingProducts() {
      try {
        setIsLoading(true);
        // Gọi API lấy toàn bộ sản phẩm (hoặc có thể viết thêm API getTrending riêng sau này)
        const allProducts = await getProductsByCategory();

        if (isMounted) {
          // Chỉ lấy 10 đôi mới nhất (hoặc nổi bật nhất) cho trang chủ
          setProducts(allProducts.slice(0, 10));
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu trang chủ:", error);
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
        <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
        <p className="font-medium text-gray-500 tracking-wide">
          Đang tải trải nghiệm...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-[#111]">
      <main className="pb-24">
        {/* ==========================================
            1. HERO SECTION (ẢNH BÌA LỚN)
        ========================================== */}
        <section className="px-6 md:px-12 max-w-[1920px] mx-auto mt-4">
          <div className="relative w-full h-[65vh] md:h-[80vh] bg-[#f5f5f5] rounded-xl overflow-hidden group">
            <img
              src={banners.hero.image}
              alt="Hero Banner"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/10"></div>
          </div>

          <div className="flex flex-col items-center text-center mt-12 px-4">
            <p className="text-base font-medium mb-2">
              {banners.hero.subtitle}
            </p>
            <h1 className="text-5xl md:text-[72px] font-extrabold uppercase tracking-tighter mb-6">
              {banners.hero.title}
            </h1>
            <p className="text-base md:text-lg mb-8 max-w-xl text-gray-700">
              {banners.hero.description}
            </p>
            <div className="flex gap-4">
              <Link
                to="/category"
                className="bg-black text-white px-8 py-3.5 rounded-full font-medium hover:bg-gray-800 transition-colors"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </section>

        {/* ==========================================
            2. TRENDING PRODUCTS (CUỘN SWIPER ĐỘNG)
        ========================================== */}
        <section className="px-6 md:px-12 max-w-[1920px] mx-auto mt-24 relative">
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-[24px] font-medium">Trending This Week</h2>
            <Link
              to="/category"
              className="text-sm font-medium hover:text-gray-500 underline underline-offset-4 hidden sm:block"
            >
              Shop All
            </Link>
          </div>

          <Swiper
            modules={[FreeMode, Navigation]}
            freeMode={true}
            navigation={true} // Bật mũi tên trái/phải mặc định của Swiper
            spaceBetween={16}
            slidesPerView="auto"
            className="pb-8 trending-swiper" // Class này để lát nữa style lại nút bấm nếu cần
          >
            {products.map((product) => (
              <SwiperSlide
                key={product.id}
                className="!w-[280px] md:!w-[400px]"
              >
                {/* Bọc toàn bộ Card bằng thẻ Link để click vào là nhảy sang trang Chi tiết */}
                <Link
                  to={`/product/${product.id}`}
                  className="group block cursor-pointer"
                >
                  <div className="bg-[#f6f6f6] aspect-square overflow-hidden mb-4 rounded-xl">
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
            3. NEW SECTION: THE ESSENTIALS (DANH MỤC LỚN)
        ========================================== */}
        <section className="px-6 md:px-12 max-w-[1920px] mx-auto mt-24">
          <h2 className="text-[24px] font-medium mb-8">The Essentials</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Thẻ MEN */}
            <Link
              to="/category/men"
              className="relative aspect-[4/5] overflow-hidden group rounded-xl"
            >
              <img
                src="https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800&q=80"
                alt="Men's Essentials"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-8 left-8">
                <span className="bg-white text-black px-6 py-2.5 rounded-full font-medium text-sm hover:bg-gray-200 transition">
                  Men's
                </span>
              </div>
            </Link>

            {/* Thẻ WOMEN */}
            <Link
              to="/category/women"
              className="relative aspect-[4/5] overflow-hidden group rounded-xl"
            >
              <img
                src="https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&q=80"
                alt="Women's Essentials"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-8 left-8">
                <span className="bg-white text-black px-6 py-2.5 rounded-full font-medium text-sm hover:bg-gray-200 transition">
                  Women's
                </span>
              </div>
            </Link>

            {/* Thẻ KIDS */}
            <Link
              to="/category/kids"
              className="relative aspect-[4/5] overflow-hidden group rounded-xl"
            >
              <img
                src="https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=800&q=80"
                alt="Kids' Essentials"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-8 left-8">
                <span className="bg-white text-black px-6 py-2.5 rounded-full font-medium text-sm hover:bg-gray-200 transition">
                  Kids'
                </span>
              </div>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
