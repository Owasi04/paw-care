import { dbConnect } from "@/app/lib/dbConnect";
import { ObjectId } from "mongodb";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const collection = dbConnect("services");
    let query = {};
    if (ObjectId.isValid(id)) {
      query = {
        $or: [
          { _id: new ObjectId(id) },
          { _id: id }                 
        ]
      };
    } else {
      query = { _id: id };
    }

    const serviceDetails = await collection.findOne(query);

    if (!serviceDetails) {
      return Response.json({ error: "Service not found" }, { status: 404 });
    }

    return Response.json(serviceDetails);
  } catch (error) {
    console.error("GET /api/services/[id] error:", error);
    return Response.json({ error: "Failed to fetch service" }, { status: 500 });
  }
}