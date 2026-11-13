"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order");

  return (
    <main
      dir="rtl"
      className="flex min-h-screen items-center justify-center bg-gray-50 px-5"
    >
      <div className="w-full max-w-xl rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl">
          ✓
        </div>

        <h1 className="text-2xl font-extrabold text-slate-900">
          سفارش شما با موفقیت ثبت شد!
        </h1>

        <p className="mt-4 text-sm leading-8 text-gray-500">
          از خرید شما از فروشگاه Oilino سپاسگزاریم.
          اطلاعات سفارش شما با موفقیت دریافت شد.
        </p>

        {orderId && (
          <div className="mt-6 rounded-2xl bg-gray-50 p-5">
            <p className="text-sm text-gray-500">
              شماره سفارش شما
            </p>

            <p className="mt-2 text-2xl font-extrabold text-orange-500">
              #{orderId}
            </p>
          </div>
        )}

        <Link
          href="/"
          className="mt-8 block rounded-xl bg-orange-500 px-6 py-4 text-sm font-bold text-white transition hover:bg-orange-600"
        >
          بازگشت به صفحه اصلی
        </Link>
      </div>
    </main>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          در حال بارگذاری...
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}