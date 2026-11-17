from django.db import models
from django.contrib.auth.models import User


class CustomerProfile(models.Model):

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="customer_profile",
        verbose_name="حساب کاربری"
    )

    phone = models.CharField(
        max_length=20,
        unique=True,
        verbose_name="شماره تلفن"
    )

    first_name = models.CharField(
        max_length=100,
        verbose_name="نام"
    )

    last_name = models.CharField(
        max_length=100,
        verbose_name="نام خانوادگی"
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="تاریخ ثبت‌نام"
    )

    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name="آخرین بروزرسانی"
    )

    def __str__(self):
        return f"{self.first_name} {self.last_name} - {self.phone}"

    class Meta:
        verbose_name = "پروفایل مشتری"
        verbose_name_plural = "پروفایل مشتریان"
        ordering = ["-created_at"]