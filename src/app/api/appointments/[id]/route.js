"use server";

import { dbConnect } from "@/app/lib/dbConnect";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

const appointmentsCollection = dbConnect("appointments");

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    let query = {};
    if (ObjectId.isValid(id)) {
      query = {
        $or: [{ _id: new ObjectId(id) }, { _id: id }],
      };
    } else {
      query = { _id: id };
    }

    const result = await appointmentsCollection.findOne(query);
    return NextResponse.json(result);
  } catch (error) {
    Response.json({ message: `Error in ${error.message}` });
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const appointmentsCollection = dbConnect("appointments");

     const result = await appointmentsCollection.updateOne(
      { _id: new ObjectId(id) }, 
      { $set: { status: "cancelled", STATUS: 0 } },
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error(error.message);
    return NextResponse.json({ error: "Server error" }, { status: 500 }); // ✅ always return a response
  }
}
