"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "../../context/CartContext";

const SHIPPING_COST = 200000;

export default function CartPage() {
  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
    cartCount,
  } = useCart();

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("fa-IR").format(price);

  const productsTotal = cartItems.reduce(
    (total, product) => total + product.price * product.quantity,
    0
  );

  const finalTotal = productsTotal + SHIPPING_COST;

  const hasUnpricedProducts = cartItems.some(
    (product) => product.price <= 0
  );

  return (
    <main className="min-h-screen bg-gray-50 text-gray-800" dir="rtl">
      <header className="border-b border-gray-100 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
          <Link href="/" className="text-2xl font-extrabold text-slate-900">
            Oil<span className="text-orange-500">ino</span>
          </Link>

          <Link
            href="/"
            className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-bold transition hover:border-orange-500 hover:text-orange-500"
          >
            بازگشت به فروشگاه
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900">
            سبد خرید شما
          </h1>

          <p className="mt-3 text-sm text-gray-500">
            محصولات انتخاب‌شده را بررسی و مدیریت کنید.
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div className="rounded-3xl border border-gray-100 bg-white px-5 py-20 text-center">
            <div className="mb-5 text-7xl">🛒</div>

            <h2 className="text-xl font-extrabold text-slate-900">
              سبد خرید شما خالی است!
            </h2>

            <p className="mt-4 text-sm text-gray-500">
              هنوز محصولی به سبد خرید اضافه نکرده‌اید.
            </p>

            <Link
              href="/categories/engine-oil"
              className="mt-8 inline-block rounded-xl bg-orange-500 px-8 py-4 text-sm font-bold text-white transition hover:bg-orange-600"
            >
              مشاهده محصولات
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="space-y-5 lg:col-span-2">
              <div className="flex items-center justify-between rounded-2xl bg-white p-5">
                <span className="font-bold text-slate-900">
                  محصولات انتخاب‌شده
                </span>

                <span className="text-sm text-gray-500">
                  {cartCount} عدد محصول
                </span>
              </div>

              {cartItems.map((product) => (
                <div
                  key={product.id}
                  className="flex flex-col gap-5 rounded-2xl border border-gray-100 bg-white p-5 sm:flex-row"
                >
                  <Link
                    href={`/products/${product.id}`}
                    className="relative flex h-40 w-full shrink-0 items-center justify-center rounded-xl bg-gray-50 sm:w-40"
                  >
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="160px"
                      className="object-contain p-3"
                    />
                  </Link>

                  <div className="flex flex-1 flex-col justify-between gap-4">
                    <div>
                      <p className="text-sm font-bold text-orange-500">
                        {product.brand}
                      </p>

                      <h2 className="mt-2 text-lg font-extrabold text-slate-900">
                        {product.name}
                      </h2>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="rounded-lg bg-gray-100 px-3 py-2 text-xs font-bold">
                          {product.viscosity}
                        </span>

                        <span className="rounded-lg bg-gray-100 px-3 py-2 text-xs font-bold">
                          API {product.api}
                        </span>

                        <span className="rounded-lg bg-orange-50 px-3 py-2 text-xs font-bold text-orange-600">
                          {product.volume}
                        </span>
                      </div>

                      <div className="mt-4">
                        {product.price > 0 ? (
                          <>
                            <p className="text-sm text-gray-500">
                              قیمت هر عدد:
                              <span className="mr-2 font-bold text-slate-800">
                                {formatPrice(product.price)} تومان
                              </span>
                            </p>

                            <p className="mt-2 text-sm font-bold text-orange-600">
                              مبلغ این محصول:
                              <span className="mr-2">
                                {formatPrice(
                                  product.price * product.quantity
                                )}{" "}
                                تومان
                              </span>
                            </p>
                          </>
                        ) : (
                          <p className="text-sm font-bold text-red-500">
                            قیمت این محصول هنوز تعیین نشده است.
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-3 rounded-xl border border-gray-200 p-2">
                        <button
                          onClick={() => decreaseQuantity(product.id)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-lg font-bold transition hover:bg-orange-100"
                        >
                          −
                        </button>

                        <span className="min-w-6 text-center font-bold">
                          {product.quantity}
                        </span>

                        <button
                          onClick={() => increaseQuantity(product.id)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-lg font-bold transition hover:bg-orange-100"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(product.id)}
                        className="text-sm font-bold text-red-500 transition hover:text-red-700"
                      >
                        حذف محصول
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={clearCart}
                className="rounded-xl border border-red-200 px-5 py-3 text-sm font-bold text-red-500 transition hover:bg-red-50"
              >
                خالی کردن سبد خرید
              </button>
            </div>

            <aside className="h-fit rounded-2xl border border-gray-100 bg-white p-6">
              <h2 className="text-lg font-extrabold text-slate-900">
                خلاصه سفارش
              </h2>

              <div className="mt-6 flex items-center justify-between border-b border-gray-100 pb-5">
                <span className="text-sm text-gray-500">
                  تعداد کل محصولات
                </span>

                <span className="font-bold text-slate-900">
                  {cartCount} عدد
                </span>
              </div>

              <div className="mt-5 rounded-xl border border-orange-100 bg-orange-50 p-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📦</span>

                  <div>
                    <p className="font-bold text-slate-900">
                      ارسال سفارش با پست
                    </p>

                    <p className="mt-1 text-sm text-gray-600">
                      سفارش شما توسط پست ارسال می‌شود.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-4 border-b border-gray-100 pb-5">
                <div>
                  <p className="text-sm text-gray-500">
                    مبلغ محصولات
                  </p>

                  <p className="mt-2 font-bold text-slate-900">
                    {formatPrice(productsTotal)} تومان
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    هزینه ارسال با پست
                  </span>

                  <span className="font-bold text-slate-900">
                    {formatPrice(SHIPPING_COST)} تومان
                  </span>
                </div>
              </div>

              <div className="mt-5">
                <p className="text-sm font-bold text-slate-900">
                  مبلغ نهایی سفارش
                </p>

                {hasUnpricedProducts ? (
                  <p className="mt-3 text-sm leading-7 text-red-500">
                    قیمت بعضی از محصولات هنوز تعیین نشده است.
                    برای محاسبه مبلغ نهایی، ابتدا قیمت آن‌ها را مشخص کنید.
                  </p>
                ) : (
                  <p className="mt-3 text-2xl font-extrabold text-orange-600">
                    {formatPrice(finalTotal)} تومان
                  </p>
                )}
              </div>

              <Link
                href="/checkout"
                className="mt-7 block w-full rounded-xl bg-orange-500 py-4 text-center text-sm font-bold text-white transition hover:bg-orange-600"
              >
                ادامه فرایند خرید
              </Link>

              <Link
                href="/categories/engine-oil"
                className="mt-4 block text-center text-sm font-bold text-orange-500 transition hover:text-orange-600"
              >
                ادامه خرید
              </Link>
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