from logistics_provider_core.storages.user_action_storage import UserActionStorage
from logistics_provider_core.utils.common_utils import dto_to_dict


class GetUserProfile:
    def __init__(self, user_action_storage: UserActionStorage):
        self.user_action_storage = user_action_storage

    def get_user_profile(self, user_id:int):
        user_profile_dto = self.user_action_storage.get_logistics_user_data_by_id(user_id=user_id)
        return dto_to_dict(user_profile_dto)
