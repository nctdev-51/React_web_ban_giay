import { useEffect, useState, type ReactNode } from "react";
import { Package, Truck, CheckCircle, XCircle } from "lucide-react";
import { getAllOrders, updateOrderStatus } from "../../api/staffApi";

type OrderStatus = "Processing" | "Đang giao" | "Hoàn thành" | "Đã hủy";

type Order = {
  _id: string;
  customerInfo: {
    email?: string;
    firstName?: string;
    lastName?: string;
    address?: string;
    phone?: string;
    paymentMethod?: string;
  };
  totalAmount: number;
  status?: string;
  createdAt: string;
};

const allStatuses: OrderStatus[] = [
  "Processing",
  "Đang giao",
  "Hoàn thành",
  "Đã hủy",
];

const statusConfig: Record<
  OrderStatus,
  { label: string; color: string; icon: ReactNode }
> = {
  Processing: {
    label: "Đang xử lý",
    color: "bg-yellow-100 text-yellow-700",
    icon: <Package size={14} />,
  },
  "Đang giao": {
    label: "Đang giao",
    color: "bg-blue-100 text-blue-700",
    icon: <Truck size={14} />,
  },
  "Hoàn thành": {
    label: "Hoàn thành",
    color: "bg-green-100 text-green-700",
    icon: <CheckCircle size={14} />,
  },
  "Đã hủy": {
    label: "Đã hủy",
    color: "bg-red-100 text-red-700",
    icon: <XCircle size={14} />,
  },
};

function normalizeStatus(status?: string): OrderStatus {
  if (status === "Đang giao") return "Đang giao";
  if (status === "Hoàn thành") return "Hoàn thành";
  if (status === "Đã hủy") return "Đã hủy";
  return "Processing";
}

export default function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<Record<string, OrderStatus>>(
    {}
  );
  const [savingId, setSavingId] = useState<string | null>(null);

  const fetchOrdersList = async () => {
    try {
      setLoading(true);

      const data = await getAllOrders();
      const ordersData: Order[] = Array.isArray(data) ? data : [];

      setOrders(ordersData);

      const statusMap: Record<string, OrderStatus> = {};
      ordersData.forEach((order) => {
        statusMap[order._id] = normalizeStatus(order.status);
      });
      setSelectedStatus(statusMap);
    } catch (error: any) {
      console.error("Lỗi lấy đơn hàng:", error);
      alert(error?.message || "Không thể tải đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrdersList();
  }, []);

  const getCustomerName = (order: Order) => {
    const fullName = [order.customerInfo?.firstName, order.customerInfo?.lastName]
      .filter(Boolean)
      .join(" ")
      .trim();

    return fullName || order.customerInfo?.email || "Ẩn danh";
  };

  const handleSaveStatus = async (orderId: string) => {
    try {
      setSavingId(orderId);
      const status = selectedStatus[orderId] || "Processing";
      await updateOrderStatus(orderId, status);
      await fetchOrdersList();
      alert("Cập nhật trạng thái đơn hàng thành công");
    } catch (error: any) {
      alert(error?.message || "Cập nhật trạng thái thất bại");
    } finally {
      setSavingId(null);
    }
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
                <th className="py-3 px-4 font-medium">Trạng thái hiện tại</th>
                <th className="py-3 px-4 font-medium">Đổi trạng thái</th>
                <th className="py-3 px-4 font-medium text-right">Lưu</th>
              </tr>
            </thead>

            <tbody className="text-sm">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-500">
                    Đang tải đơn hàng...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-500">
                    Chưa có đơn hàng nào.
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const currentStatus = normalizeStatus(order.status);
                  const config = statusConfig[currentStatus];
                  const selected = selectedStatus[order._id] || currentStatus;

                  return (
                    <tr
                      key={order._id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition"
                    >
                      <td className="py-4 px-4 font-medium text-black">{order._id}</td>
                      <td className="py-4 px-4 text-gray-700">{getCustomerName(order)}</td>
                      <td className="py-4 px-4 text-gray-500">
                        {new Date(order.createdAt).toLocaleString("vi-VN")}
                      </td>
                      <td className="py-4 px-4 font-medium text-black">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(order.totalAmount)}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}
                        >
                          {config.icon} {config.label}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <select
                          value={selected}
                          onChange={(e) =>
                            setSelectedStatus((prev) => ({
                              ...prev,
                              [order._id]: e.target.value as OrderStatus,
                            }))
                          }
                          className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                        >
                          {allStatuses.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => handleSaveStatus(order._id)}
                          disabled={savingId === order._id}
                          className="text-xs bg-black text-white px-3 py-2 rounded hover:bg-gray-800 transition disabled:opacity-60"
                        >
                          {savingId === order._id ? "Đang lưu..." : "Lưu"}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}