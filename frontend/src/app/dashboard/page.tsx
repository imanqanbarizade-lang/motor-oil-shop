"use client";

import { useEffect, useState } from "react";
import {
  getProducts,
  getInventoryReport,
  getBestSellingViscosity,
  type ApiProduct,
  type InventoryReport,
  type BestSellingViscosityReport,
} from "@/lib/api";

export default function DashboardPage() {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [inventory, setInventory] = useState<InventoryReport | null>(null);
  const [sales, setSales] = useState<BestSellingViscosityReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [productsData, inventoryData, salesData] = await Promise.all([
          getProducts(),
          getInventoryReport(),
          getBestSellingViscosity(),
        ]);

        setProducts(productsData);
        setInventory(inventoryData);
        setSales(salesData);
      } catch {
        setError("دریافت اطلاعات با مشکل مواجه شد. اتصال سرور را بررسی کنید.");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const totalProducts = products.length;

  const totalStock =
    inventory?.products.reduce(
      (sum, product) => sum + product.current_stock,
      0
    ) ?? 0;

  const lowStockCount =
    inventory?.products.filter(
      (product) => product.stock_status === "low_stock"
    ).length ?? 0;

  const formatNumber = (value: number) =>
    new Intl.NumberFormat("fa-IR").format(value);

  const formatPrice = (value: number) =>
    `${new Intl.NumberFormat("fa-IR").format(value)} تومان`;

  return (
    <main dir="rtl" className="min-h-screen bg-slate-100 text-slate-800">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 flex-col bg-slate-950 p-6 text-white lg:flex">
          <div className="mb-12">
            <h1 className="text-3xl font-black tracking-wide">
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
            <div className="flex items-center gap-3 rounded-xl bg-orange-500 px-4 py-3 font-bold text-white">
              <span>▦</span>
              داشبورد
            </div>

            <div className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-300">
              <span>▣</span>
              محصولات
            </div>

            <div className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-300">
              <span>▤</span>
              سفارش‌ها
            </div>

            <div className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-300">
              <span>◫</span>
              انبار و موجودی
            </div>

            <div className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-300">
              <span>◷</span>
              گزارش‌ها
            </div>
          </nav>

          <div className="mt-auto rounded-2xl border border-slate-800 bg-slate-900 p-4">
            <p className="text-sm font-bold">فروشگاه Oilino</p>
            <p className="mt-2 text-xs text-slate-400">
              پنل مدیریت فروشگاه
            </p>
          </div>
        </aside>

        {/* Main Content */}
        <section className="min-w-0 flex-1 p-5 md:p-8">
          {/* Header */}
          <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="mb-2 text-sm text-slate-500">
                پنل مدیریت فروشگاه
              </p>
              <h2 className="text-2xl font-black text-slate-900 md:text-3xl">
                داشبورد مدیریتی
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                نمای کلی وضعیت فروشگاه اویلینو
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-xl text-orange-600">
                ◉
              </div>
              <div>
                <p className="text-sm font-bold">مدیر فروشگاه</p>
                <p className="text-xs text-slate-400">مدیریت Oilino</p>
              </div>
            </div>
          </header>

          {loading ? (
            <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
              <p className="text-slate-500">در حال دریافت اطلاعات داشبورد...</p>
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-700">
              {error}
            </div>
          ) : (
            <>
              {/* Statistics */}
              <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                  title="تعداد محصولات"
                  value={formatNumber(totalProducts)}
                  icon="▣"
                  color="blue"
                  description="محصولات قابل نمایش فروشگاه"
                />

                <StatCard
                  title="موجودی کل انبار"
                  value={formatNumber(totalStock)}
                  icon="▤"
                  color="orange"
                  description="مجموع تعداد کالاهای موجود"
                />

                <StatCard
                  title="محصولات کم‌موجود"
                  value={formatNumber(lowStockCount)}
                  icon="⚠"
                  color="red"
                  description="نیازمند بررسی و تأمین کالا"
                />

                <StatCard
                  title="پرفروش‌ترین گرید"
                  value={sales?.data_available ? sales.best_viscosity ?? "—" : "—"}
                  icon="↗"
                  color="green"
                  description="بر اساس فروش واقعی ۲۱ روز اخیر"
                />
              </div>

              {/* Inventory Table */}
              <div className="mb-8 overflow-hidden rounded-2xl bg-white shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-6">
                  <div>
                    <h3 className="text-lg font-black text-slate-900">
                      وضعیت موجودی انبار
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      بررسی موجودی و میزان فروش محصولات
                    </p>
                  </div>

                  <span className="rounded-lg bg-orange-50 px-3 py-2 text-xs font-bold text-orange-600">
                    گزارش ۳۰ روز اخیر
                  </span>
                </div>

                {inventory && inventory.products.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[650px] text-right text-sm">
                      <thead className="bg-slate-50 text-slate-500">
                        <tr>
                          <th className="px-6 py-4 font-medium">نام محصول</th>
                          <th className="px-6 py-4 font-medium">گرید</th>
                          <th className="px-6 py-4 font-medium">موجودی فعلی</th>
                          <th className="px-6 py-4 font-medium">فروش ۳۰ روز</th>
                          <th className="px-6 py-4 font-medium">وضعیت</th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-slate-100">
                        {inventory.products.map((product) => (
                          <tr key={product.product_id}>
                            <td className="px-6 py-4 font-bold text-slate-800">
                              {product.product_name}
                            </td>

                            <td className="px-6 py-4 text-slate-600">
                              {product.viscosity}
                            </td>

                            <td className="px-6 py-4 font-bold">
                              {formatNumber(product.current_stock)}
                            </td>

                            <td className="px-6 py-4 text-slate-600">
                              {formatNumber(product.sales_last_30_days)}
                            </td>

                            <td className="px-6 py-4">
                              {product.stock_status === "low_stock" ? (
                                <span className="rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600">
                                  کمبود موجودی
                                </span>
                              ) : (
                                <span className="rounded-full bg-green-50 px-3 py-1.5 text-xs font-bold text-green-600">
                                  موجودی مناسب
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-10 text-center text-sm text-slate-500">
                    اطلاعاتی برای نمایش موجودی وجود ندارد.
                  </div>
                )}
              </div>

              {/* Sales Analysis */}
              <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <div className="rounded-2xl bg-white p-6 shadow-sm">
                  <h3 className="text-lg font-black text-slate-900">
                    تحلیل فروش گرید روغن
                  </h3>
                  <p className="mt-2 text-sm text-slate-500">
                    مقایسه فروش گریدهای مختلف در ۲۱ روز اخیر
                  </p>

                  {sales?.data_available && sales.results.length > 0 ? (
                    <div className="mt-8 space-y-6">
                      {sales.results.map((item) => {
                        const maxSales = Math.max(
                          ...sales.results.map((result) => result.total_sales),
                          1
                        );

                        const percentage =
                          (item.total_sales / maxSales) * 100;

                        return (
                          <div key={item.viscosity}>
                            <div className="mb-2 flex justify-between text-sm">
                              <span className="font-bold">
                                {item.viscosity}
                              </span>
                              <span className="text-slate-500">
                                {formatNumber(item.total_sales)} فروش
                              </span>
                            </div>

                            <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                              <div
                                className="h-full rounded-full bg-orange-500"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="mt-8 rounded-xl bg-slate-50 p-8 text-center">
                      <p className="text-3xl text-slate-300">▥</p>
                      <p className="mt-3 font-bold text-slate-700">
                        هنوز اطلاعات فروش واقعی ثبت نشده است.
                      </p>
                      <p className="mt-2 text-sm text-slate-500">
                        پس از ثبت فروش واقعی، نمودار تحلیل فروش نمایش داده می‌شود.
                      </p>
                    </div>
                  )}
                </div>

                <div className="rounded-2xl bg-slate-950 p-6 text-white shadow-sm">
                  <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-lg font-black">
                      هشدارهای انبار
                    </h3>
                    <span className="rounded-lg bg-orange-500/20 px-3 py-2 text-xs font-bold text-orange-400">
                      نیازمند توجه
                    </span>
                  </div>

                  {lowStockCount > 0 ? (
                    <div className="space-y-3">
                      {inventory?.products
                        .filter((product) => product.stock_status === "low_stock")
                        .map((product) => (
                          <div
                            key={product.product_id}
                            className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900 p-4"
                          >
                            <div>
                              <p className="text-sm font-bold">
                                {product.product_name}
                              </p>
                              <p className="mt-1 text-xs text-slate-400">
                                {product.viscosity}
                              </p>
                            </div>

                            <span className="text-sm font-bold text-orange-400">
                              {formatNumber(product.current_stock)} عدد
                            </span>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 text-center">
                      <p className="text-3xl text-green-400">✓</p>
                      <p className="mt-3 font-bold">
                        هشدار کمبود موجودی وجود ندارد.
                      </p>
                      <p className="mt-2 text-sm text-slate-400">
                        وضعیت موجودی محصولات مناسب است.
                      </p>
                    </div>
                  )}

                  <p className="mt-6 text-xs leading-6 text-slate-400">
                    هشدارها بر اساس حد آستانه موجودی تعریف‌شده در سیستم انبار
                    نمایش داده می‌شوند.
                  </p>
                </div>
              </div>

              {/* Footer */}
              <footer className="mt-8 text-center text-xs text-slate-400">
                Oilino Dashboard — انتخاب هوشمندانه برای سلامت موتور
              </footer>
            </>
          )}
        </section>
      </div>
    </main>
  );
}

function StatCard({
  title,
  value,
  icon,
  color,
  description,
}: {
  title: string;
  value: string;
  icon: string;
  color: "blue" | "orange" | "red" | "green";
  description: string;
}) {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600",
    orange: "bg-orange-50 text-orange-600",
    red: "bg-red-50 text-red-600",
    green: "bg-green-50 text-green-600",
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl text-xl ${colorClasses[color]}`}
        >
          {icon}
        </div>
      </div>

      <p className="text-2xl font-black text-slate-900">{value}</p>
      <p className="mt-2 text-xs text-slate-400">{description}</p>
    </div>
  );
}