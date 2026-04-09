import { memo } from "react";

interface OrderSummaryProps {
  subtotal: number;
  shipping: number;
  total: number;
  hasItems: boolean;
  formatPrice: (price: number) => string;
  onCheckout: () => void;
}

/**
 * Tách riêng phần tóm tắt đơn hàng để:
 * 1) code sạch hơn
 * 2) dễ dùng React.memo
 * 3) dễ giải thích về component hóa trong báo cáo
 */
const OrderSummary = memo(function OrderSummary({
  subtotal,
  shipping,
  total,
  hasItems,
  formatPrice,
  onCheckout,
}: OrderSummaryProps) {
  return (
    <div className="sticky top-28 bg-white">
      <h3 className="text-[24px] font-medium mb-6">Tóm tắt đơn hàng</h3>

      <div className="space-y-4 text-base">
        <div className="flex justify-between">
          <span className="text-gray-600">Tạm tính</span>
          <span className="font-medium">{formatPrice(subtotal)}</span>
        </div>

        <div className="flex justify-between pb-6 border-b border-gray-200">
          <span className="text-gray-600">Phí giao hàng</span>
          <span className="font-medium">
            {shipping === 0 ? "Miễn phí" : formatPrice(shipping)}
          </span>
        </div>

        <div className="flex justify-between py-2 font-medium text-lg">
          <span>Tổng cộng</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>

      <button
        onClick={onCheckout}
        className="w-full bg-black text-white py-4 rounded-full font-medium hover:bg-gray-800 transition mt-8 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
        disabled={!hasItems}
      >
        Thanh toán
      </button>
    </div>
  );
});

export default OrderSummary;