# Dairy Flat Airways Booking System

This is a simple airline booking web application for 159.352 Assignment 2.

The application is built with:

- Next.js
- React
- Tailwind CSS
- MongoDB Atlas

## Main Features

- Home page
- Search flights
- Book a flight
- View bookings by email
- Cancel a booking by booking reference
- Store schedules, passengers, and bookings in MongoDB
- Show flight times using the correct airport time zones

## How to Run

Install dependencies:

```bash
npm install
```

Create a `.env.local` file and add the MongoDB connection string:

```text
MONGODB_URI=your_mongodb_connection_string
```

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Useful Commands

Run the linter:

```bash
npm run lint
```

Build the project:

```bash
npm run build
```

## Project Pages

- `/` - Home
- `/search` - Search Flights
- `/booking` - Booking page
- `/my-bookings` - My Bookings
- `/cancel-booking` - Cancel Booking

## Notes

The `.env.local`, `node_modules`, and `.next` folders should not be included in the submitted archive.
