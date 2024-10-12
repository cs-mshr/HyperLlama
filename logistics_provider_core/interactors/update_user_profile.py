from allauth.account.views import email

from logistics_provider_core.storages.user_action_storage import UserActionStorage
from logistics_provider_core.storages.dtos import UpdateUserDetailsReqDTO
from logistics_provider_core.utils.common_utils import dto_to_dict
from logistics_provider_core.exceptions import EmailAlreadyTaken
from logistics_provider_core.exceptions import PhoneNumberAlreadyTaken


# python
class UpdateUserProfile:
    def __init__(self, user_action_storage: UserActionStorage):
        self.user_action_storage = user_action_storage

    def update_user_profile(
        self, user_id: int, update_user_req: UpdateUserDetailsReqDTO
    ):
        is_email_updated = False
        is_phone_number_updated = False
        is_password_updated = False

        if update_user_req.email:
            is_email_taken = self.user_action_storage.get_is_email_already_taken(
                email=update_user_req.email, user_id=user_id
            )
            if is_email_taken:
                raise EmailAlreadyTaken(email=update_user_req.email)
            else:
                self.user_action_storage.update_user_email(
                    user_id=user_id, email=update_user_req.email
                )

        if update_user_req.phone_number:
            is_phone_number_taken = self.user_action_storage.is_phone_already_in_use(
                user_id=user_id, phone_number=update_user_req.phone_number
            )
            if is_phone_number_taken:
                raise PhoneNumberAlreadyTaken(phone_number=update_user_req.phone_number)
            else:
                self.user_action_storage.update_phone_number(
                    user_id=user_id, phone_number=update_user_req.phone_number
                )

        if update_user_req.password:
            self.user_action_storage.update_user_password(
                password=update_user_req.password, user_id=user_id
            )

        return {
            "is_email_updated": is_email_updated,
            "is_phone_number_updated": is_phone_number_updated,
            "is_password_updated": is_password_updated,
        }
