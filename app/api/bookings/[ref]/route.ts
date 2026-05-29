import { getDb } from "@/lib/mongodb";
import type { ObjectId } from "mongodb";

type Booking = {
  bookingRef: string;
  passengerId?: ObjectId;
  passengerName: string;
  email: string;
  phone: string;
  bookedAt: Date;
  status: string;
};

type ScheduleDocument = {
  _id: ObjectId;
  bookings: Booking[];
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: Date;
};

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ ref: string }> }
) {
  try {
    const db = await getDb();

    const { ref } = await params;

    if (!ref) {
      return Response.json(
        {
          success: false,
          error: "Missing booking reference",
        },
        { status: 400 }
      );
    }

    const schedules = db.collection<ScheduleDocument>("schedules");

    const schedule = await schedules.findOne({
      "bookings.bookingRef": ref,
    });

    if (!schedule) {
      return Response.json(
        {
          success: false,
          error: "Booking reference not found",
        },
        { status: 404 }
      );
    }

    const booking = schedule.bookings.find((item) => item.bookingRef === ref);

    await schedules.updateOne(
      { _id: schedule._id },
      {
        $pull: {
          bookings: {
            bookingRef: ref,
          },
        },
      }
    );

    return Response.json({
      success: true,
      message: "Booking cancelled",
      cancelledBooking: booking,
      flight: {
        flightNumber: schedule.flightNumber,
        origin: schedule.origin,
        destination: schedule.destination,
        departureTime: schedule.departureTime,
      },
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        error: "Failed to cancel booking",
      },
      { status: 500 }
    );
  }
}
