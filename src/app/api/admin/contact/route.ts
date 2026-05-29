import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import ContactInfo from "@/models/ContactInfo";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  try {
    await connectToDatabase();
    let contact = await ContactInfo.findOne({});
    if (!contact) {
      // Create a default instance if none exists
      contact = await ContactInfo.create({
        email: "info@reckronpharma.com",
        phone: "+1 (555) 019-2834",
        address: "100 Innovation Way, Biotech Park, Suite 400",
        whatsappNumber: "+15550192834",
        mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.8354345086153!2d-122.39575828468114!3d37.778007979759714!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085807d9f7831d1%3A0xc3fa109ba4a2ff4!2sSan%20Francisco%20Biotech%20Inc!5e0!3m2!1sen!2sus!4v1622244265492!5m2!1sen!2sus",
        socialLinks: {
          facebook: "https://facebook.com/reckronpharma",
          linkedin: "https://linkedin.com/company/reckronpharma",
          twitter: "https://twitter.com/reckronpharma",
          youtube: "https://youtube.com/reckronpharma",
          instagram: "https://instagram.com/reckronpharma",
        },
      });
    }
    return NextResponse.json(contact);
  } catch (error) {
    console.error("GET ContactInfo API Error:", error);
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
    const data = await request.json();

    const { email, phone, address, whatsappNumber, mapEmbedUrl, socialLinks } = data;

    if (!email || !phone || !address) {
      return NextResponse.json(
        { error: "Email, phone, and address are required" },
        { status: 400 }
      );
    }

    let contact = await ContactInfo.findOne({});
    if (contact) {
      contact.email = email;
      contact.phone = phone;
      contact.address = address;
      contact.whatsappNumber = whatsappNumber || "";
      contact.mapEmbedUrl = mapEmbedUrl || "";
      contact.socialLinks = socialLinks || {};
      await contact.save();
    } else {
      contact = await ContactInfo.create({
        email,
        phone,
        address,
        whatsappNumber: whatsappNumber || "",
        mapEmbedUrl: mapEmbedUrl || "",
        socialLinks: socialLinks || {},
      });
    }

    return NextResponse.json(contact);
  } catch (error) {
    console.error("PUT ContactInfo API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
