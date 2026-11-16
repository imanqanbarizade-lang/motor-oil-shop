"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { API_BASE_URL } from "@/lib/api";
import {
  getAdminOrders,
  reviewOrderPayment,
  type OrderResponse,
} from "@/lib/orders";

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] =
    useState<OrderResponse | null>(null);

  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewMessage, setReviewMessage] = useState("");
  const [reviewError, setReviewError] = useState("");

  useEffect(() => {
    async function loadOrders() {
      try {
        const data = await getAdminOrders();
        setOrders(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "دریافت سفارش‌ها با مشکل مواجه شد."
        );
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, []);

  const formatNumber = (value: number) =>
    new Intl.NumberFormat("fa-IR").format(value);

  const formatPrice = (value: number) =>
    `${formatNumber(value)} تومان`;

  const formatDate = (value: string) =>
    new Date(value).toLocaleDateString("fa-IR");

  const statusLabels: Record<string, string> = {
    pending: "در انتظار بررسی",
    confirmed: "تأیید شده",
    processing: "در حال آماده‌سازی",
    shipped: "ارسال شده",
    delivered: "تحویل داده شده",
    cancelled: "لغو شده",
  };

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-50 text-yellow-700",
    confirmed: "bg-blue-50 text-blue-700",
    processing: "bg-orange-50 text-orange-700",
    shipped: "bg-purple-50 text-purple-700",
    delivered: "bg-green-50 text-green-700",
    cancelled: "bg-red-50 text-red-700",
  };

  const paymentLabels: Record<string, string> = {
    unpaid: "پرداخت نشده",
    pending_review: "در انتظار تأیید پرداخت",
    approved: "پرداخت تأیید شده",
    rejected: "فیش پرداخت رد شده",
  };

  const paymentColors: Record<string, string> = {
    unpaid: "bg-gray-100 text-gray-600",
    pending_review: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
  };

  function getReceiptUrl(receipt: string) {
    if (receipt.startsWith("http://") || receipt.startsWith("https://")) {
      return receipt;
    }

    const serverUrl = API_BASE_URL.replace(/\/api\/?$/, "");
    return `${serverUrl}${receipt.startsWith("/") ? "" : "/"}${receipt}`;
  }

  async function handlePaymentReview(
    paymentStatus: "approved" | "rejected"
  ) {
    if (!selectedOrder) return;

    const confirmationMessage =
      paymentStatus === "approved"
        ? "آیا از تأیید پرداخت این سفارش مطمئن هستید؟"
        : "آیا از رد فیش واریزی این سفارش مطمئن هستید؟";

    if (!window.confirm(confirmationMessage)) return;

    setReviewLoading(true);
    setReviewError("");
    setReviewMessage("");

    try {
      const result = await reviewOrderPayment(
        selectedOrder.id,
        paymentStatus
      );

      const updatedOrder = {
        ...selectedOrder,
        payment_status: result.payment_status,
      };

      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          order.id === selectedOrder.id ? updatedOrder : order
        )
      );

      setSelectedOrder(updatedOrder);
      setReviewMessage(result.message);
    } catch (err) {
      setReviewError(
        err instanceof Error
          ? err.message
          : "تغییر وضعیت پرداخت با خطا مواجه شد."
      );
    } finally {
      setReviewLoading(false);
    }
  }

  return (
    <main dir="rtl" className="min-h-screen bg-slate-100 text-slate-800">
      <div className="flex min-h-screen">

        <aside className="hidden w-64 shrink-0 flex-col bg-slate-950 p-6 text-white lg:flex">
          <div className="mb-12">
            <h1 className="text-3xl font-black">
              Oilino<span className="text-orange-500">.</span>
            </h1>

            <p className="mt-2 text-xs text-slate-400">
              انتخاب هوشمندانه برای سلامت موتور
            </p>
          </div>

          <p className="mb-4 text-xs font-bold text-slate-500">
            منوی مدیریت
          </p>

          <nav className="space-y-2">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-300 transition hover:bg-slate-900"
            >
              <span>▦</span>
              داشبورد
            </Link>

            <Link
              href="/dashboard/products"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-300 transition hover:bg-slate-900"
            >
              <span>▣</span>
              محصولات
            </Link>

            <Link
              href="/dashboard/orders"
              className="flex items-center gap-3 rounded-xl bg-orange-500 px-4 py-3 font-bold text-white"
            >
              <span>▤</span>
              سفارش‌ها
            </Link>
          </nav>

          <div className="mt-auto rounded-2xl border border-slate-800 bg-slate-900 p-4">
            <p className="text-sm font-bold">فروشگاه Oilino</p>
            <p className="mt-2 text-xs text-slate-400">
              پنل مدیریت فروشگاه
            </p>
          </div>
        </aside>

        <section className="min-w-0 flex-1 p-5 md:p-8">

          <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="mb-2 text-sm text-slate-500">
                پنل مدیریت فروشگاه
              </p>

              <h2 className="text-2xl font-black text-slate-900 md:text-3xl">
                مدیریت سفارش‌ها
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                مشاهده سفارش‌ها و بررسی پرداخت مشتریان
              </p>
            </div>

            <Link
              href="/dashboard"
              className="rounded-xl bg-white px-5 py-3 text-sm font-bold shadow-sm transition hover:text-orange-500"
            >
              بازگشت به داشبورد
            </Link>
          </header>

          <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">
                تعداد کل سفارش‌ها
              </p>

              <p className="mt-3 text-3xl font-black text-slate-900">
                {formatNumber(orders.length)}
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">
                پرداخت‌های در انتظار بررسی
              </p>

              <p className="mt-3 text-3xl font-black text-orange-500">
                {formatNumber(
                  orders.filter(
                    (order) => order.payment_status === "pending_review"
                  ).length
                )}
              </p>
            </div>
          </div>

          {loading && (
            <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
              <p className="text-slate-500">
                در حال دریافت سفارش‌ها...
              </p>
            </div>
          )}

          {!loading && error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-700">
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && (
            <>
              <div className="overflow-hidden rounded-2xl bg-white shadow-sm">

                <div className="border-b border-slate-100 p-6">
                  <h3 className="text-lg font-black text-slate-900">
                    فهرست سفارش‌ها
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    برای مشاهده جزئیات، روی سفارش موردنظر کلیک کن.
                  </p>
                </div>

                {orders.length === 0 ? (
                  <div className="p-16 text-center">
                    <div className="text-5xl">📦</div>

                    <h3 className="mt-5 text-lg font-bold text-slate-800">
                      هنوز سفارشی ثبت نشده است.
                    </h3>

                    <p className="mt-2 text-sm text-slate-500">
                      پس از ثبت سفارش مشتریان، اطلاعات آن‌ها در این قسمت نمایش داده می‌شود.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[1050px] text-right text-sm">

                      <thead className="bg-slate-50 text-slate-500">
                        <tr>
                          <th className="px-6 py-4">شماره سفارش</th>
                          <th className="px-6 py-4">نام مشتری</th>
                          <th className="px-6 py-4">شماره تماس</th>
                          <th className="px-6 py-4">مبلغ سفارش</th>
                          <th className="px-6 py-4">تاریخ ثبت</th>
                          <th className="px-6 py-4">وضعیت سفارش</th>
                          <th className="px-6 py-4">وضعیت پرداخت</th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-slate-100">
                        {orders.map((order) => (
                          <tr
                            key={order.id}
                            onClick={() =>
                              setSelectedOrder(
                                selectedOrder?.id === order.id
                                  ? null
                                  : order
                              )
                            }
                            className={`cursor-pointer transition hover:bg-orange-50 ${
                              selectedOrder?.id === order.id
                                ? "bg-orange-50"
                                : ""
                            }`}
                          >
                            <td className="px-6 py-5 font-bold text-orange-500">
                              #{formatNumber(order.id)}
                            </td>

                            <td className="px-6 py-5 font-bold text-slate-800">
                              {order.full_name}
                            </td>

                            <td className="px-6 py-5 text-slate-600">
                              {order.phone}
                            </td>

                            <td className="px-6 py-5 font-bold">
                              {formatPrice(order.total_amount)}
                            </td>

                            <td className="px-6 py-5 text-slate-600">
                              {formatDate(order.created_at)}
                            </td>

                            <td className="px-6 py-5">
                              <span
                                className={`rounded-full px-3 py-2 text-xs font-bold ${
                                  statusColors[order.status] ??
                                  "bg-gray-100 text-gray-600"
                                }`}
                              >
                                {statusLabels[order.status] ?? order.status}
                              </span>
                            </td>

                            <td className="px-6 py-5">
                              <span
                                className={`whitespace-nowrap rounded-full px-3 py-2 text-xs font-bold ${
                                  paymentColors[order.payment_status] ??
                                  "bg-gray-100 text-gray-600"
                                }`}
                              >
                                {paymentLabels[order.payment_status] ??
                                  order.payment_status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>

                    </table>
                  </div>
                )}
              </div>

              {selectedOrder && (
                <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">

                  <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-5">
                    <div>
                      <p className="text-sm text-slate-500">
                        جزئیات سفارش
                      </p>

                      <h3 className="mt-2 text-xl font-black text-slate-900">
                        سفارش شماره #{formatNumber(selectedOrder.id)}
                      </h3>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedOrder(null);
                        setReviewMessage("");
                        setReviewError("");
                      }}
                      className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-200"
                    >
                      بستن جزئیات
                    </button>
                  </div>

                  <h4 className="mb-4 font-black text-slate-800">
                    اطلاعات مشتری
                  </h4>

                  <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="text-xs text-slate-500">نام مشتری</p>
                      <p className="mt-2 font-bold">
                        {selectedOrder.full_name}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="text-xs text-slate-500">شماره تماس</p>
                      <p className="mt-2 font-bold">
                        {selectedOrder.phone}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="text-xs text-slate-500">استان</p>
                      <p className="mt-2 font-bold">
                        {selectedOrder.province || "ثبت نشده"}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="text-xs text-slate-500">شهر</p>
                      <p className="mt-2 font-bold">
                        {selectedOrder.city || "ثبت نشده"}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-4 sm:col-span-2">
                      <p className="text-xs text-slate-500">آدرس</p>
                      <p className="mt-2 font-bold">
                        {selectedOrder.address || "ثبت نشده"}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="text-xs text-slate-500">کد پستی</p>
                      <p className="mt-2 font-bold">
                        {selectedOrder.postal_code || "ثبت نشده"}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="text-xs text-slate-500">تاریخ ثبت</p>
                      <p className="mt-2 font-bold">
                        {formatDate(selectedOrder.created_at)}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="text-xs text-slate-500">وضعیت سفارش</p>
                      <p className="mt-2 font-bold">
                        {statusLabels[selectedOrder.status] ??
                          selectedOrder.status}
                      </p>
                    </div>
                  </div>

                  <h4 className="mb-4 font-black text-slate-800">
                    محصولات سفارش
                  </h4>

                  {selectedOrder.order_items &&
                  selectedOrder.order_items.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[600px] text-right text-sm">
                        <thead className="bg-slate-50 text-slate-500">
                          <tr>
                            <th className="px-4 py-4">نام محصول</th>
                            <th className="px-4 py-4">تعداد</th>
                            <th className="px-4 py-4">قیمت واحد</th>
                            <th className="px-4 py-4">قیمت کل</th>
                          </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100">
                          {selectedOrder.order_items.map((item, index) => (
                            <tr key={`${item.product_id}-${index}`}>
                              <td className="px-4 py-4 font-bold">
                                {item.product_name}
                              </td>

                              <td className="px-4 py-4">
                                {formatNumber(item.quantity)}
                              </td>

                              <td className="px-4 py-4">
                                {formatPrice(item.unit_price)}
                              </td>

                              <td className="px-4 py-4 font-bold text-slate-900">
                                {formatPrice(item.total_price)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="rounded-xl bg-slate-50 p-6 text-center text-sm text-slate-500">
                      اطلاعات محصولات این سفارش در دسترس نیست.
                    </div>
                  )}

                  <div className="mt-6 flex justify-end">
                    <div className="rounded-xl bg-orange-50 px-6 py-4">
                      <p className="text-sm text-slate-500">
                        مبلغ کل سفارش
                      </p>

                      <p className="mt-2 text-xl font-black text-orange-600">
                        {formatPrice(selectedOrder.total_amount)}
                      </p>
                    </div>
                  </div>

                  {selectedOrder.description && (
                    <div className="mt-6 rounded-xl border border-slate-200 p-4">
                      <p className="text-sm font-bold text-slate-700">
                        توضیحات مشتری
                      </p>

                      <p className="mt-2 text-sm text-slate-600">
                        {selectedOrder.description}
                      </p>
                    </div>
                  )}

                  {/* بخش بررسی پرداخت */}
                  <div className="mt-8 rounded-2xl border border-slate-200 p-5">
                    <h4 className="mb-4 font-black text-slate-800">
                      بررسی پرداخت
                    </h4>

                    <div className="mb-5 flex flex-wrap items-center gap-3">
                      <span className="text-sm text-slate-500">
                        وضعیت فعلی پرداخت:
                      </span>

                      <span
                        className={`rounded-full px-3 py-2 text-xs font-bold ${
                          paymentColors[selectedOrder.payment_status] ??
                          "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {paymentLabels[selectedOrder.payment_status] ??
                          selectedOrder.payment_status}
                      </span>
                    </div>

                    {selectedOrder.payment_receipt ? (
                      <div>
                        <p className="mb-3 text-sm font-bold text-slate-700">
                          تصویر فیش واریزی مشتری
                        </p>

                        <a
                          href={getReceiptUrl(selectedOrder.payment_receipt)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex rounded-xl bg-slate-100 px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-200"
                        >
                          مشاهده تصویر فیش
                        </a>

                        <div className="mt-4 max-w-md overflow-hidden rounded-xl border border-slate-200">
                          <img
                            src={getReceiptUrl(selectedOrder.payment_receipt)}
                            alt="تصویر فیش واریزی"
                            className="h-auto max-h-96 w-full object-contain"
                          />
                        </div>

                        {selectedOrder.payment_submitted_at && (
                          <p className="mt-3 text-xs text-slate-500">
                            زمان ارسال فیش:{" "}
                            {new Date(
                              selectedOrder.payment_submitted_at
                            ).toLocaleString("fa-IR")}
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="rounded-xl bg-yellow-50 p-4 text-sm text-yellow-800">
                        هنوز فیش واریزی برای این سفارش ارسال نشده است.
                      </p>
                    )}

                    {selectedOrder.payment_status === "pending_review" &&
                      selectedOrder.payment_receipt && (
                        <div className="mt-6 flex flex-wrap gap-3">
                          <button
                            type="button"
                            disabled={reviewLoading}
                            onClick={() =>
                              handlePaymentReview("approved")
                            }
                            className="rounded-xl bg-green-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-green-700 disabled:opacity-50"
                          >
                            {reviewLoading
                              ? "در حال ثبت..."
                              : "تأیید پرداخت"}
                          </button>

                          <button
                            type="button"
                            disabled={reviewLoading}
                            onClick={() =>
                              handlePaymentReview("rejected")
                            }
                            className="rounded-xl bg-red-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-red-700 disabled:opacity-50"
                          >
                            {reviewLoading
                              ? "در حال ثبت..."
                              : "رد فیش واریزی"}
                          </button>
                        </div>
                      )}

                    {reviewMessage && (
                      <div className="mt-5 rounded-xl bg-green-50 p-4 text-sm text-green-700">
                        {reviewMessage}
                      </div>
                    )}

                    {reviewError && (
                      <div className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">
                        {reviewError}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          <footer className="mt-8 text-center text-xs text-slate-400">
            Oilino Dashboard — مدیریت سفارش‌ها
          </footer>

        </section>
      </div>
    </main>
  );
}