import { useEffect, useMemo, useRef, useState } from "react";
import { MegaMenu, type MegaMenuData } from "./MegaBar";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Logo } from "../../ui/Logo";
import { suggestProducts } from "../../../lib/productsApi";
import type { ProductSummary } from "../../../types/product";

type NavItem = { label: string; href: string; menuKey?: string };

const NAV: NavItem[] = [
  { label: "New & Featured", href: "/category/new", menuKey: "new" },
  { label: "Men", href: "/category/men", menuKey: "men" },
  { label: "Women", href: "/category/women", menuKey: "women" },
  { label: "Kids", href: "/category/kids", menuKey: "kids" },
  { label: "Sale", href: "/category/sale" },
];

function formatPrice(price: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}

export function MainNav() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const closeTimer = useRef<number | null>(null);
  const suggestTimer = useRef<number | null>(null);
  const blurTimer = useRef<number | null>(null);
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<ProductSummary[]>([]);
  const [isSuggestOpen, setIsSuggestOpen] = useState(false);
  const [isSuggestLoading, setIsSuggestLoading] = useState(false);

  const cartItems = useSelector((state: any) => state.cart?.items || []);
  const totalQuantity = cartItems.reduce(
    (acc: any, item: any) => acc + item.quantity,
    0,
  );

  useEffect(() => {
    const keyword = searchQuery.trim();

    if (suggestTimer.current) window.clearTimeout(suggestTimer.current);

    if (keyword.length < 2) {
      setSuggestions([]);
      setIsSuggestOpen(false);
      setIsSuggestLoading(false);
      return;
    }

    setIsSuggestLoading(true);
    suggestTimer.current = window.setTimeout(async () => {
      try {
        const data = await suggestProducts(keyword, 6);
        setSuggestions(data);
        setIsSuggestOpen(true);
      } catch (error) {
        setSuggestions([]);
        setIsSuggestOpen(false);
      } finally {
        setIsSuggestLoading(false);
      }
    }, 250);

    return () => {
      if (suggestTimer.current) window.clearTimeout(suggestTimer.current);
    };
  }, [searchQuery]);

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
          <div className="relative hidden sm:block">
            <label className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2">
              <span className="text-slate-500 text-sm">🔎</span>
              <input
                className="bg-transparent outline-none text-sm w-48 placeholder:text-slate-500"
                placeholder="Search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                onFocus={() => {
                  if (searchQuery.trim().length >= 2) setIsSuggestOpen(true);
                }}
                onBlur={() => {
                  if (blurTimer.current) window.clearTimeout(blurTimer.current);
                  blurTimer.current = window.setTimeout(
                    () => setIsSuggestOpen(false),
                    120,
                  );
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    const keyword = searchQuery.trim();
                    if (keyword) {
                      setIsSuggestOpen(false);
                      navigate(`/search?q=${encodeURIComponent(keyword)}`);
                    }
                  }
                }}
              />
            </label>

            {isSuggestOpen && (
              <div
                className="absolute left-0 right-0 mt-2 rounded-xl border border-slate-200 bg-white shadow-lg overflow-hidden z-50"
                onMouseDown={(event) => event.preventDefault()}
              >
                {isSuggestLoading ? (
                  <div className="px-4 py-3 text-sm text-slate-500">
                    Dang tim kiem...
                  </div>
                ) : suggestions.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-slate-500">
                    Khong co san pham goi y.
                  </div>
                ) : (
                  <div className="max-h-72 overflow-auto">
                    {suggestions.map((item) => (
                      <Link
                        key={item.id}
                        to={`/product/${item.id}`}
                        className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50"
                        onClick={() => setIsSuggestOpen(false)}
                      >
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="h-12 w-12 rounded-md object-cover bg-slate-100"
                          loading="lazy"
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-900 truncate">
                            {item.title}
                          </p>
                          <p className="text-xs text-slate-500 truncate">
                            {item.sport} {item.productType}
                          </p>
                        </div>
                        <span className="ml-auto text-sm font-medium text-slate-900">
                          {formatPrice(item.price)}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}

                {suggestions.length > 0 && (
                  <button
                    className="w-full text-left px-4 py-2 text-xs font-medium text-slate-600 border-t border-slate-100 hover:bg-slate-50"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => {
                      const keyword = searchQuery.trim();
                      if (keyword) {
                        setIsSuggestOpen(false);
                        navigate(`/search?q=${encodeURIComponent(keyword)}`);
                      }
                    }}
                  >
                    Xem tat ca ket qua
                  </button>
                )}
              </div>
            )}
          </div>

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
