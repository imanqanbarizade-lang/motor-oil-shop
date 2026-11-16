from django.urls import path
from .views import (
    OrderCreateView,
    AdminOrderListView,
    OrderReceiptUploadView,
    AdminPaymentReviewView,
)

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

    # بارگذاری فیش واریزی توسط مشتری
    path(
        'orders/<int:order_id>/upload-receipt/',
        OrderReceiptUploadView.as_view(),
        name='order-upload-receipt'
    ),

    # تأیید یا رد پرداخت توسط مدیر
    path(
        'orders/admin/<int:order_id>/review-payment/',
        AdminPaymentReviewView.as_view(),
        name='admin-payment-review'
    ),
]