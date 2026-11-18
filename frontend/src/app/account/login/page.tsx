"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  customerLogin,
  CustomerLoginData,
} from "../../../lib/api";

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState<CustomerLoginData>({
    phone: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!form.phone.trim() || !form.password) {
      setError("لطفاً شماره تلفن و رمز عبور را وارد کنید.");
      return;
    }

    setLoading(true);

    try {
      const result = await customerLogin(form);

      setSuccess(result.message || "ورود با موفقیت انجام شد.");

      setTimeout(() => {
        router.push("/account/profile");
        router.refresh();
      }, 800);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "ورود به حساب کاربری با خطا مواجه شد."
      );
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100";

  return (
    <main
      dir="rtl"
      className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10"
    >
      <div className="w-full max-w-md">
        <div className="mb-7 text-center">
          <Link
            href="/"
            className="text-3xl font-black text-orange-600"
          >
            Oilino
          </Link>

          <h1 className="mt-5 text-2xl font-bold text-slate-800">
            ورود به حساب کاربری
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            برای مشاهده سفارش‌ها و اطلاعات حساب خود وارد شوید.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                شماره تلفن
              </label>

              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="شماره تلفن خود را وارد کنید"
                className={inputClass}
                autoComplete="tel"
                dir="ltr"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                رمز عبور
              </label>

              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="رمز عبور خود را وارد کنید"
                className={inputClass}
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 p-3 text-sm leading-7 text-red-600">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-xl bg-green-50 p-3 text-sm leading-7 text-green-700">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-orange-600 py-3.5 font-bold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "در حال ورود..." : "ورود به حساب"}
            </button>
          </form>

          <div className="mt-6 border-t border-slate-100 pt-5 text-center text-sm text-slate-600">
            هنوز حساب کاربری ندارید؟

            <Link
              href="/account/register"
              className="mr-2 font-bold text-orange-600 hover:text-orange-700"
            >
              ثبت‌نام کنید
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-slate-500 transition hover:text-orange-600"
          >
            بازگشت به فروشگاه
          </Link>
        </div>
      </div>
    </main>
  );
}