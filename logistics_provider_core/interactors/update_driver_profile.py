# python
from django.forms import model_to_dict

from logistics_provider_core.storages.driver_action_storage import DriverActionStorage
from logistics_provider_core.storages.dtos import UpdateDriverProfileReqDTO
from logistics_provider_core.models import Driver, LogisticAccountUser, User


class UpdateDriverProfile:
    def __init__(self, driver_action_storage: DriverActionStorage):
        self.driver_action_storage = driver_action_storage

    def update_driver_profile(self, user_id: int, update_driver_profile_req: UpdateDriverProfileReqDTO):
        logistics_user = LogisticAccountUser.objects.get(user_id=user_id)
        driver = Driver.objects.get(user=logistics_user)
        user = User.objects.get(id=user_id)

        if update_driver_profile_req.vehicle_id is not None:
            driver.vehicle_id = update_driver_profile_req.vehicle_id
        if update_driver_profile_req.license_number is not None:
            driver.license_number = update_driver_profile_req.license_number
        if update_driver_profile_req.current_location is not None:
            driver.current_location = update_driver_profile_req.current_location

        if update_driver_profile_req.phone_number is not None:
            logistics_user.phone_number = update_driver_profile_req.phone_number

        if update_driver_profile_req.email is not None:
            user.email = update_driver_profile_req.email

        driver.save()
        logistics_user.save()
        user.save()

        return {
            "driver_details": model_to_dict(driver),
            "account_details":model_to_dict(logistics_user)
        }
