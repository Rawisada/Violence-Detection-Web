import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

// GET 
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const user = await User.findById(params.id).select("-hash -salt");

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("GET user by ID error:", error);
    return NextResponse.json({ message: "Server error", error }, { status: 500 });
  }
}

// PUT 
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const updates = await req.json();
  try {
    await dbConnect();

    const user = await User.findByIdAndUpdate(params.id, updates, {
      new: true,
      runValidators: true,
      select: "-hash -salt",
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user, message: "User updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("PUT user update error:", error);
    return NextResponse.json({ message: "Server error", error }, { status: 500 });
  }
}

// DELETE
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect();

    const deletedUser = await User.findByIdAndDelete(params.id);

    if (!deletedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("DELETE user error:", error);
    return NextResponse.json({ message: "Server error", error }, { status: 500 });
  }
}
