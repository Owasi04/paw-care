"use server";
import { dbConnect } from "@/app/lib/dbConnect";
import bcrypt from "bcryptjs";
const usersCollection = dbConnect("users");

// post users data
export async function POST(request) {
  try {
    const body = await request.json();
    // check if existed or not
    const user = await usersCollection.findOne({ email: body.email });
    if (user) {
      return Response.json(
        { success: false, message: "User already exists" },
        { status: 409 },
      );
    }
    // hash password method
    const hashPassword = await bcrypt.hash(body.password, 10);
    const newUser = {
      name: body.name,
      email: body.email,
      password: hashPassword,
      createdAt: new Date().toISOString(),
      role: "user",
    };
    // new user
    const result = await usersCollection.insertOne(newUser);
    if (result?.acknowledged) {
      return Response.json(
        { success: true, message: "User created successfully" },
        { status: 201 },
      );
    } else {
      return Response.json(
        { success: false, message: "Failed to create user" },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Registration error:", error);
    return Response.json(
      { success: false, message: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}

// Get User Data
export async function GET(request) {
  try {
    const result = await usersCollection.find().toArray();
    return Response.json(result);
  } catch (error) {
    return Response.json(
      { success: false, message: error.message },
      { status: 400 },
    );
  }
}
