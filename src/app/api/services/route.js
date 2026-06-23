import { dbConnect } from "@/app/lib/dbConnect";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const limit = request.nextUrl.searchParams.get("limit");
    const collection = await dbConnect("services");

    let query = collection.find();
    if (limit) {
      query = query.limit(Number(limit));
    }

    const services = await query.toArray();
    return NextResponse.json(services);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch services" },
      { status: 500 },
    );
  }
}
