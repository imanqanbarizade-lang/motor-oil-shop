"use client";

import { useEffect, useState, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  getCategories,
  getProducts,
  updateProduct,
  type ApiCategory,
  type CreateProductData,
} from "@/lib/api";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();

  const productId = Number(params.id);

  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
    async function loadData() {
      try {
        const [categoriesData, productsData] = await Promise.all([
          getCategories(),
          getProducts(),
        ]);

        setCategories(categoriesData);

        const product = productsData.find(
          (item) => item.id === productId
        );

        if (!product) {
          setError("محصول موردنظر پیدا نشد.");
          return;
        }

        setFormData({
          category_id: product.category.id.toString(),
          name: product.name,
          brand: product.brand,
          viscosity: product.viscosity,
          api_standard: product.api_standard,
          volume: product.volume.toString(),
          description: product.description || "",
          price: product.price.toString(),
          stock: product.stock.toString(),
          is_available: product.is_available,
        });
      } catch {
        setError("دریافت اطلاعات محصول با خطا مواجه شد.");
      } finally {
        setLoading(false);
      }
    }

    if (Number.isInteger(productId) && productId > 0) {
      loadData();
    } else {
      setError("شناسه محصول معتبر نیست.");
      setLoading(false);
    }
  }, [productId]);

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
    setSaving(true);

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

      await updateProduct(productId, productData);

      setSuccess("اطلاعات محصول با موفقیت ویرایش شد.");

      setTimeout(() => {
        router.push("/dashboard/products");
      }, 1200);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "ویرایش محصول با خطا مواجه شد."
      );
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100";

  if (loading) {
    return (
      <main dir="rtl" className="p-8 text-center text-slate-500">
        در حال دریافت اطلاعات محصول...
      </main>
    );
  }

  return (
    <main dir="rtl" className="space-y-6">

      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          ویرایش محصول
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          اطلاعات محصول را بررسی و اصلاح کنید.
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
              className={inputClass}
            >
              <option value="">انتخاب دسته‌بندی</option>

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
            disabled={saving}
            className="rounded-xl bg-orange-500 px-8 py-3 font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "در حال ذخیره..." : "ذخیره تغییرات"}
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