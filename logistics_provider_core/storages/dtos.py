from dataclasses import dataclass
from datetime import datetime
from decimal import Decimal
from typing import Optional, List

from django.db.models.fields import return_None


@dataclass
class BookingData:
    user_id: int
    booking_id: int
    pickup_location: str
    dropoff_location: str
    vehicle_type: str
    scheduled_time: datetime
    status: str
    estimated_price: float

@dataclass
class UserData:
    id: int
    phone_number: str
    name: str
    is_admin: bool
    is_driver: bool



@dataclass
class CreateBookingDTO:
    user_id: int
    vehicle_type: str
    pickup_location: str
    dropoff_location: str
    scheduled_time: datetime
    status: str = 'PENDING'
    driver_id: int = None
    estimated_price: Decimal = None

@dataclass
class PriceEstimationReqDTO:
    pickup_location: str
    dropoff_location: str
    vehicle_type: str

@dataclass
class BookingDTO:
    booking_id: int
    user_id: int
    driver_id: Optional[int]
    vehicle_type: str
    pickup_location: str
    dropoff_location: str
    status: str
    created_at: datetime
    updated_at: datetime
    scheduled_time: datetime
    estimated_price: Decimal
    actual_price: Optional[Decimal]

@dataclass
class UserProfileDTO:
    user_data: UserData
    bookings: List[BookingDTO]

@dataclass
class UpdateUserDetailsReqDTO:
    email: str
    phone_number: str
    password: str


@dataclass
class UpdateDriverProfileReqDTO:
    vehicle_id: str = None
    license_number: str = None
    phone_number: str = None
    current_location: str = None
    email: str = None
