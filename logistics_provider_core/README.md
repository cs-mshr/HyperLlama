# User API Endpoints

## 1. Booking Service

### 1.1 Create a Booking
- **Endpoint:** `POST /api/bookings/`
- **Description:** Allow users to create a new booking
- **Request Body:**
  ```json
  {
    "pickup_location": "123 Main St, City",
    "dropoff_location": "456 Elm St, City",
    "vehicle_type": "VAN",
    "scheduled_time": "2024-10-15T14:30:00Z"
  }
  ```
- **Response:** Returns the created booking details including estimated price

### 1.2 Get Booking Details
- **Endpoint:** `GET /api/bookings/{booking_id}/`
- **Description:** Retrieve details of a specific booking

### 1.3 Cancel Booking
- **Endpoint:** `POST /api/bookings/{booking_id}/cancel/`
- **Description:** Allow users to cancel a booking

### 1.4 List User's Bookings
- **Endpoint:** `GET /api/bookings/`
- **Description:** Retrieve a list of user's bookings
- **Query Parameters:** 
  - `status`: Filter by booking status
  - `from_date`, `to_date`: Filter by date range

## 2. Real-Time Tracking

### 2.1 Get Driver's Current Location
- **Endpoint:** `GET /api/bookings/{booking_id}/location/`
- **Description:** Get the current location of the driver for an active booking

### 2.2 Subscribe to Location Updates
- **Endpoint:** `WebSocket /ws/bookings/{booking_id}/location/`
- **Description:** WebSocket connection to receive real-time location updates

## 3. Price Estimation

### 3.1 Get Price Estimate
- **Endpoint:** `POST /api/price-estimate/`
- **Description:** Get an estimated price for a potential booking
- **Request Body:**
  ```json
  {
    "pickup_location": "123 Main St, City",
    "dropoff_location": "456 Elm St, City",
    "vehicle_type": "VAN"
  }
  ```
- **Response:** Returns the estimated price

## 4. User Account Management

### 4.1 User Registration
- **Endpoint:** `POST /api/users/register/`
- **Description:** Allow new users to register

### 4.2 User Login
- **Endpoint:** `POST /api/users/login/`
- **Description:** Authenticate users and provide access token

### 4.3 Get User Profile
- **Endpoint:** `GET /api/users/profile/`
- **Description:** Retrieve user's profile information

### 4.4 Update User Profile
- **Endpoint:** `PUT /api/users/profile/`
- **Description:** Update user's profile information

## 5. Feedback

### 5.1 Submit Feedback
- **Endpoint:** `POST /api/bookings/{booking_id}/feedback/`
- **Description:** Allow users to submit feedback for a completed booking
- **Request Body:**
  ```json
  {
    "rating": 5,
    "comment": "Great service!"
  }
  ```

## 6. Vehicle Types

### 6.1 List Vehicle Types
- **Endpoint:** `GET /api/vehicle-types/`
- **Description:** Retrieve a list of available vehicle types



# Driver API Endpoints

## 1. Job Assignment

### 1.1 List Available Booking Requests
- **Endpoint:** `GET /api/driver/bookings/available/`
- **Description:** Retrieve a list of available booking requests for the driver to accept
- **Query Parameters:**
  - `limit`: Number of results to return (default: 10)
  - `offset`: Number of results to skip (for pagination)
- **Response:** List of available booking requests with basic details

### 1.2 Get Booking Request Details
- **Endpoint:** `GET /api/driver/bookings/{booking_id}/`
- **Description:** Retrieve full details of a specific booking request
- **Response:** Detailed information about the booking request

### 1.3 Accept Booking Request
- **Endpoint:** `POST /api/driver/bookings/{booking_id}/accept/`
- **Description:** Allow the driver to accept a specific booking request
- **Response:** Confirmation of acceptance and full booking details including pickup and drop-off locations

## 2. Job Status Updates

### 2.1 Update Booking Status
- **Endpoint:** `PUT /api/driver/bookings/{booking_id}/status/`
- **Description:** Allow the driver to update the status of an accepted booking
- **Request Body:**
  ```json
  {
    "status": "EN_ROUTE_TO_PICKUP"
  }
  ```
- **Response:** Confirmation of status update and current booking details

### 2.2 Start Journey
- **Endpoint:** `POST /api/driver/bookings/{booking_id}/start/`
- **Description:** Allow the driver to indicate they've started the journey (after picking up the goods)
- **Response:** Confirmation of journey start and updated booking details

### 2.3 Complete Booking
- **Endpoint:** `POST /api/driver/bookings/{booking_id}/complete/`
- **Description:** Allow the driver to mark the booking as completed (goods delivered)
- **Response:** Confirmation of completion and final booking details

## 3. Driver's Current Job

### 3.1 Get Current Active Booking
- **Endpoint:** `GET /api/driver/bookings/current/`
- **Description:** Retrieve details of the driver's current active booking
- **Response:** Full details of the current active booking, or null if no active booking

## 4. Driver Profile

### 4.1 Get Driver Profile
- **Endpoint:** `GET /api/driver/profile/`
- **Description:** Retrieve the driver's profile information
- **Response:** Driver's profile details

### 4.2 Update Driver Profile
- **Endpoint:** `PUT /api/driver/profile/`
- **Description:** Update the driver's profile information
- **Request Body:** Fields to be updated in the driver's profile
- **Response:** Updated driver profile information
