import json

from django.contrib import admin
from django.contrib.auth import authenticate, login
from django.conf import settings
from django.http import JsonResponse
from django.urls import path, include
from django.conf.urls.static import static
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_POST


@ensure_csrf_cookie
def csrf_token_view(request):
    return JsonResponse({"message": "CSRF cookie set successfully"})


@require_POST
def admin_login_view(request):
    try:
        data = json.loads(request.body)
        username = data.get("username")
        password = data.get("password")
    except (json.JSONDecodeError, AttributeError):
        return JsonResponse(
            {"error": "اطلاعات ارسال‌شده معتبر نیست."},
            status=400
        )

    user = authenticate(request, username=username, password=password)

    if user is None:
        return JsonResponse(
            {"error": "نام کاربری یا رمز عبور اشتباه است."},
            status=401
        )

    if not user.is_active or not user.is_staff:
        return JsonResponse(
            {"error": "دسترسی فقط برای مدیران مجاز است."},
            status=403
        )

    login(request, user)

    return JsonResponse({
        "message": "ورود مدیر با موفقیت انجام شد.",
        "username": user.username
    })


urlpatterns = [
    path("admin/", admin.site.urls),

    # احراز هویت و ورود مدیر
    path("api/auth/csrf/", csrf_token_view, name="csrf-token"),
    path("api/auth/login/", admin_login_view, name="admin-login"),

    # مسیرهای حساب مشتری
    path("api/", include("accounts.urls")),

    # مسیرهای محصولات و سفارش‌ها
    path("api/", include("products.urls")),
    path("api/", include("orders.urls")),
]


if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT
    )