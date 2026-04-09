/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PRODUCTS_API_MODE?: string;
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_PRODUCTS_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
