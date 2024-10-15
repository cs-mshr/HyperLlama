# python
import json
from dataclasses import dataclass
from datetime import datetime
from typing import List, Optional

from django.contrib.auth.models import User

from logistics_provider_core.models import Booking, LogisticAccountUser, Driver
from logistics_provider_core.storages.dtos import BookingData, BookingDTO, UserProfileDTO, UserData
from logistics_provider_core.storages.dtos import CreateBookingDTO
from logistics_provider_core.utils.common_utils import dto_to_dict


class UserActionStorage:
    def get_user_booking(
        self, user_id:int, from_date: datetime, to_date: datetime, status: Optional[str]
    ) -> List[BookingData]:
        queryset = Booking.objects.filter(
            scheduled_time__gte=from_date, scheduled_time__lte=to_date, user__user__id=user_id
        )
        if status is not None:
            queryset = queryset.filter(status=status)

        bookings = [self._get_booking_data_dto(booking=booking) for booking in queryset]
        return bookings

    def _get_booking_data_dto(self, booking):
        return BookingData(
            user_id=booking.user.id,
            booking_id=booking.id,
            pickup_location=booking.pickup_location,
            dropoff_location=booking.dropoff_location,
            vehicle_type=booking.vehicle_type,
            scheduled_time=booking.scheduled_time,
            status=booking.status,
            estimated_price=booking.estimated_price,
        )

    def create_booking(self, create_booking_dto: CreateBookingDTO) -> BookingData:
        user = LogisticAccountUser.objects.get(user__id=create_booking_dto.user_id)
        pickup_dict_str = json.dumps({
            "latitude":create_booking_dto.pickup_location.latitude,
            "longitude":create_booking_dto.pickup_location.longitude
        })
        dropoff_dict_str = json.dumps({
            "latitude":create_booking_dto.pickup_location.latitude,
            "longitude":create_booking_dto.pickup_location.longitude
        })
        booking = Booking.objects.create(
            user=user,
            vehicle_type=create_booking_dto.vehicle_type,
            pickup_location=pickup_dict_str,
            dropoff_location=dropoff_dict_str,
            scheduled_time=create_booking_dto.scheduled_time,
            estimated_price=create_booking_dto.estimated_price,
            status=create_booking_dto.status,
        )
        return self._get_booking_data_dto(booking=booking)

    def get_booking_by_id(self, booking_id):
        booking = Booking.objects.get(id=booking_id)
        return self._get_booking_data_dto(booking=booking)

    def update_booking_status(self, booking_id, status):
        booking = Booking.objects.get(id=booking_id)
        booking.status = status
        booking.save()

    def get_logistics_user_data_by_id(self, user_id):
        user = LogisticAccountUser.objects.get(user__id=user_id)
        user_dto = self._get_user_dto(user=user)
        bookings = Booking.objects.filter(user=user)
        booking_dtos = [self._get_booking_dto(booking=booking) for booking in bookings]

        return UserProfileDTO(
            user_data=user_dto,
            bookings=booking_dtos
        )


    def _get_booking_dto(self, booking:Booking):
        driver_id = None
        if booking.driver:
            driver_id = booking.driver.user.id
        return BookingDTO(
            booking_id=booking.id,
            user_id=booking.user.id,
            driver_id=driver_id,
            vehicle_type=booking.vehicle_type,
            pickup_location=booking.pickup_location,
            dropoff_location=booking.dropoff_location,
            status=booking.status,
            created_at=booking.created_at,
            updated_at=booking.updated_at,
            scheduled_time=booking.scheduled_time,
            estimated_price=booking.estimated_price,
            actual_price=booking.actual_price
        )

    def _get_user_dto(self, user):
        is_driver = Driver.objects.filter(user=user).exists()
        return UserData(
            id = user.id,
            phone_number=user.phone_number,
            name=user.user.username,
            is_admin=user.is_admin,
            is_driver=is_driver
        )

    def get_is_email_already_taken(self, email, user_id:int):
        return User.objects.filter(email=email).exclude(id=user_id).exists()

    def is_phone_already_in_use(self, user_id, phone_number):
        return LogisticAccountUser.objects.filter(phone_number=phone_number).exclude(user_id=user_id).exists()

    def update_user_email(self, user_id, email):
        user = User.objects.get(id=user_id)
        user.email = email
        user.save()

    def update_phone_number(self, user_id, phone_number):
        logistic_account_user = LogisticAccountUser.objects.get(user__id=user_id)
        logistic_account_user.phone_number = phone_number
        logistic_account_user.save()

    def update_user_password(self, password:str, user_id:int):
        user = User.objects.get(id=user_id)
        user.set_password(password)
        user.save()


