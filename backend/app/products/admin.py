from django.contrib import admin
from django import forms
from django.core.exceptions import ValidationError

from .models import (
    Category,
    Product,
    Sale,
    InventoryMovement,
)

from .services import (
    save_sale_with_stock,
    delete_sale_with_stock,
    add_inventory_stock,
    adjust_inventory_stock,
)


# ==========================================
# فرم اعتبارسنجی فروش
# ==========================================

class SaleAdminForm(forms.ModelForm):

    class Meta:
        model = Sale
        fields = "__all__"

    def clean(self):

        cleaned_data = super().clean()

        product = cleaned_data.get("product")
        quantity = cleaned_data.get("quantity")
        is_test = cleaned_data.get("is_test")

        if not product or not quantity or is_test:
            return cleaned_data

        product_ids = {product.id}

        old_sale = None

        if self.instance.pk:

            old_sale = Sale.objects.filter(
                pk=self.instance.pk
            ).first()

            if old_sale and not old_sale.is_test:
                product_ids.add(old_sale.product_id)

        products = Product.objects.filter(
            id__in=product_ids
        )

        stocks = {
            item.id: item.stock
            for item in products
        }

        if old_sale and not old_sale.is_test:

            stocks[old_sale.product_id] += old_sale.quantity

        available_stock = stocks[product.id]

        if quantity > available_stock:

            raise ValidationError(
                f"موجودی محصول کافی نیست. "
                f"موجودی قابل استفاده: {available_stock}"
            )

        return cleaned_data


# ==========================================
# فرم ثبت تغییرات موجودی
# ==========================================

class InventoryMovementAdminForm(forms.ModelForm):

    quantity = forms.IntegerField(
        required=False,
        min_value=1,
        label="تعداد کالای ورودی",
        help_text="فقط برای عملیات تأمین کالا استفاده می‌شود."
    )

    actual_stock = forms.IntegerField(
        required=False,
        min_value=0,
        label="موجودی واقعی شمارش‌شده",
        help_text="فقط برای اصلاح موجودی استفاده می‌شود."
    )

    class Meta:
        model = InventoryMovement
        fields = [
            "product",
            "movement_type",
            "note",
        ]

    def clean(self):

        cleaned_data = super().clean()

        movement_type = cleaned_data.get("movement_type")
        quantity = cleaned_data.get("quantity")
        actual_stock = cleaned_data.get("actual_stock")

        if movement_type == "purchase":

            if quantity is None or quantity <= 0:

                raise ValidationError(
                    "برای تأمین کالا باید تعداد ورودی را مشخص کنید."
                )

        elif movement_type == "adjustment":

            if actual_stock is None:

                raise ValidationError(
                    "برای اصلاح موجودی باید موجودی واقعی را وارد کنید."
                )

        return cleaned_data


# ==========================================
# مدیریت دسته‌بندی‌ها
# ==========================================

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):

    list_display = ("name", "slug")

    search_fields = ("name",)


# ==========================================
# مدیریت محصولات
# ==========================================

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):

    list_display = (
        "name",
        "brand",
        "category",
        "viscosity",
        "api_standard",
        "volume",
        "price",
        "stock",
        "is_available",
    )

    list_filter = (
        "category",
        "brand",
        "is_available",
    )

    search_fields = (
        "name",
        "brand",
        "viscosity",
    )

    list_editable = (
        "price",
        "is_available",
    )

    readonly_fields = ("stock",)


# ==========================================
# مدیریت اطلاعات فروش
# ==========================================

@admin.register(Sale)
class SaleAdmin(admin.ModelAdmin):

    form = SaleAdminForm

    list_display = (
        "id",
        "product",
        "quantity",
        "unit_price",
        "invoice_number",
        "sold_at",
        "is_test",
    )

    list_filter = (
        "sold_at",
        "product",
        "is_test",
    )

    search_fields = (
        "product__name",
        "product__brand",
        "invoice_number",
    )

    date_hierarchy = "sold_at"

    autocomplete_fields = ("product",)

    readonly_fields = ("created_at",)

    list_select_related = ("product",)

    ordering = ("-sold_at",)

    def save_model(self, request, obj, form, change):

        save_sale_with_stock(obj)

    def delete_model(self, request, obj):

        delete_sale_with_stock(obj)

    def delete_queryset(self, request, queryset):

        sales = list(queryset)

        for sale in sales:

            delete_sale_with_stock(sale)


# ==========================================
# مدیریت تاریخچه تغییرات موجودی
# ==========================================

@admin.register(InventoryMovement)
class InventoryMovementAdmin(admin.ModelAdmin):

    form = InventoryMovementAdminForm

    list_display = (
        "product",
        "movement_type",
        "quantity",
        "stock_before",
        "stock_after",
        "created_at",
    )

    list_filter = (
        "movement_type",
        "created_at",
    )

    search_fields = (
        "product__name",
        "product__brand",
        "note",
    )

    autocomplete_fields = ("product",)

    # quantity در فرم افزودن باید قابل ویرایش باشد.
    # فقط فیلدهای زیر در فرم افزودن فقط‌خواندنی هستند.
    readonly_fields = (
        "stock_before",
        "stock_after",
        "created_at",
    )

    def get_readonly_fields(self, request, obj=None):

        if obj:
            return (
                "product",
                "movement_type",
                "quantity",
                "stock_before",
                "stock_after",
                "note",
                "created_at",
            )

        return self.readonly_fields

    def save_model(self, request, obj, form, change):

        if change:
            raise ValidationError(
                "ویرایش عملیات ثبت‌شده مجاز نیست."
            )

        product_id = form.cleaned_data["product"].id
        movement_type = form.cleaned_data["movement_type"]
        note = form.cleaned_data.get("note", "")

        if movement_type == "purchase":

            movement = add_inventory_stock(
                product_id=product_id,
                quantity=form.cleaned_data["quantity"],
                note=note,
            )

        elif movement_type == "adjustment":

            movement = adjust_inventory_stock(
                product_id=product_id,
                actual_stock=form.cleaned_data["actual_stock"],
                note=note,
            )

        obj.pk = movement.pk

    def has_delete_permission(self, request, obj=None):

        return False