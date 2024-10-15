from logistics_provider_core.storages.user_action_storage import UserActionStorage
import math
from logistics_provider_core.storages.dtos import PriceEstimationReqDTO


class GetPriceEstimate:
    def __init__(self, user_action_storage: UserActionStorage):
        self.user_action_storage = user_action_storage

    def haversine_distance(self, lat1, lon1, lat2, lon2):
        R = 6371
        dlat = math.radians(lat2 - lat1)
        dlon = math.radians(lon1 - lon2)
        a = math.sin(dlat / 2) ** 2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(
            dlon / 2) ** 2
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        return R * c

    def get_price_estimate(self, price_estimate_req_dto: PriceEstimationReqDTO):
        base_fare = 50  # Dynamic base fare
        per_kilometer_charge = 100

        pickup_lat = price_estimate_req_dto.pickup_location.latitude
        pickup_lon = price_estimate_req_dto.pickup_location.longitude
        dropoff_lat = price_estimate_req_dto.dropoff_location.latitude
        dropoff_lon = price_estimate_req_dto.dropoff_location.longitude

        distance = self.haversine_distance(pickup_lat, pickup_lon, dropoff_lat, dropoff_lon)
        estimated_price = base_fare + (distance * per_kilometer_charge)

        return estimated_price
