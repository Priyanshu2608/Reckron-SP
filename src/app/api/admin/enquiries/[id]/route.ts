import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Enquiry from "@/models/Enquiry";
import { getAdminSession } from "@/lib/auth";

interface IParams {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, { params }: IParams) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await connectToDatabase();
    const { status } = await request.json();

    if (!status || !["pending", "reviewed", "resolved"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status value. Must be 'pending', 'reviewed', or 'resolved'" },
        { status: 400 }
      );
    }

    const enquiry = await Enquiry.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!enquiry) {
      return NextResponse.json({ error: "Enquiry not found" }, { status: 404 });
    }

    return NextResponse.json(enquiry);
  } catch (error) {
    console.error("PUT Enquiry API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: IParams) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await connectToDatabase();

    const enquiry = await Enquiry.findByIdAndDelete(id);
    if (!enquiry) {
      return NextResponse.json({ error: "Enquiry not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Enquiry deleted successfully" });
  } catch (error) {
    console.error("DELETE Enquiry API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
