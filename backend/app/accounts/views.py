from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.db import transaction

from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status, serializers

from .models import CustomerProfile
from .serializers import CustomerRegisterSerializer


# اعتبارسنجی اطلاعات ورود مشتری
class CustomerLoginSerializer(serializers.Serializer):

    phone = serializers.CharField(max_length=20)
    password = serializers.CharField(
        write_only=True,
        style={"input_type": "password"}
    )


# اعتبارسنجی و ویرایش اطلاعات شخصی مشتری
class CustomerProfileUpdateSerializer(serializers.ModelSerializer):

    class Meta:
        model = CustomerProfile
        fields = [
            "first_name",
            "last_name",
            "phone",
        ]

    def validate_phone(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "شماره تلفن الزامی است."
            )

        if CustomerProfile.objects.filter(
            phone=value
        ).exclude(
            pk=self.instance.pk
        ).exists():
            raise serializers.ValidationError(
                "این شماره تلفن قبلاً ثبت‌نام کرده است."
            )

        if User.objects.filter(
            username=value
        ).exclude(
            pk=self.instance.user_id
        ).exists():
            raise serializers.ValidationError(
                "این شماره تلفن قبلاً استفاده شده است."
            )

        return value

    @transaction.atomic
    def update(self, instance, validated_data):

        user = instance.user

        instance.first_name = validated_data.get(
            "first_name",
            instance.first_name
        )

        instance.last_name = validated_data.get(
            "last_name",
            instance.last_name
        )

        instance.phone = validated_data.get(
            "phone",
            instance.phone
        )

        instance.save()

        user.first_name = instance.first_name
        user.last_name = instance.last_name
        user.username = instance.phone

        user.save(
            update_fields=[
                "first_name",
                "last_name",
                "username",
            ]
        )

        return instance


# ثبت‌نام مشتری
class CustomerRegisterView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):

        serializer = CustomerRegisterSerializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        profile = serializer.save()

        login(request, profile.user)

        return Response(
            {
                "message": "ثبت‌نام با موفقیت انجام شد.",
                "customer": {
                    "id": profile.user.id,
                    "first_name": profile.first_name,
                    "last_name": profile.last_name,
                    "phone": profile.phone
                }
            },
            status=status.HTTP_201_CREATED
        )


# ورود مشتری
class CustomerLoginView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):

        serializer = CustomerLoginSerializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        phone = serializer.validated_data["phone"].strip()
        password = serializer.validated_data["password"]

        user = authenticate(
            request,
            username=phone,
            password=password
        )

        if user is None or not user.is_active or user.is_staff:
            return Response(
                {"error": "شماره تلفن یا رمز عبور اشتباه است."},
                status=status.HTTP_401_UNAUTHORIZED
            )

        if not hasattr(user, "customer_profile"):
            return Response(
                {"error": "حساب مشتری معتبر نیست."},
                status=status.HTTP_403_FORBIDDEN
            )

        login(request, user)

        return Response(
            {
                "message": "ورود با موفقیت انجام شد.",
                "customer": {
                    "id": user.id,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "phone": user.customer_profile.phone
                }
            },
            status=status.HTTP_200_OK
        )


# خروج مشتری
class CustomerLogoutView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        if request.user.is_staff or not hasattr(
            request.user,
            "customer_profile"
        ):
            return Response(
                {"error": "این مسیر مخصوص مشتریان است."},
                status=status.HTTP_403_FORBIDDEN
            )

        logout(request)

        return Response(
            {"message": "با موفقیت از حساب خارج شدید."},
            status=status.HTTP_200_OK
        )


# اطلاعات و ویرایش حساب مشتری واردشده
class CustomerMeView(APIView):

    permission_classes = [IsAuthenticated]

    def get_customer_profile(self, request):

        user = request.user

        if user.is_staff or not hasattr(
            user,
            "customer_profile"
        ):
            return None

        return user.customer_profile

    def get(self, request):

        profile = self.get_customer_profile(request)

        if profile is None:
            return Response(
                {"error": "حساب مشتری معتبر نیست."},
                status=status.HTTP_403_FORBIDDEN
            )

        return Response(
            {
                "id": profile.user.id,
                "first_name": profile.first_name,
                "last_name": profile.last_name,
                "phone": profile.phone
            },
            status=status.HTTP_200_OK
        )

    def put(self, request):

        profile = self.get_customer_profile(request)

        if profile is None:
            return Response(
                {"error": "حساب مشتری معتبر نیست."},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = CustomerProfileUpdateSerializer(
            profile,
            data=request.data
        )

        serializer.is_valid(raise_exception=True)
        updated_profile = serializer.save()

        return Response(
            {
                "message": "اطلاعات حساب با موفقیت ویرایش شد.",
                "customer": {
                    "id": updated_profile.user.id,
                    "first_name": updated_profile.first_name,
                    "last_name": updated_profile.last_name,
                    "phone": updated_profile.phone
                }
            },
            status=status.HTTP_200_OK
        )