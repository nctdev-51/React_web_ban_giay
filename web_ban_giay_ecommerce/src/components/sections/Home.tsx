import React, { useState, useEffect } from 'react';

// --- MOCK DATA ---
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
    image: 'https://static.nike.com/a/images/f_auto,cs_srgb/w_1920,c_limit/33f20a67-9cda-48eb-bf3b-9e23ebc4e332/nike-just-do-it.jpg', // Ảnh thứ 2 thêm vào
    subtitle: 'Just Do It',
    title: "'CHASE GREATNESS'",
    description: 'Push your limits and define your own legacy on the court.',
  }
];

const products = [
  {
    id: 1,
    name: 'Jordan Heir Series 2 PF',
    category: "Women's Basketball Shoes",
    price: '3,239,000₫',
    image: 'https://static.nike.com/a/images/q_auto:eco/t_product_v1/f_auto/w_330,c_limit/57112944-e1e0-4e65-a7c8-920b9b36caa4/jordan-heir-series-2-pf-basketball-shoes.png',
  },
  {
    id: 2,
    name: 'Kobe IX Elite Low EM Protro',
    category: 'Basketball Shoes',
    price: '5,279,000₫',
    image: 'https://static.nike.com/a/images/q_auto:eco/t_product_v1/f_auto/w_330,c_limit/94a150d6-19c9-4d40-88d5-0edbfa089e1d/kobe-ix-elite-low-em-protro-basketball-shoes.png',
  },
  {
    id: 3,
    name: "Luka 5 'Luka Lifestyle' PF",
    category: 'Basketball Shoes',
    price: '3,829,000₫',
    image: 'https://static.nike.com/a/images/q_auto:eco/t_product_v1/f_auto/w_330,c_limit/21236e86-254e-471d-9d6b-659543d8771a/luka-5-luka-lifestyle-pf-basketball-shoes.png',
  },
  {
    id: 4,
    name: 'Giannis Freak 7 EP',
    category: 'Basketball Shoes',
    price: '3,239,000₫',
    image: 'https://static.nike.com/a/images/q_auto:eco/t_product_v1/f_auto/w_330,c_limit/7f9be56d-0e6d-44fb-b660-770f6799fedd/giannis-freak-7-ep-basketball-shoes.png',
  },
];

const shopBySport = [
  { title: 'Running', image: 'https://static.nike.com/a/images/f_auto,cs_srgb/w_500,c_limit/1f6dcd2f-749b-412d-938b-abac8e505a10/nike-just-do-it.png' },
  { title: 'Football', image: 'https://static.nike.com/a/images/f_auto,cs_srgb/w_500,c_limit/d6b91c33-af3b-4b08-811b-07f65e94c12c/nike-just-do-it.png' },
  { title: 'Basketball', image: 'https://static.nike.com/a/images/f_auto,cs_srgb/w_500,c_limit/a6e005d8-11ca-4684-895e-2a6c9116ea43/nike-just-do-it.png' },
  { title: 'Gym & Training', image: 'https://static.nike.com/a/images/f_auto,cs_srgb/w_500,c_limit/edf91243-2922-4f9e-95e4-df7f45d38f0b/nike-just-do-it.png' },
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto swiper effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % heroSlides.length);
    }, 5000); // Chuyển ảnh mỗi 5 giây

    return () => clearInterval(timer); // Dọn dẹp timer khi component unmount
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <main className="pb-20">
        
        {/* Hero Section */}
        <section className="px-6 md:px-10 max-w-[1920px] mx-auto mt-6">
          <div className="relative w-full h-[60vh] md:h-[80vh] bg-gray-100 flex items-center justify-center overflow-hidden">
            
            {/* Hiển thị các slide */}
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
                
                {/* Lớp phủ màu đen nhẹ để chữ dễ đọc hơn */}
                <div className="absolute inset-0 bg-black/40"></div>
                
                {/* Nội dung được canh giữa */}
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

            {/* Nút chấm tròn (Dots indicator) ở dưới cùng */}
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

        {/* Featured Section */}
        <section className="px-6 md:px-10 max-w-[1920px] mx-auto mt-20">
          <h2 className="text-2xl font-medium mb-6">Featured</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative h-[500px] md:h-[700px] group cursor-pointer overflow-hidden">
              <img src="https://static.nike.com/a/images/f_auto,cs_srgb/w_960,c_limit/05289fe0-ebdf-4fdd-a586-8e8d7361bbf6/nike-just-do-it.png" className="w-full h-full object-cover group-hover:scale-105 transition duration-700" alt="Nike Zenvy" />
              <div className="absolute bottom-10 left-10 text-white">
                <p className="text-sm">Nike Zenvy</p>
                <h3 className="text-2xl font-medium mb-4">Freedom to Flow</h3>
                <button className="bg-white text-black px-6 py-2 rounded-full font-semibold hover:bg-gray-200 transition">Shop</button>
              </div>
            </div>
            <div className="relative h-[500px] md:h-[700px] group cursor-pointer overflow-hidden">
              <img src="https://static.nike.com/a/images/f_auto,cs_srgb/w_960,c_limit/96e6f2e9-c107-40ca-b76d-a97c46dc94b4/nike-just-do-it.png" className="w-full h-full object-cover group-hover:scale-105 transition duration-700" alt="ACG Explore" />
              <div className="absolute bottom-10 left-10 text-white">
                <p className="text-sm">ACG Explore</p>
                <h3 className="text-2xl font-medium mb-4">Gear up, get lost</h3>
                <button className="bg-white text-black px-6 py-2 rounded-full font-semibold hover:bg-gray-200 transition">Shop</button>
              </div>
            </div>
          </div>
        </section>

        {/* Product Slider: Latest in Basketball */}
        <section className="px-6 md:px-10 max-w-[1920px] mx-auto mt-20">
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-2xl font-medium">Latest in Basketball</h2>
            <div className="flex space-x-4 items-center">
              <a href="#" className="font-semibold hidden md:block">Shop All</a>
              <div className="flex space-x-2">
                <button className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition">{'<'}</button>
                <button className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition">{'>'}</button>
              </div>
            </div>
          </div>
          
          <div className="flex overflow-x-auto gap-4 pb-4 hide-scrollbar snap-x">
            {products.map((product) => (
              <div key={product.id} className="min-w-[300px] md:min-w-[400px] snap-start flex-shrink-0 cursor-pointer group">
                <div className="bg-[#f6f6f6] overflow-hidden mb-4">
                  <img src={product.image} alt={product.name} className="w-full h-auto object-cover group-hover:scale-105 transition duration-500" />
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-base">{product.name}</h4>
                    <p className="text-gray-500 text-base">{product.category}</p>
                  </div>
                  <p className="font-medium text-base">{product.price}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Shop By Sport */}
        <section className="px-6 md:px-10 max-w-[1920px] mx-auto mt-20">
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-2xl font-medium">Shop by Sport</h2>
            <div className="flex space-x-2">
                <button className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition">{'<'}</button>
                <button className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition">{'>'}</button>
            </div>
          </div>
          <div className="flex overflow-x-auto gap-4 pb-4 hide-scrollbar snap-x">
            {shopBySport.map((sport, index) => (
              <div key={index} className="relative min-w-[280px] md:min-w-[380px] h-[350px] md:h-[480px] snap-start flex-shrink-0 cursor-pointer group overflow-hidden">
                <img src={sport.image} alt={sport.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-xl font-medium">{sport.title}</h3>
                </div>
              </div>
            ))}
          </div>
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