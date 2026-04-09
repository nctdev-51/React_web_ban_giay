<<<<<<< Updated upstream
import { useEffect, useMemo, useState } from "react";
=======
import { useCallback, useEffect, useMemo } from "react";
import { addToCart } from "../store/cartSlice";
>>>>>>> Stashed changes
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchProductDetail } from "../store/productDetailSlice";
import {
  AddToCartActions,
  Breadcrumbs,
  ProductDetailUiProvider,
  ProductDescription,
  ProductGallery,
  ProductInfo,
  ProductSpecs,
  RelatedProducts,
  SizeSelector,
  useProductDetailUi,
} from "./ProductDetail";

<<<<<<< Updated upstream
export function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<ProductSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
=======
export default function ProductDetailPage() {
  return (
    <ProductDetailUiProvider>
      <ProductDetailContent />
    </ProductDetailUiProvider>
  );
}

function ProductDetailContent() {
  const { productId } = useParams<{ productId: string }>();
  const dispatch = useAppDispatch();
  const { product, relatedProducts, isLoading, error } = useAppSelector(
    (state) => state.productDetail,
  );
  const {
    selectedSize,
    quantity,
    sizeError,
    showToast,
    setSelectedSize,
    setQuantity,
    markSizeRequired,
    showAddedToast,
    resetUiState,
  } = useProductDetailUi();
>>>>>>> Stashed changes

  useEffect(() => {
    const id = Number(productId);

    if (!id || Number.isNaN(id)) {
      return;
    }

<<<<<<< Updated upstream
    let mounted = true;

    async function fetchData() {
      setIsLoading(true);
      setError(null);
      setSelectedSize(null);
      setQuantity(1);

      try {
        const item = await getProductById(id);
        if (!mounted) return;

        setProduct(item);

        const related = await getRelatedProducts(item, 4);
        if (!mounted) return;

        setRelatedProducts(related);
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : "Cannot load product details.");
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    fetchData();

    return () => {
      mounted = false;
    };
  }, [productId]);
=======
    resetUiState();
    dispatch(fetchProductDetail(id));
  }, [dispatch, productId, resetUiState]);
>>>>>>> Stashed changes

  const breadcrumbs = useMemo(() => {
    if (!product) {
      return [
        { label: "Home", to: "/" },
        { label: "Product" },
      ];
    }

    return [
      { label: "Home", to: "/" },
      { label: product.sport, to: `/` },
      { label: product.title },
    ];
  }, [product]);

<<<<<<< Updated upstream
  const handleAddToCart = () => {
    if (!product || !selectedSize) return;

    console.log("Add to cart", {
      productId: product.id,
      title: product.title,
      size: selectedSize,
      quantity,
    });
  };
=======
  const handleAddToCart = useCallback(() => {
    if (!selectedSize) {
      markSizeRequired();
      window.scrollTo({ top: 300, behavior: "smooth" });
      return;
    }

    if (product) {
      dispatch(
        addToCart({
          ...product,
          selectedSize,
          quantity,
        }),
      );
      showAddedToast();
    }
  }, [dispatch, markSizeRequired, product, quantity, selectedSize, showAddedToast]);
>>>>>>> Stashed changes

  if (isLoading) {
    return <div className="max-w-6xl mx-auto px-6 py-10">Loading product details...</div>;
  }

  if (error || !product) {
    return (
<<<<<<< Updated upstream
      <div className="max-w-6xl mx-auto px-6 py-10">
        <p className="text-red-600">{error || "Product not found."}</p>
=======
      <div className="min-h-[70vh] flex items-center justify-center text-lg text-gray-500">
        Đang tải thông tin...
      </div>
    );
  if (error || !product)
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-red-500">
        {error || "Product ID is invalid."}
>>>>>>> Stashed changes
      </div>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-8 space-y-10">
      <Breadcrumbs items={breadcrumbs} />

      <section className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        <ProductGallery images={product.images} title={product.title} />

        <div className="space-y-6">
          <ProductInfo product={product} />
          <SizeSelector
            sizes={product.sizes}
            selectedSize={selectedSize}
            onSelectSize={setSelectedSize}
          />
          <AddToCartActions
            quantity={quantity}
            onQuantityChange={setQuantity}
            onAddToCart={handleAddToCart}
            selectedSize={selectedSize}
          />
        </div>
      </section>

      <section className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        <ProductDescription product={product} />
        <ProductSpecs product={product} />
      </section>

      <RelatedProducts products={relatedProducts} />
    </main>
  );
}

export default ProductDetailPage;
