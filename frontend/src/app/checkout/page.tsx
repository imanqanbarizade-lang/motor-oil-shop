"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "../../context/CartContext";
import { createOrder } from "../../lib/api";

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, cartCount, clearCart } = useCart();

  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    province: "",
    city: "",
    address: "",
    postal_code: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-800 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100";

  const hasInvalidProduct = cartItems.some(
    (item) =>
      !Number.isInteger(item.productId) ||
      item.productId <= 0 ||
      !Number.isFinite(item.price) ||
      item.price <= 0 ||
      !Number.isInteger(item.quantity) ||
      item.quantity <= 0
  );

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (cartItems.length === 0) {
      setError("سبد خرید شما خالی است.");
      return;
    }

    if (hasInvalidProduct) {
      setError(
        "اطلاعات یا قیمت بعضی محصولات معتبر نیست. لطفاً آن‌ها را از سبد خرید حذف کنید و دوباره از فروشگاه اضافه کنید."
      );
      return;
    }

    if (!/^09\d{9}$/.test(formData.phone.trim())) {
      setError("شماره تماس باید با 09 شروع شود و ۱۱ رقم داشته باشد.");
      return;
    }

    try {
      setLoading(true);

      const result = await createOrder({
        ...formData,
        full_name: formData.full_name.trim(),
        phone: formData.phone.trim(),
        province: formData.province.trim(),
        city: formData.city.trim(),
        address: formData.address.trim(),
        postal_code: formData.postal_code.trim(),
        description: formData.description.trim(),
        items: cartItems.map((item) => ({
          product_id: item.productId,
          quantity: item.quantity,
        })),
      });

      clearCart();

      router.push(
        "/checkout/success?order=" + result.id + "&amount=" + result.total_amount
      );
    } catch (err) {
      console.error("خطا در ثبت سفارش:", err);

      setError(
        err instanceof Error
          ? err.message
          : "ثبت سفارش با خطای نامشخص مواجه شد."
      );
    } finally {
      setLoading(false);
    }
  };

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
              <form
                onSubmit={handleSubmit}
                className="rounded-2xl border border-gray-100 bg-white p-6"
              >
                <h2 className="mb-6 text-xl font-extrabold text-slate-900">
                  اطلاعات خریدار و گیرنده
                </h2>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-bold">
                      نام و نام خانوادگی *
                    </label>

                    <input
                      required
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      placeholder="نام کامل"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold">
                      شماره تماس *
                    </label>

                    <input
                      required
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="09xxxxxxxxx"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold">
                      استان *
                    </label>

                    <input
                      required
                      name="province"
                      value={formData.province}
                      onChange={handleChange}
                      placeholder="نام استان"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold">
                      شهر *
                    </label>

                    <input
                      required
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="نام شهر"
                      className={inputClass}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-sm font-bold">
                      آدرس کامل *
                    </label>

                    <textarea
                      required
                      rows={4}
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="آدرس محل تحویل سفارش"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold">
                      کد پستی
                    </label>

                    <input
                      name="postal_code"
                      value={formData.postal_code}
                      onChange={handleChange}
                      placeholder="کد پستی (اختیاری)"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold">
                      توضیحات سفارش
                    </label>

                    <input
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="توضیحات اضافی (اختیاری)"
                      className={inputClass}
                    />
                  </div>
                </div>

                {hasInvalidProduct && (
                  <p className="mt-5 rounded-xl bg-orange-50 p-4 text-sm leading-7 text-orange-700">
                    قیمت یا اطلاعات بعضی محصولات معتبر نیست. لطفاً آن‌ها را از
                    سبد خرید حذف کنید و دوباره از صفحه محصولات اضافه کنید.
                  </p>
                )}

                {error && (
                  <p className="mt-5 rounded-xl bg-red-50 p-4 text-sm leading-7 text-red-600">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading || hasInvalidProduct}
                  className="mt-7 w-full rounded-xl bg-orange-500 py-4 text-sm font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-gray-300"
                >
                  {loading ? "در حال ثبت سفارش..." : "ثبت سفارش"}
                </button>
              </form>
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
                مبلغ نهایی سفارش در سمت سرور و بر اساس قیمت ثبت‌شده محصولات
                محاسبه می‌شود.
              </p>
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

