import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface ProductDetailUiContextValue {
  selectedSize: number | null;
  quantity: number;
  sizeError: boolean;
  showToast: boolean;
  setSelectedSize: (size: number | null) => void;
  setQuantity: (nextQuantity: number) => void;
  markSizeRequired: () => void;
  clearSizeError: () => void;
  showAddedToast: () => void;
  resetUiState: () => void;
}

const ProductDetailUiContext = createContext<ProductDetailUiContextValue | undefined>(
  undefined,
);

export function ProductDetailUiProvider({ children }: { children: ReactNode }) {
  const [selectedSize, setSelectedSizeState] = useState<number | null>(null);
  const [quantity, setQuantityState] = useState(1);
  const [sizeError, setSizeError] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const setSelectedSize = useCallback((size: number | null) => {
    setSelectedSizeState(size);
    if (size) {
      setSizeError(false);
    }
  }, []);

  const setQuantity = useCallback((nextQuantity: number) => {
    setQuantityState(Math.max(1, nextQuantity));
  }, []);

  const markSizeRequired = useCallback(() => {
    setSizeError(true);
  }, []);

  const clearSizeError = useCallback(() => {
    setSizeError(false);
  }, []);

  const showAddedToast = useCallback(() => {
    setShowToast(true);
    window.setTimeout(() => {
      setShowToast(false);
    }, 3000);
  }, []);

  const resetUiState = useCallback(() => {
    setSelectedSizeState(null);
    setQuantityState(1);
    setSizeError(false);
    setShowToast(false);
  }, []);

  const value = useMemo(
    () => ({
      selectedSize,
      quantity,
      sizeError,
      showToast,
      setSelectedSize,
      setQuantity,
      markSizeRequired,
      clearSizeError,
      showAddedToast,
      resetUiState,
    }),
    [
      clearSizeError,
      markSizeRequired,
      quantity,
      resetUiState,
      selectedSize,
      setQuantity,
      setSelectedSize,
      showAddedToast,
      showToast,
      sizeError,
    ],
  );

  return (
    <ProductDetailUiContext.Provider value={value}>
      {children}
    </ProductDetailUiContext.Provider>
  );
}

export function useProductDetailUi() {
  const context = useContext(ProductDetailUiContext);
  if (!context) {
    throw new Error("useProductDetailUi must be used within ProductDetailUiProvider");
  }

  return context;
}
