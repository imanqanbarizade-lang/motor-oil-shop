"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const products = [
  {
    id: "synolex-rush",
    brand: "سینولکس",
    model: "Rush",
    viscosity: "5W-40",
    api: "SN",
    volume: "۵ لیتر",
    image: "/images/synolex-rush-5w40.jpg.jpeg",
  },
  {
    id: "liqui-moly-10w40",
    brand: "لیکومولی",
    model: "Super Leichtlauf",
    viscosity: "10W-40",
    api: "SN",
    volume: "۴ لیتر",
    image: "/images/liqui-moly-10w40.jpg",
  },
  {
    id: "canada-lubrifant-0w20",
    brand: "لوبریفنت کانادا",
    model: "XU7+",
    viscosity: "0W-20",
    api: "SN",
    volume: "۴.۷ لیتر",
    image: "/images/canada-lubrifant-0w20.jpg",
  },
  {
    id: "satel-10w40",
    brand: "ساتل",
    model: "",
    viscosity: "10W-40",
    api: "SL",
    volume: "۴ لیتر",
    image: "/images/satel-10w40.jpg",
  },
  {
    id: "atrod-20w50",
    brand: "آترود",
    model: "Super GLX",
    viscosity: "20W-50",
    api: "SM",
    volume: "۴.۵ لیتر",
    image: "/images/atrod-20w50.webp",
  },
  {
    id: "caspian-0w20",
    brand: "کاسپین",
    model: "Glide 3X",
    viscosity: "0W-20",
    api: "SP",
    volume: "۵ لیتر",
    image: "/images/caspian-0w20.png",
  },
  {
    id: "castrol-magnatec-10w40",
    brand: "کاسترول",
    model: "Magnatec",
    viscosity: "10W-40",
    api: "SN",
    volume: "۴ لیتر",
    image: "/images/castrol-magnatec-10w40.png",
  },
  {
    id: "dallas-5w30",
    brand: "دالاس",
    model: "",
    viscosity: "5W-30",
    api: "SP",
    volume: "۴ لیتر",
    image: "/images/dallas-5w30.jpg",
  },
];

export default function EngineOilPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = products.filter((product) => {
    const searchText = searchTerm.trim().toLowerCase();

    const productInfo = [
      product.brand,
      product.model,
      product.viscosity,
      product.api,
      product.volume,
    ]
      .join(" ")
      .toLowerCase();

    return productInfo.includes(searchText);
  });

  return (
    <main dir="rtl" className="min-h-screen bg-gray-50 text-gray-800">
      {/* نوار بالایی */}
      <div className="bg-slate-950 py-2 text-center text-xs text-white">
        ارسال سریع | ضمانت اصالت کالا | خرید مطمئن از Oilino
      </div>

      {/* هدر */}
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

      {/* عنوان صفحه */}
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

      {/* جست‌وجو */}
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

      {/* محصولات */}
      <section className="mx-auto max-w-7xl px-5 py-12">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-extrabold text-slate-900">
            محصولات روغن موتور
          </h2>

          <span className="text-sm text-gray-500">
            {filteredProducts.length} محصول
          </span>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-4">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative flex h-52 items-center justify-center rounded-xl bg-gray-50">
                <Image
                  src={product.image}
                  alt={`${product.brand} ${product.viscosity}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
                  className="object-contain p-3"
                />
              </div>

              <p className="mt-5 text-sm font-bold text-orange-500">
                {product.brand}
              </p>

              {product.model && (
                <p className="mt-1 text-xs text-gray-500">
                  {product.model}
                </p>
              )}

              <h3 className="mt-2 font-bold text-slate-900">
                روغن موتور {product.viscosity}
              </h3>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-bold">
                  API {product.api}
                </span>

                <span className="rounded-lg bg-orange-50 px-3 py-2 text-sm font-bold text-orange-600">
                  {product.volume}
                </span>
              </div>

              <p className="mt-4 text-xs text-gray-400">
                قیمت به‌زودی
              </p>

              <Link
                href={`/products/${product.id}`}
                className="mt-5 block w-full rounded-xl bg-slate-900 py-3 text-center text-sm font-bold text-white transition hover:bg-orange-500"
              >
                مشاهده محصول
              </Link>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
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

      {/* فوتر */}
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