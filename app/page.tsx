import Link from "next/link";
import { airportName } from "@/lib/airline";

const popularRoutes = [
  {
    origin: "NZNE",
    destination: "YSSY",
    aircraft: "SyberJet SJ30i",
    note: "Weekly prestige service",
    price: 1200,
  },
  {
    origin: "NZNE",
    destination: "NZRO",
    aircraft: "Cirrus SF50",
    note: "Weekday shuttle",
    price: 250,
  },
  {
    origin: "NZNE",
    destination: "NZGB",
    aircraft: "Cirrus SF50",
    note: "Mon, Wed, Fri",
    price: 180,
  },
  {
    origin: "NZNE",
    destination: "NZCI",
    aircraft: "HondaJet Elite",
    note: "Tue and Fri",
    price: 650,
  },
  {
    origin: "NZNE",
    destination: "NZTL",
    aircraft: "HondaJet Elite",
    note: "Weekly Monday",
    price: 500,
  },
];

export default function HomePage() {
  return (
    <main>
      <section className="bg-slate-900 text-white">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-amber-300">
              Online booking system
            </p>
            <h1 className="mt-4 max-w-2xl text-4xl font-bold md:text-5xl">
              Premium point-to-point flights from Dairy Flat
            </h1>
            <p className="mt-5 max-w-xl text-slate-200">
              Search scheduled flights, book a seat, view your bookings, or
              cancel a booking reference.
            </p>
            <Link
              href="/search"
              className="mt-8 inline-block rounded-md bg-amber-400 px-6 py-3 font-semibold text-slate-950 hover:bg-amber-300"
            >
              Search Flights
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <h2 className="text-2xl font-bold">Popular Routes</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-5">
          {popularRoutes.map((route) => (
            <article
              key={`${route.origin}-${route.destination}`}
              className="rounded-lg bg-white p-5 shadow"
            >
              <h3 className="font-bold">
                {airportName(route.origin)} {"->"} {airportName(route.destination)}
              </h3>
              <p className="mt-3 text-sm text-slate-600">{route.aircraft}</p>
              <p className="mt-1 text-sm text-slate-600">{route.note}</p>
              <p className="mt-4 text-xl font-bold">${route.price}</p>
              <Link
                href={`/search?orig=${route.origin}&dest=${route.destination}`}
                className="mt-4 inline-block rounded-md border border-amber-400 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-amber-50"
              >
                View Flights
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
