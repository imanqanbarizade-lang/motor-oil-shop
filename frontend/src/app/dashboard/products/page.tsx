"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  getAdminProducts,
  updateProduct,
  type ApiProduct,
} from "@/lib/api";

export default function ProductsPage() {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  async function loadProducts() {
    try {
      setError("");
      const data = await getAdminProducts();
      setProducts(data);
    } catch {
      setError("دریافت محصولات با مشکل مواجه شد. ورود مدیر را بررسی کن.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function handleToggleAvailability(product: ApiProduct) {
    const nextAvailability = !product.is_available;

    const actionText = nextAvailability
      ? "فعال کردن"
      : "غیرفعال کردن";

    const confirmed = window.confirm(
      `آیا از ${actionText} محصول «${product.name}» مطمئن هستی؟`
    );

    if (!confirmed) return;

    try {
      setUpdatingId(product.id);

      await updateProduct(product.id, {
        is_available: nextAvailability,
      });

      setProducts((currentProducts) =>
        currentProducts.map((item) =>
          item.id === product.id
            ? { ...item, is_available: nextAvailability }
            : item
        )
      );
    } catch {
      alert(`${actionText} محصول با خطا مواجه شد.`);
    } finally {
      setUpdatingId(null);
    }
  }

  const categories = useMemo(() => {
    return Array.from(
      new Map(
        products.map((product) => [
          product.category.id,
          product.category.name,
        ])
      ).entries()
    );
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const searchValue = search.trim().toLowerCase();

      const matchesSearch =
        product.name.toLowerCase().includes(searchValue) ||
        product.brand.toLowerCase().includes(searchValue) ||
        product.viscosity.toLowerCase().includes(searchValue);

      const matchesCategory =
        selectedCategory === "all" ||
        product.category.id.toString() === selectedCategory;

      const matchesStock =
        stockFilter === "all" ||
        (stockFilter === "available" && product.stock > 0) ||
        (stockFilter === "empty" && product.stock === 0);

      const matchesAvailability =
        availabilityFilter === "all" ||
        (availabilityFilter === "active" && product.is_available) ||
        (availabilityFilter === "inactive" && !product.is_available);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStock &&
        matchesAvailability
      );
    });
  }, [
    products,
    search,
    selectedCategory,
    stockFilter,
    availabilityFilter,
  ]);

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("fa-IR").format(value);
  };

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("fa-IR").format(value) + " تومان";
  };

  const activeCount = products.filter(
    (product) => product.is_available
  ).length;

  const inactiveCount = products.filter(
    (product) => !product.is_available
  ).length;

  return (
    <main dir="rtl" className="min-h-screen bg-slate-100 p-5 md:p-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link
              href="/dashboard"
              className="mb-3 inline-block text-sm text-slate-500 hover:text-orange-500"
            >
              ← بازگشت به داشبورد
            </Link>

            <h1 className="text-2xl font-black text-slate-900 md:text-3xl">
              مدیریت محصولات
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              مشاهده و مدیریت محصولات فعال و غیرفعال فروشگاه Oilino
            </p>
          </div>

          <a
            href="http://localhost:8000/admin/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-orange-600"
          >
            ورود به مدیریت محصولات ↗
          </a>
        </header>

        <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <StatCard
            title="تعداد کل محصولات"
            value={formatNumber(products.length)}
            icon="▣"
            color="blue"
          />

          <StatCard
            title="محصولات فعال"
            value={formatNumber(activeCount)}
            icon="✓"
            color="green"
          />

          <StatCard
            title="محصولات غیرفعال"
            value={formatNumber(inactiveCount)}
            icon="⊘"
            color="red"
          />
        </div>

        <section className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="border-b border-slate-100 p-6">
            <h2 className="text-lg font-black text-slate-900">
              فهرست محصولات
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              جست‌وجو، فعال‌سازی و غیرفعال‌سازی محصولات
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 border-b border-slate-100 p-6 md:grid-cols-2 lg:grid-cols-4">
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="جست‌وجوی نام، برند یا گرید..."
              className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-orange-500"
            />

            <select
              value={selectedCategory}
              onChange={(event) => setSelectedCategory(event.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-orange-500"
            >
              <option value="all">تمام دسته‌بندی‌ها</option>

              {categories.map(([id, name]) => (
                <option key={id} value={id.toString()}>
                  {name}
                </option>
              ))}
            </select>

            <select
              value={stockFilter}
              onChange={(event) => setStockFilter(event.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-orange-500"
            >
              <option value="all">تمام وضعیت‌های موجودی</option>
              <option value="available">موجود در انبار</option>
              <option value="empty">ناموجود</option>
            </select>

            <select
              value={availabilityFilter}
              onChange={(event) =>
                setAvailabilityFilter(event.target.value)
              }
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-orange-500"
            >
              <option value="all">تمام وضعیت‌های محصول</option>
              <option value="active">فقط محصولات فعال</option>
              <option value="inactive">فقط محصولات غیرفعال</option>
            </select>
          </div>

          {loading && (
            <div className="p-12 text-center text-slate-500">
              در حال دریافت محصولات...
            </div>
          )}

          {!loading && error && (
            <div className="p-12 text-center text-red-600">
              {error}
            </div>
          )}

          {!loading && !error && (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1150px] text-right text-sm">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="px-6 py-4">محصول</th>
                      <th className="px-6 py-4">برند</th>
                      <th className="px-6 py-4">دسته‌بندی</th>
                      <th className="px-6 py-4">گرید</th>
                      <th className="px-6 py-4">حجم</th>
                      <th className="px-6 py-4">قیمت</th>
                      <th className="px-6 py-4">موجودی</th>
                      <th className="px-6 py-4">وضعیت محصول</th>
                      <th className="px-6 py-4">عملیات</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {filteredProducts.map((product) => (
                      <tr
                        key={product.id}
                        className="transition hover:bg-slate-50"
                      >
                        <td className="px-6 py-4 font-bold text-slate-800">
                          {product.name}
                        </td>

                        <td className="px-6 py-4 text-slate-600">
                          {product.brand}
                        </td>

                        <td className="px-6 py-4 text-slate-600">
                          {product.category.name}
                        </td>

                        <td className="px-6 py-4 text-slate-600">
                          {product.viscosity}
                        </td>

                        <td className="px-6 py-4 text-slate-600">
                          {product.volume}
                        </td>

                        <td className="whitespace-nowrap px-6 py-4 font-bold">
                          {formatPrice(product.price)}
                        </td>

                        <td className="px-6 py-4 font-bold">
                          {formatNumber(product.stock)}
                        </td>

                        <td className="px-6 py-4">
                          {product.is_available ? (
                            <span className="rounded-full bg-green-50 px-3 py-1.5 text-xs font-bold text-green-600">
                              فعال
                            </span>
                          ) : (
                            <span className="rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600">
                              غیرفعال
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Link
                              href={"/dashboard/products/" + product.id}
                              className="rounded-lg bg-orange-50 px-3 py-2 text-xs font-bold text-orange-600 transition hover:bg-orange-500 hover:text-white"
                            >
                              ✎ ویرایش
                            </Link>

                            <button
                              type="button"
                              onClick={() =>
                                handleToggleAvailability(product)
                              }
                              disabled={updatingId === product.id}
                              className={`rounded-lg px-3 py-2 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                                product.is_available
                                  ? "bg-red-50 text-red-600 hover:bg-red-500 hover:text-white"
                                  : "bg-green-50 text-green-600 hover:bg-green-500 hover:text-white"
                              }`}
                            >
                              {updatingId === product.id
                                ? "در حال انجام..."
                                : product.is_available
                                  ? "غیرفعال کردن"
                                  : "فعال‌سازی"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredProducts.length === 0 && (
                <div className="p-12 text-center">
                  <p className="text-lg font-bold text-slate-700">
                    محصولی پیدا نشد!
                  </p>

                  <p className="mt-2 text-sm text-slate-500">
                    عبارت جست‌وجو یا فیلترها را تغییر بده.
                  </p>
                </div>
              )}

              <div className="border-t border-slate-100 px-6 py-4 text-sm text-slate-500">
                نمایش {formatNumber(filteredProducts.length)} محصول از{" "}
                {formatNumber(products.length)} محصول
              </div>
            </>
          )}
        </section>

        <footer className="mt-8 text-center text-xs text-slate-400">
          Oilino Dashboard — مدیریت محصولات
        </footer>
      </div>
    </main>
  );
}

function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: string;
  icon: string;
  color: "blue" | "green" | "red";
}) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    red: "bg-red-50 text-red-600",
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{title}</p>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl text-xl ${colors[color]}`}
        >
          {icon}
        </div>
      </div>

      <p className="text-2xl font-black text-slate-900">{value}</p>
    </div>
  );
}