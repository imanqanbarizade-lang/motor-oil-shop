export const API_BASE_URL = "http://localhost:8000/api";

// اطلاعات دسته‌بندی
export interface ApiCategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
}

// اطلاعات محصولات
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

// اطلاعات ثبت محصول
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

// ورود مدیر
export interface AdminLoginData {
  username: string;
  password: string;
}

export interface AdminLoginResponse {
  message: string;
  username: string;
}

// اطلاعات حساب مشتری
export interface Customer {
  id: number;
  first_name: string;
  last_name: string;
  phone: string;
}

// اطلاعات ویرایش حساب مشتری
export interface CustomerProfileUpdateData {
  first_name: string;
  last_name: string;
  phone: string;
}

// پاسخ ویرایش حساب مشتری
export interface CustomerProfileUpdateResponse {
  message: string;
  customer: Customer;
}

// اطلاعات ثبت‌نام مشتری
export interface CustomerRegisterData {
  first_name: string;
  last_name: string;
  phone: string;
  password: string;
  password_confirm: string;
}

// اطلاعات ورود مشتری
export interface CustomerLoginData {
  phone: string;
  password: string;
}

// پاسخ عملیات حساب مشتری
export interface CustomerAuthResponse {
  message: string;
  customer: Customer;
}

// اطلاعات یک محصول در سفارش
export interface CreateOrderItemData {
  product_id: number;
  quantity: number;
}

// اطلاعات ثبت سفارش
export interface CreateOrderData {
  full_name: string;
  phone: string;
  province: string;
  city: string;
  address: string;
  postal_code: string;
  description: string;
  items: CreateOrderItemData[];
}

// پاسخ ثبت سفارش
export interface CreateOrderResponse {
  id: number;
  full_name: string;
  phone: string;
  total_amount: number;
  status: string;
  created_at: string;
}

// اطلاعات محصولات داخل سفارش مشتری
export interface CustomerOrderItem {
  product_id: number;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

// اطلاعات کامل سفارش مشتری
export interface CustomerOrder {
  id: number;
  full_name: string;
  phone: string;
  province: string;
  city: string;
  address: string;
  postal_code: string;
  description: string;
  order_items: CustomerOrderItem[];
  total_amount: number;
  status: string;
  payment_status: string;
  payment_receipt: string | null;
  payment_submitted_at: string | null;
  created_at: string;
}

// پاسخ ارسال فیش واریزی
export interface UploadReceiptResponse {
  message: string;
  order_id: number;
  payment_status: string;
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
  const response = await fetch(`${API_BASE_URL}/auth/csrf/`, {
    credentials: "include",
  });

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

  const response = await fetch(`${API_BASE_URL}/auth/login/`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrfToken,
    },
    body: JSON.stringify(loginData),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "ورود مدیر با خطا مواجه شد.");
  }

  return result;
}

// ثبت‌نام مشتری
export async function customerRegister(
  registerData: CustomerRegisterData
): Promise<CustomerAuthResponse> {
  const csrfToken = await getCsrfToken();

  const response = await fetch(`${API_BASE_URL}/auth/register/`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrfToken,
    },
    body: JSON.stringify(registerData),
  });

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      result
        ? JSON.stringify(result)
        : "ثبت‌نام با خطا مواجه شد."
    );
  }

  return result;
}

// ورود مشتری
export async function customerLogin(
  loginData: CustomerLoginData
): Promise<CustomerAuthResponse> {
  const csrfToken = await getCsrfToken();

  const response = await fetch(`${API_BASE_URL}/auth/customer-login/`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrfToken,
    },
    body: JSON.stringify(loginData),
  });

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      result?.error || "ورود به حساب کاربری با خطا مواجه شد."
    );
  }

  return result;
}

// خروج مشتری
export async function customerLogout(): Promise<{ message: string }> {
  const csrfToken = await getCsrfToken();

  const response = await fetch(`${API_BASE_URL}/auth/customer-logout/`, {
    method: "POST",
    credentials: "include",
    headers: {
      "X-CSRFToken": csrfToken,
    },
  });

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      result?.error || "خروج از حساب با خطا مواجه شد."
    );
  }

  return result;
}

// دریافت اطلاعات مشتری واردشده
export async function getCurrentCustomer(): Promise<Customer> {
  const response = await fetch(`${API_BASE_URL}/auth/me/`, {
    credentials: "include",
    cache: "no-store",
  });

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      result?.error || "دریافت اطلاعات حساب کاربری با خطا مواجه شد."
    );
  }

  return result;
}

// ویرایش اطلاعات حساب مشتری
export async function updateCurrentCustomer(
  customerData: CustomerProfileUpdateData
): Promise<CustomerProfileUpdateResponse> {
  const csrfToken = await getCsrfToken();

  const response = await fetch(`${API_BASE_URL}/auth/me/`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrfToken,
    },
    body: JSON.stringify(customerData),
  });

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      result
        ? JSON.stringify(result)
        : "ویرایش اطلاعات حساب با خطا مواجه شد."
    );
  }

  return result;
}

// دریافت دسته‌بندی‌ها
export async function getCategories(): Promise<ApiCategory[]> {
  const response = await fetch(`${API_BASE_URL}/categories/`);

  if (!response.ok) {
    throw new Error("دریافت دسته‌بندی‌ها با خطا مواجه شد.");
  }

  return response.json();
}

// دریافت محصولات فعال فروشگاه
export async function getProducts(): Promise<ApiProduct[]> {
  const response = await fetch(`${API_BASE_URL}/products/`);

  if (!response.ok) {
    throw new Error("دریافت محصولات با خطا مواجه شد.");
  }

  return response.json();
}

// دریافت تمام محصولات برای مدیر
export async function getAdminProducts(): Promise<ApiProduct[]> {
  const response = await fetch(`${API_BASE_URL}/products/admin/all/`, {
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("دریافت تمام محصولات با خطا مواجه شد.");
  }

  return response.json();
}

// دریافت جزئیات محصول
export async function getProductBySlug(
  slug: string
): Promise<ApiProduct> {
  const response = await fetch(`${API_BASE_URL}/products/${slug}/`);

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

  const response = await fetch(`${API_BASE_URL}/products/create/`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrfToken,
    },
    body: JSON.stringify(productData),
  });

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

// ثبت سفارش مشتری
export async function createOrder(
  orderData: CreateOrderData
): Promise<CreateOrderResponse> {
  const csrfToken = await getCsrfToken();

  const response = await fetch(`${API_BASE_URL}/orders/create/`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrfToken,
    },
    body: JSON.stringify(orderData),
  });

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      result
        ? JSON.stringify(result)
        : "ثبت سفارش با خطا مواجه شد."
    );
  }

  return result;
}

// دریافت سفارش‌های حساب مشتری
export async function getMyOrders(): Promise<CustomerOrder[]> {
  const response = await fetch(`${API_BASE_URL}/orders/my-orders/`, {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      result?.detail || "دریافت سفارش‌های شما با خطا مواجه شد."
    );
  }

  // پشتیبانی از پاسخ معمولی و پاسخ صفحه‌بندی‌شده
  return Array.isArray(result) ? result : result?.results || [];
}

// ارسال فیش واریزی سفارش
export async function uploadOrderReceipt(
  orderId: number,
  phone: string,
  receipt: File
): Promise<UploadReceiptResponse> {
  const formData = new FormData();

  formData.append("phone", phone);
  formData.append("payment_receipt", receipt);

  const response = await fetch(
    `${API_BASE_URL}/orders/${orderId}/upload-receipt/`,
    {
      method: "POST",
      body: formData,
    }
  );

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      result
        ? JSON.stringify(result)
        : "ارسال فیش واریزی با خطا مواجه شد."
    );
  }

  return result;
}

// دریافت گزارش موجودی انبار
export async function getInventoryReport(): Promise<InventoryReport> {
  const response = await fetch(`${API_BASE_URL}/inventory/report/`, {
    cache: "no-store",
  });

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