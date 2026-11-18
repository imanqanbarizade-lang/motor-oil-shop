"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  Customer,
  getCurrentCustomer,
  customerLogout,
  updateCurrentCustomer,
} from "../../../lib/api";

export default function ProfilePage() {
  const router = useRouter();

  const [customer, setCustomer] = useState<Customer | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");

  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      try {
        const result = await getCurrentCustomer();

        if (active) {
          setCustomer(result);
          setFirstName(result.first_name);
          setLastName(result.last_name);
          setPhone(result.phone);
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "دریافت اطلاعات حساب با خطا مواجه شد."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      active = false;
    };
  }, []);

  function handleEdit() {
    if (!customer) return;

    setFirstName(customer.first_name);
    setLastName(customer.last_name);
    setPhone(customer.phone);

    setEditing(true);
    setError("");
    setSuccess("");
  }

  function handleCancel() {
    if (!customer) return;

    setFirstName(customer.first_name);
    setLastName(customer.last_name);
    setPhone(customer.phone);

    setEditing(false);
    setError("");
    setSuccess("");
  }

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!firstName.trim() || !lastName.trim() || !phone.trim()) {
      setError("لطفاً تمام فیلدها را تکمیل کنید.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const result = await updateCurrentCustomer({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        phone: phone.trim(),
      });

      setCustomer(result.customer);

      setFirstName(result.customer.first_name);
      setLastName(result.customer.last_name);
      setPhone(result.customer.phone);

      setEditing(false);
      setSuccess("اطلاعات حساب شما با موفقیت ویرایش شد.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "ویرایش اطلاعات با خطا مواجه شد."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    setLoggingOut(true);
    setError("");

    try {
      await customerLogout();
      router.push("/");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "خروج از حساب با خطا مواجه شد."
      );

      setLoggingOut(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100";

  if (loading) {
    return (
      <main
        dir="rtl"
        className="flex min-h-screen items-center justify-center bg-slate-50"
      >
        <p className="text-slate-500">
          در حال دریافت اطلاعات حساب...
        </p>
      </main>
    );
  }

  if (!customer) {
    return (
      <main
        dir="rtl"
        className="flex min-h-screen items-center justify-center bg-slate-50 px-4"
      >
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold text-slate-800">
            دسترسی به حساب کاربری
          </h1>

          <p className="mt-4 text-sm leading-7 text-slate-500">
            برای مشاهده پروفایل، ابتدا باید وارد حساب کاربری خود شوید.
          </p>

          {error && (
            <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">
              {error}
            </p>
          )}

          <Link
            href="/account/login"
            className="mt-6 inline-block rounded-xl bg-orange-600 px-6 py-3 font-bold text-white hover:bg-orange-700"
          >
            ورود به حساب
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-slate-50 px-4 py-10"
    >
      <div className="mx-auto max-w-4xl">

        {/* سربرگ */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link
              href="/"
              className="text-2xl font-black text-orange-600"
            >
              Oilino
            </Link>

            <h1 className="mt-4 text-2xl font-bold text-slate-800">
              حساب کاربری من
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              اطلاعات حساب خود را مدیریت کنید.
            </p>
          </div>

          <Link
            href="/"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 hover:border-orange-500 hover:text-orange-600"
          >
            بازگشت به فروشگاه
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">

          {/* کارت اطلاعات مشتری */}
          <aside className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">

            <div className="flex flex-col items-center text-center">

              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 text-3xl font-bold text-orange-600">
                {customer.first_name.charAt(0)}
              </div>

              <h2 className="mt-4 text-lg font-bold text-slate-800">
                {customer.first_name} {customer.last_name}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                مشتری Oilino
              </p>

            </div>

            <div className="mt-7 border-t border-slate-100 pt-5 space-y-3">

              <Link
                href="/account/orders"
                className="block w-full rounded-xl bg-orange-50 py-3 text-center text-sm font-bold text-orange-700 transition hover:bg-orange-100"
              >
                مشاهده سفارش‌های من
              </Link>

              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="w-full rounded-xl bg-red-50 py-3 text-sm font-bold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
              >
                {loggingOut
                  ? "در حال خروج..."
                  : "خروج از حساب کاربری"}
              </button>

            </div>

          </aside>

          {/* اطلاعات شخصی */}
          <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm md:col-span-2">

            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-5">

              <h2 className="text-lg font-bold text-slate-800">
                اطلاعات شخصی
              </h2>

              {!editing && (
                <button
                  onClick={handleEdit}
                  className="rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-orange-700"
                >
                  ویرایش اطلاعات
                </button>
              )}

            </div>

            <form
              onSubmit={handleSave}
              className="mt-6 space-y-5"
            >

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-600">
                  نام
                </label>

                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  readOnly={!editing}
                  className={`${inputClass} ${
                    !editing ? "bg-slate-50" : ""
                  }`}
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-600">
                  نام خانوادگی
                </label>

                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  readOnly={!editing}
                  className={`${inputClass} ${
                    !editing ? "bg-slate-50" : ""
                  }`}
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-600">
                  شماره تلفن
                </label>

                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  readOnly={!editing}
                  dir="ltr"
                  className={`${inputClass} text-left ${
                    !editing ? "bg-slate-50" : ""
                  }`}
                  required
                />
              </div>

              {editing && (
                <div className="flex flex-wrap gap-3 pt-3">

                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-xl bg-orange-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-orange-700 disabled:opacity-50"
                  >
                    {saving
                      ? "در حال ذخیره..."
                      : "ذخیره تغییرات"}
                  </button>

                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={saving}
                    className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                  >
                    انصراف
                  </button>

                </div>
              )}

            </form>

            {success && (
              <div className="mt-6 rounded-xl bg-green-50 p-4 text-sm leading-7 text-green-700">
                {success}
              </div>
            )}

            {error && (
              <div className="mt-6 rounded-xl bg-red-50 p-4 text-sm leading-7 text-red-600">
                {error}
              </div>
            )}

            {!editing && (
              <div className="mt-8 rounded-xl bg-orange-50 p-4">
                <p className="text-sm leading-7 text-orange-800">
                  اطلاعات حساب کاربری شما در فروشگاه Oilino
                  ثبت شده است. برای تغییر اطلاعات، روی دکمه
                  ویرایش اطلاعات کلیک کنید.
                </p>
              </div>
            )}

          </section>

        </div>

      </div>
    </main>
  );
}