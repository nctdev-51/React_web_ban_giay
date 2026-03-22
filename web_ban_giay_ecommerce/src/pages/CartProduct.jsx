import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
} from "../store/cartSlice"; // Điều chỉnh đường dẫn cho đúng

function CartProduct() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Lấy danh sách sản phẩm từ Redux
  const cartItems = useSelector((state) => state.cart.items);

  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString("vi-VN") + "₫";
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + (item.price || 0) * (item.quantity || 1),
    0,
  );

  const shipping = cartItems.length > 0 ? 250000 : 0;
  const total = subtotal + shipping;

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-12 font-sans text-[#111]">
      <div className="flex flex-col lg:flex-row gap-16">
        <div className="flex-1">
          <h2 className="text-2xl font-medium mb-8">Giỏ hàng</h2>

          {cartItems.length > 0 ? (
            cartItems.map((product) => (
              <div
                key={`${product.id}-${product.selectedSize}`} // Key kết hợp ID và Size
                className="flex flex-col sm:flex-row border-b border-gray-200 pb-8 mb-8"
              >
                <div className="w-full sm:w-44 h-44 bg-[#f6f6f6] flex items-center justify-center">
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="w-full h-full object-contain mix-blend-multiply"
                  />
                </div>

                <div className="sm:ml-8 flex-1 mt-4 sm:mt-0">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="font-bold text-lg">{product.title}</h3>
                      <p className="text-gray-500">{product.category}</p>
                      <p className="text-gray-500 mt-1">
                        Kích thước: {product.selectedSize}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-medium text-lg">
                        {formatPrice(product.price)}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Số lượng: {product.quantity}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 mt-6">
                    <div className="flex items-center border border-gray-300 rounded-full px-4 py-1">
                      <button
                        onClick={() =>
                          dispatch(
                            decreaseQuantity({
                              id: product.id,
                              size: product.selectedSize,
                            }),
                          )
                        }
                        className="text-xl font-light px-2"
                      >
                        {" "}
                        -{" "}
                      </button>
                      <span className="px-4 text-sm font-medium">
                        {product.quantity}
                      </span>
                      <button
                        onClick={() =>
                          dispatch(
                            increaseQuantity({
                              id: product.id,
                              size: product.selectedSize,
                            }),
                          )
                        }
                        className="text-xl font-light px-2"
                      >
                        {" "}
                        +{" "}
                      </button>
                    </div>

                    <div className="flex gap-4 text-gray-400">
                      <button
                        onClick={() =>
                          dispatch(
                            removeFromCart({
                              id: product.id,
                              size: product.selectedSize,
                            }),
                          )
                        }
                        className="hover:text-black"
                        title="Xóa"
                      >
                        {" "}
                        🗑{" "}
                      </button>
                    </div>
                  </div>
                  <p className="mt-5 font-semibold">
                    Thành tiền:{" "}
                    {formatPrice((product.price || 0) * product.quantity)}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-lg font-medium">Giỏ hàng trống.</p>
          )}
        </div>

        {/* Cột bên phải (Tóm tắt đơn hàng) giữ nguyên, chỉ sửa lại điều kiện disabled */}
        <div className="w-full lg:w-[400px]">
          {/* ... (Giữ nguyên code phần Tóm tắt đơn hàng của bạn) ... */}
          <div className="mt-10 flex flex-col gap-3">
            <button
              onClick={() => navigate("/guest-checkout")}
              className="w-full bg-black text-white py-5 rounded-full font-medium hover:bg-gray-800 transition disabled:opacity-50"
              disabled={cartItems.length === 0}
            >
              Thanh toán không cần tài khoản
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartProduct;
