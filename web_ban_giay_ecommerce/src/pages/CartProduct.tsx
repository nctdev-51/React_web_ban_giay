import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
} from "../store/cartSlice";

// Format tiền tệ chuẩn VND
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

export default function CartProduct() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Lấy state và ép kiểu an toàn
  const cartItems = useSelector((state: any) => state.cart.items || []);

  const subtotal = cartItems.reduce(
    (acc: number, item: any) => acc + (item.price || 0) * (item.quantity || 1),
    0
  );

  const shipping = cartItems.length > 0 ? 250000 : 0;
  const total = subtotal + shipping;

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-12 font-sans text-[#111] min-h-[60vh]">
      <div className="flex flex-col lg:flex-row gap-16">
        {/* Cột trái: Danh sách sản phẩm */}
        <div className="flex-1">
          <h2 className="text-[24px] font-medium mb-8">Giỏ hàng</h2>

          {cartItems.length > 0 ? (
            cartItems.map((product: any) => (
              <div
                key={`${product.id}-${product.selectedSize}`}
                className="flex flex-col sm:flex-row border-b border-gray-200 pb-8 mb-8"
              >
                <Link to={`/product/${product.id}`} className="w-full sm:w-40 h-40 bg-[#f6f6f6] block cursor-pointer group">
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                  />
                </Link>

                <div className="sm:ml-8 flex-1 mt-4 sm:mt-0 flex flex-col justify-between">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <Link to={`/product/${product.id}`} className="font-medium text-lg hover:text-gray-600 transition-colors">
                        {product.title}
                      </Link>
                      <p className="text-gray-500 mt-1">{product.sport} {product.productType}</p>
                      <p className="text-gray-500 mt-1">
                        Size: <span className="text-[#111] font-medium">{product.selectedSize}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-lg">{formatPrice(product.price)}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-6">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center bg-[#f6f6f6] rounded-full px-2 py-1">
                        <button
                          onClick={() =>
                            dispatch(decreaseQuantity({ id: product.id, size: product.selectedSize }))
                          }
                          className="w-8 h-8 flex items-center justify-center text-lg rounded-full hover:bg-gray-200 transition-colors"
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-sm font-medium">{product.quantity}</span>
                        <button
                          onClick={() =>
                            dispatch(increaseQuantity({ id: product.id, size: product.selectedSize }))
                          }
                          className="w-8 h-8 flex items-center justify-center text-lg rounded-full hover:bg-gray-200 transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        dispatch(removeFromCart({ id: product.id, size: product.selectedSize }))
                      }
                      className="text-gray-400 hover:text-red-500 transition-colors underline text-sm"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-10">
              <p className="text-gray-500 text-lg mb-6">Giỏ hàng của bạn đang trống.</p>
              <Link to="/category" className="px-8 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition">
                Tiếp tục mua sắm
              </Link>
            </div>
          )}
        </div>

        {/* Cột phải: Sticky Tóm tắt đơn hàng */}
        <div className="w-full lg:w-[350px]">
          <div className="sticky top-28 bg-white">
            <h3 className="text-[24px] font-medium mb-6">Tóm tắt đơn hàng</h3>
            <div className="space-y-4 text-base">
              <div className="flex justify-between">
                <span className="text-gray-600">Tạm tính</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between pb-6 border-b border-gray-200">
                <span className="text-gray-600">Phí giao hàng</span>
                <span className="font-medium">{shipping === 0 ? "Miễn phí" : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between py-2 font-medium text-lg">
                <span>Tổng cộng</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <button
              onClick={() => navigate("/guest-checkout")}
              className="w-full bg-black text-white py-4 rounded-full font-medium hover:bg-gray-800 transition mt-8 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
              disabled={cartItems.length === 0}
            >
              Thanh toán
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}