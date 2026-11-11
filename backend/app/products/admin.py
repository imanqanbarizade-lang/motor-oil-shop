from django.contrib import admin
from .models import Category, Product


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "slug")
    search_fields = ("name",)


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

    list_filter = ("category", "brand", "is_available")

    search_fields = ("name", "brand", "viscosity")

    list_editable = ("price", "stock", "is_available")