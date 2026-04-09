import { apiGet } from "./api";
import type { Product, ProductSummary } from "../types/product";

const PRODUCTS_URL = "http://localhost:5000/api/products";

function toSummary(product: Product): ProductSummary {
  return {
    id: product.id,
    title: product.title,
    price: product.price,
    thumbnail: product.thumbnail,
    sport: product.sport,
    productType: product.productType,
    collection: product.collection,
  };
}

let cachePromise: Promise<Product[]> | null = null;

async function fetchAllProducts(): Promise<Product[]> {
  if (!cachePromise) {
    // ĐÃ FIX: Backend trả về trực tiếp mảng Product[], không còn bọc trong res.products nữa
    cachePromise = apiGet<Product[]>(PRODUCTS_URL);
  }

  return cachePromise;
}

function normalizeSlug(value: string) {
  if (!value) return "";
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function matchesCategory(product: Product, categorySlug: string) {
  const slug = normalizeSlug(categorySlug);

  // Đảm bảo không bị lỗi nếu product thiếu một số trường (undefined)
  const fields = [
    product.sport || "",
    product.productType || "",
    product.collection || "",
    ...(product.gender || []),
  ].map(normalizeSlug);

  return fields.some((field) => field.includes(slug));
}

export async function getProductsByCategory(
  categorySlug?: string,
): Promise<ProductSummary[]> {
  const products = await fetchAllProducts();

  if (!categorySlug || categorySlug === "new") {
    return products.map(toSummary);
  }

  return products
    .filter((p) => matchesCategory(p, categorySlug))
    .map(toSummary);
}

export async function getProductById(productId: number): Promise<Product> {
  const products = await fetchAllProducts();
  const found = products.find((p) => p.id === productId);

  if (!found) {
    throw new Error("Product not found.");
  }

  return found;
}

export async function getRelatedProducts(
  current: Product,
  limit = 4,
): Promise<ProductSummary[]> {
  const products = await fetchAllProducts();

  return products
    .filter((p) => p.id !== current.id)
    .map((p) => {
      let score = 0;
      if (p.sport === current.sport) score += 2;
      if (p.collection === current.collection) score += 1;
      if (p.productType === current.productType) score += 1;

      return { product: p, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => toSummary(item.product));
}
