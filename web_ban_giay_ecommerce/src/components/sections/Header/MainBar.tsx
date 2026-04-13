import { useMemo, useRef, useState } from "react";
import { MegaMenu, type MegaMenuData } from "./MegaBar";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Logo } from "../../ui/Logo";

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

  const cartItems = useSelector((state: any) => state.cart?.items || []);
  const totalQuantity = cartItems.reduce(
    (acc: any, item: any) => acc + item.quantity,
    0,
  );

  // ĐÃ FIX: Thay thế toàn bộ "#" bằng link Category thật
  const menus = useMemo<Record<string, MegaMenuData>>(
    () => ({
      new: {
        columns: [
          {
            title: "Featured",
            links: [
              { label: "New Arrivals", href: "/category/new" },
              { label: "Bestsellers", href: "/category/bestseller" },
              { label: "Member Access", href: "/category/member-access" },
            ],
          },
          {
            title: "Trending",
            links: [
              { label: "Just In", href: "/category/just-in" },
              { label: "Sustainable Materials", href: "/category/sustainable" },
            ],
          },
        ],
      },
      men: {
        columns: [
          {
            title: "Shoes",
            links: [
              { label: "Lifestyle", href: "/category/lifestyle" },
              { label: "Running", href: "/category/running" },
              { label: "Basketball", href: "/category/basketball" },
              { label: "Training & Gym", href: "/category/training" },
            ],
          },
          {
            title: "Clothing",
            links: [
              { label: "Tops & T-Shirts", href: "/category/tops" },
              { label: "Hoodies", href: "/category/hoodies" },
              { label: "Jackets", href: "/category/jackets" },
            ],
          },
        ],
      },
      women: {
        columns: [
          {
            title: "Shoes",
            links: [
              { label: "Lifestyle", href: "/category/lifestyle" },
              { label: "Running", href: "/category/running" },
              { label: "Training & Gym", href: "/category/training" },
            ],
          },
          {
            title: "Clothing",
            links: [
              { label: "Sports Bras", href: "/category/sports-bras" },
              { label: "Leggings", href: "/category/leggings" },
              { label: "Jackets", href: "/category/jackets" },
            ],
          },
          {
            title: "Icons",
            links: [
              { label: "Air Force 1", href: "/category/air-force-1" },
              { label: "Dunk", href: "/category/dunk" },
              { label: "Air Max", href: "/category/air-max" },
              { label: "Pegasus", href: "/category/pegasus" },
            ],
          },
        ],
      },
      kids: {
        columns: [
          {
            title: "Kids' Shoes",
            links: [
              { label: "Older Kids (7–15)", href: "/category/older-kids" },
              { label: "Younger Kids (4–7)", href: "/category/younger-kids" },
              { label: "Baby & Toddler (0–4)", href: "/category/baby" },
            ],
          },
          {
            title: "By Sport",
            links: [
              { label: "Running", href: "/category/running" },
              { label: "Football", href: "/category/football" },
              { label: "Basketball", href: "/category/basketball" },
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
      <div className="relative z-50 bg-white mx-auto max-w-6xl px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center hover:opacity-80 transition-opacity"
        >
          <Logo className="h-8" showText={true} />
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

          <Link
            to="/favorites"
            className="h-9 w-9 grid place-items-center rounded-full hover:bg-slate-100 cursor-pointer"
            aria-label="Favorites"
          >
            ♡
          </Link>

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
          <div className="fixed inset-0 top-[100px] bg-black/20 z-30 transition-opacity" />

          <div
            className="absolute left-0 right-0 top-full z-40 bg-white shadow-md border-b border-gray-200"
            onMouseEnter={() => {
              if (closeTimer.current) window.clearTimeout(closeTimer.current);
            }}
            onMouseLeave={scheduleClose}
          >
            {/* THÊM KEY ĐỂ COMPONENT RE-RENDER MƯỢT HƠN */}
            <MegaMenu key={activeMenu} data={menus[activeMenu!]} />
          </div>
        </>
      )}
    </div>
  );
}
