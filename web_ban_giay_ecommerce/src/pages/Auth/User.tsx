import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import type { ProductSummary } from "../../types/product";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { getUserOrderHistory } from "../../api/userApi";

type OrderHistoryItem = {
  _id: string;
  createdAt: string;
  totalAmount: number;
  status: string;
  items: Array<{
    id: number;
    title: string;
    price: number;
    quantity: number;
    selectedSize: number;
    thumbnail?: string;
  }>;
};

const mockFavorites = [
  {
    id: 1,
    title: "Nike Air Max 270",
    sport: "Running",
    productType: "Shoes",
    price: 3200000,
    thumbnail:
      "https://static.nike.com/a/images/f_auto,cs_srgb/w_960,c_limit/05289fe0-ebdf-4fdd-a586-8e8d7361bbf6/nike-just-do-it.png",
  },
  {
    id: 2,
    title: "LeBron XX",
    sport: "Basketball",
    productType: "Shoes",
    price: 4500000,
    thumbnail:
      "https://static.nike.com/a/images/f_auto,cs_srgb/w_960,c_limit/96e6f2e9-c107-40ca-b76d-a97c46dc94b4/nike-just-do-it.png",
  },
  {
    id: 3,
    title: "Nike Dri-FIT",
    sport: "Training",
    productType: "Apparel",
    price: 850000,
    thumbnail:
      "https://static.nike.com/a/images/f_auto,cs_srgb/w_500,c_limit/1f6dcd2f-749b-412d-938b-abac8e505a10/nike-just-do-it.png",
  },
] as unknown as ProductSummary[];

const User: React.FC = () => {
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const [orders, setOrders] = useState<OrderHistoryItem[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  const carouselRef = useRef<HTMLDivElement>(null);
  const user = useSelector((state: RootState) => state.auth.user as any);

  useEffect(() => {
    const timer = setTimeout(() => {
      setProducts(mockFavorites);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!user?.email) {
          setOrders([]);
          setOrdersLoading(false);
          return;
        }

        setOrdersLoading(true);
        const data = await getUserOrderHistory(user.email);
        setOrders(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Lỗi lấy lịch sử đơn hàng:", error);
        setOrders([]);
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchOrders();
  }, [user?.email]);

  const scrollLeft = useCallback(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -316, behavior: "smooth" });
    }
  }, []);

  const scrollRight = useCallback(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 316, behavior: "smooth" });
    }
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN");
  };

  const avatarLabel = `${user?.firstName?.charAt(0) || ""}${user?.surname?.charAt(0) || ""}`
    .toUpperCase() || "U";

  let joinedDate = "Any Day";

  if (user?.createdAt) {
    const dateObj = new Date(user.createdAt);

    if (!isNaN(dateObj.getTime())) {
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      joinedDate = `${monthNames[dateObj.getMonth()]} ${dateObj.getFullYear()}`;
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 font-sans text-neutral-900 min-h-[70vh]">
      <main className="flex flex-wrap justify-between items-center pb-10 mb-10 border-b border-gray-200 gap-5">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-medium text-2xl">
            {avatarLabel}
          </div>
          <div>
            <h1 className="text-3xl font-medium mb-2">
              {user?.firstName || ""} {user?.surname || ""}
            </h1>
            <p className="text-base text-gray-500 m-0">
              Nike Member Since {joinedDate}
            </p>
          </div>
        </div>
      </main>

      <section className="mb-16">
        <h3 className="text-[24px] font-medium m-0 mb-6">Interests</h3>
        <div className="mt-5 bg-gray-50 p-8 rounded-xl text-center md:text-left flex flex-col md:flex-row items-center justify-between border border-gray-200">
          <p className="text-base text-gray-600 max-w-xl mb-6 md:mb-0">
            Add your interests to shop a collection of products that are based on what you're into.
          </p>
        </div>
      </section>

      <section className="mb-16">
        <div className="flex justify-between items-end mb-6">
          <h3 className="text-[24px] font-medium m-0">Lịch sử mua hàng</h3>
          {user?.email && (
            <span className="text-sm text-gray-500">{user.email}</span>
          )}
        </div>

        {ordersLoading ? (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-gray-500">
            Đang tải lịch sử đơn hàng...
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-gray-500">
            Bạn chưa có đơn hàng nào.
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Mã đơn</p>
                    <p className="font-semibold break-all">{order._id}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Ngày đặt</p>
                    <p className="font-medium">{formatDate(order.createdAt)}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Trạng thái</p>
                    <p className="font-medium">{order.status}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Tổng tiền</p>
                    <p className="font-semibold">{formatPrice(order.totalAmount)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {order.items?.map((item, index) => (
                    <div
                      key={`${order._id}-${item.id}-${index}`}
                      className="flex gap-4 border border-gray-100 rounded-lg p-3 bg-gray-50"
                    >
                      <img
                        src={item.thumbnail || "https://via.placeholder.com/96"}
                        alt={item.title}
                        className="w-20 h-20 object-cover rounded-md bg-white"
                      />

                      <div className="flex-1">
                        <h4 className="font-medium text-base">{item.title}</h4>
                        <p className="text-sm text-gray-500 mt-1">
                          Size: {item.selectedSize}
                        </p>
                        <p className="text-sm text-gray-500">
                          Số lượng: {item.quantity}
                        </p>
                        <p className="text-sm font-medium mt-1">
                          {formatPrice(item.price)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mb-16">
        <div className="flex justify-between items-end mb-6">
          <h3 className="text-[24px] font-medium m-0">Find your next favourite</h3>
          <div className="flex gap-2">
            <button
              onClick={scrollLeft}
              className="w-12 h-12 rounded-full bg-[#f5f5f5] hover:bg-gray-200 transition-colors"
            >
              {"<"}
            </button>
            <button
              onClick={scrollRight}
              className="w-12 h-12 rounded-full bg-[#f5f5f5] hover:bg-gray-200 transition-colors"
            >
              {">"}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40 animate-pulse">
            Loading suggestions...
          </div>
        ) : (
          <div
            ref={carouselRef}
            className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory hide-scrollbar"
          >
            {products.map((product) => (
              <Link
                to={`/product/${product.id}`}
                key={product.id}
                className="min-w-[300px] snap-start group block"
              >
                <div className="bg-[#f6f6f6] rounded-md overflow-hidden mb-3 aspect-square">
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div>
                  <h4 className="text-base font-medium mb-1">{product.title}</h4>
                  <p className="text-base text-gray-500 mb-1">{product.sport}</p>
                  <p className="text-base font-medium m-0">{formatPrice(product.price)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <style
        dangerouslySetInnerHTML={{
          __html:
            ".hide-scrollbar::-webkit-scrollbar { display: none; } .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }",
        }}
      />
    </div>
  );
};

export default User;