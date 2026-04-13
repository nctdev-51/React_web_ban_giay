import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { Link } from "react-router-dom";

type TopLink = { label: string; href: string };

export type TopBarProps = {
    links?: TopLink[];
    className?: string;
};

const defaultLinks: TopLink[] = [
    { label: "Find a Store", href: "#" },
    { label: "Help", href: "#" },
    { label: "Join Us", href: "/register" },
    { label: "Sign In", href: "/login" },
];

export function TopBar({ links = defaultLinks, className = "" }: TopBarProps) {
    const isLogin = useSelector((state: RootState) => state.auth.isLogin);
    const user = useSelector((state: RootState) => state.auth.user);

    const renderLinks = () => {
        if (isLogin && user) {
            // Lọc bỏ 'Join Us' và 'Sign In', thêm 'Hi, userName'
            const filtered = links.filter(
                (item) => item.label !== "Join Us" && item.label !== "Sign In"
            );
            if(user.role === "admin")
                return [...filtered, { label: `Hi, ${user.firstName} 🙋‍♂️`, href: "/admin" }];
            else
                return [...filtered, { label: `Hi, ${user.firstName} 🙋‍♂️`, href: "/profile" }];
        }

        return links;
    };

    const finalLinks = renderLinks();

    return (
        <div className={`border-b bg-white ${className}`}>
            <div className="mx-auto max-w-6xl px-4 h-9 flex items-center justify-end">
                <ul className="flex items-center text-xs text-slate-700">
                    {
                    finalLinks.map((item, idx) => (
                        <li key={item.label} className="flex items-center">
                            {/* Dùng Link thay vì a */}
                            <Link to={item.href} className="hover:text-slate-900">
                            {item.label}
                            </Link>
                            {idx !== finalLinks.length - 1 && (
                            <span className="mx-3 text-slate-300">|</span>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
