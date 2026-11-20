from django.conf import settings
from django.db import models
from django.core.validators import MinValueValidator
from products.models import Product


class Order(models.Model):

    STATUS_CHOICES = [
        ("pending", "در انتظار بررسی"),
        ("confirmed", "تأیید شده"),
        ("processing", "در حال آماده‌سازی"),
        ("shipped", "ارسال شده"),
        ("delivered", "تحویل داده شده"),
        ("cancelled", "لغو شده"),
    ]

    PAYMENT_STATUS_CHOICES = [
        ("unpaid", "پرداخت نشده"),
        ("pending_review", "در انتظار تأیید پرداخت"),
        ("approved", "پرداخت تأیید شده"),
        ("rejected", "فیش پرداخت رد شده"),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="orders",
        verbose_name="حساب کاربری مشتری"
    )

    full_name = models.CharField(
        max_length=150,
        verbose_name="نام و نام خانوادگی"
    )

    phone = models.CharField(
        max_length=20,
        verbose_name="شماره تماس"
    )

    province = models.CharField(
        max_length=100,
        verbose_name="استان"
    )

    city = models.CharField(
        max_length=100,
        verbose_name="شهر"
    )

    address = models.TextField(
        verbose_name="آدرس کامل"
    )

    postal_code = models.CharField(
        max_length=20,
        blank=True,
        verbose_name="کد پستی"
    )

    description = models.TextField(
        blank=True,
        verbose_name="توضیحات سفارش"
    )

    shipping_cost = models.PositiveBigIntegerField(
        default=0,
        verbose_name="هزینه ارسال"
    )

    total_amount = models.PositiveBigIntegerField(
        default=0,
        verbose_name="مبلغ کل سفارش"
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="pending",
        verbose_name="وضعیت سفارش"
    )

    payment_status = models.CharField(
        max_length=20,
        choices=PAYMENT_STATUS_CHOICES,
        default="unpaid",
        verbose_name="وضعیت پرداخت"
    )

    payment_receipt = models.ImageField(
        upload_to="payment_receipts/",
        blank=True,
        null=True,
        verbose_name="تصویر فیش واریزی"
    )

    payment_submitted_at = models.DateTimeField(
        blank=True,
        null=True,
        verbose_name="زمان ارسال فیش"
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="تاریخ ثبت سفارش"
    )

    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name="آخرین بروزرسانی"
    )

    def __str__(self):
        return f"سفارش شماره {self.id} - {self.full_name}"

    class Meta:
        verbose_name = "سفارش"
        verbose_name_plural = "سفارش‌ها"
        ordering = ["-created_at"]


class OrderItem(models.Model):

    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name="items",
        verbose_name="سفارش"
    )

    product = models.ForeignKey(
        Product,
        on_delete=models.PROTECT,
        related_name="order_items",
        verbose_name="محصول"
    )

    quantity = models.PositiveIntegerField(
        validators=[MinValueValidator(1)],
        verbose_name="تعداد"
    )

    unit_price = models.PositiveBigIntegerField(
        default=0,
        verbose_name="قیمت واحد هنگام سفارش"
    )

    def __str__(self):
        return f"{self.product.name} - {self.quantity} عدد"

    @property
    def total_price(self):
        return self.quantity * self.unit_price

    class Meta:
        verbose_name = "محصول سفارش"
        verbose_name_plural = "محصولات سفارش"