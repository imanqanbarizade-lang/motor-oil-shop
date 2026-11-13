from django.db import transaction
from django.core.exceptions import ValidationError

from .models import Product, Sale, InventoryMovement


# ==========================================
# ثبت یک حرکت در تاریخچه موجودی
# ==========================================

def create_inventory_movement(
    product,
    movement_type,
    quantity,
    stock_before,
    stock_after,
    note=""
):

    return InventoryMovement.objects.create(
        product=product,
        movement_type=movement_type,
        quantity=quantity,
        stock_before=stock_before,
        stock_after=stock_after,
        note=note,
    )


# ==========================================
# مدیریت ثبت و ویرایش فروش
# ==========================================

@transaction.atomic
def save_sale_with_stock(sale):

    old_sale = None

    if sale.pk:

        old_sale = Sale.objects.filter(
            pk=sale.pk
        ).first()

    product_ids = {sale.product_id}

    if old_sale:
        product_ids.add(old_sale.product_id)

    products = Product.objects.select_for_update().filter(
        id__in=sorted(product_ids)
    )

    products_map = {
        product.id: product
        for product in products
    }

    # اگر اطلاعات مؤثر فروش تغییر نکرده باشد،
    # فقط خود فروش ذخیره می‌شود.
    if old_sale:

        same_stock_effect = (
            old_sale.product_id == sale.product_id
            and old_sale.quantity == sale.quantity
            and old_sale.is_test == sale.is_test
        )

        if same_stock_effect:
            sale.save()
            return sale

    # بازگرداندن موجودی فروش قبلی
    if old_sale and not old_sale.is_test:

        old_product = products_map[old_sale.product_id]

        stock_before = old_product.stock
        stock_after = stock_before + old_sale.quantity

        old_product.stock = stock_after

        old_product.save(
            update_fields=["stock", "updated_at"]
        )

        create_inventory_movement(
            product=old_product,
            movement_type="sale_return",
            quantity=old_sale.quantity,
            stock_before=stock_before,
            stock_after=stock_after,
            note=f"برگشت اثر فروش قبلی؛ فاکتور {old_sale.invoice_number}"
        )

    # بررسی و اعمال فروش جدید
    if not sale.is_test:

        product = products_map[sale.product_id]

        stock_before = product.stock

        if sale.quantity > stock_before:

            raise ValidationError(
                f"موجودی محصول «{product.name}» کافی نیست. "
                f"موجودی قابل استفاده: {stock_before}"
            )

        stock_after = stock_before - sale.quantity

        product.stock = stock_after

        product.save(
            update_fields=["stock", "updated_at"]
        )

    else:
        product = products_map[sale.product_id]
        stock_before = product.stock
        stock_after = stock_before

    # ثبت فروش
    sale.save()

    # ثبت فروش واقعی در تاریخچه
    if not sale.is_test:

        create_inventory_movement(
            product=product,
            movement_type="sale",
            quantity=-sale.quantity,
            stock_before=stock_before,
            stock_after=stock_after,
            note=f"ثبت فروش واقعی؛ فاکتور {sale.invoice_number}"
        )

    return sale


# ==========================================
# حذف فروش و بازگرداندن موجودی
# ==========================================

@transaction.atomic
def delete_sale_with_stock(sale):

    sale = Sale.objects.select_related(
        "product"
    ).get(pk=sale.pk)

    if not sale.is_test:

        product = Product.objects.select_for_update().get(
            pk=sale.product_id
        )

        stock_before = product.stock
        stock_after = stock_before + sale.quantity

        product.stock = stock_after

        product.save(
            update_fields=["stock", "updated_at"]
        )

        create_inventory_movement(
            product=product,
            movement_type="sale_return",
            quantity=sale.quantity,
            stock_before=stock_before,
            stock_after=stock_after,
            note=f"حذف فروش و بازگشت موجودی؛ فاکتور {sale.invoice_number}"
        )

    sale.delete()


# ==========================================
# ثبت تأمین کالا و افزایش موجودی
# ==========================================

@transaction.atomic
def add_inventory_stock(product_id, quantity, note=""):

    if quantity <= 0:

        raise ValidationError(
            "تعداد کالای ورودی باید بیشتر از صفر باشد."
        )

    product = Product.objects.select_for_update().get(
        pk=product_id
    )

    stock_before = product.stock
    stock_after = stock_before + quantity

    product.stock = stock_after

    product.save(
        update_fields=["stock", "updated_at"]
    )

    movement = create_inventory_movement(
        product=product,
        movement_type="purchase",
        quantity=quantity,
        stock_before=stock_before,
        stock_after=stock_after,
        note=note
    )

    return movement


# ==========================================
# اصلاح موجودی براساس شمارش واقعی انبار
# ==========================================

@transaction.atomic
def adjust_inventory_stock(product_id, actual_stock, note=""):

    if actual_stock < 0:

        raise ValidationError(
            "موجودی واقعی نمی‌تواند منفی باشد."
        )

    product = Product.objects.select_for_update().get(
        pk=product_id
    )

    stock_before = product.stock

    difference = actual_stock - stock_before

    if difference == 0:

        raise ValidationError(
            "موجودی ثبت‌شده با موجودی واقعی برابر است. "
            "نیازی به اصلاح وجود ندارد."
        )

    product.stock = actual_stock

    product.save(
        update_fields=["stock", "updated_at"]
    )

    movement = create_inventory_movement(
        product=product,
        movement_type="adjustment",
        quantity=difference,
        stock_before=stock_before,
        stock_after=actual_stock,
        note=note
    )

    return movement