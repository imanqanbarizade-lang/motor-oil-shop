from rest_framework import generics, serializers, status
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser

from django.shortcuts import get_object_or_404
from django.utils import timezone

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


# اعتبارسنجی اطلاعات فیش واریزی
class ReceiptUploadSerializer(serializers.Serializer):
    phone = serializers.CharField(max_length=20)
    payment_receipt = serializers.ImageField()


# بارگذاری فیش واریزی توسط مشتری
class OrderReceiptUploadView(APIView):
    permission_classes = [AllowAny]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, order_id):
        serializer = ReceiptUploadSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        phone = serializer.validated_data["phone"]
        receipt = serializer.validated_data["payment_receipt"]

        order = get_object_or_404(
            Order,
            id=order_id,
            phone=phone
        )

        if order.payment_status == "approved":
            return Response(
                {"error": "پرداخت این سفارش قبلاً تأیید شده است."},
                status=status.HTTP_400_BAD_REQUEST
            )

        order.payment_receipt = receipt
        order.payment_status = "pending_review"
        order.payment_submitted_at = timezone.now()
        order.save()

        return Response(
            {
                "message": "فیش واریزی با موفقیت ثبت شد و در انتظار بررسی مدیر است.",
                "order_id": order.id,
                "payment_status": order.payment_status
            },
            status=status.HTTP_200_OK
        )


# تأیید یا رد پرداخت توسط مدیر
class AdminPaymentReviewView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request, order_id):
        order = get_object_or_404(Order, id=order_id)

        payment_status = request.data.get("payment_status")

        if payment_status not in ["approved", "rejected"]:
            return Response(
                {"error": "وضعیت پرداخت معتبر نیست."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if payment_status == "approved" and not order.payment_receipt:
            return Response(
                {"error": "برای تأیید پرداخت ابتدا باید فیش واریزی ثبت شده باشد."},
                status=status.HTTP_400_BAD_REQUEST
            )

        order.payment_status = payment_status
        order.save(update_fields=["payment_status"])

        message = (
            "پرداخت سفارش با موفقیت تأیید شد."
            if payment_status == "approved"
            else "فیش واریزی سفارش رد شد."
        )

        return Response(
            {
                "message": message,
                "order_id": order.id,
                "payment_status": order.payment_status
            },
            status=status.HTTP_200_OK
        )