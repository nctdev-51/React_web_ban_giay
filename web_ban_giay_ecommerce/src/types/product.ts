export type ProductSize = {
  size: number;
  stock: number;
};

export type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  images: string[];
  gender: string[];
  productType: string;
  sport: string;
  collection: string;
  collectionName?: string;
  tags: string[];
  sizes: ProductSize[];
};

export type ProductsListResponse = {
  products: Product[];
};

export type ProductSummary = Pick<
  Product,
  | "id"
  | "title"
  | "price"
  | "thumbnail"
  | "sport"
  | "productType"
  | "collection"
  | "gender"
  | "sizes"
>;
