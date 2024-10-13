from django.contrib import admin
from .models import LogisticAccountUser, Vehicle, Driver, Booking, Trip, Location, PriceEstimation, DriverPerformance, Analytics, Feedback

admin.site.register(LogisticAccountUser)
admin.site.register(Vehicle)
admin.site.register(Driver)
admin.site.register(Booking)
admin.site.register(Trip)
admin.site.register(Location)
admin.site.register(PriceEstimation)
admin.site.register(DriverPerformance)
admin.site.register(Analytics)
admin.site.register(Feedback)
