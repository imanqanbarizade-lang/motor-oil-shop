from django.db import models


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


class Product(models.Model):
    category = models.ForeignKey(
        Category,
        on_delete=models.PROTECT,
        related_name="products",
        verbose_name="دسته‌بندی"
    )

    slug = models.SlugField(
        max_length=200,
        unique=True,
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
        blank=True,
        verbose_name="ویسکوزیته"
    )
    api_standard = models.CharField(
        max_length=50,
        blank=True,
        verbose_name="استاندارد API"
    )
    volume = models.CharField(
        max_length=50,
        blank=True,
        verbose_name="حجم بسته‌بندی"
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
        verbose_name="قیمت (تومان)"
    )
    stock = models.PositiveIntegerField(
        default=0,
        verbose_name="موجودی انبار"
    )
    is_available = models.BooleanField(
        default=True,
        verbose_name="فعال بودن محصول"
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="تاریخ ایجاد"
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name="آخرین ویرایش"
    )

    def __str__(self):
        return f"{self.brand} - {self.name}"

    class Meta:
        verbose_name = "محصول"
        verbose_name_plural = "محصولات"
        ordering = ["-created_at"]