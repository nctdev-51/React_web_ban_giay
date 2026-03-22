import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux"; // <-- Thêm import Redux

// Xóa các props (cartData, loading, error) đi vì giờ ta dùng Redux
function GuestCheckout() {
  const navigate = useNavigate();

  // <-- Lấy giỏ hàng trực tiếp từ Redux thay vì truyền props
  const cartItems = useSelector((state) => state.cart.items);

  const [formData, setFormData] = useState({
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

  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString("vi-VN") + "₫";
  };

  // Gán thẳng products bằng cartItems của Redux
  const products = cartItems || [];

  const subtotal = products.reduce(
    (acc, item) => acc + (item.price || 0) * (item.quantity || 1),
    0,
  );

  const shipping = products.length > 0 ? 250000 : 0;
  const total = subtotal + shipping;

  const freeShipTarget = 4000000;
  const remainForFreeShip = Math.max(freeShipTarget - subtotal, 0);
  const progressPercent = Math.min((subtotal / freeShipTarget) * 100, 100);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Đặt hàng thành công (demo)");
  };

  // Nếu giỏ hàng trống thì báo lỗi và có nút quay lại (Giữ nguyên logic của bạn bạn)
  if (products.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-xl font-medium">Giỏ hàng đang trống.</p>
        <Link to="/" className="px-6 py-3 rounded-full bg-black text-white">
          Quay lại giỏ hàng
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#efefef] py-10 px-4">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6">
          <button
            onClick={() => navigate("/")}
            className="text-sm underline text-gray-700"
          >
            ← Quay lại giỏ hàng
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start">
          <form
            onSubmit={handleSubmit}
            className="bg-transparent px-2 sm:px-6 lg:px-10"
          >
            <h2 className="text-[22px] font-semibold text-black mb-6">
              Thanh toán không cần tài khoản
            </h2>

            <section className="mb-8">
              <h3 className="text-[18px] font-semibold mb-4">Giao hàng</h3>

              <div className="space-y-3">
                <input
                  type="email"
                  name="email"
                  placeholder="Email *"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full h-12 rounded border border-gray-300 bg-white px-4 text-sm outline-none focus:border-black"
                />

                <p className="text-[11px] text-gray-500">
                  Nhận thông báo đơn hàng và thông tin giao hàng qua email.
                </p>

                <input
                  type="text"
                  name="firstName"
                  placeholder="Tên *"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full h-12 rounded border border-gray-300 bg-white px-4 text-sm outline-none focus:border-black"
                />

                <input
                  type="text"
                  name="lastName"
                  placeholder="Họ *"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full h-12 rounded border border-gray-300 bg-white px-4 text-sm outline-none focus:border-black"
                />

                <input
                  type="text"
                  name="address"
                  placeholder="Địa chỉ, phường/xã, quận/huyện *"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full h-12 rounded border border-gray-300 bg-white px-4 text-sm outline-none focus:border-black"
                />

                <p className="text-[11px] text-gray-500 underline cursor-pointer w-fit">
                  Nhập địa chỉ thủ công
                </p>

                <input
                  type="text"
                  name="phone"
                  placeholder="Số điện thoại *"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full h-12 rounded border border-gray-300 bg-white px-4 text-sm outline-none focus:border-black"
                />

                <p className="text-[11px] text-gray-500">
                  Dùng để liên hệ khi có vấn đề với đơn hàng.
                </p>

                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    name="sameBilling"
                    checked={formData.sameBilling}
                    onChange={handleChange}
                    className="h-4 w-4"
                  />
                  Địa chỉ thanh toán giống địa chỉ giao hàng
                </label>
              </div>
            </section>

            <section className="mb-8 border-t border-gray-300 pt-6">
              <h3 className="text-[18px] font-semibold mb-4">Vận chuyển</h3>

              <div className="text-sm text-gray-700">
                <p className="font-medium mb-1">
                  {formatPrice(shipping)} giao hàng
                </p>
                <p className="text-gray-500">Giao hàng tiêu chuẩn</p>
                <p className="text-gray-500">Dự kiến: 20/03 - 27/03</p>
              </div>
            </section>

            <section className="border-t border-gray-300 pt-6">
              <h3 className="text-[18px] font-semibold mb-4">Thanh toán</h3>

              <p className="text-sm mb-3">Bạn có mã giảm giá?</p>

              <div className="flex gap-3 mb-6">
                <input
                  type="text"
                  name="promoCode"
                  placeholder="Nhập mã"
                  value={formData.promoCode}
                  onChange={handleChange}
                  className="flex-1 h-12 rounded border border-gray-300 bg-white px-4 text-sm outline-none focus:border-black"
                />
                <button
                  type="button"
                  className="h-12 px-5 rounded-full border border-gray-400 bg-[#e5e5e5] text-sm hover:bg-gray-300"
                >
                  Áp dụng
                </button>
              </div>

              <div className="space-y-3 mb-6">
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, paymentMethod: "card" }))
                  }
                  className={`w-full h-12 rounded-lg border px-4 flex items-center justify-between text-sm ${
                    formData.paymentMethod === "card"
                      ? "border-black bg-white"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  <span>Thẻ tín dụng hoặc thẻ ghi nợ</span>
                  <span>💳</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      paymentMethod: "paypal",
                    }))
                  }
                  className={`w-full h-12 rounded-lg border px-4 flex items-center justify-between text-sm ${
                    formData.paymentMethod === "paypal"
                      ? "border-black bg-white"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  <span>PayPal</span>
                  <span className="font-semibold text-blue-600">PayPal</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      paymentMethod: "applepay",
                    }))
                  }
                  className={`w-full h-12 rounded-lg border px-4 flex items-center justify-between text-sm ${
                    formData.paymentMethod === "applepay"
                      ? "border-black bg-white"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  <span>Apple Pay</span>
                  <span>Pay</span>
                </button>
              </div>

              {formData.paymentMethod === "card" && (
                <div className="space-y-3">
                  <p className="text-sm text-gray-700">
                    Nhập thông tin thanh toán:
                  </p>

                  <input
                    type="text"
                    name="cardName"
                    placeholder="Tên trên thẻ *"
                    value={formData.cardName}
                    onChange={handleChange}
                    className="w-full h-12 rounded border border-gray-300 bg-white px-4 text-sm outline-none focus:border-black"
                  />

                  <div className="relative">
                    <input
                      type="text"
                      name="cardNumber"
                      placeholder="Số thẻ *"
                      value={formData.cardNumber}
                      onChange={handleChange}
                      className="w-full h-12 rounded border border-gray-300 bg-white px-4 pr-10 text-sm outline-none focus:border-black"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                      🔒
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      name="expiry"
                      placeholder="MM/YY *"
                      value={formData.expiry}
                      onChange={handleChange}
                      className="w-full h-12 rounded border border-gray-300 bg-white px-4 text-sm outline-none focus:border-black"
                    />

                    <input
                      type="text"
                      name="cvv"
                      placeholder="Mã CVV *"
                      value={formData.cvv}
                      onChange={handleChange}
                      className="w-full h-12 rounded border border-gray-300 bg-white px-4 text-sm outline-none focus:border-black"
                    />
                  </div>

                  <p className="text-[11px] text-gray-500 underline text-center">
                    CVV là gì?
                  </p>
                </div>
              )}

              <p className="text-[11px] text-gray-500 mt-6 leading-5">
                Khi bấm <span className="font-medium">Đặt hàng</span>, bạn đồng
                ý với Điều khoản sử dụng và Chính sách quyền riêng tư.
              </p>

              <button
                type="submit"
                className="mt-6 w-full sm:w-[180px] h-12 rounded-full bg-[#d9d9d9] text-sm font-medium text-gray-700 border border-gray-400 hover:bg-[#cfcfcf]"
              >
                Đặt hàng
              </button>
            </section>
          </form>

          <aside className="border border-gray-300 bg-[#f7f7f7] p-5">
            <h3 className="text-[18px] font-semibold mb-5">Tóm tắt đơn hàng</h3>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span>Tạm tính</span>
                <span>{formatPrice(subtotal)}</span>
              </div>

              <div className="flex items-center justify-between">
                <span>Phí ship</span>
                <span>{formatPrice(shipping)}</span>
              </div>

              {remainForFreeShip > 0 ? (
                <div className="text-[12px] text-gray-600">
                  Thêm {formatPrice(remainForFreeShip)} nữa để được miễn phí vận
                  chuyển.
                </div>
              ) : (
                <div className="text-[12px] text-green-700 font-medium">
                  Bạn đã đủ điều kiện miễn phí vận chuyển.
                </div>
              )}

              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-600 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="border-t border-gray-300 pt-4 flex items-center justify-between font-semibold">
                <span>Tổng</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-300 space-y-4">
              {products.map((product) => (
                <div key={product.id} className="flex gap-4">
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="w-20 h-20 object-cover bg-white"
                  />

                  <div className="text-sm leading-5">
                    <p className="font-semibold">{product.title}</p>
                    <p className="text-gray-600">{product.category}</p>
                    <p className="text-gray-600">Kích thước: 35.5</p>
                    <p className="text-gray-600">
                      Số lượng: {product.quantity}
                    </p>
                    <p className="mt-1 font-medium">
                      {formatPrice((product.price || 0) * product.quantity)}
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

export default GuestCheckout;
