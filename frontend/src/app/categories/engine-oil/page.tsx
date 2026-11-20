"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getProducts, ApiProduct } from "../../../lib/api";

const productImages: Record<string, string> = {
  "synolex-rush": "/images/synolex-rush-5w40.jpg.jpeg",
  "liqui-moly-10w40": "/images/liqui-moly-10w40.jpg",
  "canada-lubrifant-0w20": "/images/canada-lubrifant-0w20.jpg",
  "satel-10w40": "/images/satel-10w40.jpg",
  "atrod-20w50": "/images/atrod-20w50.webp",
  "caspian-0w20": "/images/caspian-0w20.png",
  "castrol-magnatec-10w40": "/images/castrol-magnatec-10w40.png",
  "dallas-5w30": "/images/dallas-5w30.jpg",
};

export default function EngineOilPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        setError("");

        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        console.error("خطا در دریافت محصولات:", err);
        setError("دریافت محصولات با مشکل مواجه شد.");
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const searchText = searchTerm.trim().toLowerCase();

    const productInfo = [
      product.name,
      product.brand,
      product.viscosity,
      product.api_standard,
      product.volume,
    ]
      .join(" ")
      .toLowerCase();

    return productInfo.includes(searchText);
  });

  return (
    <main dir="rtl" className="min-h-screen bg-gray-50 text-gray-800">
      <div className="bg-slate-950 py-2 text-center text-xs text-white">
        ارسال سریع | ضمانت اصالت کالا | خرید مطمئن از Oilino
      </div>

      <header className="border-b border-gray-100 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
          <Link href="/" className="text-3xl font-extrabold text-slate-900">
            Oil<span className="text-orange-500">ino</span>
          </Link>

          <Link
            href="/"
            className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-bold transition hover:border-orange-500 hover:text-orange-500"
          >
            بازگشت به صفحه اصلی
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 py-12">
        <div className="rounded-3xl bg-slate-950 px-8 py-12 text-white">
          <span className="text-5xl">🛢️</span>

          <h1 className="mt-6 text-3xl font-extrabold">
            روغن موتور
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-8 text-gray-300">
            انواع روغن موتور از برندهای معتبر را بررسی کنید
            و محصول مناسب خودروی خود را انتخاب کنید.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="جست‌وجو در روغن موتور‌ها..."
            className="w-full rounded-2xl border border-gray-200 bg-white px-5 py-4 text-sm outline-none transition focus:border-orange-500"
          />

          <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xl">
            🔍
          </span>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-extrabold text-slate-900">
            محصولات روغن موتور
          </h2>

          <span className="text-sm text-gray-500">
            {filteredProducts.length} محصول
          </span>
        </div>

        {loading && (
          <div className="rounded-2xl bg-white py-16 text-center text-gray-500">
            در حال دریافت محصولات...
          </div>
        )}

        {error && !loading && (
          <div className="rounded-2xl bg-white py-16 text-center">
            <p className="font-bold text-red-600">{error}</p>

            <button
              onClick={() => window.location.reload()}
              className="mt-5 rounded-xl bg-orange-500 px-6 py-3 text-white"
            >
              تلاش مجدد
            </button>
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-4">
            {filteredProducts.map((product) => {
              const isOutOfStock =
                product.stock <= 0 || !product.is_available;

              const image =
                product.image || productImages[product.slug] || null;

              return (
                <div
                  key={product.id}
                  className="overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative flex h-52 items-center justify-center rounded-xl bg-gray-50">
                    {image ? (
                      <Image
                        src={image}
                        alt={`${product.brand} ${product.viscosity}`}
                        fill
                        unoptimized
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
                        className={`object-contain p-3 ${
                          isOutOfStock ? "opacity-50" : ""
                        }`}
                      />
                    ) : (
                      <span className="text-7xl">🛢️</span>
                    )}

                    {isOutOfStock && (
                      <span className="absolute right-3 top-3 rounded-lg bg-red-600 px-3 py-2 text-xs font-bold text-white">
                        ناموجود
                      </span>
                    )}
                  </div>

                  <p className="mt-5 text-sm font-bold text-orange-500">
                    {product.brand}
                  </p>

                  <h3 className="mt-2 font-bold text-slate-900">
                    {product.name}
                  </h3>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-bold">
                      {product.viscosity}
                    </span>

                    <span className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-bold">
                      API {product.api_standard}
                    </span>

                    <span className="rounded-lg bg-orange-50 px-3 py-2 text-sm font-bold text-orange-600">
                      {product.volume}
                    </span>
                  </div>

                  {product.price > 0 ? (
                    <p className="mt-4 font-bold text-slate-900">
                      {new Intl.NumberFormat("fa-IR").format(
                        product.price
                      )}{" "}
                      تومان
                    </p>
                  ) : (
                    <p className="mt-4 text-xs text-gray-400">
                      قیمت به‌زودی
                    </p>
                  )}

                  <p
                    className={`mt-3 text-xs font-medium ${
                      isOutOfStock ? "text-red-600" : "text-green-700"
                    }`}
                  >
                    {isOutOfStock
                      ? "این محصول در حال حاضر موجود نیست."
                      : `موجودی: ${new Intl.NumberFormat("fa-IR").format(
                          product.stock
                        )} عدد`}
                  </p>

                  <Link
                    href={`/products/${product.slug}`}
                    className={`mt-5 block w-full rounded-xl py-3 text-center text-sm font-bold text-white transition ${
                      isOutOfStock
                        ? "bg-gray-500 hover:bg-gray-600"
                        : "bg-slate-900 hover:bg-orange-500"
                    }`}
                  >
                    مشاهده محصول
                  </Link>
                </div>
              );
            })}
          </div>
        )}

        {!loading && !error && filteredProducts.length === 0 && (
          <div className="rounded-2xl bg-white px-5 py-16 text-center">
            <p className="text-4xl">🔍</p>

            <h3 className="mt-4 font-bold text-slate-900">
              محصولی پیدا نشد!
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              عبارت دیگری را برای جست‌وجو امتحان کنید.
            </p>
          </div>
        )}
      </section>

      <footer className="mt-10 bg-slate-950 px-5 py-10 text-center text-white">
        <p className="text-2xl font-extrabold">
          Oil<span className="text-orange-500">ino</span>
        </p>

        <p className="mt-4 text-sm text-gray-400">
          انتخاب هوشمندانه برای سلامت موتور
        </p>
      </footer>
    </main>
  );
}