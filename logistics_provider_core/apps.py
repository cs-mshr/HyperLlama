from django.apps import AppConfig


class LogisticsProviderCoreConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'logistics_provider_core'

    def ready(self):
        import logistics_provider_core.signals

