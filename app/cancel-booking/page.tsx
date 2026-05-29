"use client";

import { useState } from "react";

export default function CancelBookingPage() {
  const [bookingRef, setBookingRef] = useState("");
  const [message, setMessage] = useState("");

  async function handleCancelBooking() {
    setMessage("");

    if (!bookingRef) {
      setMessage("Please enter a booking reference.");
      return;
    }

    const response = await fetch(`/api/bookings/${bookingRef}`, {
      method: "DELETE",
    });
    const data = await response.json();

    if (data.success) {
      setMessage(`Booking ${bookingRef} has been cancelled successfully.`);
      setBookingRef("");
    } else {
      setMessage(data.error || "Failed to cancel booking.");
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-8">
      <section className="rounded-lg bg-white p-6 shadow">
        <h1 className="text-3xl font-bold">Cancel Booking</h1>
        <p className="mt-2 text-slate-600">
          Enter your booking reference to cancel a confirmed booking.
        </p>

        <div className="mt-5 flex flex-col gap-3 md:flex-row">
          <input
            className="w-full rounded-md border border-slate-300 p-2"
            placeholder="Booking Reference, e.g. BKTXQ8FY"
            value={bookingRef}
            onChange={(event) => setBookingRef(event.target.value.toUpperCase())}
          />
          <button
            onClick={handleCancelBooking}
            className="rounded-md bg-red-600 px-5 py-2 font-semibold text-white hover:bg-red-700"
          >
            Cancel Booking
          </button>
        </div>

        {message && <p className="mt-4 text-blue-700">{message}</p>}
      </section>
    </main>
  );
}
