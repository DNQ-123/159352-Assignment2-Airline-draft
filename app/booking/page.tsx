"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { airportName, formatDateTimeForAirport } from "@/lib/airline";
import type { Invoice, Schedule } from "@/lib/types";

export default function BookingPage() {
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [passengerName, setPassengerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [invoice, setInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    // Load the flight selected from the search page.
    async function loadSchedule() {
      const scheduleId = new URLSearchParams(window.location.search).get(
        "scheduleId"
      );

      if (!scheduleId) {
        setMessage("Please choose a flight from the search page first.");
        setLoading(false);
        return;
      }

      const response = await fetch(`/api/schedules/${scheduleId}`);
      const data = await response.json();

      if (data.success) {
        setSchedule(data.schedule);
      } else {
        setMessage(data.error || "Failed to load flight.");
      }

      setLoading(false);
    }

    loadSchedule();
  }, []);

  // Send the passenger details to the booking API.
  async function handleBooking() {
    if (!schedule) {
      return;
    }

    setMessage("");
    setInvoice(null);

    if (!passengerName || !email) {
      setMessage("Please enter passenger name and email.");
      return;
    }

    const response = await fetch("/api/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        scheduleId: schedule._id,
        passengerName,
        email,
        phone,
      }),
    });

    const data = await response.json();

    if (data.success) {
      setInvoice(data.invoice);
      setPassengerName("");
      setEmail("");
      setPhone("");
      setMessage("Booking confirmed.");
    } else {
      setMessage(data.error || "Booking failed.");
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-8">
      <section className="rounded-lg bg-white p-6 shadow">
        <h1 className="text-3xl font-bold">Booking</h1>

        {loading && <p className="mt-4 text-slate-600">Loading flight...</p>}
        {message && <p className="mt-4 text-blue-700">{message}</p>}

        {!loading && !schedule && (
          <Link
            href="/search"
            className="mt-6 inline-block rounded-md bg-slate-950 px-5 py-2 font-semibold text-white"
          >
            Go to Search Flights
          </Link>
        )}

        {schedule && (
          <div className="mt-6 grid gap-6 md:grid-cols-[1fr_360px]">
            <div className="rounded-lg border border-slate-200 p-5">
              <p className="text-sm font-semibold uppercase tracking-wide text-amber-600">
                Selected flight
              </p>
              <h2 className="mt-2 text-xl font-bold">
                {schedule.flightNumber}
              </h2>
              <p className="mt-1 text-lg font-semibold text-slate-800">
                {airportName(schedule.origin)} {"->"}{" "}
                {airportName(schedule.destination)}
              </p>

              <dl className="mt-5 space-y-3 text-sm">
                <div>
                  <dt className="font-semibold text-slate-900">Aircraft</dt>
                  <dd className="text-slate-600">{schedule.aircraft}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-900">Departure</dt>
                  <dd className="text-slate-600">
                    {formatDateTimeForAirport(
                      schedule.departureTime,
                      schedule.origin
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-900">Arrival</dt>
                  <dd className="text-slate-600">
                    {formatDateTimeForAirport(
                      schedule.arrivalTime,
                      schedule.destination
                    )}
                  </dd>
                </div>
              </dl>

              <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-slate-200 pt-4">
                <span className="rounded-md bg-slate-100 px-3 py-2 text-sm font-semibold">
                  Seats available: {schedule.capacity - schedule.bookings.length}
                </span>
                <span className="text-2xl font-bold">${schedule.price}</span>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
              <h2 className="text-xl font-bold">Passenger Details</h2>
              <div className="mt-4 space-y-4">
                <label className="block">
                  <span className="text-sm font-medium text-slate-700">
                    Passenger name
                  </span>
                  <input
                    className="mt-1 w-full rounded-md border border-slate-300 bg-white p-2"
                    value={passengerName}
                    onChange={(event) => setPassengerName(event.target.value)}
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-slate-700">
                    Email
                  </span>
                  <input
                    className="mt-1 w-full rounded-md border border-slate-300 bg-white p-2"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-slate-700">
                    Phone
                  </span>
                  <input
                    className="mt-1 w-full rounded-md border border-slate-300 bg-white p-2"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                  />
                </label>
              </div>

              <button
                onClick={handleBooking}
                className="mt-5 w-full rounded-md bg-amber-400 px-5 py-2 font-semibold text-slate-950 hover:bg-amber-300"
              >
                Confirm Booking
              </button>
            </div>
          </div>
        )}
      </section>

      {invoice && (
        <section className="mt-6 rounded-lg border border-green-300 bg-white p-6 shadow">
          <div className="flex flex-col justify-between gap-3 border-b border-slate-200 pb-4 md:flex-row md:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-green-700">
                Booking confirmed
              </p>
              <h2 className="text-2xl font-bold text-slate-950">
                Booking Invoice
              </h2>
            </div>
            <div className="rounded-md bg-green-100 px-4 py-2 font-bold text-green-900">
              {invoice.bookingRef}
            </div>
          </div>

          <dl className="mt-5 grid gap-4 text-sm md:grid-cols-2">
            <div>
              <dt className="font-semibold text-slate-900">Passenger</dt>
              <dd className="text-slate-600">{invoice.passengerName}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-900">Email</dt>
              <dd className="text-slate-600">{invoice.email}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-900">Phone</dt>
              <dd className="text-slate-600">{invoice.phone || "N/A"}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-900">Flight</dt>
              <dd className="text-slate-600">{invoice.flightNumber}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-900">Departure</dt>
              <dd className="text-slate-600">
                {formatDateTimeForAirport(invoice.departureTime, invoice.origin)}
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-900">Arrival</dt>
              <dd className="text-slate-600">
                {formatDateTimeForAirport(
                  invoice.arrivalTime,
                  invoice.destination
                )}
              </dd>
            </div>
          </dl>

          <p className="mt-5 border-t border-slate-200 pt-4 text-right text-2xl font-bold">
            Total: ${invoice.price}
          </p>
        </section>
      )}
    </main>
  );
}
