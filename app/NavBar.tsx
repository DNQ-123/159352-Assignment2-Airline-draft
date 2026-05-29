"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/search", label: "Search Flights" },
  { href: "/my-bookings", label: "My Bookings" },
  { href: "/cancel-booking", label: "Cancel Booking" },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-3 text-sm">
      {navItems.map((item) => {
        const isActive =
          item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`border-b-2 px-3 py-2 ${
              isActive
                ? "border-amber-400 text-white"
                : "border-transparent text-slate-200 hover:border-slate-500 hover:text-white"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
