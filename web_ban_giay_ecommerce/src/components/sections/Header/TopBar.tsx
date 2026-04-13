// import { useSelector } from "react-redux";
// import { RootState } from "../../../store/store";
// import { Link } from "react-router-dom";

// type TopLink = { label: string; href: string };

// export type TopBarProps = {
//     links?: TopLink[];
//     className?: string;
// };

// const defaultLinks: TopLink[] = [
//     { label: "Find a Store", href: "#" },
//     { label: "Help", href: "#" },
//     { label: "Join Us", href: "/register" },
//     { label: "Sign In", href: "/login" },
// ];

// export function TopBar({ links = defaultLinks, className = "" }: TopBarProps) {
//     const isLogin = useSelector((state: RootState) => state.auth.isLogin);
//     const user = useSelector((state: RootState) => state.auth.user);

//     const renderLinks = () => {
//         if (isLogin && user) {
//             // Lọc bỏ 'Join Us' và 'Sign In', thêm 'Hi, userName'
//             const filtered = links.filter(
//                 (item) => item.label !== "Join Us" && item.label !== "Sign In"
//             );
//             if(user.role === "admin")
//                 return [...filtered, { label: `Hi, ${user.firstName} 🙋‍♂️`, href: "/admin" }, {label: 'Sign out', href: "/home"}];
//             else
//                 return [...filtered, { label: `Hi, ${user.firstName} 🙋‍♂️`, href: "/profile" }, {label: 'Sign out', href: "/home"}];
//         }

//         return links;
//     };

//     const finalLinks = renderLinks();

//     return (
//         <div className={`border-b bg-white ${className}`}>
//             <div className="mx-auto max-w-6xl px-4 h-9 flex items-center justify-end">
//                 <ul className="flex items-center text-xs text-slate-700">
//                     {
//                     finalLinks.map((item, idx) => (
//                         <li key={item.label} className="flex items-center">
//                             {/* Dùng Link thay vì a */}
//                             <Link to={item.href} className="hover:text-slate-900">
//                             {item.label}
//                             </Link>
//                             {idx !== finalLinks.length - 1 && (
//                             <span className="mx-3 text-slate-300">|</span>
//                             )}
//                         </li>
//                     ))}
//                 </ul>
//             </div>
//         </div>
//     );
// }
import { useSelector, useDispatch } from "react-redux"; 
import { RootState } from "../../../store/store";
import { Link, useNavigate } from "react-router-dom"; 
import { logout } from "../../../store/authSlice"; 

type TopLink = { 
    label: string; 
    href: string; 
    isLogout?: boolean; // Thêm trường này để nhận diện nút logout
};

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
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isLogin = useSelector((state: RootState) => state.auth.isLogin);
    const user = useSelector((state: RootState) => state.auth.user);

    const renderLinks = () => {
        if (isLogin && user) {
            const filtered = links.filter(
                (item) => item.label !== "Join Us" && item.label !== "Sign In"
            );
            
            const userLink = { 
                label: `Hi, ${user.firstName} 🙋‍♂️`, 
                href: user.role === "admin" ? "/admin" : "/profile" 
            };
            
            // Gán thêm cờ isLogout: true cho nút Sign out
            const signOutLink = { label: 'Sign out', href: "#", isLogout: true };

            return [...filtered, userLink, signOutLink];
        }
        return links;
    };

    const finalLinks = renderLinks();

    // Hàm xử lý khi nhấn vào Link
    const handleLinkClick = (e: React.MouseEvent, item: TopLink) => {
        if (item.isLogout) {
            e.preventDefault(); // Chặn hành vi chuyển trang của thẻ Link
            dispatch(logout()); // Xóa state và localStorage
            navigate("/home");  // Điều hướng về trang chủ
        }
    };

    return (
        <div className={`border-b bg-white ${className}`}>
            <div className="mx-auto max-w-6xl px-4 h-9 flex items-center justify-end">
                <ul className="flex items-center text-xs text-slate-700">
                    {finalLinks.map((item, idx) => (
                        <li key={item.label} className="flex items-center">
                            <Link 
                                to={item.href} 
                                onClick={(e) => handleLinkClick(e, item)} // Gán sự kiện click
                                className="hover:text-slate-900 transition-colors"
                            >
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
