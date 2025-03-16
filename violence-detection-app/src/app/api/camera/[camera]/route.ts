import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Camera from "@/models/Camera";


export async function PUT(req: NextRequest, { params }: { params: Promise<{ camera: number }> }) { 
    await dbConnect();

    try {
        const { camera } = await params;
        const body = await req.json();
        const { status } = body;

        if (typeof status !== "boolean") {
            return NextResponse.json({ success: false, error: "Invalid status" }, { status: 400 });
        }

        const updatedCamera = await Camera.findOneAndUpdate(
            { camera: Number(camera) },
            { status },
            { new: true }
        );

        if (!updatedCamera) {
            return NextResponse.json({ success: false, error: "Camera not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: updatedCamera });
    } catch (error) {
        return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
    }
}


