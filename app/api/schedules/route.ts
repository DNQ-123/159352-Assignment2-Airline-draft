import { getDb } from "@/lib/mongodb";
import type { Filter } from "mongodb";

type ScheduleDocument = {
  origin: string;
  destination: string;
  departureDateLocal: string;
  departureTime: Date;
};

export async function GET(request: Request) {
  try {
    const db = await getDb();

    const { searchParams } = new URL(request.url);

    const orig = searchParams.get("orig");
    const dest = searchParams.get("dest");
    const date1 = searchParams.get("date1");
    const date2 = searchParams.get("date2");

    const query: Filter<ScheduleDocument> = {};

    if (orig) {
      query.origin = orig;
    }

    if (dest) {
      query.destination = dest;
    }

    if (date1 || date2) {
      const departureDateLocal: { $gte?: string; $lte?: string } = {};

      if (date1) {
        departureDateLocal.$gte = date1;
      }

      if (date2) {
        departureDateLocal.$lte = date2;
      }

      query.departureDateLocal = departureDateLocal;
    }

    const schedules = await db
      .collection<ScheduleDocument>("schedules")
      .find(query)
      .sort({ departureTime: 1 })
      .toArray();

    return Response.json({
      success: true,
      count: schedules.length,
      schedules,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        error: "Failed to fetch schedules",
      },
      {
        status: 500,
      }
    );
  }
}
