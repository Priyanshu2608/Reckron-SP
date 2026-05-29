import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import WebsiteContent from "@/models/WebsiteContent";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  try {
    await connectToDatabase();
    const contents = await WebsiteContent.find({});
    
    // Format as a simple dictionary: { key: value }
    const contentMap = contents.reduce((acc: any, item) => {
      acc[item.key] = item.value;
      return acc;
    }, {});

    return NextResponse.json(contentMap);
  } catch (error) {
    console.error("GET WebsiteContent API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const { key, value } = await request.json();

    if (!key || value === undefined) {
      return NextResponse.json(
        { error: "Key and value are required" },
        { status: 400 }
      );
    }

    const updatedContent = await WebsiteContent.findOneAndUpdate(
      { key },
      { value },
      { new: true, upsert: true }
    );

    return NextResponse.json({ success: true, content: updatedContent });
  } catch (error) {
    console.error("PUT WebsiteContent API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
