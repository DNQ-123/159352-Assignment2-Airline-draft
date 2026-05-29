import { getDb } from "@/lib/mongodb";

type FlightTemplate = {
  flightNumber: string;
  aircraft: string;
  origin: string;
  destination: string;
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  departureTime: string;
  durationMinutes: number;
  capacity: number;
  price: number;
  originOffset: string;
  destinationOffset: string;
};

const flightTemplates: FlightTemplate[] = [];

function addTemplate(template: FlightTemplate) {
  flightTemplates.push(template);
}

// Sydney prestige service
addTemplate({
  flightNumber: "DF101",
  aircraft: "SyberJet SJ30i",
  origin: "NZNE",
  destination: "YSSY",
  dayOfWeek: 5,
  departureTime: "10:00",
  durationMinutes: 210,
  capacity: 6,
  price: 1200,
  originOffset: "+12:00",
  destinationOffset: "+10:00",
});

addTemplate({
  flightNumber: "DF102",
  aircraft: "SyberJet SJ30i",
  origin: "YSSY",
  destination: "NZNE",
  dayOfWeek: 0,
  departureTime: "15:00",
  durationMinutes: 270,
  capacity: 6,
  price: 1200,
  originOffset: "+10:00",
  destinationOffset: "+12:00",
});

// Rotorua weekday shuttle: Monday-Friday, two return trips per weekday
for (const day of [1, 2, 3, 4, 5]) {
  addTemplate({
    flightNumber: `DF20${day}A`,
    aircraft: "Cirrus SF50",
    origin: "NZNE",
    destination: "NZRO",
    dayOfWeek: day,
    departureTime: "07:30",
    durationMinutes: 45,
    capacity: 4,
    price: 250,
    originOffset: "+12:00",
    destinationOffset: "+12:00",
  });

  addTemplate({
    flightNumber: `DF20${day}B`,
    aircraft: "Cirrus SF50",
    origin: "NZRO",
    destination: "NZNE",
    dayOfWeek: day,
    departureTime: "08:45",
    durationMinutes: 45,
    capacity: 4,
    price: 250,
    originOffset: "+12:00",
    destinationOffset: "+12:00",
  });

  addTemplate({
    flightNumber: `DF20${day}C`,
    aircraft: "Cirrus SF50",
    origin: "NZNE",
    destination: "NZRO",
    dayOfWeek: day,
    departureTime: "16:30",
    durationMinutes: 45,
    capacity: 4,
    price: 250,
    originOffset: "+12:00",
    destinationOffset: "+12:00",
  });

  addTemplate({
    flightNumber: `DF20${day}D`,
    aircraft: "Cirrus SF50",
    origin: "NZRO",
    destination: "NZNE",
    dayOfWeek: day,
    departureTime: "18:00",
    durationMinutes: 45,
    capacity: 4,
    price: 250,
    originOffset: "+12:00",
    destinationOffset: "+12:00",
  });
}

// Great Barrier / Claris: outbound Mon/Wed/Fri, return Tue/Thu/Sat
for (const day of [1, 3, 5]) {
  addTemplate({
    flightNumber: `DF30${day}`,
    aircraft: "Cirrus SF50",
    origin: "NZNE",
    destination: "NZGB",
    dayOfWeek: day,
    departureTime: "09:00",
    durationMinutes: 35,
    capacity: 4,
    price: 180,
    originOffset: "+12:00",
    destinationOffset: "+12:00",
  });
}

for (const day of [2, 4, 6]) {
  addTemplate({
    flightNumber: `DF31${day}`,
    aircraft: "Cirrus SF50",
    origin: "NZGB",
    destination: "NZNE",
    dayOfWeek: day,
    departureTime: "09:00",
    durationMinutes: 35,
    capacity: 4,
    price: 180,
    originOffset: "+12:00",
    destinationOffset: "+12:00",
  });
}

// Chatham Islands / Tuuta: outbound Tue/Fri, return Wed/Sat
for (const day of [2, 5]) {
  addTemplate({
    flightNumber: `DF40${day}`,
    aircraft: "HondaJet Elite",
    origin: "NZNE",
    destination: "NZCI",
    dayOfWeek: day,
    departureTime: "09:00",
    durationMinutes: 135,
    capacity: 5,
    price: 650,
    originOffset: "+12:00",
    destinationOffset: "+12:45",
  });
}

for (const day of [3, 6]) {
  addTemplate({
    flightNumber: `DF41${day}`,
    aircraft: "HondaJet Elite",
    origin: "NZCI",
    destination: "NZNE",
    dayOfWeek: day,
    departureTime: "10:00",
    durationMinutes: 150,
    capacity: 5,
    price: 650,
    originOffset: "+12:45",
    destinationOffset: "+12:00",
  });
}

// Lake Tekapo: outbound Monday, return Tuesday
addTemplate({
  flightNumber: "DF501",
  aircraft: "HondaJet Elite",
  origin: "NZNE",
  destination: "NZTL",
  dayOfWeek: 1,
  departureTime: "10:00",
  durationMinutes: 90,
  capacity: 5,
  price: 500,
  originOffset: "+12:00",
  destinationOffset: "+12:00",
});

addTemplate({
  flightNumber: "DF502",
  aircraft: "HondaJet Elite",
  origin: "NZTL",
  destination: "NZNE",
  dayOfWeek: 2,
  departureTime: "11:00",
  durationMinutes: 105,
  capacity: 5,
  price: 500,
  originOffset: "+12:00",
  destinationOffset: "+12:00",
});

function addDays(date: Date, days: number) {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}

function makeDateWithOffset(date: Date, time: string, offset: string) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");

  return new Date(`${year}-${month}-${day}T${time}:00${offset}`);
}

function makeLocalDateString(date: Date) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function generateSchedules(startDateString: string, weeks: number) {
  const startDate = new Date(`${startDateString}T00:00:00Z`);
  const schedules = [];

  for (let week = 0; week < weeks; week++) {
    for (const template of flightTemplates) {
      const weekStart = addDays(startDate, week * 7);
      const startDay = weekStart.getUTCDay();
      const daysToAdd = (template.dayOfWeek - startDay + 7) % 7;
      const flightDate = addDays(weekStart, daysToAdd);

      const departureTime = makeDateWithOffset(
        flightDate,
        template.departureTime,
        template.originOffset
      );

      const arrivalTime = new Date(
        departureTime.getTime() + template.durationMinutes * 60 * 1000
      );

      schedules.push({
        flightNumber: `${template.flightNumber}-W${week + 1}`,
        baseFlightNumber: template.flightNumber,
        aircraft: template.aircraft,
        origin: template.origin,
        destination: template.destination,
        departureDateLocal: makeLocalDateString(flightDate),
        departureTime,
        arrivalTime,
        capacity: template.capacity,
        price: template.price,
        bookings: [],
      });
    }
  }

  return schedules;
}

export async function GET() {
  try {
    const db = await getDb();

    const schedules = generateSchedules("2026-06-01", 8);

    await db.collection("schedules").deleteMany({});
    const result = await db.collection("schedules").insertMany(schedules);

    return Response.json({
      success: true,
      message: "Complete multi-week seed data inserted",
      templatesPerWeek: flightTemplates.length,
      weeks: 8,
      insertedCount: result.insertedCount,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        error: "Seed failed",
      },
      { status: 500 }
    );
  }
}