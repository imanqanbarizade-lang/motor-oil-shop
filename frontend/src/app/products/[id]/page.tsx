"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "../../../context/CartContext";
import {
  getProductBySlug,
  ApiProduct,
  API_BASE_URL,
} from "../../../lib/api";

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();

  const slug = params.id as string;

  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCartModal, setShowCartModal] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        setError("");

        const data = await getProductBySlug(slug);
        setProduct(data);
        setImageError(false);
      } catch (err) {
        console.error("Product loading error:", err);
        setError("دریافت اطلاعات محصول با مشکل مواجه شد.");
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      loadProduct();
    }
  }, [slug]);

  function getImageUrl(image: string | null) {
    if (!image) {
      return "";
    }

    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }

    const serverUrl = API_BASE_URL.replace("/api", "");

    if (image.startsWith("/")) {
      return serverUrl + image;
    }

    return serverUrl + "/" + image;
  }

  function handleAddToCart() {
    if (!product) {
      return;
    }

    const image = getImageUrl(product.image);

    addToCart({
      id: product.slug,
      productId: product.id,
      name: product.name,
      brand: product.brand,
      image: image,
      viscosity: product.viscosity,
      api: product.api_standard,
      volume: product.volume,
      price: product.price,
    });

    setShowCartModal(true);
  }

  function formatPrice(price: number) {
    return new Intl.NumberFormat("fa-IR").format(price);
  }

  if (loading) {
    return (
      <main
        dir="rtl"
        className="min-h-screen flex items-center justify-center bg-gray-50"
      >
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">
            در حال دریافت اطلاعات محصول...
          </p>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main
        dir="rtl"
        className="min-h-screen flex items-center justify-center bg-gray-50 px-4"
      >
        <div className="bg-white rounded-2xl shadow-sm p-8 text-center max-w-md w-full">
          <div className="text-5xl mb-4">⚠️</div>

          <h2 className="text-xl font-bold text-gray-800 mb-3">
            محصول پیدا نشد
          </h2>

          <p className="text-gray-500 mb-6">
            {error || "اطلاعات این محصول در دسترس نیست."}
          </p>

          <button
            onClick={() => router.push("/")}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl transition"
          >
            بازگشت به صفحه اصلی
          </button>
        </div>
      </main>
    );
  }

  const imageUrl = getImageUrl(product.image);

  const stockAvailable =
    product.stock > 0 && product.is_available;

  const stockClass = stockAvailable
    ? "font-bold text-lg text-green-600"
    : "font-bold text-lg text-red-500";

  const buttonClass = stockAvailable
    ? "w-full py-4 rounded-xl font-bold text-white transition bg-orange-500 hover:bg-orange-600"
    : "w-full py-4 rounded-xl font-bold text-white transition bg-gray-400 cursor-not-allowed";

  return (
    <main dir="rtl" className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-sm text-gray-500 mb-6 flex items-center gap-2">
          <button
            onClick={() => router.push("/")}
            className="hover:text-orange-500 transition"
          >
            صفحه اصلی
          </button>

          <span>/</span>

          <span className="text-gray-700">
            {product.name}
          </span>
        </div>

        <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-10">
            <div className="bg-gray-50 rounded-2xl flex items-center justify-center min-h-[320px] md:min-h-[450px] p-6">
              {imageUrl && !imageError ? (
                <img
                  src={imageUrl}
                  alt={product.name}
                  className="max-h-[420px] w-full object-contain"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="text-center">
                  <div className="text-8xl mb-4">🛢️</div>
                  <p className="text-gray-400 text-sm">
                    تصویر محصول موجود نیست
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-col justify-center">
              <div className="mb-4">
                <span className="inline-block bg-orange-100 text-orange-600 text-sm font-medium px-4 py-2 rounded-full">
                  {product.category?.name || "محصول"}
                </span>
              </div>

              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
                {product.name}
              </h1>

              <p className="text-gray-500 mb-6">
                برند: {product.brand}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-400 mb-2">
                    گرانروی
                  </p>
                  <p className="font-bold text-gray-800 text-lg">
                    {product.viscosity || "ثبت نشده"}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-400 mb-2">
                    استاندارد API
                  </p>
                  <p className="font-bold text-gray-800 text-lg">
                    {product.api_standard || "ثبت نشده"}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-400 mb-2">
                    حجم
                  </p>
                  <p className="font-bold text-gray-800 text-lg">
                    {product.volume || "ثبت نشده"}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-400 mb-2">
                    وضعیت موجودی
                  </p>
                  <p className={stockClass}>
                    {stockAvailable ? "موجود" : "ناموجود"}
                  </p>
                </div>
              </div>

              {product.description && (
                <div className="mb-8">
                  <h3 className="font-bold text-gray-800 mb-3">
                    توضیحات محصول
                  </h3>

                  <p className="text-gray-600 leading-8 text-sm">
                    {product.description}
                  </p>
                </div>
              )}

              <div className="border-t border-gray-100 pt-6 mb-6">
                <p className="text-sm text-gray-400 mb-2">
                  قیمت محصول
                </p>

                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-orange-600">
                    {formatPrice(product.price)}
                  </span>

                  <span className="text-gray-500">
                    تومان
                  </span>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!stockAvailable}
                className={buttonClass}
              >
                {stockAvailable
                  ? "افزودن به سبد خرید"
                  : "این محصول ناموجود است"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {showCartModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-7 shadow-xl text-center">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-5">
              ✓
            </div>

            <h2 className="text-xl font-bold text-gray-800 mb-3">
              محصول به سبد خرید اضافه شد
            </h2>

            <p className="text-gray-500 text-sm mb-7">
              محصول با موفقیت به سبد خرید شما اضافه شد.
              اکنون می‌توانید خرید خود را ادامه دهید یا سبد خرید را مشاهده کنید.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowCartModal(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-medium transition"
              >
                ادامه خرید
              </button>

              <button
                onClick={() => router.push("/cart")}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-medium transition"
              >
                مشاهده سبد خرید
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
