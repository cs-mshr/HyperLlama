from logistics_provider_core.storages.user_action_storage import UserActionStorage
from logistics_provider_core.storages.dtos import PriceEstimationReqDTO

class GetPriceEstimate:
    def __init__(self, user_action_storage: UserActionStorage):
        self.user_action_storage = user_action_storage

    def get_price_estimate(self, price_estimate_req_dto:PriceEstimationReqDTO):
        per_kilometer_charge = 100
        distance = 10
        # todo : do distance cal based on pickup and dropoff lat long
        # todo : put more complex logic with differnt eng
        return distance * per_kilometer_charge
