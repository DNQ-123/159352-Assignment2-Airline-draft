"use client";

import Link from "next/link";
import { useState } from "react";
import {
  airportName,
  airports,
  formatDateTimeForAirport,
  routesByOrigin,
} from "@/lib/airline";
import type { Schedule } from "@/lib/types";

type SearchFlightsClientProps = {
  initialOrigin: string;
  initialDestination: string;
};

export default function SearchFlightsClient({
  initialOrigin,
  initialDestination,
}: SearchFlightsClientProps) {
  const [origin, setOrigin] = useState(initialOrigin);
  const [destination, setDestination] = useState(initialDestination);
  const [date1, setDate1] = useState("2026-06-01");
  const [date2, setDate2] = useState("2026-07-31");
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const availableDestinations = routesByOrigin[origin] || [];

  // Keep the destination list valid for the selected origin.
  function handleOriginChange(newOrigin: string) {
    setOrigin(newOrigin);
    setDestination(routesByOrigin[newOrigin][0]);
    setSchedules([]);
    setMessage("");
  }

  async function handleSearch() {
    if (!availableDestinations.includes(destination)) {
      setMessage("Please choose a valid route.");
      return;
    }

    setLoading(true);
    setMessage("");

    const params = new URLSearchParams({
      orig: origin,
      dest: destination,
      date1,
      date2,
    });

    const response = await fetch(`/api/schedules?${params.toString()}`);
    const data = await response.json();

    if (data.success) {
      setSchedules(data.schedules);
      setMessage(
        data.schedules.length === 0 ? "No flights found for this search." : ""
      );
    } else {
      setMessage(data.error || "Failed to search flights.");
    }

    setLoading(false);
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <section className="rounded-lg bg-white p-6 shadow">
        <h1 className="text-3xl font-bold">Search Flights</h1>
        <p className="mt-2 text-slate-600">
          Choose a route and date range to find scheduled flights.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Origin
            </label>
            <select
              className="mt-1 w-full rounded-md border border-slate-300 p-2"
              value={origin}
              onChange={(event) => handleOriginChange(event.target.value)}
            >
              {Object.keys(routesByOrigin).map((airportCode) => (
                <option key={airportCode} value={airportCode}>
                  {airports[airportCode]} - {airportCode}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Destination
            </label>
            <select
              className="mt-1 w-full rounded-md border border-slate-300 p-2"
              value={destination}
              onChange={(event) => setDestination(event.target.value)}
            >
              {availableDestinations.map((airportCode) => (
                <option key={airportCode} value={airportCode}>
                  {airports[airportCode]} - {airportCode}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              From date
            </label>
            <input
              className="mt-1 w-full rounded-md border border-slate-300 p-2"
              type="date"
              value={date1}
              onChange={(event) => setDate1(event.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              To date
            </label>
            <input
              className="mt-1 w-full rounded-md border border-slate-300 p-2"
              type="date"
              value={date2}
              onChange={(event) => setDate2(event.target.value)}
            />
          </div>
        </div>

        <button
          onClick={handleSearch}
          className="mt-6 rounded-md bg-slate-950 px-5 py-2 font-semibold text-white hover:bg-slate-800"
        >
          {loading ? "Searching..." : "Search Flights"}
        </button>

        {message && <p className="mt-4 text-blue-700">{message}</p>}
      </section>

      {schedules.length > 0 && (
        <section className="mt-6 overflow-hidden rounded-lg border border-slate-200 bg-white shadow">
          <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
            <h2 className="text-xl font-bold">Available Flights</h2>
          </div>

          <div className="divide-y divide-slate-200">
            {schedules.map((flight) => (
              <article
                key={flight._id}
                className="grid gap-4 px-5 py-5 md:grid-cols-[130px_1fr_170px]"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-500">
                    Flight
                  </p>
                  <p className="mt-1 text-xl font-bold text-slate-950">
                    {flight.flightNumber}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    {flight.aircraft}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-bold">
                    {airportName(flight.origin)} {"->"}{" "}
                    {airportName(flight.destination)}
                  </h3>
                  <dl className="mt-3 grid gap-3 text-sm md:grid-cols-2">
                    <div>
                      <dt className="font-semibold text-slate-900">
                        Departure
                      </dt>
                      <dd className="text-slate-600">
                        {formatDateTimeForAirport(
                          flight.departureTime,
                          flight.origin
                        )}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-slate-900">Arrival</dt>
                      <dd className="text-slate-600">
                        {formatDateTimeForAirport(
                          flight.arrivalTime,
                          flight.destination
                        )}
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="flex flex-col justify-between gap-3 md:items-end md:text-right">
                  <p className="text-sm font-semibold text-slate-600">
                    {flight.capacity - flight.bookings.length} seats available
                  </p>
                  <div>
                    <p className="text-2xl font-bold">${flight.price}</p>
                    <Link
                      href={`/booking?scheduleId=${flight._id}`}
                      className="mt-3 inline-block rounded-md bg-amber-400 px-5 py-2 font-semibold text-slate-950 hover:bg-amber-300"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
