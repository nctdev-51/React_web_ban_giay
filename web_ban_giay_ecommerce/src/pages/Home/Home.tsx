import { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import type { ProductSummary } from "../../types/product";

// ==========================================
// IMPORT THƯ VIỆN SWIPER
// ==========================================
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
// Import CSS bắt buộc của Swiper
import "swiper/css";
import "swiper/css/free-mode";

// ==========================================
// MOCK DATA TRỰC TIẾP TẠI FILE
// ==========================================
const mockProducts = [
  { id: 1, title: "Nike Zenvy", sport: "basketball", productType: "Shoes", price: 2500000, thumbnail: "https://static.nike.com/a/images/f_auto,cs_srgb/w_960,c_limit/05289fe0-ebdf-4fdd-a586-8e8d7361bbf6/nike-just-do-it.png" },
  { id: 2, title: "ACG Explore", sport: "running", productType: "Apparel", price: 3000000, thumbnail: "https://static.nike.com/a/images/f_auto,cs_srgb/w_960,c_limit/96e6f2e9-c107-40ca-b76d-a97c46dc94b4/nike-just-do-it.png" },
  { id: 3, title: "Air Jordan 1", sport: "basketball", productType: "Shoes", price: 4200000, thumbnail: "https://static.nike.com/a/images/f_auto,cs_srgb/w_500,c_limit/a6e005d8-11ca-4684-895e-2a6c9116ea43/nike-just-do-it.png" }
] as unknown as ProductSummary[]; 

const mockBanners = {
  hero: { 
    image: "https://static.nike.com/a/images/f_auto,cs_srgb/w_1920,c_limit/97b15157-84f1-4e29-8924-c3b6ff6dfe49/nike-just-do-it.jpg", 
    subtitle: "Just In", 
    title: "LEBRON XXIII ELITE", 
    description: "Define your own legacy on the court with the latest innovation." 
  }
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
};

export default function Home() {
  const dispatch = useDispatch();

  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [banners, setBanners] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setProducts(mockProducts);
      setBanners(mockBanners);
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const trendingProducts = useMemo(() => {
    return products.slice(0, 10);
  }, [products]);

  const handleAddToCart = useCallback((product: ProductSummary) => {
    alert(`(Redux) Đã thêm ${product.title} vào giỏ hàng!`);
  }, [dispatch]);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Đang tải trải nghiệm Nike...</div>;
  if (!banners) return null;

  return (
    <div className="min-h-screen bg-white font-sans text-[#111]">
      <main className="pb-20">
        
        {/* 1. HERO SECTION */}
        <section className="px-6 md:px-12 max-w-[1920px] mx-auto mt-4">
          <div className="relative w-full h-[70vh] md:h-[85vh] bg-[#f5f5f5]">
            <img src={banners.hero.image} alt="Hero Banner" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/20"></div>
          </div>
          <div className="flex flex-col items-center text-center mt-12 px-4">
            <p className="text-base font-medium mb-2">{banners.hero.subtitle}</p>
            <h1 className="text-5xl md:text-[72px] font-extrabold uppercase tracking-tight mb-6">{banners.hero.title}</h1>
            <p className="text-base md:text-lg mb-8 max-w-xl">{banners.hero.description}</p>
            <Link to="/category" className="bg-[#111] text-white px-6 py-3.5 rounded-full font-medium hover:bg-[#333] transition">
              Shop Now
            </Link>
          </div>
        </section>

        {/* 2. TRENDING PRODUCTS - ĐÃ ÁP DỤNG SWIPER */}
        <section className="px-6 md:px-12 max-w-[1920px] mx-auto mt-20">
            <h2 className="text-[24px] font-medium mb-8">Trending</h2>
            
            {/* GIẢI THÍCH BÁO CÁO: Dùng thư viện Swiper để tối ưu trải nghiệm vuốt (Touch/Swipe) trên thiết bị di động */}
            <Swiper
              modules={[FreeMode]}
              freeMode={true} // Cho phép vuốt mượt tự do không bị khóa cứng vào từng slide
              spaceBetween={16} // Khoảng cách giữa các thẻ (tương đương gap-4 của Tailwind)
              slidesPerView="auto" // Cho phép thẻ tự co giãn theo width định sẵn bằng Tailwind
              className="pb-8"
            >
                {trendingProducts.map((product) => (
                    // Cần bọc mỗi item vào thẻ SwiperSlide. Dùng class !w-[] để ép width cố định cho Slide
                    <SwiperSlide key={product.id} className="!w-[300px] md:!w-[400px]">
                        <div className="group block border rounded-lg p-2 h-full">
                            <div className="bg-[#f6f6f6] aspect-square overflow-hidden mb-4 rounded">
                                <img src={product.thumbnail} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                            </div>
                            <div className="flex justify-between items-start mt-4 px-2">
                                <div>
                                    <h4 className="font-medium text-base">{product.title}</h4>
                                    <p className="text-[#707070]">{product.sport}</p>
                                    <p className="font-medium text-base mt-2">{formatPrice(product.price)}</p>
                                </div>
                                <button 
                                    onClick={() => handleAddToCart(product)}
                                    className="bg-black text-white px-4 py-2 rounded-full font-medium text-sm hover:bg-gray-800 transition"
                                >
                                    Thêm vô giỏ
                                </button>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>

      </main>
    </div>
  );
}