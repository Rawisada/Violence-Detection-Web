// src/app/api/signup/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, password, firstName, lastName, organization } = body;

  try {
    await dbConnect();

    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json({ message: "User already exists" }, { status: 409 });
    }

    const salt = crypto.randomBytes(16).toString("hex");
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");


    const newUser = new User({
      email,
      hash,
      salt,
      profile: {
        firstName,
        lastName,
        organization,
        role: "user",
      },
    });

    await newUser.save();
    return NextResponse.json({ message: "User created successfully" }, { status: 200 });

  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ message: "Server error", error }, { status: 500 });
  }
}
