"use server";

import { dbConnect } from "@/app/lib/dbConnect";

export async function POST(request) {
  const collection = dbConnect("appointments");
  const body = await request.json();

  try {
    const userMail = body.userEmail;
    if (!userMail) {
      return Response.json({
        status: 403,
        message: "Unauthorized access",
      });
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
      vetName: body.vetName,
      appointmentDate: body.appointmentDate,
      appointmentTime: body.appointmentTime,

      // status & extras
      status: "pending",
    };
    const result = await collection.insertOne(newAppointment);
    return Response.josn(result);
  } catch (error) {
    console.log(error);
  }
}
