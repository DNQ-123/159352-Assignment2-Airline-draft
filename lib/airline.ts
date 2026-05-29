export const airports: Record<string, string> = {
  NZNE: "Dairy Flat",
  YSSY: "Sydney",
  NZRO: "Rotorua",
  NZGB: "Claris",
  NZCI: "Tuuta",
  NZTL: "Lake Tekapo",
};

const airportTimeZones: Record<string, { timeZone: string; label: string }> = {
  NZNE: { timeZone: "Pacific/Auckland", label: "NZ time" },
  YSSY: { timeZone: "Australia/Sydney", label: "Sydney time" },
  NZRO: { timeZone: "Pacific/Auckland", label: "NZ time" },
  NZGB: { timeZone: "Pacific/Auckland", label: "NZ time" },
  NZCI: { timeZone: "Pacific/Chatham", label: "Chatham time" },
  NZTL: { timeZone: "Pacific/Auckland", label: "NZ time" },
};

export const routesByOrigin: Record<string, string[]> = {
  NZNE: ["YSSY", "NZRO", "NZGB", "NZCI", "NZTL"],
  YSSY: ["NZNE"],
  NZRO: ["NZNE"],
  NZGB: ["NZNE"],
  NZCI: ["NZNE"],
  NZTL: ["NZNE"],
};

export function airportName(code: string) {
  return `${airports[code] || code} (${code})`;
}

// Display a stored UTC date in the correct airport time zone.
export function formatDateTimeForAirport(dateString: string, airportCode: string) {
  const timeZoneInfo =
    airportTimeZones[airportCode] || airportTimeZones.NZNE;

  return new Date(dateString).toLocaleString("en-NZ", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: timeZoneInfo.timeZone,
  }) + ` (${timeZoneInfo.label})`;
}
