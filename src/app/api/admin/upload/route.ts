import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { uploadImage } from "@/lib/upload";

export async function POST(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Call upload service
    const imageUrl = await uploadImage(buffer, file.name);

    return NextResponse.json({ url: imageUrl });
  } catch (error) {
    console.error("Upload API Error:", error);
    return NextResponse.json(
      { error: "Image upload failed. " + (error instanceof Error ? error.message : "") },
      { status: 500 }
    );
  }
}
