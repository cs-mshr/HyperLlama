from logistics_provider_core.constants import BookingStatus
from logistics_provider_core.models import Booking, Driver, LogisticAccountUser, Feedback


class DriverActionStorage:
    def has_ongoing_delivery(self, driver_id: int) -> bool:
        ongoing_statuses = [BookingStatus.ACCEPTED.value, BookingStatus.EN_ROUTE.value, BookingStatus.PICKED_UP.value]
        return Booking.objects.filter(driver_id=driver_id, status__in=ongoing_statuses).exists()

    def is_booking_available_to_pick(self, booking_id: int) -> bool:
        return not Booking.objects.filter(id=booking_id, status=BookingStatus.PENDING.value).exists()

    def assign_booking_to_agent(self, booking_id: int, user_id: int):
        booking = Booking.objects.get(id=booking_id)
        logistics_user_obj = LogisticAccountUser.objects.get(user_id=user_id)
        driver = Driver.objects.get(user=logistics_user_obj)
        booking.status = BookingStatus.ACCEPTED.value
        booking.driver = driver
        booking.save()

    def get_driver_details(self, driver_id: int) -> Driver:
        return Driver.objects.get(id=driver_id)

    def get_driver_bookings(self, driver_id: int) -> list:
        return Booking.objects.filter(driver_id=driver_id).all()

    def get_booking_feedbacks(self, booking_ids: list) -> list:
        return Feedback.objects.filter(booking_id__in=booking_ids).all()
