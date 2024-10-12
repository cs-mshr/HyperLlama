from logistics_provider_core.storages.user_action_storage import UserActionStorage
from logistics_provider_core.storages.dtos import CreateBookingDTO


class CreateBooking:
    def __init__(self, user_action_storage: UserActionStorage):
        self.user_action_storage = user_action_storage

    def create_booking(self, booking_req:CreateBookingDTO):
        estimated_price = self._get_estimated_price(
            pickup_location=booking_req.pickup_location,
            dropoff_location=booking_req.dropoff_location,
            vehicle_type=booking_req.vehicle_type
        )
        booking_req.estimated_price = estimated_price

        booking_data = self.user_action_storage.create_booking(create_booking_dto=booking_req)
        return booking_data.__dict__

    def _get_estimated_price(self, pickup_location, dropoff_location, vehicle_type):
        return 100
