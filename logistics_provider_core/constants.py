from enum import Enum


class BookingStatus(Enum):
    PENDING = "PENDING"
    ACCEPTED = "ACCEPTED"
    EN_ROUTE = "EN_ROUTE"
    PICKED_UP = "PICKED_UP"
    IN_TRANSIT = "IN_TRANSIT"
    DELIVERED = "DELIVERED"
    CANCELLED = "CANCELLED"


CANCELLATION_ALLOWED_STATUS = [
    BookingStatus.PENDING.value,
    BookingStatus.ACCEPTED.value,
]
DRIVER_ACTIVE_BOOKING_STATUS = [
    BookingStatus.ACCEPTED.value,
    BookingStatus.EN_ROUTE.value,
    BookingStatus.PICKED_UP.value,
]
