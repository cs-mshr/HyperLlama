from django.dispatch import receiver
from allauth.account.signals import user_signed_up
from .models import LogisticAccountUser

@receiver(user_signed_up)
def create_logistic_account_user(sender, user, request, **kwargs):
    LogisticAccountUser.objects.create(user=user)
