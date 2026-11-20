from django.db import models
from django.core.validators import MinValueValidator
from django.utils.text import slugify


# ==========================================
# مدل دسته‌بندی محصولات
# ==========================================

class Category(models.Model):

    name = models.CharField(
        max_length=100,
        verbose_name="نام دسته‌بندی"
    )

    slug = models.SlugField(
        unique=True,
        verbose_name="شناسه دسته‌بندی"
    )

    description = models.TextField(
        blank=True,
        null=True,
        verbose_name="توضیحات"
    )

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "دسته‌بندی"
        verbose_name_plural = "دسته‌بندی‌ها"


# ==========================================
# مدل محصولات
# ==========================================

class Product(models.Model):

    category = models.ForeignKey(
        Category,
        on_delete=models.PROTECT,
        related_name="products",
        verbose_name="دسته‌بندی"
    )

    slug = models.SlugField(
        max_length=200,
        blank=True,
        verbose_name="شناسه محصول"
    )

    name = models.CharField(
        max_length=200,
        verbose_name="نام محصول"
    )

    brand = models.CharField(
        max_length=100,
        verbose_name="برند"
    )

    viscosity = models.CharField(
        max_length=50,
        verbose_name="گرانروی"
    )

    api_standard = models.CharField(
        max_length=50,
        verbose_name="استاندارد API"
    )

    volume = models.CharField(
        max_length=50,
        verbose_name="حجم"
    )

    description = models.TextField(
        blank=True,
        verbose_name="توضیحات محصول"
    )

    image = models.ImageField(
        upload_to="products/",
        blank=True,
        null=True,
        verbose_name="تصویر محصول"
    )

    price = models.PositiveBigIntegerField(
        default=0,
        verbose_name="قیمت"
    )

    stock = models.PositiveIntegerField(
        default=0,
        verbose_name="موجودی انبار"
    )

    is_available = models.BooleanField(
        default=True,
        verbose_name="قابل نمایش بودن محصول"
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="تاریخ ایجاد"
    )

    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name="آخرین بروزرسانی"
    )

    def generate_unique_slug(self):

        # تلاش اول: استفاده از نام محصول
        base_slug = slugify(self.name)

        # تلاش دوم: استفاده از برند، گرانروی و استاندارد
        if not base_slug:
            base_slug = slugify(
                f"{self.brand} {self.viscosity} {self.api_standard}"
            )

        # اگر باز هم اسلاگ خالی بود
        if not base_slug:
            base_slug = f"product-{self.pk or 'new'}"

        # محدودیت طول اسلاگ
        base_slug = base_slug[:180]

        candidate_slug = base_slug
        counter = 2

        # جلوگیری از تکراری شدن اسلاگ
        while Product.objects.filter(
            slug=candidate_slug
        ).exclude(pk=self.pk).exists():

            suffix = f"-{counter}"
            candidate_slug = f"{base_slug[:200 - len(suffix)]}{suffix}"
            counter += 1

        return candidate_slug

    def save(self, *args, **kwargs):

        # برای محصول جدید یا محصولی که اسلاگ ندارد
        if not self.slug:
            self.slug = self.generate_unique_slug()

        # اگر اسلاگ محصول با محصول دیگری تداخل داشته باشد
        elif Product.objects.filter(
            slug=self.slug
        ).exclude(pk=self.pk).exists():

            self.slug = self.generate_unique_slug()

        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "محصول"
        verbose_name_plural = "محصولات"
        ordering = ["-created_at"]


# ==========================================
# مدل ثبت اطلاعات فروش
# ==========================================

class Sale(models.Model):

    product = models.ForeignKey(
        Product,
        on_delete=models.PROTECT,
        related_name="sales",
        verbose_name="محصول"
    )

    quantity = models.PositiveIntegerField(
        validators=[MinValueValidator(1)],
        verbose_name="تعداد فروش"
    )

    unit_price = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        validators=[MinValueValidator(0)],
        verbose_name="قیمت واحد هنگام فروش"
    )

    invoice_number = models.CharField(
        max_length=100,
        blank=True,
        verbose_name="شماره فاکتور"
    )

    sold_at = models.DateTimeField(
        verbose_name="تاریخ فروش"
    )

    is_test = models.BooleanField(
        default=False,
        verbose_name="فروش آزمایشی"
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="تاریخ ثبت"
    )

    def __str__(self):
        return f"{self.product.name} - {self.quantity} عدد"

    class Meta:
        verbose_name = "فروش"
        verbose_name_plural = "فروش‌ها"
        ordering = ["-sold_at"]


# ==========================================
# مدل تاریخچه تغییرات موجودی انبار
# ==========================================

class InventoryMovement(models.Model):

    MOVEMENT_TYPES = [
        ("purchase", "تأمین کالا"),
        ("adjustment", "اصلاح موجودی"),
        ("sale", "فروش واقعی"),
        ("sale_return", "برگشت فروش"),
    ]

    product = models.ForeignKey(
        Product,
        on_delete=models.PROTECT,
        related_name="inventory_movements",
        verbose_name="محصول"
    )

    movement_type = models.CharField(
        max_length=20,
        choices=MOVEMENT_TYPES,
        verbose_name="نوع عملیات"
    )

    quantity = models.IntegerField(
        verbose_name="میزان تغییر موجودی"
    )

    stock_before = models.PositiveIntegerField(
        verbose_name="موجودی قبل از عملیات"
    )

    stock_after = models.PositiveIntegerField(
        verbose_name="موجودی بعد از عملیات"
    )

    note = models.TextField(
        blank=True,
        verbose_name="توضیحات"
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="تاریخ ثبت عملیات"
    )

    def __str__(self):
        return f"{self.product.name} - {self.get_movement_type_display()}"

    class Meta:
        verbose_name = "تغییر موجودی انبار"
        verbose_name_plural = "تاریخچه موجودی انبار"
        ordering = ["-created_at"]