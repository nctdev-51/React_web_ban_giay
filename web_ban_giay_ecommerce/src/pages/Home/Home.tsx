import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// Sửa lại đường dẫn import chính xác dựa trên cấu trúc thư mục: src/pages/Home/Home.tsx
import { getProductsByCategory } from "../../lib/productsApi";
import type { ProductSummary } from "../../types/product";

// ==========================================
// ĐỊNH NGHĨA TYPESCRIPT CHO BANNER (Thay thế cho any)
// ==========================================
interface HeroBanner {
  image: string;
  subtitle: string;
  title: string;
  description: string;
}

interface FeaturedBanner {
  id: number;
  title: string;
  subtitle: string;
  image: string;
}

interface SportBanner {
  title: string;
  image: string;
  slug: string;
}

interface BannerData {
  hero: HeroBanner;
  featured: FeaturedBanner[];
  sports: SportBanner[];
}

// ==========================================
// MÔ PHỎNG API LẤY BANNER TỪ BACKEND (CMS)
// ==========================================
const fetchBannersAPI = async (): Promise<BannerData> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        hero: {
          image:
            "https://static.nike.com/a/images/f_auto,cs_srgb/w_1920,c_limit/97b15157-84f1-4e29-8924-c3b6ff6dfe49/nike-just-do-it.jpg",
          subtitle: "Just In",
          title: "LEBRON XXIII ELITE",
          description:
            "Define your own legacy on the court with the latest innovation.",
        },
        featured: [
          {
            id: 1,
            title: "Nike Zenvy",
            subtitle: "Freedom to Flow",
            image:
              "https://static.nike.com/a/images/f_auto,cs_srgb/w_960,c_limit/05289fe0-ebdf-4fdd-a586-8e8d7361bbf6/nike-just-do-it.png",
          },
          {
            id: 2,
            title: "ACG Explore",
            subtitle: "Gear up, get lost",
            image:
              "https://static.nike.com/a/images/f_auto,cs_srgb/w_960,c_limit/96e6f2e9-c107-40ca-b76d-a97c46dc94b4/nike-just-do-it.png",
          },
        ],
        sports: [
          {
            title: "Running",
            image:
              "https://static.nike.com/a/images/f_auto,cs_srgb/w_500,c_limit/1f6dcd2f-749b-412d-938b-abac8e505a10/nike-just-do-it.png",
            slug: "running",
          },
          {
            title: "Basketball",
            image:
              "https://static.nike.com/a/images/f_auto,cs_srgb/w_500,c_limit/a6e005d8-11ca-4684-895e-2a6c9116ea43/nike-just-do-it.png",
            slug: "basketball",
          },
          {
            title: "Football",
            image:
              "https://static.nike.com/a/images/f_auto,cs_srgb/w_500,c_limit/d6b91c33-af3b-4b08-811b-07f65e94c12c/nike-just-do-it.png",
            slug: "football",
          },
          {
            title: "Training",
            image:
              "https://static.nike.com/a/images/f_auto,cs_srgb/w_500,c_limit/edf91243-2922-4f9e-95e4-df7f45d38f0b/nike-just-do-it.png",
            slug: "training",
          },
        ],
      });
    }, 500);
  });
};

// Hàm format tiền tệ (Nên tách ra file utils chung cho dự án sau này)
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

export default function Home() {
  const [banners, setBanners] = useState<BannerData | null>(null);

  // Lưu state cho nhiều danh mục sản phẩm khác nhau
  const [trendingProducts, setTrendingProducts] = useState<ProductSummary[]>(
    [],
  );
  const [basketballProducts, setBasketballProducts] = useState<
    ProductSummary[]
  >([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch toàn bộ dữ liệu khi load trang
  useEffect(() => {
    let mounted = true;

    const fetchAllData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Gọi API song song bằng Promise.all để tối ưu tốc độ load
        const [bannerData, allProducts, bbProducts] = await Promise.all([
          fetchBannersAPI(),
          getProductsByCategory(), // Lấy ngẫu nhiên cho mục Trending
          getProductsByCategory("basketball"), // Lọc riêng bóng rổ
        ]);

        if (mounted) {
          setBanners(bannerData);
          setTrendingProducts(allProducts.slice(0, 10)); // Lấy 10 đôi đầu tiên
          setBasketballProducts(bbProducts.slice(0, 10));
        }
      } catch (err) {
        if (mounted) {
          setError("Không thể tải dữ liệu trang chủ. Vui lòng thử lại sau.");
          console.error("Lỗi tải dữ liệu trang chủ:", err);
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    fetchAllData();
    return () => {
      mounted = false;
    };
  }, []);

  // Component con để render Slider Sản phẩm (Giúp code không bị lặp lại)
  const ProductCarousel = ({
    title,
    products,
  }: {
    title: string;
    products: ProductSummary[];
  }) => (
    <section className="px-6 md:px-12 max-w-[1920px] mx-auto mt-20">
      <div className="flex justify-between items-end mb-8">
        <h2 className="text-[24px] font-medium">{title}</h2>
        <div className="flex items-center gap-4">
          <Link
            to="/category"
            className="font-medium hover:text-gray-500 hidden md:block"
          >
            Shop All
          </Link>
          <div className="flex gap-2">
            <button className="w-12 h-12 bg-[#f5f5f5] rounded-full flex items-center justify-center hover:bg-[#e5e5e5] transition">
              {"<"}
            </button>
            <button className="w-12 h-12 bg-[#f5f5f5] rounded-full flex items-center justify-center hover:bg-[#e5e5e5] transition">
              {">"}
            </button>
          </div>
        </div>
      </div>

      <div className="flex overflow-x-auto gap-4 pb-8 hide-scrollbar snap-x snap-mandatory">
        {products.map((product) => (
          <Link
            to={`/product/${product.id}`}
            key={product.id}
            className="min-w-[300px] md:min-w-[400px] snap-start flex-shrink-0 group block"
          >
            <div className="bg-[#f6f6f6] aspect-square overflow-hidden mb-4">
              <img
                src={product.thumbnail}
                alt={product.title}
                className="w-full h-full object-cover mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
            </div>
            <div className="flex justify-between items-start mt-4">
              <div>
                <h4 className="font-medium text-base text-[#111]">
                  {product.title}
                </h4>
                <p className="text-[#707070] text-base mt-1">
                  {product.sport} {product.productType}
                </p>
              </div>
              <p className="font-medium text-base text-[#111] whitespace-nowrap ml-4">
                {formatPrice(product.price)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );

  // Xử lý UI khi đang tải dữ liệu
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-pulse text-xl font-medium text-gray-500">
          Đang tải trải nghiệm Nike...
        </div>
      </div>
    );
  }

  // Xử lý UI khi API gọi thất bại
  if (error || !banners) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-4">
        <p className="text-xl font-medium text-red-500">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-black text-white rounded-full font-medium"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-[#111]">
      <main className="pb-20">
        {/* 1. HERO SECTION (Chuẩn style Nike: Ảnh to, text bóp hẹp ở giữa) */}
        <section className="px-6 md:px-12 max-w-[1920px] mx-auto mt-4">
          <div className="relative w-full h-[70vh] md:h-[85vh] bg-[#f5f5f5]">
            <img
              src={banners.hero.image}
              alt={banners.hero.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20"></div>
          </div>

          <div className="flex flex-col items-center text-center mt-12 px-4">
            <p className="text-base font-medium mb-2">
              {banners.hero.subtitle}
            </p>
            <h1 className="text-5xl md:text-[72px] font-extrabold uppercase tracking-tight mb-6">
              {banners.hero.title}
            </h1>
            <p className="text-base md:text-lg mb-8 max-w-xl">
              {banners.hero.description}
            </p>
            <div className="flex gap-4">
              <Link
                to="/category"
                className="bg-[#111] text-white px-6 py-3.5 rounded-full font-medium hover:bg-[#333] transition"
              >
                Shop
              </Link>
            </div>
          </div>
        </section>

        {/* 2. TRENDING PRODUCTS CAROUSEL (Dữ liệu từ API) */}
        {trendingProducts.length > 0 && (
          <ProductCarousel title="Trending" products={trendingProducts} />
        )}

        {/* 3. FEATURED SECTION */}
        <section className="px-6 md:px-12 max-w-[1920px] mx-auto mt-16">
          <h2 className="text-[24px] font-medium mb-8">Featured</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {banners.featured.map((item) => (
              <div
                key={item.id}
                className="relative aspect-[4/5] md:aspect-square group cursor-pointer overflow-hidden"
              >
                <img
                  src={item.image}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  alt={item.title}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
                <div className="absolute bottom-10 left-10 text-white z-10">
                  <p className="text-base mb-2">{item.title}</p>
                  <h3 className="text-2xl font-medium mb-6">{item.subtitle}</h3>
                  <Link
                    to="/category"
                    className="bg-white text-[#111] px-6 py-2.5 rounded-full font-medium hover:bg-gray-200 transition"
                  >
                    Shop
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. BASKETBALL LATEST CAROUSEL */}
        {basketballProducts.length > 0 && (
          <ProductCarousel
            title="Latest in Basketball"
            products={basketballProducts}
          />
        )}

        {/* 5. SHOP BY SPORT */}
        <section className="px-6 md:px-12 max-w-[1920px] mx-auto mt-20 mb-10">
          <h2 className="text-[24px] font-medium mb-8">Shop by Sport</h2>
          <div className="flex overflow-x-auto gap-4 pb-8 hide-scrollbar snap-x snap-mandatory">
            {banners.sports.map((sport, index) => (
              <Link
                to={`/category/${sport.slug}`}
                key={index}
                className="relative min-w-[300px] md:min-w-[400px] aspect-[4/5] snap-start flex-shrink-0 group overflow-hidden block"
              >
                <img
                  src={sport.image}
                  alt={sport.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition duration-500"></div>
                <div className="absolute bottom-8 left-8 text-white">
                  <h3 className="text-xl font-medium bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm">
                    {sport.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      {/* CSS ẩn thanh cuộn nhưng vẫn giữ tính năng trượt */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `,
        }}
      />
    </div>
  );
}
