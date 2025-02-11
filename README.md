# Project Name

## Setup and Running Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/aolaniran21/greatbrands.git
cd greatbrands
```

### 2. Install Dependencies

Ensure you have Node.js and Docker installed, then run:

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory with the following variables:

```plaintext
PORT=3000
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
DB_TEST_NAME=your_test_db
DB_HOST=your_db_host
JWT_SECRET=your_jwt_secret
REDIS_HOST=your_redis_host
REDIS_PORT=6379
```

### 4. Start the Database with Docker

If using PostgreSQL and Redis locally via Docker, execute:

```bash
docker-compose up -d
```

This will start PostgreSQL for database storage and Redis for distributed locking and caching.

### 5. Run Migrations and Seed Data

Execute the following commands to set up the database:

```bash
npm run db:migrate
npm run db:seed
```

### 6. Start the Application

To start the application, run:

```bash
npm run dev
```

Or, to use Docker:

```bash
docker build -t event-booking .
docker run -d -p 5000:5000 --env-file .env event-booking
```

### 7. Access the API

Once running, the API will be available at: [http://localhost:5000](http://localhost:5000)

## Design Choices

- **Microservices & Modular Architecture**: Separation of concerns for Authentication, Events, Bookings, and Waiting Lists ensures scalability and maintainability.
- **RESTful API**: Stateless design with proper HTTP status codes for meaningful responses.
- **Concurrency Handling with Redis**: Prevents race conditions and ensures safe concurrent ticket bookings.
- **Authentication**: JWT-based authentication for secure user access with middleware for protected routes.

## API Documentation

### Authentication

#### User Signup

`POST /register`

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response (201 Created):**

```json
{
  "message": "User registered successfully",
  "token": "jwt_token_here"
}
```

#### User Login

`POST /login`

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response (200 OK):**

```json
{
  "message": "Login successful",
  "token": "jwt_token_here"
}
```

### Event Management

#### Create an Event

`POST /events`

**Request Body:**

```json
{
  "name": "Tech Conference 2025",
  "totalTickets": 100
}
```

**Response (201 Created):**

```json
{
  "message": "Event created successfully",
  "event": {
    "id": 1,
    "name": "Tech Conference 2025",
    "totalTickets": 100,
    "availableTickets": 100
  }
}
```

#### Get Event Status

`GET /events/:eventId`

**Response (200 OK):**

```json
{
  "eventId": 1,
  "name": "Tech Conference 2025",
  "availableTickets": 10,
  "waitingListCount": 5
}
```

### Ticket Booking

#### Book a Ticket

`POST /book`

**Request Body:**

```json
{
  "eventId": 1,
  "userId": "user_12345"
}
```

**Response (200 OK):**

```json
{
  "message": "Ticket booked successfully"
}
```

If sold out (User added to Waiting List):

```json
{
  "message": "Event sold out, added to waiting list"
}
```

#### Cancel a Booking

`POST /cancel`

**Request Body:**

```json
{
  "eventId": 1,
  "userId": "user_12345"
}
```

**Response (200 OK):**

```json
{
  "message": "Booking canceled successfully"
}
```

## Running Tests

To run unit and integration tests, use:

```bash
npm test
```

````

## Deployment

For production deployment:

1. Build the Docker image:
   ```bash
   docker build -t event-booking .
````

2. Run the container:
   ```bash
   docker run -d -p 3000:3000 --env-file .env event-booking
   ```

## Conclusion

This Event Ticket Booking System is designed for scalability, security, and reliability, using Redis for concurrency control, JWT authentication, and following RESTful principles for clean API design.
