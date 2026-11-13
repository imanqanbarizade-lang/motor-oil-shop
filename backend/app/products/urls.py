from django.urls import path

from .views import (
    CategoryListView,
    ProductListView,
    AdminProductListView,
    ProductCreateView,
    ProductUpdateView,
    ProductDetailView,
    InventoryReportView,
    BestSellingViscosityView,
)


urlpatterns = [
    path('categories/', CategoryListView.as_view(), name='category-list'),

    path('products/', ProductListView.as_view(), name='product-list'),

    path(
        'products/admin/all/',
        AdminProductListView.as_view(),
        name='admin-product-list'
    ),

    path('products/create/', ProductCreateView.as_view(), name='product-create'),

    path(
        'products/<int:product_id>/update/',
        ProductUpdateView.as_view(),
        name='product-update'
    ),

    path('products/<slug:slug>/', ProductDetailView.as_view(), name='product-detail'),

    path('inventory/report/', InventoryReportView.as_view(), name='inventory-report'),

    path('analytics/best-viscosity/', BestSellingViscosityView.as_view(), name='best-selling-viscosity'),
]