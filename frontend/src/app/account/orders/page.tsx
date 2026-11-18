"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  CustomerOrder,
  getMyOrders,
  getCurrentCustomer,
} from "../../../lib/api";

function formatPrice(price: number) {
  return new Intl.NumberFormat("fa-IR").format(price) + " تومان";
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getOrderStatus(status: string) {
  const statuses: Record<string, string> = {
    pending: "در انتظار بررسی",
    processing: "در حال آماده‌سازی",
    shipped: "ارسال شده",
    delivered: "تحویل داده شده",
    cancelled: "لغو شده",
  };

  return statuses[status] || status;
}

function getPaymentStatus(status: string) {
  const statuses: Record<string, string> = {
    pending: "پرداخت نشده",
    pending_review: "در انتظار تأیید پرداخت",
    approved: "پرداخت تأیید شده",
    rejected: "پرداخت رد شده",
    paid: "پرداخت شده",
  };

  return statuses[status] || status;
}

function getPaymentColor(status: string) {
  if (status === "approved" || status === "paid") {
    return "bg-green-100 text-green-700";
  }

  if (status === "rejected") {
    return "bg-red-100 text-red-700";
  }

  return "bg-orange-100 text-orange-700";
}

export default function CustomerOrdersPage() {
  const router = useRouter();

  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadOrders() {
      try {
        await getCurrentCustomer();

        const result = await getMyOrders();

        if (active) {
          setOrders(result);
        }
      } catch (err) {
        if (active) {
          const message =
            err instanceof Error
              ? err.message
              : "دریافت سفارش‌ها با خطا مواجه شد.";

          setError(message);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadOrders();

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <main
        dir="rtl"
        className="flex min-h-screen items-center justify-center bg-slate-50"
      >
        <p className="text-slate-500">
          در حال دریافت سفارش‌های شما...
        </p>
      </main>
    );
  }

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-slate-50 px-4 py-10"
    >
      <div className="mx-auto max-w-5xl">

        {/* سربرگ */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link
              href="/"
              className="text-2xl font-black text-orange-600"
            >
              Oilino
            </Link>

            <h1 className="mt-4 text-2xl font-bold text-slate-800">
              سفارش‌های من
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              سوابق خرید و وضعیت سفارش‌های خود را مشاهده کنید.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/account/profile"
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:border-orange-500 hover:text-orange-600"
            >
              پروفایل من
            </Link>

            <Link
              href="/"
              className="rounded-xl bg-orange-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-orange-700"
            >
              بازگشت به فروشگاه
            </Link>
          </div>
        </div>

        {/* خطا */}
        {error && (
          <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center">
            <p className="text-sm leading-7 text-red-600">
              {error}
            </p>

            <button
              onClick={() => router.push("/account/profile")}
              className="mt-4 rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-orange-700"
            >
              بازگشت به پروفایل
            </button>
          </div>
        )}

        {/* سفارش خالی */}
        {!error && orders.length === 0 && (
          <div className="rounded-2xl border border-slate-100 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-orange-50 text-3xl">
              🛒
            </div>

            <h2 className="mt-6 text-xl font-bold text-slate-800">
              هنوز سفارشی ثبت نکرده‌اید
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-500">
              بعد از ثبت سفارش در فروشگاه، اطلاعات خرید و
              وضعیت آن در این قسمت نمایش داده می‌شود.
            </p>

            <Link
              href="/"
              className="mt-7 inline-block rounded-xl bg-orange-600 px-7 py-3 text-sm font-bold text-white transition hover:bg-orange-700"
            >
              مشاهده محصولات
            </Link>
          </div>
        )}

        {/* فهرست سفارش‌ها */}
        {!error && orders.length > 0 && (
          <div className="space-y-6">

            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">
                تعداد سفارش‌های ثبت‌شده
              </p>

              <p className="mt-2 text-2xl font-black text-orange-600">
                {orders.length.toLocaleString("fa-IR")}
              </p>
            </div>

            {orders.map((order) => (
              <section
                key={order.id}
                className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm"
              >
                {/* اطلاعات اصلی سفارش */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 bg-slate-50/70 p-5">
                  <div>
                    <p className="text-xs text-slate-400">
                      شماره سفارش
                    </p>

                    <p className="mt-1 font-bold text-slate-800">
                      #{order.id.toLocaleString("fa-IR")}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">
                      تاریخ ثبت
                    </p>

                    <p className="mt-1 text-sm font-medium text-slate-700">
                      {formatDate(order.created_at)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">
                      وضعیت سفارش
                    </p>

                    <p className="mt-1 text-sm font-bold text-slate-700">
                      {getOrderStatus(order.status)}
                    </p>
                  </div>
                </div>

                <div className="p-5">

                  {/* محصولات سفارش */}
                  <h3 className="mb-4 font-bold text-slate-800">
                    محصولات سفارش
                  </h3>

                  <div className="space-y-3">
                    {order.order_items.map((item, index) => (
                      <div
                        key={`${order.id}-${item.product_id}-${index}`}
                        className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-50 p-4"
                      >
                        <div>
                          <p className="font-medium text-slate-700">
                            {item.product_name}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            تعداد: {item.quantity.toLocaleString("fa-IR")}
                          </p>
                        </div>

                        <p className="text-sm font-bold text-slate-700">
                          {formatPrice(item.total_price)}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* اطلاعات تحویل */}
                  <div className="mt-5 grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-2">
                    <div>
                      <p className="text-xs text-slate-400">
                        تحویل‌گیرنده
                      </p>

                      <p className="mt-1 text-sm font-medium text-slate-700">
                        {order.full_name}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400">
                        شماره تماس
                      </p>

                      <p
                        dir="ltr"
                        className="mt-1 text-right text-sm font-medium text-slate-700"
                      >
                        {order.phone}
                      </p>
                    </div>

                    <div className="sm:col-span-2">
                      <p className="text-xs text-slate-400">
                        نشانی تحویل
                      </p>

                      <p className="mt-1 text-sm leading-7 text-slate-700">
                        {order.province}، {order.city}، {order.address}
                      </p>
                    </div>
                  </div>

                  {/* وضعیت پرداخت و مبلغ */}
                  <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-orange-50 p-4">
                    <div>
                      <p className="text-xs text-slate-500">
                        وضعیت پرداخت
                      </p>

                      <span
                        className={`mt-2 inline-block rounded-lg px-3 py-1.5 text-xs font-bold ${getPaymentColor(
                          order.payment_status
                        )}`}
                      >
                        {getPaymentStatus(order.payment_status)}
                      </span>
                    </div>

                    <div className="text-left">
                      <p className="text-xs text-slate-500">
                        مبلغ کل سفارش
                      </p>

                      <p className="mt-2 text-lg font-black text-orange-700">
                        {formatPrice(order.total_amount)}
                      </p>
                    </div>
                  </div>

                </div>
              </section>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}