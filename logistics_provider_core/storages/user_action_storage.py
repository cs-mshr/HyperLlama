# python
from dataclasses import dataclass
from datetime import datetime
from typing import List, Optional

from logistics_provider_core.models import Booking, LogisticAccountUser, Driver
from logistics_provider_core.storages.dtos import BookingData
from logistics_provider_core.storages.dtos import CreateBookingDTO


class UserActionStorage:
    def get_user_booking(
        self, from_date: datetime, to_date: datetime, status: Optional[str]
    ) -> List[BookingData]:
        queryset = Booking.objects.filter(
            scheduled_time__gte=from_date, scheduled_time__lte=to_date
        )
        if status is not None:
            queryset = queryset.filter(status=status)

        bookings = [self._get_booking_data_dto(booking=booking) for booking in queryset]
        return bookings

    def _get_booking_data_dto(self, booking):
        return BookingData(
            id=booking.id,
            pickup_location=booking.pickup_location,
            dropoff_location=booking.dropoff_location,
            vehicle_type=booking.vehicle_type,
            scheduled_time=booking.scheduled_time,
            status=booking.status,
            estimated_price=booking.estimated_price,
        )

    def create_booking(self, create_booking_dto: CreateBookingDTO) -> BookingData:
        user = LogisticAccountUser.objects.get(user__id=create_booking_dto.user_id)

        booking = Booking.objects.create(
            user=user,
            vehicle_type=create_booking_dto.vehicle_type,
            pickup_location=create_booking_dto.pickup_location,
            dropoff_location=create_booking_dto.dropoff_location,
            scheduled_time=create_booking_dto.scheduled_time,
            estimated_price=create_booking_dto.estimated_price,
            status=create_booking_dto.status,
        )
        return self._get_booking_data_dto(booking=booking)
