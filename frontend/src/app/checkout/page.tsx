"use client";

import Link from "next/link";
import { useCart } from "../../context/CartContext";

export default function CheckoutPage() {
  const { cartItems, cartCount } = useCart();

  return (
    <main className="min-h-screen bg-gray-50 text-gray-800" dir="rtl">
      <header className="border-b border-gray-100 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
          <Link href="/" className="text-2xl font-extrabold text-slate-900">
            Oil<span className="text-orange-500">ino</span>
          </Link>

          <Link
            href="/cart"
            className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-bold transition hover:border-orange-500 hover:text-orange-500"
          >
            بازگشت به سبد خرید
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900">
            تکمیل اطلاعات سفارش
          </h1>

          <p className="mt-3 text-sm text-gray-500">
            اطلاعات ارسال سفارش خود را وارد کنید.
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div className="rounded-3xl bg-white px-5 py-20 text-center">
            <div className="mb-5 text-6xl">🛒</div>

            <h2 className="text-xl font-extrabold text-slate-900">
              سبد خرید شما خالی است.
            </h2>

            <Link
              href="/categories/engine-oil"
              className="mt-8 inline-block rounded-xl bg-orange-500 px-8 py-4 text-sm font-bold text-white hover:bg-orange-600"
            >
              مشاهده محصولات
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <div className="rounded-2xl border border-gray-100 bg-white p-6">
                <h2 className="mb-6 text-xl font-extrabold text-slate-900">
                  اطلاعات خریدار و گیرنده
                </h2>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {[
                    { label: "نام و نام خانوادگی", placeholder: "نام کامل" },
                    { label: "شماره تماس", placeholder: "09xxxxxxxxx" },
                    { label: "استان", placeholder: "نام استان" },
                    { label: "شهر", placeholder: "نام شهر" },
                  ].map((field) => (
                    <div key={field.label}>
                      <label className="mb-2 block text-sm font-bold">
                        {field.label} *
                      </label>
                      <input
                        disabled
                        placeholder={field.placeholder}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-500"
                      />
                    </div>
                  ))}

                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-sm font-bold">
                      آدرس کامل *
                    </label>
                    <textarea
                      disabled
                      rows={4}
                      placeholder="آدرس دقیق محل تحویل سفارش"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-500"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold">
                      کد پستی
                    </label>
                    <input
                      disabled
                      placeholder="کد پستی (اختیاری)"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-500"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold">
                      توضیحات سفارش
                    </label>
                    <input
                      disabled
                      placeholder="توضیحات اضافی (اختیاری)"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-500"
                    />
                  </div>
                </div>

                <p className="mt-5 text-xs text-gray-400">
                  تکمیل فرم پس از نهایی شدن قیمت محصولات فعال خواهد شد.
                </p>
              </div>
            </div>

            <aside className="h-fit rounded-2xl border border-gray-100 bg-white p-6">
              <h2 className="text-lg font-extrabold text-slate-900">
                خلاصه سفارش
              </h2>

              <div className="mt-5 space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between gap-3 border-b border-gray-100 pb-4"
                  >
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        {item.name}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {item.viscosity} - {item.volume}
                      </p>
                    </div>

                    <span className="text-sm font-bold">
                      {item.quantity} عدد
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex justify-between">
                <span className="text-sm text-gray-500">
                  تعداد کل محصولات
                </span>
                <span className="font-bold">{cartCount} عدد</span>
              </div>

              <p className="mt-5 rounded-xl bg-orange-50 p-4 text-sm leading-7 text-orange-700">
                قیمت محصولات هنوز تعیین نشده است. پس از تکمیل قیمت‌گذاری،
                امکان ثبت سفارش فعال خواهد شد.
              </p>

              <button
                type="button"
                disabled
                className="mt-7 w-full cursor-not-allowed rounded-xl bg-gray-300 py-4 text-sm font-bold text-gray-500"
              >
                ثبت سفارش پس از تعیین قیمت‌ها فعال می‌شود
              </button>
            </aside>
          </div>
        )}
      </section>

      <footer className="mt-16 bg-slate-950 px-5 py-8 text-center text-sm text-gray-400">
        <p>Oilino؛ انتخاب هوشمندانه برای سلامت موتور</p>
      </footer>
    </main>
  );
}