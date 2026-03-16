import React from 'react';
import { useNavigate } from 'react-router-dom';

function CartProduct({
  cartData,
  loading,
  error,
  onIncrease,
  onDecrease,
  onRemove,
}) {
  const navigate = useNavigate();

  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString('vi-VN') + '₫';
  };

  const subtotal =
    cartData?.products?.reduce(
      (acc, item) => acc + (item.price || 0) * (item.quantity || 1),
      0
    ) || 0;

  const shipping = cartData?.products?.length > 0 ? 250000 : 0;
  const total = subtotal + shipping;

  if (loading) {
    return <div className="text-center p-20 font-medium">Đang tải giỏ hàng...</div>;
  }

  if (error) {
    return (
      <div className="text-center p-20 text-red-500 font-medium">
        Không tải được dữ liệu giỏ hàng: {error}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-12 font-sans text-[#111]">
      <div className="flex flex-col lg:flex-row gap-16">
        <div className="flex-1">
          <h2 className="text-2xl font-medium mb-8">Giỏ hàng</h2>

          {cartData?.products?.length > 0 ? (
            cartData.products.map((product) => (
              <div
                key={product.id}
                className="flex flex-col sm:flex-row border-b border-gray-200 pb-8 mb-8"
              >
                <div className="w-full sm:w-44 h-44 bg-[#f6f6f6] flex items-center justify-center">
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="sm:ml-8 flex-1 mt-4 sm:mt-0">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="font-bold text-lg">{product.title}</h3>
                      <p className="text-gray-500">{product.category}</p>
                      <p className="text-gray-500 mt-1">Kích thước: 35.5</p>
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
                        onClick={() => onDecrease(product.id)}
                        className="text-xl font-light px-2"
                      >
                        -
                      </button>
                      <span className="px-4 text-sm font-medium">
                        {product.quantity}
                      </span>
                      <button
                        onClick={() => onIncrease(product.id)}
                        className="text-xl font-light px-2"
                      >
                        +
                      </button>
                    </div>

                    <div className="flex gap-4 text-gray-400">
                      <button className="hover:text-black" title="Yêu thích">
                        ❤
                      </button>
                      <button
                        onClick={() => onRemove(product.id)}
                        className="hover:text-black"
                        title="Xóa"
                      >
                        🗑
                      </button>
                    </div>
                  </div>

                  <p className="text-[#8d6d1e] text-sm mt-4 italic font-medium">
                    Sắp hết hàng. Hãy đặt mua sớm.
                  </p>

                  <p className="mt-3 font-semibold">
                    Thành tiền: {formatPrice((product.price || 0) * product.quantity)}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-lg font-medium">Giỏ hàng trống.</p>
          )}
        </div>

        <div className="w-full lg:w-[400px]">
          <h2 className="text-2xl font-medium mb-8">Tóm tắt đơn hàng</h2>

          <div className="space-y-5">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Tạm tính</span>
              <span className="font-medium">{formatPrice(subtotal)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">Phí vận chuyển dự kiến</span>
              <span className="font-medium">{formatPrice(shipping)}</span>
            </div>

            <div className="flex justify-between items-center border-t border-b border-gray-200 py-5 my-2">
              <span className="font-medium">Tổng cộng</span>
              <span className="font-bold text-lg">{formatPrice(total)}</span>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-3">
            <button
              onClick={() => navigate('/guest-checkout')}
              className="w-full bg-black text-white py-5 rounded-full font-medium hover:bg-gray-800 transition"
              disabled={cartData?.products?.length === 0}
            >
              Thanh toán không cần tài khoản
            </button>

            <button className="w-full bg-black text-white py-5 rounded-full font-medium hover:bg-gray-800 transition">
              Thanh toán thành viên
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartProduct;