class BookingNotBelongsToUser(Exception):
    def __init__(self, booking_id:int, user_id:int):
        self.booking_id = booking_id
        self.user_id = user_id

class CancellationNotAllowed(Exception):
    def __init__(self, booking_id:int, status:str):
        self.booking_id = booking_id
        self.status = status
