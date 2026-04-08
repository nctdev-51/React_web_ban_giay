import { useMemo, useRef, useState } from "react";
import { MegaMenu, type MegaMenuData } from "./MegaBar";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux"; // <-- 1. Import Redux

type NavItem = { label: string; href: string; menuKey?: string };

const NAV: NavItem[] = [
  { label: "New & Featured", href: "/category/new", menuKey: "new" },
  { label: "Men", href: "/category/men", menuKey: "men" },
  { label: "Women", href: "/category/women", menuKey: "women" },
  { label: "Kids", href: "/category/kids", menuKey: "kids" },
  { label: "Sale", href: "/category/sale" },
];

export function MainNav() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const closeTimer = useRef<number | null>(null);

  // Lấy dữ liệu Giỏ hàng từ Redux
  const cartItems = useSelector((state: any) => state.cart?.items || []);
  const totalQuantity = cartItems.reduce(
    (acc: any, item: any) => acc + item.quantity,
    0,
  );

  const menus = useMemo<Record<string, MegaMenuData>>(
    () => ({
      new: {
        columns: [
          {
            title: "Featured",
            links: [
              { label: "Upcoming Drops", href: "#" },
              { label: "New Arrivals", href: "#" },
              { label: "Bestsellers", href: "#" },
              { label: "SNKRS Launch Calendar", href: "#" },
            ],
          },
          {
            title: "Trending",
            links: [
              { label: "Just Do the Work", href: "#" },
              { label: "What's Trending", href: "#" },
              { label: "Colours of the Season", href: "#" },
            ],
          },
        ],
      },
      men: {
        columns: [
          {
            title: "Shoes",
            links: [
              { label: "Lifestyle", href: "#" },
              { label: "Running", href: "#" },
              { label: "Training", href: "#" },
            ],
          },
          {
            title: "Clothing",
            links: [
              { label: "Tops & T-Shirts", href: "#" },
              { label: "Hoodies", href: "#" },
              { label: "Jackets", href: "#" },
            ],
          },
        ],
      },
      women: {
        columns: [
          {
            title: "Shoes",
            links: [
              { label: "Lifestyle", href: "#" },
              { label: "Running", href: "#" },
              { label: "Training", href: "#" },
            ],
          },
          {
            title: "Clothing",
            links: [
              { label: "Sports Bras", href: "#" },
              { label: "Leggings", href: "#" },
              { label: "Jackets", href: "#" },
            ],
          },
          {
            title: "Icons",
            links: [
              { label: "Air Force 1", href: "#" },
              { label: "Dunk", href: "#" },
              { label: "Air Max", href: "#" },
            ],
          },
          {
            title: "Featured",
            links: [
              { label: "New Arrivals", href: "#" },
              { label: "Bestsellers", href: "#" },
            ],
          },
        ],
      },
      kids: {
        columns: [
          {
            title: "Kids' Shoes",
            links: [
              { label: "Older Kids (7–15)", href: "#" },
              { label: "Younger Kids (4–7)", href: "#" },
              { label: "Baby & Toddler (0–4)", href: "#" },
            ],
          },
          {
            title: "Kids' Clothing",
            links: [
              { label: "Tops & T-Shirts", href: "#" },
              { label: "Hoodies", href: "#" },
              { label: "Tracksuits", href: "#" },
            ],
          },
          {
            title: "By Sport",
            links: [
              { label: "Running", href: "#" },
              { label: "Football", href: "#" },
              { label: "Basketball", href: "#" },
            ],
          },
          {
            title: "Featured",
            links: [
              { label: "New Releases", href: "#" },
              { label: "Sale", href: "#" },
            ],
          },
        ],
      },
    }),
    [],
  );

  function openMenu(key: string) {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setActiveMenu(key);
  }

  function scheduleClose() {
    closeTimer.current = window.setTimeout(() => setActiveMenu(null), 120);
  }

  const hasMenu = activeMenu && menus[activeMenu];

  return (
    <div
      className="relative"
      onMouseLeave={scheduleClose}
      onMouseEnter={() => {
        if (closeTimer.current) window.clearTimeout(closeTimer.current);
      }}
    >
      {/* KHU VỰC ĐÃ FIX: Bao bọc thanh nav chính bằng relative z-50 và bg-white để nó luôn nổi trên cùng */}
      <div className="relative z-50 bg-white mx-auto max-w-6xl px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="h-7 w-7 rounded bg-black" aria-hidden />
          <span className="sr-only">Home</span>
        </Link>

        {/* Center nav */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium h-full">
          {NAV.map((item) => {
            return (
              <Link
                key={item.label}
                to={item.href}
                className="text-slate-900 hover:opacity-70 py-4 h-full flex items-center border-b-2 border-transparent hover:border-black transition-all"
                onMouseEnter={() => {
                  if (item.menuKey) openMenu(item.menuKey);
                  else setActiveMenu(null);
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-3">
          <label className="hidden sm:flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2">
            <span className="text-slate-500 text-sm">🔎</span>
            <input
              className="bg-transparent outline-none text-sm w-40 placeholder:text-slate-500"
              placeholder="Search"
            />
          </label>

          <button
            className="h-9 w-9 grid place-items-center rounded-full hover:bg-slate-100"
            aria-label="Favorites"
          >
            ♡
          </button>

          <Link
            to="/cart"
            className="relative h-9 w-9 grid place-items-center rounded-full hover:bg-slate-100"
            aria-label="Cart"
          >
            🛍
            {totalQuantity > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#E53611] text-[10px] font-bold text-white">
                {totalQuantity}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Dropdown panel */}
      {hasMenu && (
        <>
          {/* KHU VỰC ĐÃ FIX: Lớp phủ mờ hạ z-index xuống 30 và đặt top-[100px] để bắt đầu ngay dưới thanh Nav */}
          <div className="fixed inset-0 top-[100px] bg-black/20 z-30 transition-opacity" />

          {/* KHU VỰC ĐÃ FIX: MegaMenu hạ z-index xuống 40 và dùng top-full để bám sát dưới chân thẻ relative */}
          <div
            className="absolute left-0 right-0 top-full z-40 bg-white shadow-md border-b border-gray-200"
            onMouseEnter={() => {
              if (closeTimer.current) window.clearTimeout(closeTimer.current);
            }}
            onMouseLeave={scheduleClose}
          >
            <MegaMenu data={menus[activeMenu!]} />
          </div>
        </>
      )}
    </div>
  );
}
