type TopLink = { label: string; href: string };

export type TopBarProps = {
  links?: TopLink[];
  className?: string;
};

const defaultLinks: TopLink[] = [
  { label: "Find a Store", href: "#" },
  { label: "Help", href: "#" },
  { label: "Join Us", href: "#" },
  { label: "Sign In", href: "#" },
];

export function TopBar({ links = defaultLinks, className = "" }: TopBarProps) {
  return (
    <div className={`border-b bg-white ${className}`}>
      <div className="mx-auto max-w-6xl px-4 h-9 flex items-center justify-end">
        <ul className="flex items-center text-xs text-slate-700">
          {links.map((item, idx) => (
            <li key={item.label} className="flex items-center">
              <a href={item.href} className="hover:text-slate-900">
                {item.label}
              </a>
              {idx !== links.length - 1 && (
                <span className="mx-3 text-slate-300">|</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}