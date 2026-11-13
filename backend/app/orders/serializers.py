from django.db import transaction
from rest_framework import serializers

from products.models import Product
from .models import Order, OrderItem


class OrderItemSerializer(serializers.Serializer):

    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.filter(is_available=True),
        source="product"
    )

    quantity = serializers.IntegerField(min_value=1)


class OrderSerializer(serializers.ModelSerializer):

    items = OrderItemSerializer(
        many=True,
        write_only=True
    )

    order_items = serializers.SerializerMethodField(
        read_only=True
    )

    class Meta:
        model = Order

        fields = [
            "id",
            "full_name",
            "phone",
            "province",
            "city",
            "address",
            "postal_code",
            "description",
            "items",
            "order_items",
            "total_amount",
            "status",
            "created_at",
        ]

        read_only_fields = [
            "id",
            "order_items",
            "total_amount",
            "status",
            "created_at",
        ]

    def validate_items(self, items):

        if not items:
            raise serializers.ValidationError(
                "سبد خرید خالی است."
            )

        for item in items:

            product = item["product"]
            quantity = item["quantity"]

            if quantity > product.stock:
                raise serializers.ValidationError(
                    f"موجودی محصول {product.name} کافی نیست."
                )

            if product.price <= 0:
                raise serializers.ValidationError(
                    f"قیمت محصول {product.name} هنوز تعیین نشده است."
                )

        return items

    def get_order_items(self, obj):

        return [
            {
                "product_id": item.product.id,
                "product_name": item.product.name,
                "quantity": item.quantity,
                "unit_price": item.unit_price,
                "total_price": item.total_price,
            }
            for item in obj.items.select_related("product").all()
        ]

    @transaction.atomic
    def create(self, validated_data):

        items_data = validated_data.pop("items")

        total_amount = sum(
            item["product"].price * item["quantity"]
            for item in items_data
        )

        order = Order.objects.create(
            total_amount=total_amount,
            **validated_data
        )

        for item in items_data:

            product = item["product"]

            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=item["quantity"],
                unit_price=product.price
            )

        return order