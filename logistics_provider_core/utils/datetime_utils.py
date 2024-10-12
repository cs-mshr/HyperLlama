from datetime import datetime

def convert_date_str_to_datetime(date_str: str) -> datetime:
    return datetime.strptime(date_str, '%Y-%m-%d')
