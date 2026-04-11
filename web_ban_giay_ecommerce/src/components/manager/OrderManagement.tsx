import { useState } from 'react';
import { Package, Truck, CheckCircle, XCircle } from 'lucide-react';

type OrderStatus = 'pending' | 'shipping' | 'completed' | 'cancelled';

interface Order {
  id: string;
  customer: string;
  date: string;
  total: number;
  status: OrderStatus;
}

const initialOrders: Order[] = [
  { id: '#ORD-0921', customer: 'Nguyễn Văn A', date: '2026-04-11', total: 2900000, status: 'pending' },
  { id: '#ORD-0922', customer: 'Trần Thị B', date: '2026-04-10', total: 7500000, status: 'shipping' },
  { id: '#ORD-0923', customer: 'Lê Văn C', date: '2026-04-09', total: 4200000, status: 'completed' },
];

export default function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  // Cấu hình UI cho từng trạng thái
  const statusConfig = {
    pending: { label: 'Đang xử lý', color: 'bg-yellow-100 text-yellow-700', icon: <Package size={14}/> },
    shipping: { label: 'Đang giao', color: 'bg-blue-100 text-blue-700', icon: <Truck size={14}/> },
    completed: { label: 'Hoàn thành', color: 'bg-green-100 text-green-700', icon: <CheckCircle size={14}/> },
    cancelled: { label: 'Đã hủy', color: 'bg-red-100 text-red-700', icon: <XCircle size={14}/> },
  };

  // Logic chuyển trạng thái tuyến tính
  const advanceStatus = (id: string, currentStatus: OrderStatus) => {
    let nextStatus: OrderStatus = currentStatus;
    if (currentStatus === 'pending') nextStatus = 'shipping';
    else if (currentStatus === 'shipping') nextStatus = 'completed';

    setOrders(orders.map(o => o.id === id ? { ...o, status: nextStatus } : o));
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-medium text-[#111] mb-6">Quản lý Đơn hàng</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-sm text-gray-600 border-b border-gray-200">
                <th className="py-3 px-4 font-medium">Mã Đơn</th>
                <th className="py-3 px-4 font-medium">Khách hàng</th>
                <th className="py-3 px-4 font-medium">Ngày đặt</th>
                <th className="py-3 px-4 font-medium">Tổng tiền</th>
                <th className="py-3 px-4 font-medium">Trạng thái</th>
                <th className="py-3 px-4 font-medium text-right">Cập nhật</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {orders.map((order) => {
                const config = statusConfig[order.status];
                return (
                  <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="py-4 px-4 font-medium text-black">{order.id}</td>
                    <td className="py-4 px-4 text-gray-700">{order.customer}</td>
                    <td className="py-4 px-4 text-gray-500">{order.date}</td>
                    <td className="py-4 px-4 font-medium text-black">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.total)}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}>
                        {config.icon} {config.label}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      {/* Nút bấm chuyển sang trạng thái tiếp theo */}
                      {order.status === 'pending' && (
                        <button onClick={() => advanceStatus(order.id, order.status)} className="text-xs bg-black text-white px-3 py-1.5 rounded hover:bg-gray-800 transition">
                          Giao hàng ngay
                        </button>
                      )}
                      {order.status === 'shipping' && (
                        <button onClick={() => advanceStatus(order.id, order.status)} className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 transition">
                          Xác nhận Đã giao
                        </button>
                      )}
                      {(order.status === 'completed' || order.status === 'cancelled') && (
                        <span className="text-xs text-gray-400 italic">Không thể đổi</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}   