from logistics_provider_core.storages.driver_action_storage import DriverActionStorage
from django.forms.models import model_to_dict



class GetDriverDetails:
    def __init__(self, driver_action_storage: DriverActionStorage):
        self.driver_action_storage = driver_action_storage

    def get_driver_profile_details(self, driver_id: int):
        driver = self.driver_action_storage.get_driver_details(driver_id)
        bookings = self.driver_action_storage.get_driver_bookings(driver_id)
        booking_ids = [booking.id for booking in bookings]
        feedbacks = self.driver_action_storage.get_booking_feedbacks(booking_ids)

        return {
            "driver": model_to_dict(driver),
            "bookings": [model_to_dict(booking) for booking in bookings],
            "feedbacks": [model_to_dict(feedback) for feedback in feedbacks]
        }
