"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useCart } from "../../../context/CartContext";
import { getProductBySlug, ApiProduct } from "../../../lib/api";

const productDetails: Record<
  string,
  {
    brand: string;
    model: string;
    image: string;
    volume: string;
  }
> = {
  "synolex-rush": {
    brand: "سینولکس",
    model: "Rush",
    image: "/images/synolex-rush-5w40.jpg.jpeg",
    volume: "۵ لیتر",
  },
  "liqui-moly-10w40": {
    brand: "لیکومولی",
    model: "Super Leichtlauf",
    image: "/images/liqui-moly-10w40.jpg",
    volume: "۴ لیتر",
  },
  "canada-lubrifant-0w20": {
    brand: "لوبریفنت کانادا",
    model: "XU7+",
    image: "/images/canada-lubrifant-0w20.jpg",
    volume: "۴.۷ لیتر",
  },
  "satel-10w40": {
    brand: "ساتل",
    model: "",
    image: "/images/satel-10w40.jpg",
    volume: "۴ لیتر",
  },
  "atrod-20w50": {
    brand: "آترود",
    model: "Super GLX",
    image: "/images/atrod-20w50.webp",
    volume: "۴.۵ لیتر",
  },
  "caspian-0w20": {
    brand: "کاسپین",
    model: "Glide 3X",
    image: "/images/caspian-0w20.png",
    volume: "۵ لیتر",
  },
  "castrol-magnatec-10w40": {
    brand: "کاسترول",
    model: "Magnatec",
    image: "/images/castrol-magnatec-10w40.png",
    volume: "۴ لیتر",
  },
  "dallas-5w30": {
    brand: "دالاس",
    model: "",
    image: "/images/dallas-5w30.jpg",
    volume: "۴ لیتر",
  },
};

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();

  const { addToCart } = useCart();

  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const slug = params.id as string;

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        setError("");

        const data = await getProductBySlug(slug);
        setProduct(data);
      } catch (err) {
        console.error("خطا در دریافت محصول:", err);
        setError("دریافت اطلاعات محصول با مشکل مواجه شد.");
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      loadProduct();
    }
  }, [slug]);

  const details = product ? productDetails[product.slug] : undefined;

  const brand = details?.brand || product?.brand || "";
  const model = details?.model || "";
  const image = details?.image || "";
  const volume = details?.volume || product?.volume || "";

  const productName = product
    ? `روغن موتور ${brand} ${model}`.trim()
    : "";

  const formattedPrice = product
    ? new Intl.NumberFormat("fa-IR").format(product.price)
    : "۰";

  const isOutOfStock = product
    ? product.stock <= 0 || !product.is_available
    : false;

  const handleAddToCart = () => {
    if (!product) return;

    if (isOutOfStock) {
      setMessage("این محصول در حال حاضر موجود نیست.");
      return;
    }

    if (product.price <= 0) {
      setMessage("قیمت این محصول هنوز تعیین نشده است.");
      return;
    }

    addToCart({
      id: product.slug,
      productId: product.id,
      name: productName,
      brand: brand,
      image: image,
      viscosity: product.viscosity,
      api: product.api_standard,
      volume: volume,
      price: product.price,
    });

    setMessage("محصول با موفقیت به سبد خرید اضافه شد.");
  };

  if (loading) {
    return (
      <main
        dir="rtl"
        className="min-h-screen bg-gray-50 flex items-center justify-center p-6"
      >
        <p className="text-gray-500">
          در حال دریافت اطلاعات محصول...
        </p>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            {error || "محصول پیدا نشد"}
          </h1>

          <button
            onClick={() => router.push("/categories/engine-oil")}
            className="bg-orange-500 text-white px-6 py-3 rounded-xl"
          >
            بازگشت به محصولات
          </button>
        </div>
      </main>
    );
  }

  return (
    <main dir="rtl" className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-5 flex justify-between items-center">
          <button
            onClick={() => router.push("/")}
            className="text-2xl font-bold text-blue-950"
          >
            Oilino
          </button>

          <button
            onClick={() => router.push("/categories/engine-oil")}
            className="text-gray-600 hover:text-orange-500"
          >
            بازگشت به روغن موتور
          </button>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white rounded-3xl p-6 md:p-10 shadow-sm">
          <div className="relative min-h-[320px] md:min-h-[450px] bg-gray-50 rounded-2xl">
            {image ? (
              <Image
                src={image}
                alt={productName}
                fill
                className="object-contain p-6"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-7xl">
                🛢️
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center">
            <span className="text-orange-500 font-medium mb-3">
              {brand}
            </span>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
              {productName}
            </h1>

            <p className="text-gray-600 leading-8 mb-8">
              {product.description ||
                "توضیحات این محصول به‌زودی تکمیل می‌شود."}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-gray-50 rounded-xl p-4">
                <span className="text-sm text-gray-500">
                  گرید روغن
                </span>
                <p className="font-bold text-gray-800 mt-2">
                  {product.viscosity}
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <span className="text-sm text-gray-500">
                  استاندارد API
                </span>
                <p className="font-bold text-gray-800 mt-2">
                  {product.api_standard}
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <span className="text-sm text-gray-500">
                  حجم بسته‌بندی
                </span>
                <p className="font-bold text-gray-800 mt-2">
                  {volume}
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <span className="text-sm text-gray-500">
                  برند
                </span>
                <p className="font-bold text-gray-800 mt-2">
                  {brand}
                </p>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-6">
              {product.price > 0 ? (
                <div className="mb-5">
                  <span className="text-gray-500 text-sm">
                    قیمت محصول
                  </span>
                  <p className="text-2xl font-bold text-blue-950 mt-2">
                    {formattedPrice} تومان
                  </p>
                </div>
              ) : (
                <p className="text-gray-500 mb-5">
                  قیمت این محصول هنوز تعیین نشده است.
                </p>
              )}

              <div className="mb-5">
                {isOutOfStock ? (
                  <span className="inline-flex items-center rounded-lg bg-red-100 px-4 py-2 text-sm font-bold text-red-700">
                    ناموجود
                  </span>
                ) : (
                  <span className="text-sm font-medium text-green-700">
                    موجود در انبار:{" "}
                    {new Intl.NumberFormat("fa-IR").format(product.stock)} عدد
                  </span>
                )}
              </div>

              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock || product.price <= 0}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold transition"
              >
                {isOutOfStock
                  ? "در حال حاضر ناموجود"
                  : "افزودن به سبد خرید"}
              </button>

              {message && (
                <p
                  className={`mt-4 text-center text-sm font-medium ${
                    message.includes("موفقیت")
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {message}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <footer className="text-center text-gray-500 py-8 text-sm">
        © تمامی حقوق برای فروشگاه Oilino محفوظ است.
      </footer>
    </main>
  );
}