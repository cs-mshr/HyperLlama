from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator

class LogisticAccountUser(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='logistic_account')
    phone_number = models.CharField(max_length=15)
    username = models.CharField(max_length=15)
    is_driver = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)

class Vehicle(models.Model):
    VEHICLE_TYPES = [
        ('BIKE', 'Bike'),
        ('CAR', 'Car'),
        ('VAN', 'Van'),
        ('TRUCK', 'Truck'),
    ]
    type = models.CharField(max_length=5, choices=VEHICLE_TYPES)
    license_plate = models.CharField(max_length=20, unique=True)
    capacity = models.FloatField(help_text="Capacity in kg")
    is_available = models.BooleanField(default=True)

class Driver(models.Model):
    user = models.OneToOneField(LogisticAccountUser, on_delete=models.CASCADE)
    vehicle = models.ForeignKey(Vehicle, on_delete=models.SET_NULL, null=True)
    license_number = models.CharField(max_length=20, unique=True)
    current_location = models.CharField(max_length=255, null=True, blank=True)

class Booking(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('ACCEPTED', 'Accepted'),
        ('EN_ROUTE', 'En Route to Pickup'),
        ('PICKED_UP', 'Goods Picked Up'),
        ('IN_TRANSIT', 'In Transit'),
        ('DELIVERED', 'Delivered'),
        ('CANCELLED', 'Cancelled'),
    ]
    user = models.ForeignKey(LogisticAccountUser, on_delete=models.CASCADE, related_name='bookings')
    driver = models.ForeignKey(Driver, on_delete=models.SET_NULL, null=True, related_name='assignments', blank=True)
    vehicle_type = models.CharField(max_length=5, choices=Vehicle.VEHICLE_TYPES)
    pickup_location = models.CharField(max_length=255)
    dropoff_location = models.CharField(max_length=255)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    scheduled_time = models.DateTimeField(auto_now=True)
    estimated_price = models.DecimalField(max_digits=10, decimal_places=2)
    actual_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

class Trip(models.Model):
    booking = models.OneToOneField(Booking, on_delete=models.CASCADE, related_name='trip')
    start_time = models.DateTimeField(null=True, blank=True)
    end_time = models.DateTimeField(null=True, blank=True)
    distance = models.FloatField(null=True, blank=True, help_text="Distance in km")

class Location(models.Model):
    driver = models.ForeignKey(Driver, on_delete=models.CASCADE, related_name='locations')
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    timestamp = models.DateTimeField(auto_now_add=True)

class PriceEstimation(models.Model):
    vehicle_type = models.CharField(max_length=5, choices=Vehicle.VEHICLE_TYPES)
    base_price = models.DecimalField(max_digits=6, decimal_places=2)
    price_per_km = models.DecimalField(max_digits=4, decimal_places=2)
    demand_multiplier = models.FloatField(default=1.0, validators=[MinValueValidator(1.0)])

class DriverPerformance(models.Model):
    driver = models.OneToOneField(Driver, on_delete=models.CASCADE, related_name='performance')
    total_trips = models.PositiveIntegerField(default=0)
    total_distance = models.FloatField(default=0, help_text="Total distance in km")
    average_rating = models.FloatField(default=0, validators=[MinValueValidator(0), MinValueValidator(5)])

class Analytics(models.Model):
    date = models.DateField(unique=True)
    total_trips = models.PositiveIntegerField(default=0)
    total_revenue = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    average_trip_time = models.DurationField(null=True, blank=True)

class Feedback(models.Model):
    booking = models.OneToOneField(Booking, on_delete=models.CASCADE, related_name='feedback')
    rating = models.PositiveIntegerField(validators=[MinValueValidator(1), MinValueValidator(5)])
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
