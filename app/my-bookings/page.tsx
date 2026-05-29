"use client";

import { useState } from "react";
import { formatDateTimeForAirport } from "@/lib/airline";
import type { PassengerBooking } from "@/lib/types";

export default function MyBookingsPage() {
  const [lookupEmail, setLookupEmail] = useState("");
  const [bookings, setBookings] = useState<PassengerBooking[]>([]);
  const [message, setMessage] = useState("");

  // Find all bookings that use this email address.
  async function handleFindBookings() {
    setMessage("");
    setBookings([]);

    if (!lookupEmail) {
      setMessage("Please enter an email address.");
      return;
    }

    const params = new URLSearchParams({ email: lookupEmail });
    const response = await fetch(`/api/bookings?${params.toString()}`);
    const data = await response.json();

    if (data.success) {
      setBookings(data.bookings);
      setMessage(
        data.bookings.length === 0
          ? "No bookings found for this email."
          : `Found ${data.bookings.length} booking(s).`
      );
    } else {
      setMessage(data.error || "Failed to find bookings.");
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-8">
      <section className="rounded-lg bg-white p-6 shadow">
        <h1 className="text-3xl font-bold">My Bookings</h1>
        <p className="mt-2 text-slate-600">
          Enter your email address to view your scheduled flights.
        </p>

        <div className="mt-5 flex flex-col gap-3 md:flex-row">
          <input
            className="w-full rounded-md border border-slate-300 p-2 md:max-w-sm"
            placeholder="Email address"
            type="email"
            value={lookupEmail}
            onChange={(event) => setLookupEmail(event.target.value)}
          />
          <button
            onClick={handleFindBookings}
            className="rounded-md bg-slate-950 px-5 py-2 font-semibold text-white hover:bg-slate-800"
          >
            Find My Bookings
          </button>
        </div>

        {message && <p className="mt-4 text-blue-700">{message}</p>}
      </section>

      <section className="mt-6 space-y-4">
        {bookings.map((booking) => (
          <article
            key={booking.bookingRef}
            className="rounded-lg bg-white p-5 shadow"
          >
            <div className="flex flex-col justify-between gap-3 border-b border-slate-200 pb-4 md:flex-row">
              <div>
                <p className="text-sm font-semibold text-amber-600">
                  {booking.flightNumber}
                </p>
                <h2 className="mt-1 text-xl font-bold">
                  {booking.origin} {"->"} {booking.destination}
                </h2>
              </div>
              <p className="text-2xl font-bold">${booking.price}</p>
            </div>

            <div className="mt-4 grid gap-2 text-sm md:grid-cols-2">
              <p>
                <strong>Booking Reference:</strong> {booking.bookingRef}
              </p>
              <p>
                <strong>Status:</strong> {booking.status}
              </p>
              <p>
                <strong>Passenger:</strong> {booking.passengerName}
              </p>
              <p>
                <strong>Aircraft:</strong> {booking.aircraft}
              </p>
              <p>
                <strong>Departure:</strong>{" "}
                {formatDateTimeForAirport(booking.departureTime, booking.origin)}
              </p>
              <p>
                <strong>Arrival:</strong>{" "}
                {formatDateTimeForAirport(
                  booking.arrivalTime,
                  booking.destination
                )}
              </p>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
