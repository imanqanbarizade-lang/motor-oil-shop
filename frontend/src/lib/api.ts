export const API_BASE_URL = "http://127.0.0.1:8000/api";

export interface ApiProduct {
  id: number;
  slug: string;
  category: {
    id: number;
    name: string;
    slug: string;
    description: string | null;
  };
  name: string;
  brand: string;
  viscosity: string;
  api_standard: string;
  volume: string;
  description: string;
  image: string | null;
  price: number;
  stock: number;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export async function getProducts(): Promise<ApiProduct[]> {
  const response = await fetch(`${API_BASE_URL}/products/`);

  if (!response.ok) {
    throw new Error("دریافت محصولات با خطا مواجه شد.");
  }

  return response.json();
}

export async function getProductBySlug(
  slug: string
): Promise<ApiProduct> {
  const response = await fetch(
    `${API_BASE_URL}/products/${slug}/`
  );

  if (!response.ok) {
    throw new Error("دریافت اطلاعات محصول با خطا مواجه شد.");
  }

  return response.json();
}