import { API_BASE_URL } from "./api";

export interface CreateOrderData {
  full_name: string;
  phone: string;
  province: string;
  city: string;
  address: string;
  postal_code: string;
  description: string;
  items: {
    product_id: number;
    quantity: number;
  }[];
}

export interface OrderItem {
  product_id: number;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface OrderResponse {
  id: number;
  full_name: string;
  phone: string;
  province?: string;
  city?: string;
  address?: string;
  postal_code?: string;
  description?: string;
  total_amount: number;
  status: string;
  created_at: string;
  order_items?: OrderItem[];
}

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

export async function createOrder(
  orderData: CreateOrderData
): Promise<OrderResponse> {
  const csrfToken = await getCsrfToken();

  const response = await fetch(
    `${API_BASE_URL}/orders/create/`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
      },
      body: JSON.stringify(orderData),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(JSON.stringify(result));
  }

  return result;
}

// دریافت تمام سفارش‌ها برای پنل مدیریت
export async function getAdminOrders(): Promise<OrderResponse[]> {
  const response = await fetch(
    `${API_BASE_URL}/orders/admin/all/`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new Error("برای مشاهده سفارش‌ها باید با حساب مدیر وارد شوید.");
    }

    throw new Error("دریافت سفارش‌ها با خطا مواجه شد.");
  }

  return response.json();
}