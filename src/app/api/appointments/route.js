"use server";
import { dbConnect } from "@/app/lib/dbConnect";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const collection = await dbConnect("appointments");

    const userMail = body.userMail;
    if (!userMail) {
      return Response.json(
        { status: 403, message: "Unauthorized access" },
        { status: 403 },
      );
    }

    const vetID = body.vetID ?? body.vetId ?? "";
    const vetName = body.vetName ?? "";

    const newAppointment = {
      userMail,
      userName: body.userName,
      userPhone: body.userPhone,

      // which pet this is for
      petName: body.petName,
      petType: body.petType,
      petBreed: body.petBreed,

      // vet id + name
      vetID,
      vetId: vetID,
      vetName,

      // service + scheduling
      serviceName: body.serviceName,
      appointmentDate: body.appointmentDate,
      appointmentTime: body.appointmentTime,

      // status & extras
      status: "pending",
      STATUS: 1,
    };

    const result = await collection.insertOne(newAppointment);
    return Response.json(result);
  } catch (error) {
    console.log(error);
    return Response.json(
      { status: 500, message: error.message },
      { status: 500 },
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = request.nextUrl;
    const userMail = searchParams.get("userMail");
    const statusValues = searchParams.getAll("status");

    const query = {};

    if (userMail) {
      query.userMail = userMail;
    }

    if (statusValues.length > 0) {
      query.status = { $in: statusValues };
    }

    const appointmentsCollection = await dbConnect("appointments");
    const result = await appointmentsCollection
      .find(query)
      .sort({ appointmentDate: -1 })
      .toArray();

    return NextResponse.json(result);
  } catch (error) {
    console.log(error.message);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
