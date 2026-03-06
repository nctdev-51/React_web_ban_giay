import { useMemo, useRef, useState } from "react";
import { MegaMenu, type MegaMenuData } from "./MegaBar";

type NavItem = { label: string; href: string; menuKey?: string };

const NAV: NavItem[] = [
  { label: "New & Featured", href: "#new", menuKey: "new" },
  { label: "Men", href: "#men", menuKey: "men" },
  { label: "Women", href: "#women", menuKey: "women" },
  { label: "Kids", href: "#kids", menuKey: "kids" },
  { label: "Sale", href: "#sale" }, // không dropdown
];

export function MainNav() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const closeTimer = useRef<number | null>(null);

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
          }
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
    []
  );

  function openMenu(key: string) {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setActiveMenu(key);
  }

  function scheduleClose() {
    // delay nhẹ để người dùng rê xuống panel không bị tắt ngay
    closeTimer.current = window.setTimeout(() => setActiveMenu(null), 120);
  }

  const hasMenu = activeMenu && menus[activeMenu];

  return (
    <div
      className="relative bg-white"
      onMouseLeave={scheduleClose}
      onMouseEnter={() => {
        if (closeTimer.current) window.clearTimeout(closeTimer.current);
      }}
    >
      {/* Main row */}
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2">
          <div className="h-7 w-7 rounded bg-black" aria-hidden />
          <span className="sr-only">Home</span>
        </a>

        {/* Center nav */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          {NAV.map((item) => {
            const isDropdown = Boolean(item.menuKey);
            return (
              <a
                key={item.label}
                href={item.href}
                className="text-slate-900 hover:opacity-70 py-4"
                onMouseEnter={() => {
                  if (item.menuKey) openMenu(item.menuKey);
                  else setActiveMenu(null);
                }}
              >
                {item.label}
              </a>
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

          <button className="h-9 w-9 grid place-items-center rounded-full hover:bg-slate-100" aria-label="Favorites">
            ♡
          </button>
          <button className="h-9 w-9 grid place-items-center rounded-full hover:bg-slate-100" aria-label="Cart">
            🛍
          </button>
        </div>
      </div>

      {/* Dropdown panel */}
      {hasMenu && (
        <>
          {/* overlay */}
          <div className="fixed inset-0 top-16 bg-gray/20" />

          {/* panel */}
          <div
            className="absolute left-0 right-0 top-16"
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