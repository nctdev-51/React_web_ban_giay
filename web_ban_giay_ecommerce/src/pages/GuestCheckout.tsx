import { useState, useMemo, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearCart, type CartItem } from "../store/cartSlice";

/**
 * Kiểu dữ liệu của form checkout
 * Ghi rõ type để dễ kiểm soát dữ liệu nhập vào
 */
interface CheckoutForm {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
  promoCode: string;
  cardName: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
  sameBilling: boolean;
  paymentMethod: "card" | "paypal" | "applepay";
}

/**
 * Hàm format tiền tệ VNĐ
 * Đặt ngoài component để không bị tạo lại sau mỗi lần render
 */
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

export default function GuestCheckout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  /**
   * Lấy cart từ Redux store
   * Ép kiểu về CartItem[] để tránh dùng any
   */
  const cartItems = useSelector(
    (state: any) => (state.cart.items || []) as CartItem[],
  );

  /**
   * State quản lý dữ liệu form checkout
   */
  const [formData, setFormData] = useState<CheckoutForm>({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    phone: "",
    promoCode: "",
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
    sameBilling: true,
    paymentMethod: "card",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  /**
   * useMemo:
   * Chỉ tính lại tổng tiền khi cartItems thay đổi
   * Tránh mỗi lần render là reduce lại mảng sản phẩm
   */
  const summary = useMemo(() => {
    const subtotal = cartItems.reduce(
      (acc, item) => acc + (item.price || 0) * (item.quantity || 1),
      0,
    );

    const shipping = cartItems.length > 0 ? 250000 : 0;
    const total = subtotal + shipping;

    return {
      subtotal,
      shipping,
      total,
    };
  }, [cartItems]);

  /**
   * useCallback:
   * Ghi nhớ hàm xử lý input
   * Có ích khi sau này tách form ra component con
   */
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }, []);

  // Hàm mô phỏng đẩy dữ liệu lên Database
  // Hàm đẩy dữ liệu lên Database Backend thật
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newOrder = {
      customerInfo: formData,
      items: cartItems,
      totalAmount: total,
    };

    try {
      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newOrder),
      });

      if (!response.ok) {
        throw new Error("Lỗi khi tạo đơn hàng");
      }

      setOrderSuccess(true);
      dispatch(clearCart());
    } catch (error) {
      alert("Lỗi kết nối đến máy chủ. Vui lòng thử lại sau!");
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Màn hình đặt hàng thành công
   */
  if (orderSuccess) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl mb-6">
          ✓
        </div>

        <h2 className="text-3xl font-medium mb-4">Cảm ơn bạn đã đặt hàng!</h2>

        <p className="text-gray-600 mb-8">
          Chúng tôi đã gửi email xác nhận đơn hàng đến {formData.email}
        </p>

        <button
          onClick={handleContinueShopping}
          className="px-8 py-3 rounded-full bg-black text-white hover:bg-gray-800 transition"
        >
          Tiếp tục mua sắm
        </button>
      </div>
    );
  }

  /**
   * Nếu giỏ hàng trống thì không cho checkout
   */
  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
        <p className="text-xl font-medium text-gray-500">
          Giỏ hàng đang trống.
        </p>

        <Link
          to="/category"
          className="px-8 py-3 rounded-full bg-black text-white font-medium"
        >
          Quay lại cửa hàng
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#efefef] py-10 px-4">
      <div className="mx-auto max-w-5xl">
        <button
          onClick={handleBackToCart}
          className="text-sm font-medium text-[#111] hover:text-gray-600 mb-6 flex items-center gap-2"
        >
          ← Quay lại giỏ hàng
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8 items-start">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 sm:p-10 rounded-xl shadow-sm"
          >
            <h2 className="text-[24px] font-medium text-black mb-8">
              Thanh toán không cần tài khoản
            </h2>

            {/* ================= THÔNG TIN GIAO HÀNG ================= */}
            <section className="mb-8">
              <h3 className="text-[18px] font-medium mb-4">
                Thông tin giao hàng
              </h3>

              <div className="space-y-4">
                <input
                  required
                  type="email"
                  name="email"
                  placeholder="Email *"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full h-12 rounded-md border border-gray-300 px-4 text-sm outline-none focus:border-black transition-colors"
                />

                <div className="grid grid-cols-2 gap-4">
                  <input
                    required
                    type="text"
                    name="firstName"
                    placeholder="Tên *"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full h-12 rounded-md border border-gray-300 px-4 text-sm outline-none focus:border-black transition-colors"
                  />

                  <input
                    required
                    type="text"
                    name="lastName"
                    placeholder="Họ *"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full h-12 rounded-md border border-gray-300 px-4 text-sm outline-none focus:border-black transition-colors"
                  />
                </div>

                <input
                  required
                  type="text"
                  name="address"
                  placeholder="Địa chỉ đầy đủ *"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full h-12 rounded-md border border-gray-300 px-4 text-sm outline-none focus:border-black transition-colors"
                />

                <input
                  required
                  type="tel"
                  name="phone"
                  placeholder="Số điện thoại *"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full h-12 rounded-md border border-gray-300 px-4 text-sm outline-none focus:border-black transition-colors"
                />
              </div>
            </section>

            {/* ================= THANH TOÁN ================= */}
            <section className="border-t border-gray-200 pt-8">
              <h3 className="text-[18px] font-medium mb-4">
                Phương thức thanh toán
              </h3>

              <div className="space-y-3 mb-6">
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, paymentMethod: "card" }))
                  }
                  className={`w-full h-14 rounded-lg border px-4 flex items-center justify-between text-sm transition-colors ${
                    formData.paymentMethod === "card"
                      ? "border-black bg-gray-50 ring-1 ring-black"
                      : "border-gray-300 bg-white hover:border-gray-400"
                  }`}
                >
                  <span className="font-medium">Thẻ tín dụng / Ghi nợ</span>
                  <span>💳</span>
                </button>
              </div>

              {formData.paymentMethod === "card" && (
                <div className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <input
                    required
                    type="text"
                    name="cardName"
                    placeholder="Tên trên thẻ *"
                    value={formData.cardName}
                    onChange={handleChange}
                    className="w-full h-12 rounded-md border border-gray-300 bg-white px-4 text-sm outline-none focus:border-black"
                  />

                  <input
                    required
                    type="text"
                    name="cardNumber"
                    placeholder="Số thẻ *"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    className="w-full h-12 rounded-md border border-gray-300 bg-white px-4 text-sm outline-none focus:border-black"
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <input
                      required
                      type="text"
                      name="expiry"
                      placeholder="MM/YY *"
                      value={formData.expiry}
                      onChange={handleChange}
                      className="w-full h-12 rounded-md border border-gray-300 bg-white px-4 text-sm outline-none focus:border-black"
                    />

                    <input
                      required
                      type="text"
                      name="cvv"
                      placeholder="CVV *"
                      value={formData.cvv}
                      onChange={handleChange}
                      className="w-full h-12 rounded-md border border-gray-300 bg-white px-4 text-sm outline-none focus:border-black"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-8 w-full h-14 rounded-full bg-black text-white text-base font-medium hover:bg-gray-800 transition disabled:bg-gray-400 flex justify-center items-center"
              >
                {isSubmitting
                  ? "Đang xử lý..."
                  : `Thanh toán ${formatPrice(summary.total)}`}
              </button>
            </section>
          </form>

          {/* ================= TÓM TẮT ĐƠN HÀNG ================= */}
          <aside className="sticky top-24 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-[18px] font-medium mb-6">Tóm tắt đơn hàng</h3>

            <div className="space-y-4 text-sm mb-6 border-b border-gray-200 pb-6">
              <div className="flex justify-between text-gray-600">
                <span>Tạm tính</span>
                <span>{formatPrice(summary.subtotal)}</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Phí giao hàng</span>
                <span>
                  {summary.shipping === 0
                    ? "Miễn phí"
                    : formatPrice(summary.shipping)}
                </span>
              </div>

              <div className="flex justify-between font-medium text-base text-black pt-2">
                <span>Tổng thanh toán</span>
                <span>{formatPrice(summary.total)}</span>
              </div>
            </div>

            <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2">
              {cartItems.map((product) => (
                <div
                  key={`${product.id}-${product.selectedSize}`}
                  className="flex gap-4"
                >
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="w-16 h-16 object-cover bg-[#f6f6f6] rounded"
                  />

                  <div className="text-sm">
                    <p className="font-medium text-[#111] line-clamp-1">
                      {product.title}
                    </p>

                    <p className="text-gray-500 mt-1">
                      Size: {product.selectedSize} | SL: {product.quantity}
                    </p>

                    <p className="font-medium mt-1">
                      {formatPrice(product.price * product.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
