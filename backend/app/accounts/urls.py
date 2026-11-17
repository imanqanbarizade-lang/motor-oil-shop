from django.urls import path

from .views import (
    CustomerRegisterView,
    CustomerLoginView,
    CustomerLogoutView,
    CustomerMeView,
)


urlpatterns = [

    # ثبت‌نام مشتری
    path(
        "auth/register/",
        CustomerRegisterView.as_view(),
        name="customer-register"
    ),

    # ورود مشتری
    path(
        "auth/customer-login/",
        CustomerLoginView.as_view(),
        name="customer-login"
    ),

    # خروج مشتری
    path(
        "auth/customer-logout/",
        CustomerLogoutView.as_view(),
        name="customer-logout"
    ),

    # اطلاعات حساب مشتری
    path(
        "auth/me/",
        CustomerMeView.as_view(),
        name="customer-me"
    ),

]