import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return Response.json(
        { success: false, error: "Invalid schedule id" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const schedule = await db.collection("schedules").findOne({
      _id: new ObjectId(id),
    });

    if (!schedule) {
      return Response.json(
        { success: false, error: "Scheduled flight not found" },
        { status: 404 }
      );
    }

    return Response.json({ success: true, schedule });
  } catch (error) {
    console.error(error);

    return Response.json(
      { success: false, error: "Failed to fetch scheduled flight" },
      { status: 500 }
    );
  }
}
