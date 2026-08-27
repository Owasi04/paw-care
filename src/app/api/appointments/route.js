import { dbConnect } from "@/app/lib/dbConnect";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { resolveVetProfile } from "@/app/lib/vetUtils";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    // Identity comes from the session, never the request body — otherwise a
    // client could book on another user's behalf.
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const collection = await dbConnect("appointments");

    // Resolve the service server-side so the vet assignment and category can't
    // be forged by the client; a spoofed vetID would land in a vet's schedule.
    const servicesCollection = await dbConnect("services");
    const service = body.serviceID
      ? await servicesCollection.findOne({ _id: body.serviceID })
      : await servicesCollection.findOne({ name: body.serviceName });

    if (!service) {
      return NextResponse.json(
        { error: "Unknown service" },
        { status: 400 },
      );
    }

    const newAppointment = {
      userMail: session.user.email,
      userName: session.user.name,
      userPhone: body.userPhone,

      // which pet this is for
      petName: body.petName,
      petType: body.petType,
      petBreed: body.petBreed,

      // service, derived from the service document
      serviceID: service._id,
      serviceName: service.name,
      serviceCategory: service.category ?? null,

      // vet id + name, also derived from the service document
      vetID: service.vet?._id ?? "",
      vetName: service.vet?.name ?? "",

      // scheduling — a bare local "YYYY-MM-DD" / "HH:MM" pair
      appointmentDate: body.appointmentDate,
      appointmentTime: body.appointmentTime,

      // status & extras
      status: "pending",
    };

    const result = await collection.insertOne(newAppointment);
    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function GET(request) {
  try {
    // 1. Get authenticated session. authOptions MUST be passed, otherwise the
    // session callback never runs and session.user.role is undefined.
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { role, email } = session.user;

    // 2. Build the base query based on role
    const query = {};

    if (role === "user") {
      // A pet owner can only see their own appointments
      query.userMail = email;
    } else if (role === "vet") {
      // A vet only sees appointments assigned to their vet profile
      const { vetID } = await resolveVetProfile(session);
      if (!vetID) {
        // Distinct from "no appointments" so the UI can explain the cause
        // instead of rendering a silently empty schedule.
        return NextResponse.json(
          { error: "No vet profile is linked to this account", code: "VET_NOT_LINKED" },
          { status: 409 },
        );
      }
      query.vetID = vetID;
    } else if (role !== "admin") {
      return NextResponse.json({ error: "Invalid role" }, { status: 403 });
    }
    // admin: no scoping, sees every appointment

    // 3. Optional filters from query parameters (status, serviceName, category)
    const { searchParams } = request.nextUrl;
    const statusValues = searchParams.getAll("status");
    if (statusValues.length > 0) {
      query.status = { $in: statusValues };
    }

    const serviceName = searchParams.get("serviceName");
    if (serviceName) {
      query.serviceName = serviceName; // exact match; use regex for partial
    }

    // 4. Fetch appointments
    const appointmentsCollection = await dbConnect("appointments");
    const result = await appointmentsCollection
      .find(query)
      .sort({ appointmentDate: -1 })
      .toArray();

    return NextResponse.json(result);
  } catch (error) {
    console.error(error.message);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
