from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAdminUser

from .models import Order
from .serializers import OrderSerializer


# ثبت سفارش توسط مشتری
class OrderCreateView(generics.CreateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [AllowAny]


# مشاهده تمام سفارش‌ها توسط مدیر
class AdminOrderListView(generics.ListAPIView):
    queryset = Order.objects.all().prefetch_related(
        "items__product"
    )
    serializer_class = OrderSerializer
    permission_classes = [IsAdminUser]