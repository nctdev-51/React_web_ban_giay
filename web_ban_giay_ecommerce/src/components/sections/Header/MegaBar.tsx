import { Link } from "react-router-dom";

type MenuColumn = {
  title: string;
  links: { label: string; href: string }[];
};

export type MegaMenuData = {
  columns: MenuColumn[];
};

export function MegaMenu({ data }: { data: MegaMenuData }) {
  return (
    <div className="border-t bg-white pb-12 pt-8">
      <div className="mx-auto max-w-[1200px] flex justify-center gap-12 lg:gap-20">
        {data.columns.map((col) => (
          <div key={col.title} className="w-[160px]">
            <div className="text-base font-medium text-black mb-4">
              {col.title}
            </div>
            <ul className="space-y-3 text-sm">
              {col.links.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="text-gray-500 hover:text-black font-medium transition-colors"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
