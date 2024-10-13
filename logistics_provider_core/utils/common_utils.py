from datetime import datetime

from django.utils import timezone


def convert_date_str_to_datetime(date_str: str) -> datetime:
    return datetime.strptime(date_str, '%Y-%m-%d')

def dto_to_dict(dto):
    if isinstance(dto, list):
        return [dto_to_dict(item) for item in dto]
    elif hasattr(dto, '__dict__'):
        return {key: dto_to_dict(value) for key, value in dto.__dict__.items()}
    else:
        return dto

def model_to_dict(instance, fields=None):
    data = {}
    for field in (fields or instance._meta.fields):
        value = getattr(instance, field.name)
        if isinstance(value, timezone.datetime):
            value = value.isoformat()
        data[field.name] = value
    return data
