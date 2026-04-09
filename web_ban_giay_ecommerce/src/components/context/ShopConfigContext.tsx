import {
  createContext,
  useContext,
  useMemo,
  useCallback,
  ReactNode,
} from "react";

/**
 * Context này KHÔNG thay Redux.
 * Context chỉ dùng cho các config UI ít thay đổi:
 * - phí ship
 * - format tiền
 *
 * Redux phù hợp cho business state lớn như cart, user, order...
 * Context phù hợp cho theme, language, config hiển thị...
 */
interface ShopConfigContextType {
  shippingFee: number;
  formatPrice: (price: number) => string;
}

const ShopConfigContext = createContext<ShopConfigContextType | null>(null);

export function ShopConfigProvider({ children }: { children: ReactNode }) {
  /**
   * Giá trị config dùng chung
   * Có thể đổi sau này thành lấy từ API hoặc admin config
   */
  const shippingFee = 250000;

  /**
   * useCallback:
   * Giữ nguyên tham chiếu hàm giữa các lần render
   * -> có ích khi truyền hàm này xuống component con đã dùng memo
   */
  const formatPrice = useCallback((price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  }, []);

  /**
   * useMemo:
   * Tránh tạo lại object value của Context mỗi lần render
   * Nếu không memo, tất cả component dùng context có thể render lại không cần thiết
   */
  const value = useMemo(
    () => ({
      shippingFee,
      formatPrice,
    }),
    [shippingFee, formatPrice],
  );

  return (
    <ShopConfigContext.Provider value={value}>
      {children}
    </ShopConfigContext.Provider>
  );
}

export function useShopConfig() {
  const context = useContext(ShopConfigContext);

  if (!context) {
    throw new Error(
      "useShopConfig phải được dùng bên trong ShopConfigProvider",
    );
  }

  return context;
}
