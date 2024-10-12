from logistics_provider_core.constants import CANCELLATION_ALLOWED_STATUS
from logistics_provider_core.storages.user_action_storage import UserActionStorage
from logistics_provider_core.exceptions import BookingNotBelongsToUser, CancellationNotAllowed
from logistics_provider_core.constants import BookingStatus


class CancelBooking:
    def __init__(self, user_action_storage: UserActionStorage):
        self.user_action_storage = user_action_storage

    def cancel_booking(self, booking_id, user_id):
        self._validate_booking(booking_id=booking_id, user_id=user_id)
        self.user_action_storage.update_booking_status(booking_id=booking_id, status=BookingStatus.CANCELLED.value)
        return

    def _validate_booking(self, booking_id, user_id):
        booking_data = self.user_action_storage.get_booking_by_id(booking_id)
        if booking_data.user_id != user_id:
            raise BookingNotBelongsToUser(booking_id=booking_id, user_id=user_id)

        if booking_data.status not in CANCELLATION_ALLOWED_STATUS:
            raise CancellationNotAllowed(booking_id=booking_id, status=booking_data.status)
