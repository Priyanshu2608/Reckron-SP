import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { v2 as cloudinary } from "cloudinary";

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    const isConfigured = !!cloudName && !!apiKey && !!apiSecret;

    if (!isConfigured) {
      return NextResponse.json({
        configured: false,
        error: "Missing one or more environment variables (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET) in .env.local"
      });
    }

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });

    // Test connection with a ping
    let pingOk = false;
    let pingError = "";
    try {
      const res = await cloudinary.api.ping();
      if (res && res.status === "ok") {
        pingOk = true;
      } else {
        pingError = JSON.stringify(res);
      }
    } catch (err: any) {
      pingError = err.message || String(err);
    }

    return NextResponse.json({
      configured: true,
      ping: pingOk,
      cloudName,
      error: pingOk ? null : `Ping failed: ${pingError}`,
    });
  } catch (error: any) {
    return NextResponse.json({
      configured: false,
      error: error.message || String(error)
    }, { status: 500 });
  }
}
