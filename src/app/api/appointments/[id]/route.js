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

export async function PATCH(params) {
  try {
    const { id } = await params;
    if (!id) {
      console.log("Couldn't get the id");
    }
    const result = await appointmentsCollection.updateOne({
      status: "cancelled",
      STATUS: 0,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error(error.message);
  }
}
