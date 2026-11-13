import json

from django.contrib import admin
from django.contrib.auth import authenticate, login
from django.http import JsonResponse
from django.urls import path, include
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_POST


# دریافت توکن امنیتی CSRF
@ensure_csrf_cookie
def csrf_token_view(request):
    return JsonResponse({
        "message": "CSRF cookie set successfully"
    })


# ورود مدیر
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

    user = authenticate(
        request,
        username=username,
        password=password
    )

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


# آدرس‌های اصلی پروژه
urlpatterns = [

    path('admin/', admin.site.urls),

    # دریافت CSRF
    path(
        'api/auth/csrf/',
        csrf_token_view,
        name='csrf-token'
    ),

    # ورود مدیر
    path(
        'api/auth/login/',
        admin_login_view,
        name='admin-login'
    ),

    # API محصولات
    path('api/', include('products.urls')),

    # API سفارش‌ها
    path('api/', include('orders.urls')),
]