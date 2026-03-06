type MenuColumn = {
  title: string;
  links: { label: string; href: string }[];
};

export type MegaMenuData = {
  columns: MenuColumn[];
};

export function MegaMenu({ data }: { data: MegaMenuData }) {
  return (
    <div className="border-t bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-8 md:grid-cols-4">
          {data.columns.map((col) => (
            <div key={col.title}>
              <div className="text-sm font-semibold text-slate-900">
                {col.title}
              </div>
              <ul className="mt-3 space-y-2 text-sm">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="text-slate-600 hover:text-slate-900"
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
    </div>
  );
}