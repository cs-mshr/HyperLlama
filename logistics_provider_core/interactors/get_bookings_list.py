from datetime import datetime
from typing import Dict, List, Union

from logistics_provider_core.storages.dtos import BookingData
from logistics_provider_core.storages.user_action_storage import UserActionStorage


class GetUserBookingList:
    def __init__(self, user_action_storage: UserActionStorage):
        self.user_action_storage = user_action_storage

    def get_bookings_lists(self, user_id:int, filter_request: Dict[str,Union[str, datetime]]):
        from_date = filter_request.get("from_date")
        to_date = filter_request.get("to_date")

        status = filter_request.get("status")
        bookings = self.user_action_storage.get_user_booking(
            from_date=from_date, to_date=to_date, status=status, user_id=user_id
        )
        return self._get_bookings_dicts(bookings=bookings)

    def _get_bookings_dicts(self, bookings:List[BookingData]):
        return [
            booking.__dict__
            for booking in bookings
        ]
