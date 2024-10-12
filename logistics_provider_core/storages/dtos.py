from dataclasses import dataclass
from datetime import datetime
from decimal import Decimal



@dataclass
class BookingData:
    id: int
    pickup_location: str
    dropoff_location: str
    vehicle_type: str
    scheduled_time: datetime
    status: str
    estimated_price: float


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
