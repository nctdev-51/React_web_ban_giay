import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import type { Product, ProductSummary } from "../types/product";
import { getProductById, getRelatedProducts } from "../lib/productsApi";
import {
  AddToCartActions,
  Breadcrumbs,
  ProductDescription,
  ProductGallery,
  ProductInfo,
  ProductSpecs,
  RelatedProducts,
  SizeSelector,
} from "../components/sections/ProductDetail";

export function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<ProductSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const id = Number(productId);

    if (!id || Number.isNaN(id)) {
      setError("Product ID is invalid.");
      setIsLoading(false);
      return;
    }

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

  const handleAddToCart = () => {
    if (!product || !selectedSize) return;

    console.log("Add to cart", {
      productId: product.id,
      title: product.title,
      size: selectedSize,
      quantity,
    });
  };

  if (isLoading) {
    return <div className="max-w-6xl mx-auto px-6 py-10">Loading product details...</div>;
  }

  if (error || !product) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-10">
        <p className="text-red-600">{error || "Product not found."}</p>
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
