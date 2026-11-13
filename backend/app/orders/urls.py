from django.urls import path
from .views import OrderCreateView, AdminOrderListView

urlpatterns = [
    # ثبت سفارش توسط مشتری
    path(
        'orders/create/',
        OrderCreateView.as_view(),
        name='order-create'
    ),

    # مشاهده سفارش‌ها توسط مدیر
    path(
        'orders/admin/all/',
        AdminOrderListView.as_view(),
        name='admin-order-list'
    ),
]