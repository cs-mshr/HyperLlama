from logistics_provider_core.storages.user_action_storage import UserActionStorage
from logistics_provider_core.storages.dtos import (
    CreateBookingDTO,
    PriceEstimationReqDTO,
)


class CreateBooking:
    def __init__(self, user_action_storage: UserActionStorage):
        self.user_action_storage = user_action_storage

    def create_booking(self, booking_req: CreateBookingDTO):
        estimated_price = self._get_estimated_price(
            pickup_location=booking_req.pickup_location,
            dropoff_location=booking_req.dropoff_location,
            vehicle_type=booking_req.vehicle_type,
        )
        booking_req.estimated_price = estimated_price

        booking_data = self.user_action_storage.create_booking(
            create_booking_dto=booking_req
        )
        return booking_data.__dict__

    def _get_estimated_price(self, pickup_location, dropoff_location, vehicle_type):
        from logistics_provider_core.interactors.get_price_estimate import (
            GetPriceEstimate,
        )

        interactor = GetPriceEstimate(user_action_storage=self.user_action_storage)
        req_dto = PriceEstimationReqDTO(
            pickup_location=pickup_location,
            dropoff_location=dropoff_location,
            vehicle_type=vehicle_type,
        )
        return interactor.get_price_estimate(price_estimate_req_dto=req_dto)
