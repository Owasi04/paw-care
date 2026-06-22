import { dbConnect } from "@/app/lib/dbConnect";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    console.log("backend id", id);

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid service ID" },
        { status: 400 },
      );
    }

    const collection = dbConnect(`services`);

    const serviceDetails = await collection.findOne({
      _id: new ObjectId(id),
    });

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }
    return NextResponse.json(serviceDetails);

  } catch (error) {
    console.error("GET /api/services/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch service" },
      { status: 500 },
    );
  }
}
