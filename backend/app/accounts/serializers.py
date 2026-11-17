from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.db import transaction

from rest_framework import serializers

from .models import CustomerProfile


class CustomerRegisterSerializer(serializers.ModelSerializer):

    password = serializers.CharField(
        write_only=True,
        min_length=8,
        validators=[validate_password],
        style={"input_type": "password"}
    )

    password_confirm = serializers.CharField(
        write_only=True,
        style={"input_type": "password"}
    )

    phone = serializers.CharField(
        max_length=20
    )

    first_name = serializers.CharField(
        max_length=100
    )

    last_name = serializers.CharField(
        max_length=100
    )

    class Meta:
        model = CustomerProfile
        fields = [
            "first_name",
            "last_name",
            "phone",
            "password",
            "password_confirm",
        ]

    def validate_phone(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "شماره تلفن الزامی است."
            )

        if CustomerProfile.objects.filter(phone=value).exists():
            raise serializers.ValidationError(
                "این شماره تلفن قبلاً ثبت‌نام کرده است."
            )

        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError(
                "این شماره تلفن قبلاً استفاده شده است."
            )

        return value

    def validate(self, attrs):

        if attrs["password"] != attrs["password_confirm"]:
            raise serializers.ValidationError({
                "password_confirm": "تکرار رمز عبور مطابقت ندارد."
            })

        return attrs

    @transaction.atomic
    def create(self, validated_data):

        validated_data.pop("password_confirm")

        password = validated_data.pop("password")

        first_name = validated_data["first_name"]
        last_name = validated_data["last_name"]
        phone = validated_data["phone"]

        user = User.objects.create_user(
            username=phone,
            password=password,
            first_name=first_name,
            last_name=last_name
        )

        profile = CustomerProfile.objects.create(
            user=user,
            first_name=first_name,
            last_name=last_name,
            phone=phone
        )

        return profile