import time
from datetime import datetime

from celery import shared_task
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from logistics_provider_core.models import Location, Driver


@shared_task
def process_location_update(user_id, latitude, longitude):
    driver_id = Driver.objects.get(user__user__id=user_id).id
    is_location_updated = add_new_location_in_db(
        driver_id=driver_id, latitude=latitude, longitude=longitude
    )
    if not is_location_updated:
        pass

    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f"driver_{driver_id}",
        {
            "type": "location_update",
            "location": {"latitude": latitude, "longitude": longitude},
        },
    )


def add_new_location_in_db(driver_id, latitude, longitude) -> bool:
    driver = Driver.objects.get(id=driver_id)

    last_location = (
        Location.objects.filter(driver=driver).order_by("-timestamp").first()
    )
    if (
        last_location
        and float(last_location.latitude) == float(latitude)
        and float(last_location.longitude) == float(longitude)
    ):
        return False

    new_location = Location(
        driver=driver, latitude=latitude, longitude=longitude, timestamp=datetime.now()
    )

    new_location.save()
    return True
