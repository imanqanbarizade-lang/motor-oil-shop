from datetime import timedelta

from django.db.models import Sum
from django.utils import timezone

from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser

from .models import Category, Product, Sale
from .serializers import CategorySerializer, ProductSerializer


# نمایش دسته‌بندی‌ها
class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


# نمایش محصولات فعال
class ProductListView(generics.ListAPIView):
    queryset = Product.objects.filter(is_available=True)
    serializer_class = ProductSerializer


# نمایش تمام محصولات (فعال و غیرفعال) برای مدیر
class AdminProductListView(generics.ListAPIView):
    queryset = Product.objects.all().order_by('-created_at')
    serializer_class = ProductSerializer
    permission_classes = [IsAdminUser]


# ثبت محصول جدید
class ProductCreateView(generics.CreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAdminUser]


# ویرایش محصول
class ProductUpdateView(generics.UpdateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAdminUser]
    lookup_field = 'id'
    lookup_url_kwarg = 'product_id'


# جزئیات محصول
class ProductDetailView(generics.RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    lookup_field = 'slug'


# گزارش هوشمند موجودی محصولات
class InventoryReportView(APIView):

    def get(self, request):
        today = timezone.now()
        thirty_days_ago = today - timedelta(days=30)

        products = Product.objects.all().order_by('name')
        report = []

        for product in products:
            total_sales = Sale.objects.filter(
                product=product,
                is_test=False,
                sold_at__gte=thirty_days_ago
            ).aggregate(
                total=Sum('quantity')
            )['total'] or 0

            has_sales_data = total_sales > 0

            if has_sales_data:
                average_daily_sales = round(total_sales / 30, 2)
                target_stock = total_sales
            else:
                average_daily_sales = None
                target_stock = None

            if product.stock < 10:
                stock_status = "low_stock"
            else:
                stock_status = "normal"

            report.append({
                "product_id": product.id,
                "product_name": product.name,
                "viscosity": product.viscosity,
                "current_stock": product.stock,
                "sales_last_30_days": total_sales,
                "average_daily_sales": average_daily_sales,
                "target_stock": target_stock,
                "has_sales_data": has_sales_data,
                "stock_status": stock_status,
            })

        return Response({
            "period": "30 days",
            "data_available": any(
                item["has_sales_data"] for item in report
            ),
            "inventory_warning_threshold": 10,
            "products": report,
        })


# پرفروش‌ترین گرید روغن در ۲۱ روز اخیر
class BestSellingViscosityView(APIView):

    def get(self, request):
        twenty_one_days_ago = (
            timezone.now() - timedelta(days=21)
        )

        sales = Sale.objects.filter(
            is_test=False,
            sold_at__gte=twenty_one_days_ago
        )

        viscosity_sales = sales.values(
            'product__viscosity'
        ).annotate(
            total_quantity=Sum('quantity')
        ).order_by(
            '-total_quantity'
        )

        if not viscosity_sales.exists():
            return Response({
                "data_available": False,
                "message": "داده فروش واقعی کافی برای تحلیل وجود ندارد.",
                "best_viscosity": None,
                "results": [],
            })

        results = []

        for item in viscosity_sales:
            results.append({
                "viscosity": item['product__viscosity'],
                "total_sales": item['total_quantity'],
            })

        return Response({
            "data_available": True,
            "period": "21 days",
            "best_viscosity": results[0]["viscosity"],
            "results": results,
        })