import { dbConnect } from "@/app/lib/dbConnect";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const ownerName = searchParams.get("ownerName");
    const query = ownerName ? { ownerName } : {};
    const petsCollection = await dbConnect("pets");
    const result = await petsCollection.find(query).toArray();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  const body = await request.json();
  const ownerName = body.ownerName;
  if (!ownerName) {
    return NextResponse.json({ status: 403, message: "user is not found" });
  }
  try {
    const addNewPets = {
      ownerName,
      petsName: body.petName,
      species: body.species,
      petsBreed: body.breed,
      petsAge: body.age,
      petsWeight: body.weight,
      isVaccinated: body.vaccinated,
      notes: body.notes,
      petsPhotoURL: body.petsPhotoURL || null,
    };
    const petsCollection = await dbConnect("pets");
    const result = await petsCollection.insertOne(addNewPets);
    return NextResponse.json({ status: 200 }, result);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
