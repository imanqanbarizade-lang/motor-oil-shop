"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "../context/CartContext";
import { getProducts, ApiProduct } from "../lib/api";

const categories = [
  { name: "روغن موتور", icon: "🛢️", description: "انواع روغن موتور خودرو" },
  { name: "روغن گیربکس", icon: "⚙️", description: "روغن انواع گیربکس" },
  { name: "فیلتر روغن", icon: "🔧", description: "فیلترهای باکیفیت خودرو" },
  { name: "ضدیخ و مکمل", icon: "🚗", description: "محصولات مراقبت از خودرو" },
];

const productDetails: Record<
  string,
  {
    brand: string;
    model: string;
    image: string;
    volume: string;
  }
> = {
  "synolex-rush": {
    brand: "سینولکس",
    model: "Rush",
    image: "/images/synolex-rush-5w40.jpg.jpeg",
    volume: "۵ لیتر",
  },
  "liqui-moly-10w40": {
    brand: "لیکومولی",
    model: "Super Leichtlauf",
    image: "/images/liqui-moly-10w40.jpg",
    volume: "۴ لیتر",
  },
  "canada-lubrifant-0w20": {
    brand: "لوبریفنت کانادا",
    model: "XU7+",
    image: "/images/canada-lubrifant-0w20.jpg",
    volume: "۴.۷ لیتر",
  },
  "satel-10w40": {
    brand: "ساتل",
    model: "",
    image: "/images/satel-10w40.jpg",
    volume: "۴ لیتر",
  },
  "atrod-20w50": {
    brand: "آترود",
    model: "Super GLX",
    image: "/images/atrod-20w50.webp",
    volume: "۴.۵ لیتر",
  },
  "caspian-0w20": {
    brand: "کاسپین",
    model: "Glide 3X",
    image: "/images/caspian-0w20.png",
    volume: "۵ لیتر",
  },
  "castrol-magnatec-10w40": {
    brand: "کاسترول",
    model: "Magnatec",
    image: "/images/castrol-magnatec-10w40.png",
    volume: "۴ لیتر",
  },
  "dallas-5w30": {
    brand: "دالاس",
    model: "",
    image: "/images/dallas-5w30.jpg",
    volume: "۴ لیتر",
  },
};

function Logo() {
  return (
    <div className="flex items-center gap-2">
      <svg viewBox="0 0 100 100" width="42" height="42" fill="none">
        <path
          d="M50 5C50 5 15 48 15 68C15 87 30 98 50 98C70 98 85 87 85 68C85 48 50 5 50 5Z"
          fill="#F97316"
        />
        <path
          d="M32 68C32 58 39 47 46 38"
          stroke="white"
          strokeWidth="6"
          strokeLinecap="round"
        />
      </svg>

      <span className="text-3xl font-extrabold text-slate-900">
        Oil<span className="text-orange-500">ino</span>
      </span>
    </div>
  );
}

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { cartCount } = useCart();

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

    const details = productDetails[product.slug];

    const productInfo = [
      details?.brand,
      product.brand,
      product.name,
      details?.model,
      product.viscosity,
      product.api_standard,
      details?.volume,
      product.volume,
    ]
      .join(" ")
      .toLowerCase();

    return productInfo.includes(searchText);
  });

  return (
    <main className="min-h-screen bg-gray-50 text-gray-800" dir="rtl">
      {/* نوار بالایی */}
      <div className="bg-slate-950 py-2 text-center text-xs text-white">
        ارسال سریع | ضمانت اصالت کالا | خرید مطمئن از Oilino
      </div>

      {/* هدر */}
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-5 px-5 py-5">
          <Link href="/">
            <Logo />
          </Link>

          {/* جست‌وجو */}
          <div className="min-w-60 flex-1 md:mx-8">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="جست‌وجوی روغن موتور، برند یا محصول..."
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 text-sm outline-none transition focus:border-orange-500 focus:bg-white"
              />

              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xl">
                🔍
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-bold transition hover:border-orange-500 hover:text-orange-500">
              ورود / ثبت‌نام
            </button>

            <Link
              href="/cart"
              className="relative rounded-xl bg-orange-500 px-5 py-3 font-bold text-white transition hover:bg-orange-600"
            >
              🛒 سبد خرید

              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full border-2 border-white bg-slate-950 px-1 text-xs font-extrabold text-white">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* منوی سایت */}
        <nav className="border-t border-gray-100">
          <div className="mx-auto flex max-w-7xl flex-wrap gap-9 px-5 py-4 text-sm font-medium">
            <Link href="/" className="font-bold text-orange-500">
              صفحه اصلی
            </Link>

            <Link
              href="/categories/engine-oil"
              className="transition hover:text-orange-500"
            >
              روغن موتور
            </Link>

            <a href="#" className="transition hover:text-orange-500">
              روغن گیربکس
            </a>

            <a href="#" className="transition hover:text-orange-500">
              فیلتر روغن
            </a>

            <a href="#" className="transition hover:text-orange-500">
              برندها
            </a>

            <a href="#" className="transition hover:text-orange-500">
              درباره ما
            </a>

            <a href="#" className="transition hover:text-orange-500">
              تماس با ما
            </a>
          </div>
        </nav>
      </header>

      {/* بنر اصلی */}
      <section className="mx-auto max-w-7xl px-5 py-10">
        <div className="relative flex flex-col items-center justify-between gap-10 overflow-hidden rounded-3xl bg-slate-950 px-8 py-16 text-white md:flex-row md:px-16">
          <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-orange-500 opacity-10 blur-3xl" />

          <div className="relative z-10 max-w-xl">
            <span className="mb-6 inline-block rounded-full border border-orange-500/40 bg-orange-500/10 px-5 py-2 text-sm text-orange-400">
              فروشگاه تخصصی روان‌کارهای خودرو
            </span>

            <h1 className="mb-6 text-4xl font-extrabold leading-relaxed md:text-5xl">
              انتخاب هوشمندانه،
              <br />
              مراقبت از قلب خودرو
            </h1>

            <p className="mb-8 max-w-lg text-sm leading-8 text-gray-300 md:text-base">
              انواع روغن موتور از برندهای معتبر را در Oilino پیدا کنید
              و با انتخاب مناسب، از سلامت موتور خودروی خود مراقبت کنید.
            </p>

            <button
              onClick={() =>
                document
                  .getElementById("products")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="rounded-xl bg-orange-500 px-8 py-4 font-bold text-white transition hover:bg-orange-600"
            >
              مشاهده محصولات ←
            </button>
          </div>

          <div className="relative z-10 flex h-64 w-64 items-center justify-center rounded-full border border-white/10 bg-white/5 md:h-80 md:w-80">
            <div className="flex h-52 w-52 items-center justify-center rounded-full bg-orange-500/10 text-9xl md:h-64 md:w-64">
              🛢️
            </div>
          </div>
        </div>
      </section>

      {/* مزیت‌های فروشگاه */}
      <section className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-5 py-5 md:grid-cols-4">
        {[
          { icon: "✓", title: "ضمانت اصالت کالا", desc: "خرید با اطمینان" },
          { icon: "🚚", title: "ارسال سریع", desc: "تحویل سفارش‌ها" },
          { icon: "🛡️", title: "خرید مطمئن", desc: "تجربه خرید آسان" },
          { icon: "🎧", title: "مشاوره تخصصی", desc: "راهنمای انتخاب محصول" },
        ].map((item) => (
          <div
            key={item.title}
            className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-5"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-2xl text-orange-500">
              {item.icon}
            </div>

            <div>
              <h3 className="text-sm font-bold">{item.title}</h3>
              <p className="mt-1 text-xs text-gray-500">{item.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* دسته‌بندی محصولات */}
      <section className="mx-auto max-w-7xl px-5 py-14">
        <div className="mb-8">
          <h2 className="text-2xl font-extrabold text-slate-900">
            دسته‌بندی محصولات
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            محصولات مورد نیاز خودروی خود را انتخاب کنید.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={
                category.name === "روغن موتور"
                  ? "/categories/engine-oil"
                  : "#"
              }
              className="cursor-pointer rounded-2xl border border-gray-100 bg-white p-7 text-center transition hover:-translate-y-1 hover:border-orange-400 hover:shadow-lg"
            >
              <div className="mb-5 flex h-20 items-center justify-center rounded-xl bg-gray-50 text-5xl">
                {category.icon}
              </div>

              <h3 className="font-bold text-slate-900">
                {category.name}
              </h3>

              <p className="mt-2 text-xs text-gray-500">
                {category.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* محصولات روغن موتور */}
      <section
        id="products"
        className="mx-auto max-w-7xl px-5 py-12"
      >
        <div className="mb-8">
          <h2 className="text-2xl font-extrabold text-slate-900">
            روغن موتورهای موجود
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            محصولات برندهای مختلف را بررسی و مقایسه کنید.
          </p>
        </div>

        {loading && (
          <div className="rounded-2xl border border-gray-100 bg-white py-16 text-center text-sm text-gray-500">
            در حال دریافت محصولات...
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-red-100 bg-white py-16 text-center">
            <p className="text-sm font-bold text-red-500">{error}</p>
            <p className="mt-3 text-xs text-gray-500">
              اتصال سرور Django را بررسی کنید.
            </p>
          </div>
        )}

        {!loading && !error && (
          <>
            {searchTerm.trim() !== "" && (
              <p className="mb-6 text-sm text-gray-500">
                تعداد محصولات پیدا شده: {filteredProducts.length}
              </p>
            )}

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-4">
              {filteredProducts.map((product) => {
                const details = productDetails[product.slug];

                return (
                  <div
                    key={product.slug}
                    className="overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 transition hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="relative flex h-52 items-center justify-center rounded-xl bg-gray-50 p-3">
                      {details?.image ? (
                        <Image
                          src={details.image}
                          alt={`${details.brand} ${product.viscosity}`}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
                          className="object-contain p-3"
                        />
                      ) : (
                        <span className="text-5xl">🛢️</span>
                      )}
                    </div>

                    <p className="mt-5 text-sm font-bold text-orange-500">
                      {details?.brand || product.brand}
                    </p>

                    {details?.model && (
                      <p className="mt-1 text-xs text-gray-500">
                        {details.model}
                      </p>
                    )}

                    <h3 className="mt-2 font-bold text-slate-900">
                      روغن موتور {product.viscosity}
                    </h3>

                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <span className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-bold text-slate-700">
                        API {product.api_standard}
                      </span>

                      <span className="rounded-lg bg-orange-50 px-3 py-2 text-sm font-bold text-orange-600">
                        {details?.volume || product.volume}
                      </span>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        قیمت به‌زودی
                      </span>
                    </div>

                    <Link
                      href={`/products/${product.slug}`}
                      className="mt-5 block w-full rounded-xl bg-slate-900 py-3 text-center text-sm font-bold text-white transition hover:bg-orange-500"
                    >
                      مشاهده محصول
                    </Link>
                  </div>
                );
              })}
            </div>

            {filteredProducts.length === 0 && (
              <div className="rounded-2xl border border-gray-100 bg-white px-5 py-16 text-center">
                <div className="mb-4 text-5xl">🔍</div>

                <h3 className="text-lg font-bold text-slate-900">
                  محصولی پیدا نشد!
                </h3>

                <p className="mt-3 text-sm text-gray-500">
                  عبارت جست‌وجو را تغییر دهید و دوباره امتحان کنید.
                </p>

                <button
                  onClick={() => setSearchTerm("")}
                  className="mt-6 rounded-xl bg-orange-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
                >
                  پاک کردن جست‌وجو
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* بنر پایانی */}
      <section className="mx-auto max-w-7xl px-5 py-10">
        <div className="rounded-3xl bg-orange-500 px-8 py-12 text-center text-white">
          <h2 className="text-2xl font-extrabold md:text-3xl">
            برای خودروی خود بهترین انتخاب را داشته باشید
          </h2>

          <p className="mt-4 text-sm leading-7">
            Oilino؛ انتخاب هوشمندانه برای سلامت موتور
          </p>
        </div>
      </section>

      {/* فوتر */}
      <footer className="mt-10 bg-slate-950 px-5 py-12 text-center text-white">
        <div className="flex justify-center">
          <Logo />
        </div>

        <p className="mt-5 text-sm text-gray-400">
          فروشگاه تخصصی روغن موتور و محصولات مراقبت از خودرو
        </p>

        <p className="mt-3 text-sm text-orange-400">
          انتخاب هوشمندانه برای سلامت موتور
        </p>

        <div className="mt-8 border-t border-white/10 pt-6 text-xs text-gray-500">
          © تمامی حقوق این فروشگاه محفوظ است.
        </div>
      </footer>
    </main>
  );
}