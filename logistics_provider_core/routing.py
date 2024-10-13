from django.urls import re_path
from logistics_provider_core.consumers import DriverLocationConsumer

websocket_urlpatterns = [
    re_path(r'ws/get_driver/location/(?P<driver_id>\d+)/$', DriverLocationConsumer.as_asgi()),
]
