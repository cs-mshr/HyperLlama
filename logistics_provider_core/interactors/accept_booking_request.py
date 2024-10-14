from logistics_provider_core.constants import BookingStatus
from logistics_provider_core.models import Driver, LogisticAccountUser
from logistics_provider_core.storages.driver_action_storage import DriverActionStorage
from logistics_provider_core.exceptions import DriverHaveOngoingDelivery, BookingAlreadyPicked


class AcceptBookingRequest:
    def __init__(self, driver_action_storage: DriverActionStorage):
        self.driver_action_storage = driver_action_storage

    def accept_booking_request(self, user_id:int, booking_id:int):
        logistics_user = LogisticAccountUser.objects.get(user_id=user_id)
        driver_id = Driver.objects.get(user=logistics_user).id
        have_on_going_delivery = self.driver_action_storage.has_ongoing_delivery(driver_id=driver_id)
        if have_on_going_delivery:
            raise DriverHaveOngoingDelivery()

        is_booking_already_picked = self.driver_action_storage.is_booking_available_to_pick(booking_id=booking_id)
        if is_booking_already_picked:
            raise BookingAlreadyPicked()

        self.driver_action_storage.assign_booking_to_agent(booking_id=booking_id, user_id=user_id)
        return {"booking_id":booking_id, "user_id":user_id, "booking_status":BookingStatus.ACCEPTED.value}

