from rest_framework import serializers
from .models import Category, Product


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = [
            'id',
            'name',
            'slug',
            'description',
        ]


class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)

    class Meta:
        model = Product
        fields = [
            'id',
            'slug',
            'category',
            'name',
            'brand',
            'viscosity',
            'api_standard',
            'volume',
            'description',
            'image',
            'price',
            'stock',
            'is_available',
            'created_at',
            'updated_at',
        ]