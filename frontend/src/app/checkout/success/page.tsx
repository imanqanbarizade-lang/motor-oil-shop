"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { uploadOrderReceipt } from "../../../lib/api";

const CARD_NUMBER = "5859-4711-2222-4391";
const ACCOUNT_HOLDER = "ایمان قنبری زاده";

function PaymentContent() {
  const searchParams = useSearchParams();

  const orderId = searchParams.get("order");
  const amount = searchParams.get("amount");

  const [phone, setPhone] = useState("");
  const [receipt, setReceipt] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const formattedAmount = amount
    ? new Intl.NumberFormat("fa-IR").format(Number(amount))
    : "۰";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!orderId) {
      setError("شماره سفارش معتبر نیست.");
      return;
    }

    if (!/^09\d{9}$/.test(phone)) {
      setError("لطفاً شماره موبایل ثبت‌شده در سفارش را وارد کنید.");
      return;
    }

    if (!receipt) {
      setError("لطفاً تصویر فیش واریزی را انتخاب کنید.");
      return;
    }

    if (!receipt.type.startsWith("image/")) {
      setError("فایل انتخاب‌شده باید تصویر باشد.");
      return;
    }

    setLoading(true);

    try {
      const result = await uploadOrderReceipt(
        Number(orderId),
        phone,
        receipt
      );

      setMessage(result.message);
      setReceipt(null);
      setPhone("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "ارسال فیش واریزی با خطا مواجه شد."
      );
    } finally {
      setLoading(false);
    }
  }

  async function copyCardNumber() {
    try {
      await navigator.clipboard.writeText(CARD_NUMBER.replaceAll("-", ""));
      setMessage("شماره کارت کپی شد.");
      setError("");
    } catch {
      setError("کپی شماره کارت انجام نشد.");
    }
  }

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-gray-50 px-4 py-12 text-gray-800"
    >
      <div className="mx-auto max-w-3xl overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
        <div className="bg-green-50 px-6 py-8 text-center">
          <div className="text-5xl">✓</div>

          <h1 className="mt-4 text-2xl font-extrabold text-green-700">
            سفارش شما با موفقیت ثبت شد
          </h1>

          <p className="mt-3 text-sm leading-7 text-gray-600">
            برای تکمیل سفارش، مبلغ را کارت‌به‌کارت کنید و تصویر فیش واریزی
            را در همین صفحه ارسال کنید.
          </p>

          <div className="mt-5 inline-block rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-800">
            شماره سفارش: {orderId || "نامشخص"}
          </div>
        </div>

        <div className="space-y-8 p-6 md:p-8">
          <section>
            <h2 className="mb-4 text-lg font-extrabold text-slate-900">
              مبلغ قابل پرداخت
            </h2>

            <div className="rounded-2xl bg-orange-50 p-5 text-center">
              <p className="text-sm text-gray-500">مبلغ سفارش</p>

              <p className="mt-2 text-2xl font-extrabold text-orange-600">
                {formattedAmount} تومان
              </p>
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-lg font-extrabold text-slate-900">
              اطلاعات کارت بانکی فروشگاه
            </h2>

            <div className="rounded-2xl bg-slate-800 p-6 text-white">
              <p className="text-sm text-gray-300">شماره کارت</p>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
                <p
                  dir="ltr"
                  className="text-xl font-extrabold tracking-wider"
                >
                  {CARD_NUMBER}
                </p>

                <button
                  type="button"
                  onClick={copyCardNumber}
                  className="rounded-lg bg-slate-700 px-4 py-2 text-xs font-bold transition hover:bg-slate-600"
                >
                  کپی شماره کارت
                </button>
              </div>

              <div className="my-6 border-t border-white/10" />

              <p className="text-sm text-gray-300">به نام</p>

              <p className="mt-2 font-bold">{ACCOUNT_HOLDER}</p>
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-lg font-extrabold text-slate-900">
              ارسال فیش واریزی
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-bold">
                  شماره موبایل ثبت‌شده در سفارش
                </label>

                <input
                  type="tel"
                  dir="ltr"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="مثلاً 09123456789"
                  className="w-full rounded-xl border border-gray-200 px-5 py-4 text-left outline-none transition focus:border-orange-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold">
                  تصویر فیش واریزی
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) =>
                    setReceipt(event.target.files?.[0] || null)
                  }
                  className="w-full rounded-xl border border-gray-200 px-4 py-4 text-sm"
                />

                {receipt && (
                  <p className="mt-2 text-xs text-green-700">
                    فایل انتخاب‌شده: {receipt.name}
                  </p>
                )}
              </div>

              {error && (
                <div className="rounded-xl bg-red-50 p-4 text-sm leading-7 text-red-600">
                  {error}
                </div>
              )}

              {message && (
                <div className="rounded-xl bg-green-50 p-4 text-sm leading-7 text-green-700">
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-orange-500 py-4 font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "در حال ارسال..." : "ارسال فیش واریزی"}
              </button>
            </form>

            <p className="mt-6 text-center text-xs leading-7 text-gray-500">
              پس از ارسال فیش، پرداخت شما در وضعیت انتظار بررسی قرار می‌گیرد
              و پس از تأیید مدیر، سفارش قابل پردازش خواهد بود.
            </p>
          </section>

          <div className="border-t border-gray-100 pt-6 text-center">
            <Link
              href="/"
              className="inline-block rounded-xl bg-slate-900 px-7 py-3 text-sm font-bold text-white transition hover:bg-orange-500"
            >
              بازگشت به فروشگاه
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 py-20 text-center text-gray-500">
          در حال بارگذاری صفحه پرداخت...
        </div>
      }
    >
      <PaymentContent />
    </Suspense>
  );
}