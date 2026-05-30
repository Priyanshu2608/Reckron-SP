import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import NewsletterSubscriber from "@/models/NewsletterSubscriber";
import { getAdminSession } from "@/lib/auth";

interface IParams {
  params: Promise<{ id: string }>;
}

export async function DELETE(request: Request, { params }: IParams) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await connectToDatabase();

    const subscriber = await NewsletterSubscriber.findByIdAndDelete(id);
    if (!subscriber) {
      return NextResponse.json({ error: "Subscriber not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Subscriber removed successfully" });
  } catch (error) {
    console.error("DELETE Subscriber API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
