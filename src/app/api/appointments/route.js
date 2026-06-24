"use server";
import { dbConnect } from "@/app/lib/dbConnect";

export async function POST(request) {
  try {
    const body = await request.json();
    const collection = dbConnect("appointments");

    const userMail = body.userMail;
    if (!userMail) {
      return Response.json(
        { status: 403, message: "Unauthorized access" },
        { status: 403 },
      );
    }

    const newAppointment = {
      userMail,
      userName: body.userName,
      userPhone: body.userPhone,

      // which pet this is for
      petName: body.petName,
      petType: body.petType,
      petBreed: body.petBreed,

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
  const { searchParams } = request.nextUrl;
  const collection = dbConnect("appointments");
  const userMail = searchParams.get("userMail");
  if (!userMail) {
    return Response.json(
      { status: 403, message: "Unauthorized access" },
      { status: 403 },
    );
  }
  const result = await collection.find({ userMail }).toArray();
  return Response.json(result);
}
