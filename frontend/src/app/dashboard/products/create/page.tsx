"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  getCategories,
  createProduct,
  type ApiCategory,
  type CreateProductData,
} from "@/lib/api";

export default function CreateProductPage() {
  const router = useRouter();

  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    category_id: "",
    name: "",
    brand: "",
    viscosity: "",
    api_standard: "",
    volume: "",
    description: "",
    price: "",
    stock: "",
    is_available: true,
  });

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch {
        setError("دریافت دسته‌بندی‌ها با خطا مواجه شد.");
      } finally {
        setLoadingCategories(false);
      }
    }

    loadCategories();
  }, []);

  function handleChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const productData: CreateProductData = {
        category_id: Number(formData.category_id),
        name: formData.name,
        brand: formData.brand,
        viscosity: formData.viscosity,
        api_standard: formData.api_standard,
        volume: Number(formData.volume),
        description: formData.description,
        price: Number(formData.price),
        stock: Number(formData.stock),
        is_available: formData.is_available,
      };

      await createProduct(productData);

      setSuccess("محصول با موفقیت ثبت شد.");

      setTimeout(() => {
        router.push("/dashboard/products");
      }, 1200);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "ثبت محصول با خطا مواجه شد."
      );
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100";

  return (
    <main dir="rtl" className="space-y-6">

      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          افزودن محصول جدید
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          اطلاعات محصول جدید را وارد کنید.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              دسته‌بندی محصول
            </label>

            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              required
              disabled={loadingCategories}
              className={inputClass}
            >
              <option value="">
                {loadingCategories
                  ? "در حال دریافت دسته‌بندی‌ها..."
                  : "انتخاب دسته‌بندی"}
              </option>

              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              نام محصول
            </label>

            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="مثلاً روغن موتور سینولکس"
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              برند
            </label>

            <input
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              required
              placeholder="مثلاً سینولکس"
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              گرانروی
            </label>

            <input
              name="viscosity"
              value={formData.viscosity}
              onChange={handleChange}
              required
              placeholder="مثلاً 5W-30"
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              استاندارد API
            </label>

            <input
              name="api_standard"
              value={formData.api_standard}
              onChange={handleChange}
              required
              placeholder="مثلاً API SP"
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              حجم بسته‌بندی (لیتر)
            </label>

            <input
              type="number"
              step="0.1"
              min="0.1"
              name="volume"
              value={formData.volume}
              onChange={handleChange}
              required
              placeholder="مثلاً 4"
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              قیمت (تومان)
            </label>

            <input
              type="number"
              min="0"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              placeholder="مثلاً 1500000"
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              تعداد موجودی
            </label>

            <input
              type="number"
              min="0"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              required
              placeholder="مثلاً 20"
              className={inputClass}
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              توضیحات محصول
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="توضیحات مربوط به محصول را وارد کنید..."
              className={inputClass}
            />
          </div>

          <div className="md:col-span-2">
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={formData.is_available}
                onChange={(event) =>
                  setFormData((previous) => ({
                    ...previous,
                    is_available: event.target.checked,
                  }))
                }
                className="h-4 w-4 accent-orange-500"
              />

              <span className="text-sm font-medium text-slate-700">
                محصول در فروشگاه فعال باشد
              </span>
            </label>
          </div>

        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            {success}
          </div>
        )}

        <div className="mt-8 flex flex-wrap gap-3">

          <button
            type="submit"
            disabled={loading || loadingCategories}
            className="rounded-xl bg-orange-500 px-8 py-3 font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "در حال ثبت محصول..." : "ثبت محصول"}
          </button>

          <button
            type="button"
            onClick={() => router.push("/dashboard/products")}
            className="rounded-xl border border-slate-200 px-8 py-3 font-medium text-slate-600 transition hover:bg-slate-50"
          >
            انصراف
          </button>

        </div>
      </form>
    </main>
  );
}