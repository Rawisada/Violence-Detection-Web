import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    let data;

    if (email) {
      data = await User.findOne({ email }).select("-hash -salt");
      } else {
      data = await User.find().select("-hash -salt");
    }
    
    if (!data) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user by email:", error);
    return NextResponse.json({ message: "Server error", error }, { status: 500 });
  }
}
