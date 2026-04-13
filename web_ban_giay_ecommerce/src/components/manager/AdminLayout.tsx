import { useState } from "react";
import { LayoutDashboard, Box, ShoppingCart, LogOut } from "lucide-react";
import AdminDashboard from "./AdminDashboard";
import ProductManagement from "./ProductManagement";
import OrderManagement from "./OrderManagement";

export default function AdminLayout() {
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "products" | "orders"
  >("dashboard");

  const menuItems = [
    { id: "dashboard", label: "Thống kê", icon: <LayoutDashboard size={20} /> },
    { id: "products", label: "Sản phẩm", icon: <Box size={20} /> },
    { id: "orders", label: "Đơn hàng", icon: <ShoppingCart size={20} /> },
  ];

  return (
    /* ĐIỂM CỐT LÕI: fixed inset-0 z-50 
       Ép toàn bộ Layout đóng băng vừa khít màn hình, vô hiệu hóa thanh cuộn gốc của trang web */
    <div className="fixed inset-0 z-50 flex bg-[#f9fafb] font-sans text-[#111]">
      {/* 1. SIDEBAR CỐ ĐỊNH TẠI CHỖ */}
      <aside className="w-64 bg-black text-white flex flex-col h-full flex-shrink-0 shadow-2xl z-20">
        <div className="p-8">
          <h2 className="text-2xl font-black tracking-tighter italic text-white leading-none">
            TQS ADMIN
          </h2>
          <div className="mt-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
              Hệ thống đang chạy
            </span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl transition-all duration-300 ${
                activeTab === item.id
                  ? "bg-white text-black shadow-[0_10px_20px_rgba(255,255,255,0.1)] scale-[1.02]"
                  : "text-gray-400 hover:bg-gray-900 hover:text-white"
              }`}
            >
              {item.icon}
              <span className="font-bold text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-gray-800">
          <button className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-red-500 w-full transition-colors font-bold text-sm">
            <LogOut size={20} />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* 2. CỘT BÊN PHẢI (Chứa Header và Nội dung) */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* HEADER CỐ ĐỊNH - KHÔNG BAO GIỜ BỊ CUỘN */}
        <header className="h-[80px] bg-white/80 backdrop-blur-md border-b border-gray-200 px-8 flex justify-between items-center flex-shrink-0 z-10">
          <h2 className="text-xl font-bold text-gray-900 capitalize tracking-tight">
            {menuItems.find((i) => i.id === activeTab)?.label}
          </h2>

          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-gray-900">Quốc Trần</p>
              <p className="text-[11px] text-gray-500 font-medium">
                Quản trị viên hệ thống
              </p>
            </div>
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center font-black text-white shadow-md">
              QT
            </div>
          </div>
        </header>

        {/* NỘI DUNG CHÍNH: CHỈ CUỘN TRONG KHU VỰC NÀY */}
        {/* overflow-y-auto cho phép phần main tạo thanh cuộn riêng */}
        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-[1200px] mx-auto pb-10">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {activeTab === "dashboard" && <AdminDashboard />}
              {activeTab === "products" && <ProductManagement />}
              {activeTab === "orders" && <OrderManagement />}
            </div>
          </div>
        </main>
      </div>

      {/* Tùy chỉnh thanh cuộn cho mượt mà (Có thể bỏ vào index.css) */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </div>
  );
}
