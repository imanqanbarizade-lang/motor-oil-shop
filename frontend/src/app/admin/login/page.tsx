"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { adminLogin } from "@/lib/api";

export default function AdminLoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      await adminLogin({
        username,
        password,
      });

      router.push("/dashboard");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("ورود با خطا مواجه شد.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      dir="rtl"
      className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10"
    >
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="bg-slate-900 px-8 py-10 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500 text-3xl font-bold text-white">
            O
          </div>

          <h1 className="text-3xl font-bold text-white">
            Oilino
          </h1>

          <p className="mt-3 text-sm text-slate-300">
            انتخاب هوشمندانه برای سلامت موتور
          </p>
        </div>

        <div className="p-8">
          <h2 className="text-xl font-bold text-slate-800">
            ورود مدیر
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            برای ورود به پنل مدیریت، اطلاعات خود را وارد کنید.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label
                htmlFor="username"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                نام کاربری
              </label>

              <input
                id="username"
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                required
                autoComplete="username"
                placeholder="نام کاربری مدیر"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                رمز عبور
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                autoComplete="current-password"
                placeholder="رمز عبور خود را وارد کنید"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-orange-500 py-3.5 font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "در حال ورود..." : "ورود به پنل مدیریت"}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-slate-400">
            دسترسی محدود به مدیران فروشگاه
          </p>
        </div>
      </div>
    </main>
  );
}