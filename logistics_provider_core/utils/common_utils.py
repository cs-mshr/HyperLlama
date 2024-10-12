from datetime import datetime

def convert_date_str_to_datetime(date_str: str) -> datetime:
    return datetime.strptime(date_str, '%Y-%m-%d')

def dto_to_dict(dto):
    if isinstance(dto, list):
        return [dto_to_dict(item) for item in dto]
    elif hasattr(dto, '__dict__'):
        return {key: dto_to_dict(value) for key, value in dto.__dict__.items()}
    else:
        return dto
