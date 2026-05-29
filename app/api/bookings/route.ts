import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

type BookingRequest = {
  scheduleId?: string;
  passengerName?: string;
  email?: string;
  phone?: string;
};

type Booking = {
  bookingRef: string;
  passengerId: ObjectId;
  passengerName: string;
  email: string;
  phone: string;
  bookedAt: Date;
  status: string;
};

type ScheduleDocument = {
  _id: ObjectId;
  flightNumber: string;
  aircraft: string;
  origin: string;
  destination: string;
  departureTime: Date;
  arrivalTime: Date;
  capacity: number;
  price: number;
  bookings: Booking[];
};

type PassengerDocument = {
  _id: ObjectId;
  passengerName: string;
  email: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
};

function generateBookingRef() {
  return "BK" + Math.random().toString(36).substring(2, 8).toUpperCase();
}

// Create a passenger record and add the booking inside the schedule.
export async function POST(request: Request) {
  try {
    const db = await getDb();
    const body = (await request.json()) as BookingRequest;

    const { scheduleId, passengerName, email, phone } = body;

    if (!scheduleId || !passengerName || !email) {
      return Response.json(
        {
          success: false,
          error: "Missing required booking information",
        },
        { status: 400 }
      );
    }

    const schedules = db.collection<ScheduleDocument>("schedules");

    const schedule = await schedules.findOne({
      _id: new ObjectId(scheduleId),
    });

    if (!schedule) {
      return Response.json(
        {
          success: false,
          error: "Scheduled flight not found",
        },
        { status: 404 }
      );
    }

    const currentBookings = schedule.bookings || [];

    if (currentBookings.length >= schedule.capacity) {
      return Response.json(
        {
          success: false,
          error: "This flight is fully booked",
        },
        { status: 400 }
      );
    }

    const passengers = db.collection<PassengerDocument>("passengers");
    const now = new Date();
    const passengerPhone = phone || "";

    const passengerResult = await passengers.findOneAndUpdate(
      { email },
      {
        $set: {
          passengerName,
          phone: passengerPhone,
          updatedAt: now,
        },
        $setOnInsert: {
          email,
          createdAt: now,
        },
      },
      {
        upsert: true,
        returnDocument: "after",
      }
    );

    if (!passengerResult) {
      return Response.json(
        {
          success: false,
          error: "Failed to save passenger information",
        },
        { status: 500 }
      );
    }

    const bookingRef = generateBookingRef();
    const booking = {
      bookingRef,
      passengerId: passengerResult._id,
      passengerName,
      email,
      phone: passengerPhone,
      bookedAt: now,
      status: "confirmed",
    };

    await schedules.updateOne(
      { _id: new ObjectId(scheduleId) },
      {
        $push: {
          bookings: booking,
        },
      }
    );

    return Response.json({
      success: true,
      booking,
      invoice: {
        bookingRef,
        passengerName,
        email,
        phone: phone || "",
        flightNumber: schedule.flightNumber,
        aircraft: schedule.aircraft,
        origin: schedule.origin,
        destination: schedule.destination,
        departureTime: schedule.departureTime,
        arrivalTime: schedule.arrivalTime,
        price: schedule.price,
      },
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        error: "Failed to create booking",
      },
      { status: 500 }
    );
  }
}

// Return all bookings for one passenger email address.
export async function GET(request: Request) {
  try {
    const db = await getDb();

    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return Response.json(
        {
          success: false,
          error: "Missing email",
        },
        { status: 400 }
      );
    }

    const schedules = await db
      .collection<ScheduleDocument>("schedules")
      .find({
        "bookings.email": email,
      })
      .sort({ departureTime: 1 })
      .toArray();

    const results = schedules.flatMap((schedule) => {
      const matchedBookings = schedule.bookings.filter(
        (booking) => booking.email === email
      );

      return matchedBookings.map((booking) => ({
          bookingRef: booking.bookingRef,
          passengerName: booking.passengerName,
          email: booking.email,
          phone: booking.phone,
          status: booking.status,
          bookedAt: booking.bookedAt,
          flightNumber: schedule.flightNumber,
          aircraft: schedule.aircraft,
          origin: schedule.origin,
          destination: schedule.destination,
          departureTime: schedule.departureTime,
          arrivalTime: schedule.arrivalTime,
          price: schedule.price,
        }));
    });

    return Response.json({
      success: true,
      count: results.length,
      bookings: results,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        error: "Failed to fetch bookings",
      },
      { status: 500 }
    );
  }
}

