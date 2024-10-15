# Logistics Provider Backend

## Requirements

- Python 3.12

## Setup

1. **Install Python 3.12:**
    - **Linux:**
        ```sh
        sudo apt update
        sudo apt install -y python3.12 python3.12-venv python3.12-dev
        ```

2. **Create a virtual environment:**
    ```sh
    virtualenv env --python=python3.12
    ```

3. **Activate the virtual environment:**
    ```sh
    source env/bin/activate
    ```

4. **Install dependencies:**
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