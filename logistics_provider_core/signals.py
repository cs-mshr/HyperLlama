from allauth.account.signals import user_signed_up

from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from cacheops import invalidate_model, invalidate_obj
from .models import (
    LogisticAccountUser,
    Vehicle,
    Driver,
    Booking,
    Trip,
    Location,
    PriceEstimation,
    DriverPerformance,
    Analytics,
    Feedback,
)


@receiver(user_signed_up)
def create_logistic_account_user(sender, user, request, **kwargs):
    LogisticAccountUser.objects.create(user=user)


@receiver([post_save, post_delete], sender=LogisticAccountUser)
def invalidate_logisticaccountuser_cache(sender, instance, **kwargs):
    invalidate_obj(instance)


@receiver([post_save, post_delete], sender=Vehicle)
def invalidate_vehicle_cache(sender, instance, **kwargs):
    invalidate_obj(instance)


@receiver([post_save, post_delete], sender=Driver)
def invalidate_driver_cache(sender, instance, **kwargs):
    invalidate_obj(instance)


@receiver([post_save, post_delete], sender=Booking)
def invalidate_booking_cache(sender, instance, **kwargs):
    invalidate_obj(instance)


@receiver([post_save, post_delete], sender=Trip)
def invalidate_trip_cache(sender, instance, **kwargs):
    invalidate_obj(instance)


@receiver([post_save, post_delete], sender=Location)
def invalidate_location_cache(sender, instance, **kwargs):
    invalidate_obj(instance)


@receiver([post_save, post_delete], sender=PriceEstimation)
def invalidate_priceestimation_cache(sender, instance, **kwargs):
    invalidate_obj(instance)


@receiver([post_save, post_delete], sender=DriverPerformance)
def invalidate_driverperformance_cache(sender, instance, **kwargs):
    invalidate_obj(instance)


@receiver([post_save, post_delete], sender=Analytics)
def invalidate_analytics_cache(sender, instance, **kwargs):
    invalidate_obj(instance)


@receiver([post_save, post_delete], sender=Feedback)
def invalidate_feedback_cache(sender, instance, **kwargs):
    invalidate_obj(instance)
