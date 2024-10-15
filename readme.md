# Logistics Provider Backend

## Requirements

- Python 3.12

## Setup

1. **Create a virtual environment:**
    ```sh
    virtualenv env
    ```

2. **Activate the virtual environment:**
    ```sh
    source env/bin/activate
    ```

3. **Install dependencies:**
    ```sh
    pip install -r requirements.txt
    ```

## Database Migrations

- Apply database migrations:
    ```sh
    python manage.py migrate
    ```

## Running the Server

- Start the Daphne server:
    ```sh
    daphne -p 8000 logistics_provider_backend.asgi:application
    ```

- Start the Celery worker:
    ```sh
    celery -A logistics_provider_backend worker --loglevel=info
    ```
