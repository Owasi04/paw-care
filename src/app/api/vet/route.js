"use server";

import { dbConnect } from "@/app/lib/dbConnect";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const limit = request.nextUrl.searchParams.get("limit");
    const vetCollection = await dbConnect("vet");

    // `email` links a vet profile to its login account; it is not public.
    let query = vetCollection.find({}, { projection: { email: 0 } });
    if (limit) {
      query = query.limit(Number(limit));
    }

    const vet = await query.toArray();
    return NextResponse.json(vet);
  } catch (error) {
    console.error(error.message);
    return NextResponse.json({ status: 500, message: error.message });
  }
}
