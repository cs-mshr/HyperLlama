from rest_framework import serializers
from .models import (
    Booking,
    Driver,
    LogisticAccountUser,
    Vehicle,
    Trip,
    DriverPerformance,
    Location,
    PriceEstimation,
    Feedback,
)


class CreateBookingRequestSerializer(serializers.Serializer):
    pickup_location = serializers.CharField(max_length=255)
    dropoff_location = serializers.CharField(max_length=255)
    vehicle_type = serializers.ChoiceField(choices=Vehicle.VEHICLE_TYPES)
    scheduled_time = serializers.DateTimeField()


class PriceEstimateRequestSerializer(serializers.Serializer):
    pickup_location = serializers.CharField(max_length=255)
    dropoff_location = serializers.CharField(max_length=255)
    vehicle_type = serializers.ChoiceField(choices=Vehicle.VEHICLE_TYPES)


class UpdateUserProfileRequestSerializer(serializers.Serializer):
    email = serializers.EmailField(required=False)
    phone_number = serializers.CharField(max_length=15, required=False)
    password = serializers.CharField(max_length=15, required=False)


class SubmitFeedbackRequestSerializer(serializers.Serializer):
    rating = serializers.IntegerField(min_value=1, max_value=5)
    comment = serializers.CharField(max_length=500, allow_blank=True)


class BookingListRequestSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=Booking.STATUS_CHOICES, required=False)
    from_date = serializers.DateTimeField()
    to_date = serializers.DateTimeField()


from rest_framework import serializers


class BookingResponseSerializer(serializers.Serializer):
    booking_id = serializers.IntegerField()
    pickup_location = serializers.CharField(max_length=255)
    dropoff_location = serializers.CharField(max_length=255)
    vehicle_type = serializers.ChoiceField(
        choices=[("BIKE", "Bike"), ("CAR", "Car"), ("VAN", "Van"), ("TRUCK", "Truck")]
    )
    scheduled_time = serializers.DateTimeField()
    status = serializers.ChoiceField(
        choices=[
            ("PENDING", "Pending"),
            ("ACCEPTED", "Accepted"),
            ("EN_ROUTE", "En Route to Pickup"),
            ("PICKED_UP", "Goods Picked Up"),
            ("IN_TRANSIT", "In Transit"),
            ("DELIVERED", "Delivered"),
            ("CANCELLED", "Cancelled"),
        ]
    )
    estimated_price = serializers.DecimalField(max_digits=10, decimal_places=2)


class UserProfileResponseSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()


class VehicleTypeResponseSerializer(serializers.Serializer):
    type = serializers.ChoiceField(
        choices=[("BIKE", "Bike"), ("CAR", "Car"), ("VAN", "Van"), ("TRUCK", "Truck")]
    )


class LocationResponseSerializer(serializers.Serializer):
    latitude = serializers.DecimalField(max_digits=9, decimal_places=6)
    longitude = serializers.DecimalField(max_digits=9, decimal_places=6)
    timestamp = serializers.DateTimeField()

class UpdateBookingStatusRequest(serializers.Serializer):
    status = serializers.ChoiceField(
        choices=[
            ("PENDING", "Pending"),
            ("ACCEPTED", "Accepted"),
            ("EN_ROUTE", "En Route to Pickup"),
            ("PICKED_UP", "Goods Picked Up"),
            ("IN_TRANSIT", "In Transit"),
            ("DELIVERED", "Delivered"),
            ("CANCELLED", "Cancelled"),
        ]
    )


class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = "__all__"


class DriverSerializer(serializers.ModelSerializer):
    class Meta:
        model = Driver
        fields = "__all__"


class VehicleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehicle
        fields = "__all__"


class TripSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trip
        fields = "__all__"


class DriverPerformanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = DriverPerformance
        fields = "__all__"


class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = "__all__"


class PriceEstimationSerializer(serializers.ModelSerializer):
    class Meta:
        model = PriceEstimation
        fields = "__all__"


class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = "__all__"


class LogisticAccountUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = LogisticAccountUser
        fields = "__all__"


class RegisterDriverRequestSerializer(serializers.Serializer):
    vehicle_id = serializers.CharField(max_length=20, required=False)
    license_number = serializers.CharField(max_length=20)
    current_location = serializers.CharField(max_length=255)

class GetDriverDetailsRequestSerializer(serializers.Serializer):
    driver_id = serializers.IntegerField()


class UpdateDriverProfileRequestSerializer(serializers.Serializer):
    vehicle_id = serializers.CharField(max_length=20, required=False)
    license_number = serializers.CharField(max_length=20, required=False)
    phone_number = serializers.CharField(max_length=20, required=False)
    current_location = serializers.CharField(max_length=255, required=False)
    email = serializers.EmailField(required=False)


