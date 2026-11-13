export const API_BASE_URL = "http://localhost:8000/api";

// نوع اطلاعات دسته‌بندی
export interface ApiCategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
}

// نوع اطلاعات محصولات
export interface ApiProduct {
  id: number;
  slug: string;
  category: ApiCategory;
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

// اطلاعات موردنیاز برای ثبت محصول
export interface CreateProductData {
  category_id: number;
  name: string;
  brand: string;
  viscosity: string;
  api_standard: string;
  volume: number;
  description: string;
  price: number;
  stock: number;
  is_available: boolean;
}

// اطلاعات ورود مدیر
export interface AdminLoginData {
  username: string;
  password: string;
}

export interface AdminLoginResponse {
  message: string;
  username: string;
}

// گزارش هوشمند انبار
export interface InventoryReportItem {
  product_id: number;
  product_name: string;
  viscosity: string;
  current_stock: number;
  sales_last_30_days: number;
  average_daily_sales: number | null;
  target_stock: number | null;
  has_sales_data: boolean;
  stock_status: "low_stock" | "normal";
}

export interface InventoryReport {
  period: string;
  data_available: boolean;
  inventory_warning_threshold: number;
  products: InventoryReportItem[];
}

// تحلیل پرفروش‌ترین گرید روغن
export interface BestSellingViscosityItem {
  viscosity: string;
  total_sales: number;
}

export interface BestSellingViscosityReport {
  data_available: boolean;
  message?: string;
  period?: string;
  best_viscosity: string | null;
  results: BestSellingViscosityItem[];
}

// دریافت توکن CSRF
async function getCsrfToken(): Promise<string> {
  const response = await fetch(
    `${API_BASE_URL}/auth/csrf/`,
    {
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("دریافت توکن امنیتی با خطا مواجه شد.");
  }

  const cookie = document.cookie
    .split("; ")
    .find((item) => item.startsWith("csrftoken="));

  if (!cookie) {
    throw new Error("توکن امنیتی CSRF دریافت نشد.");
  }

  return cookie.split("=")[1];
}

// ورود مدیر
export async function adminLogin(
  loginData: AdminLoginData
): Promise<AdminLoginResponse> {
  const csrfToken = await getCsrfToken();

  const response = await fetch(
    `${API_BASE_URL}/auth/login/`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
      },
      body: JSON.stringify(loginData),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.error || "ورود مدیر با خطا مواجه شد."
    );
  }

  return result;
}

// دریافت دسته‌بندی‌ها
export async function getCategories(): Promise<ApiCategory[]> {
  const response = await fetch(
    `${API_BASE_URL}/categories/`
  );

  if (!response.ok) {
    throw new Error("دریافت دسته‌بندی‌ها با خطا مواجه شد.");
  }

  return response.json();
}

// دریافت محصولات فعال فروشگاه
export async function getProducts(): Promise<ApiProduct[]> {
  const response = await fetch(
    `${API_BASE_URL}/products/`
  );

  if (!response.ok) {
    throw new Error("دریافت محصولات با خطا مواجه شد.");
  }

  return response.json();
}

// دریافت تمام محصولات (فعال و غیرفعال) برای مدیر
export async function getAdminProducts(): Promise<ApiProduct[]> {
  const response = await fetch(
    `${API_BASE_URL}/products/admin/all/`,
    {
      credentials: "include",
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("دریافت تمام محصولات با خطا مواجه شد.");
  }

  return response.json();
}

// دریافت جزئیات محصول
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

// ثبت محصول جدید
export async function createProduct(
  productData: CreateProductData
): Promise<ApiProduct> {
  const csrfToken = await getCsrfToken();

  const response = await fetch(
    `${API_BASE_URL}/products/create/`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
      },
      body: JSON.stringify(productData),
    }
  );

  const errorData = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      errorData
        ? JSON.stringify(errorData)
        : "ثبت محصول با خطا مواجه شد."
    );
  }

  return errorData;
}

// ویرایش محصول
export async function updateProduct(
  productId: number,
  productData: Partial<CreateProductData>
): Promise<ApiProduct> {
  const csrfToken = await getCsrfToken();

  const response = await fetch(
    `${API_BASE_URL}/products/${productId}/update/`,
    {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
      },
      body: JSON.stringify(productData),
    }
  );

  const errorData = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      errorData
        ? JSON.stringify(errorData)
        : "ویرایش محصول با خطا مواجه شد."
    );
  }

  return errorData;
}

// دریافت گزارش موجودی انبار
export async function getInventoryReport(): Promise<InventoryReport> {
  const response = await fetch(
    `${API_BASE_URL}/inventory/report/`,
    { cache: "no-store" }
  );

  if (!response.ok) {
    throw new Error("دریافت گزارش موجودی انبار با خطا مواجه شد.");
  }

  return response.json();
}

// تحلیل پرفروش‌ترین گرید روغن
export async function getBestSellingViscosity(): Promise<BestSellingViscosityReport> {
  const response = await fetch(
    `${API_BASE_URL}/analytics/best-viscosity/`,
    { cache: "no-store" }
  );

  if (!response.ok) {
    throw new Error("دریافت تحلیل فروش با خطا مواجه شد.");
  }

  return response.json();
}